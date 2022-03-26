const { number, array } = require('@hapi/joi');
const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Order = new Schema(
	{
		customerId: defaultModel.stringR,
		totalMoney: defaultModel.number,
		totalMoneyProduct: defaultModel.number,
		product: [
			{
				productId: String,
				price: Number,
				quantity: Number,
				weight: Number,
				name: String,
				nameGroup: String,
				image: Array
			}
		],
		status: defaultModel.number,
		note: defaultModel.string,
		area: {
			name: String,
			phone: String,
			province: String,
			district: String,
			address: String
		},
		orderCode: { type: String, unique: true },
		shipFee: defaultModel.number,
		history: [{ title: String, createdAt: Date }],
		typePayment: { type: String, default: 'Chưa thanh toán' },
		discountMoney: defaultModel.number
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Order', Order);
