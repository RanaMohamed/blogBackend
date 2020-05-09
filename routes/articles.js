const express = require('express');

const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

const Article = require('../models/article');
const User = require('../models/user');

router.post('/', authenticate, upload.single('imgUrl'), async (req, res) => {
	const { title, body, tags } = req.body;
	const article = new Article({ title, body, tags });
	article.author = req.user._id;
	if (req.file) article.imgUrl = 'images/' + req.file.filename;
	await article.save();
	res.json({ message: 'Article added successfully', article });
});

router.get('/:id?', async (req, res) => {
	const id = req.params.id;
	if (id) {
		const article = await Article.findById(id).populate('author');
		res.json({ article });
		return;
	}

	const q = req.query.q;
	let filter = req.query.userId ? { author: req.query.userId } : {};
	if (q) {
		let users = await User.find({ $text: { $search: q } });
		users = users.map((u) => u.id);
		filter = {
			...filter,
			$or: [{ $text: { $search: q } }, { author: users }],
		};
	}
	const total = await Article.countDocuments(filter);
	const articles = await Article.find(filter)
		.populate('author')
		.sort({ updatedAt: -1 })
		.skip((req.query.page - 1) * 5)
		.limit(5);
	res.json({ total, articles });
});

router.patch('/', authenticate, upload.single('imgUrl'), async (req, res) => {
	const article = await Article.findById(req.user._id);
	Object.keys(req.body).map((key) => (article[key] = req.body[key]));
	if (req.file) article.imgUrl = 'images/' + req.file.filename;
	await article.save();
	res.json({ message: 'Article edited successfuly', article });
});

router.delete('/', (req, res, next) => {
	console.log(req);
	next();
});

module.exports = router;
