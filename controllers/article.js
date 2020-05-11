const Article = require('../models/article');

const getArticles = async (filter, page) => {
	const total = await Article.countDocuments(filter);
	const articles = await Article.find(filter)
		.populate('author')
		.sort({ updatedAt: -1 })
		.skip((page - 1) * 5)
		.limit(5);
	return { total, articles };
};

module.exports = {
	getArticles,
};
