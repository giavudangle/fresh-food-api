const { number } = require('@hapi/joi');
const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Eveluate = new Schema(
	{
		productId: defaultModel.string,
		customerId: defaultModel.string,
		orderId: defaultModel.string,
		image: defaultModel.array,
		content: defaultModel.string,
		star: defaultModel.number
	},
	{ timestamps: true }
);

module.exports = mongoose.model('evalute', Eveluate);
