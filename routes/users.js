const express = require('express');
const { body } = require('express-validator');

const upload = require('../middlewares/upload');
const { emailRegex } = require('../helpers/helper');
const validateRequest = require('../middlewares/validateRequest');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

const User = require('../models/user');

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	const user = new User({ name, email, password });
	await user.save();
	res.json({ message: 'User registered successfully', user });
});

router.post(
	'/login',
	validateRequest([
		body('email')
			.exists()
			.withMessage('Email is required')
			.matches(emailRegex)
			.withMessage('Email is invalid'),
		body('password').exists().withMessage('Password is required'),
	]),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) throw new Error('Invalid email or password');

		const isMatched = await user.checkPassword(password);
		if (!isMatched) throw new Error('Invalid email or password');

		const token = await user.generateToken();
		res.json({ user, token });
	}
);

router.get('/getUser', authenticate, async (req, res) => {
	res.json({ user: req.user });
});

router.patch('/', authenticate, upload.single('imgUrl'), async (req, res) => {
	const user = await User.findById(req.user._id);
	Object.keys(req.body).map((key) => (user[key] = req.body[key]));
	if (req.file) user.imgUrl = 'images/' + req.file.filename;
	await user.save();
	res.json({ message: 'User edited successfuly', user });
});

router.delete('/', (req, res, next) => {
	console.log(req);
	next();
});

module.exports = router;
