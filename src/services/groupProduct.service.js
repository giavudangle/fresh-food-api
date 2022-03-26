const USER = require('../models/User.model');
const { defaultRoles } = require('../config/defineModel');
const otpGenerator = require('otp-generator');
const { configEnv } = require('../config/index');
const nodemailer = require('nodemailer');
const GROUPPRODUCT = require('../models/GroupProduct.model');

exports.createGroupProductAsync = async body => {
	try {
		let arr = await GROUPPRODUCT.find();
		if (arr.length >= 1) {
			var key = arr[arr.length - 1].key;
			var splitted = key.split('-', 2);
			let number = splitted[1];
			let code = `${Number(number) + 1}`;
			newKey = 'GP' + '-' + code;
			body.key = newKey;
		} else {
			let newKey = `GP-1`;
			body.key = newKey;
		}
		const groupProduct = new GROUPPRODUCT(body);
		await groupProduct.save();
		
		return {
			message: 'Successfully create Group',
			success: true,
			data: groupProduct
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateGroupProductAsync = async (id, body) => {
	try {
		const groupProduct = await GROUPPRODUCT.findOneAndUpdate(
			{ _id: id },
			body,
			{
				new: true
			}
		);

		return {
			message: 'Successfully update Group',
			success: true,
			data: groupProduct
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.deleteGroupProductAsync = async id => {
	try {
		const groupProduct = await GROUPPRODUCT.deleteOne({ _id: id });
		return {
			message: 'Successfully delete Group',
			success: true
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllGroupProductAsync = async id => {
	try {
		const groupProduct = await GROUPPRODUCT.find().sort({ createdAt: -1 });
		return {
			message: 'Successfully get all Group',
			success: true,
			data: groupProduct
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
