const mongoose = require('mongoose');

const _ = require('lodash');

const schema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Title is required'],
		},
		body: {
			type: String,
			required: [true, 'Body is required'],
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
			index: true,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (doc, ret) => _.omit(ret, ['__v', 'createdAt']),
		},
	}
);

schema.index({ title: 'text', tags: 'text' });

const Article = mongoose.model('Article', schema);

module.exports = Article;
