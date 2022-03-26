const { number } = require('@hapi/joi');
const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Cart = new Schema(
	{
		productId: defaultModel.stringRef,
		customerId: defaultModel.stringRef,
		status: { type: Number, default: 1 },
		quantity: defaultModel.number,
		name: defaultModel.string,
		nameGroup: defaultModel.string
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Cart', Cart);
