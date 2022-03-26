const mongoose = require('mongoose');
const { defaultModel } = require('../config/defineModel');
const Schema = mongoose.Schema;

const ROOM = new Schema(
	{
		idRoom: defaultModel.string,
		idLastMessage: defaultModel.string,
		name: defaultModel.string
	},
	{ timestamps: true }
);

module.exports = mongoose.model('ROOM', ROOM);
