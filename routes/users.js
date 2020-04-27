const express = require('express');

const router = express.Router();

const User = require('../models/user');

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;
	const user = new User({ name, email, password });
	await user.save();
	res.json({ message: 'User registered Successfully', user });
});

router.get('/', (req, res, next) => {
	console.log(req);
	next();
});

router.patch('/', (req, res, next) => {
	console.log(req);
	next();
});

router.delete('/', (req, res, next) => {
	console.log(req);
	next();
});

module.exports = router;
