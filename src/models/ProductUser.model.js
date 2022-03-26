const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const ProductUser = new Schema(
	{
		customerId: defaultModel.stringR,
		productId: defaultModel.stringR
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ProductUser', ProductUser);
