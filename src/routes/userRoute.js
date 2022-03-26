const express = require('express');
const Controller = require('../controllers/user.controller');
const SchemaValidateUser = require('../validators/user.validator');
const router = express.Router();
const Validate = require('../validators');
const jwtServices = require('../services/jwt.services');

var multer = require('multer');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
var storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, '');
	}
});

var singleUpload = multer({ storage: storage }).single('image');

router.post(
	'/changePassword',
	jwtServices.verify,
	Validate.body(SchemaValidateUser.changePass),
	Controller.changePasswordAsync
);

router.post(
	'/login',
	Validate.body(SchemaValidateUser.login),
	Controller.loginAsync
);

router.post(
	'/register',
	Validate.body(SchemaValidateUser.register),
	Controller.registerAsync
);

router.get('/forgotPassword', Controller.forgotPasswordAsync);

router.post(
	'/resetPassword',
	Validate.body(SchemaValidateUser.resetPassword),
	Controller.resetPasswordAsync
);

router.get('/successPayPal', Controller.paymentSuccess);

router.get('/cancelPayPal', Controller.cancelPayment);

router.get('/successVnPay', Controller.successVnPayOrder);

router.get('/getInformation', jwtServices.verify, Controller.getInformation);

router.put(
	'/updateInformation',
	jwtServices.verify,
	Validate.body(SchemaValidateUser.updateInformation),
	Controller.updateInformation
);

router.post(
	'/updateImage',
	jwtServices.verify,
	Validate.body(SchemaValidateUser.updateAvatar),
	Controller.uploadImage
);

router.post(
	'/confirmOtp',
	Validate.body(SchemaValidateUser.confirmOtp),
	Controller.confirmOtp
);

router.post(
	'/changePasswordWithOtp',
	Validate.body(SchemaValidateUser.changePasswordWithOtp),
	Controller.ChangePassWithOtp
);

router.get(
	'/getAllUser',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.findAllUserAsync
);

router.get(
	'/getInformationById',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.getInformationByIdAsync
);

router.get('/getAvatarAdmin', Controller.getImageByAdmin);

router.post(
	'/createStaff',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateUser.register),
	Controller.createStaff
);

module.exports = router;
