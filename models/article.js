const mongoose = require('mongoose');

const _ = require('lodash');

const schema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Name is required'],
		},
		body: {
			type: String,
			required: [true, 'Email is required'],
		},
		tags: {
			type: [String],
		},
		imgUrl: {
			type: String,
		},
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (doc, ret) => _.omit(ret, ['__v', 'createdAt']),
		},
	}
);

const Article = mongoose.model('Article', schema);

module.exports = Article;
