const { number, date } = require('@hapi/joi');
const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Discount = new Schema(
	{
		idProduct: defaultModel.string,
    	idGroupProduct: defaultModel.string,
		totalProduct: defaultModel.boolean,
		percentDiscount: defaultModel.number,
		duration: defaultModel.date,
		maxDiscount: defaultModel.number
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Discount', Discount);
