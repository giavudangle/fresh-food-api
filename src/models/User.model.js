const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const User = new Schema(
	{
		email: defaultModel.stringR,
		password: defaultModel.stringR,
		role: defaultModel.number,
		name: defaultModel.stringR,
		phone: defaultModel.stringPhone,
		avatar: defaultModel.string,
		otp: defaultModel.string
	},
	{ timestamps: true }
);

module.exports = mongoose.model('User', User);
