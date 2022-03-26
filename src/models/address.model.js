const { number } = require('@hapi/joi');
const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const Address = new Schema(
	{
		customerId: defaultModel.stringRef,
		name: defaultModel.stringR,
		phone: defaultModel.stringR,
		province: defaultModel.stringR,
		district: defaultModel.stringR,
		address: defaultModel.stringR,
		isMain: defaultModel.booleanFalse
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Address', Address);
