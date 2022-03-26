const joi = require('@hapi/joi');
const schemas = {
	register: joi.object().keys({
		email: joi.string().required(),
		password: joi.string().required(),
		phone:joi.string().required().min(10).max(10),
		name:joi.string().required(),
	}),

	login: joi.object().keys({
		email: joi.string().required(),
		password: joi.string().required()
	}),

	changePass: joi.object().keys({
		oldPassword: joi.string().required(),
		newPassword: joi.string().required()
	}),

	resetPassword: joi.object().keys({
		email: joi.string().required(),
		password: joi.string().required(),
		otp:joi.string().required()
	}),

	updateInformation: joi.object().keys({
		phone: joi.string().required(),
		name:joi.string().required(),
		avatar: joi.string()
	}),

	updateAvatar: joi.object().keys({
		avatar: joi.string().required()
	}),
	
	confirmOtp: joi.object().keys({
		email: joi.string().required(),
		otp:joi.string().required()
	}),
	
	changePasswordWithOtp: joi.object().keys({
		password: joi.string().required(),
		token:joi.string().required()
	}),
};
module.exports = schemas;


