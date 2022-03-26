const USER = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwtServices = require('./jwt.services');
const jwt = require('jsonwebtoken');
const { defaultRoles, defaultModel } = require('../config/defineModel');
const otpGenerator = require('otp-generator');
const { configEnv } = require('../config/index');
const { sendMail } = require('./sendMail.service');
const { sendSmsTwilio } = require('./sms.service');
const uploadServices = require('../services/uploadS3.service');
exports.registerUserAsync = async body => {
	try {
		const { email, password, phone, name } = body;
		//check if email is already in the database
		const emailExist = await USER.findOne({
			email: email
		});
		if (emailExist != null)
			return {
				message: 'Email already exists',
				success: false
			};
		var otp = otpGenerator.generate(6, {
			upperCase: false,
			specialChars: false
		});
		const hashedPassword = await bcrypt.hash(password, 8);
		const newUser = new USER({
			email: email,
			password: hashedPassword,
			phone: phone,
			name: name,
			otp: otp,
			avatar: 'Avatar/1638466795493avatar.png'
		});
		await newUser.save();
		const generateToken = jwtServices.createToken({
			id: newUser._id,
			role: newUser.role
		});
		var result = {
			token: generateToken,
			role: newUser.role
		};
		return {
			message: 'Successfully Register',
			success: true,
			data: result
		};
	} catch (err) {
		return {
			error: 'Internal Server',
			success: false
		};
	}
};

