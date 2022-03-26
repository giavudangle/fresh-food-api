const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const CHAT = new Schema(
	{
		creatorUser: defaultModel.string,
		seenByUser: defaultModel.array,
		message: defaultModel.string,
		isDelete: defaultModel.booleanFalse,
		idRoom: defaultModel.string
	},
	{ timestamps: true }
);

module.exports = mongoose.model('CHAT', CHAT);
