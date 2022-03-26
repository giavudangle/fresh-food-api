const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Product = new Schema(
	{
		name: defaultModel.stringR,
		detail: defaultModel.stringR,
		price: defaultModel.number,
		image: defaultModel.array,
		status: { type: Number, default: 1 },
		groupProduct: { name: String, key: String },
		weight: defaultModel.number,
		quantity: defaultModel.number,
		sold: defaultModel.number
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Product', Product);
