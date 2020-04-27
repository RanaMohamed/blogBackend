const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const _ = require('lodash');
var uniqueValidator = require('mongoose-unique-validator');

const { saltRounds } = require('../config/config');

// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Name is required'],
		},
		email: {
			type: String,
			required: [true, 'Email is required'],
			unique: true,
			match: [emailRegex, 'Email is invalid'],
		},
		password: {
			type: String,
			required: [true, 'Passowrd is required'],
			// set: (v) => bcrypt.hashSync(v, saltRounds),
		},
		imgUrl: {
			type: String,
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: (doc, ret) =>
				_.omit(ret, ['__v', 'password', 'createdAt', 'updatedAt']),
		},
	}
);

schema.pre('save', async function () {
	const currentDocument = this;
	const hashed = await bcrypt.hash(currentDocument.password, saltRounds);
	currentDocument.password = hashed;
});

schema.methods.checkPassword = function (plainPassword) {
	const currentDocument = this;
	return bcrypt.compare(plainPassword, currentDocument.password);
};

schema.plugin(uniqueValidator, {
	message: 'Email is already taken',
});

const User = mongoose.model('User', schema);

module.exports = User;