exports.loginAsync = async body => {
	try {
		const { email, password } = body;
		const user = await USER.findOne({
			email: email
		});

		if (!user) {
			return {
				message: 'Invalid Email !!',
				success: false
			};
		}
		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return {
				message: 'Invalid password !!',
				success: false
			};
		}

		const generateToken = jwtServices.createToken({
			id: user._id,
			role: user.role
		});
		return {
			message: 'Successfully login',
			success: true,
			data: {
				token: generateToken,
				role: user.role
			}
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findUserByIdAsync = async body => {
	try {
		const user = await USER.findById(body);
		if (!user) {
			return {
				message: 'Get User Fail',
				success: false
			};
		}

		return {
			message: 'Successfully Get User',
			success: true,
			data: user
		};
	} catch (err) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.changePasswordAsync = async (id, body) => {
	try {
		const user = await USER.findById(id);
		const oldPassword = body.oldPassword;
		const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
		if (!isPasswordMatch) {
			return {
				message: 'Wrong PassWord Old',
				success: false,
				data: user
			};
		}

		const newPassword = await bcrypt.hash(body.newPassword, 8);
		user.password = newPassword;
		await user.save();
		return {
			message: 'Change Password Successfully',
			success: true
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.forgotPassword = async body => {
	try {
		const email = body.email;
		const result = await USER.findOne({ email: email });

		if (result != null) {
			const mailOptions = {
				to: result.email,
				from: configEnv.Email,
				subject: 'Quên mật khẩu Fresh Food',
				text: 'Mã OTP của bạn là:' + result.otp
			};

			var bodySms = {
				phoneSend: result.phone,
				Otp: result.otp
			};

			const resultSendSms = await sendSmsTwilio(bodySms);
			if (resultSendSms != true) {
				return {
					message: 'Send Phone Fail',
					success: false
				};
			}

			const resultSendMail = await sendMail(mailOptions);
			if (resultSendMail != true) {
				return {
					message: 'Send Email Fail',
					success: false
				};
			}

			if (!resultSendMail || resultSendSms != true) {
				return {
					message: 'Send Email Or Phone Fail',
					success: false
				};
			} else {
				console.log('voo nef');
				return {
					message: 'Send Email And Phone Success',
					success: true
				};
			}
		} else {
			return {
				message: 'Do not email',
				success: false
			};
		}
	} catch (error) {
		console.log(error);
		return {
			message: 'Internal Server',
			success: false
		};
	}
};

exports.resetPassword = async body => {
	try {
		const { otp, password, email } = body;
		let user = await USER.findOne({ email: email });

		if (user != null) {
			if (otp == user.otp) {
				const hashedPassword = await bcrypt.hash(password, 8);
				const otp = otpGenerator.generate(6, {
					upperCase: false,
					specialChars: false,
					alphabets: false
				});
				user.password = hashedPassword;
				user.otp = otp;
				user.save();
				return {
					message: 'Reset Password success',
					success: true
				};
			} else {
				return {
					message: 'OTP invalid',
					success: false
				};
			}
		} else {
			return {
				message: 'Do not Email',
				success: false
			};
		}
	} catch (error) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.confirmOtp = async body => {
	try {
		const { otp, email } = body;
		let user = await USER.findOne({ email: email });
		if (user != null) {
			if (otp == user.otp) {
				const otp = otpGenerator.generate(6, {
					upperCase: false,
					specialChars: false,
					alphabets: false
				});

				user.otp = otp;
				user.save();
				const generateToken = jwtServices.createToken({
					id: user._id,
					role: user.role
				});

				return {
					message: 'Successfully confirm Otp',
					success: true,
					data: {
						token: generateToken
					}
				};
			} else {
				return {
					message: 'OTP invalid',
					success: false
				};
			}
		} else {
			return {
				message: 'Do not Email',
				success: false
			};
		}
	} catch (error) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.changePasswordWithOtp = async body => {
	try {
		const { password, token } = body;
		jwt.verify(
			token,
			configEnv.ACCESS_TOKEN_SECRET,
			async (err, decodedFromToken) => {
				if (err) {
					return {
						message: 'Fail Token',
						success: false
					};
				} else {
					var user = await USER.findById(decodedFromToken.data.id);
					const hashedPassword = await bcrypt.hash(password, 8);
					user.password = hashedPassword;
					user.save();
				}
			}
		);

		return {
			message: 'Successfully change password',
			success: true
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findInformation = async id => {
	try {
		const user = await USER.findById(id, {
			_id: 1,
			email: 1,
			role: 1,
			name: 1,
			phone: 1,
			avatar: 1
		}).lean();

		return {
			message: 'Successfully Get Information',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateInformation = async (id, body) => {
	try {
		const user = await USER.findByIdAndUpdate(id, body, { new: true });
		return {
			message: 'Successfully update Information',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllUser = async query => {
	try {
		const { role, skip, limit, search } = query;
		const user = await USER.find(
			{
				role: role,
				$or: [
					{
						name: {
							$regex: `${search}`,
							$options: '$i'
						}
					},
					{
						email: {
							$regex: `${search}`,
							$options: '$i'
						}
					},
					{
						phone: {
							$regex: `${search}`,
							$options: '$i'
						}
					}
				]
			},
			{ _id: 1, email: 1, role: 1, name: 1, phone: 1, avatar: 1 }
		)
			.sort({ createdAt: -1 })
			.skip(Number(limit) * Number(skip) - Number(limit))
			.limit(Number(limit));

		return {
			message: 'Successfully Get All User',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getInformationById = async id => {
	try {
		const user = await USER.findById(id, {
			_id: 1,
			email: 1,
			role: 1,
			name: 1,
			phone: 1,
			avatar: 1
		}).lean();

		return {
			message: 'Successfully Get All User',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAvatarAdmin = async id => {
	try {
		const user = await USER.findOne(
			{ role: 1 },
			{
				_id: 1,
				email: 1,
				role: 1,
				name: 1,
				phone: 1,
				avatar: 1
			}
		).lean();
		return {
			message: 'Successfully Get Image Admin',
			success: true,
			data: user
		};
	} catch (err) {
		console.log(err);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.registerStaffAsync = async body => {
	try {
		const { email, password, phone, name } = body;
		//check if email is already in the database
		const emailExist = await USER.findOne({
			email: email
		});
		if (emailExist != null)
			return {
				message: 'Email already exists',
				success: false
			};

		var otp = otpGenerator.generate(6, {
			upperCase: false,
			specialChars: false
		});

		const hashedPassword = await bcrypt.hash(password, 8);
		const newUser = new USER({
			email: email,
			password: hashedPassword,
			phone: phone,
			name: name,
			otp: otp,
			avatar: 'Avatar/1638807317930staff.jfif',
			role: defaultRoles.Staff
		});

		await newUser.save();
		const generateToken = jwtServices.createToken({
			id: newUser._id,
			role: newUser.role
		});
		var result = {
			token: generateToken,
			role: newUser.role
		};

		return {
			message: 'Successfully Register',
			success: true,
			data: result
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server',
			success: false
		};
	}
};
