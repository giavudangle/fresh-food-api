const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Paypal = new Schema(
	{
		idPaypal: defaultModel.stringR,
		Transaction: defaultModel.stringR,
		idOrder: defaultModel.stringR
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model('paypal', Paypal);
