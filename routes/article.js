const express = require('express');

const upload = require('../middlewares/upload');
const authenticate = require('../middlewares/authenticate');
const { getArticles } = require('../controllers/article');

const router = express.Router();

const Article = require('../models/article');
const User = require('../models/user');

const cloudinary = require('cloudinary');

router.post('/', authenticate, upload.single('imgUrl'), async (req, res) => {
	const { title, body, tags } = req.body;
	const article = new Article({ title, body, tags });
	article.author = req.user._id;

	if (req.file) {
		const result = await cloudinary.v2.uploader.upload(req.file.path);
		article.imgUrl = result.secure_url;
	}

	await article.save();

	res.status(201).json({ message: 'Article added successfully', article });
});

router.get('/followed', authenticate, async (req, res) => {
	const data = await getArticles(
		{ author: req.user.following },
		req.query.page
	);

	res.json(data);
});

router.get(
	'/:id?',
	(req, res, next) => {
		if (req.query.q) return authenticate(req, res, next);
		next();
	},
	async (req, res) => {
		const id = req.params.id;
		if (id) {
			const article = await Article.findById(id).populate('author');
			return res.json({ article });
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

		const data = await getArticles(filter, req.query.page);
		res.json(data);
	}
);

router.patch('/', authenticate, upload.single('imgUrl'), async (req, res) => {
	const article = await Article.findById(req.body._id);

	if (article.author.toString() != req.user._id.toString())
		return res.status(403).json({ message: 'Unauthorized' });

	Object.keys(req.body).map((key) => (article[key] = req.body[key]));

	if (req.file) {
		const result = await cloudinary.v2.uploader.upload(req.file.path);
		article.imgUrl = result.secure_url;
	}

	await article.save();

	res.status(201).json({ message: 'Article edited successfully', article });
});

router.delete('/:id', authenticate, async (req, res) => {
	const article = await Article.findById(req.params.id);

	if (!article || article.author.toString() !== req.user._id.toString())
		return res.status(403).json({ message: 'Unauthorized' });

	await Article.deleteOne({ _id: req.params.id });

	res.status(201).json({ message: 'Article deleted successfully' });
});

module.exports = router;
