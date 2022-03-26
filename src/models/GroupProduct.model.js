const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const GroupProduct = new Schema(
	{
		name: defaultModel.stringR,
		key: defaultModel.stringR
	},
	{ timestamps: true }
);

module.exports = mongoose.model('GroupProduct', GroupProduct);
