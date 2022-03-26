const express = require('express');
const Controller = require('../controllers/address.controller');
const SchemaValidateAddress = require('../validators/address.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createAddress',
	jwtServices.verify,
	Validate.body(SchemaValidateAddress.createAddress),
	Controller.createAddressAsync
);

router.put(
	'/updateAddress',
	jwtServices.verify,
	Validate.body(SchemaValidateAddress.updateAddress),
	Controller.updateAddressAsync
);

router.delete(
	'/deleteAddress',
	jwtServices.verify,
	Controller.deleteAddressAsync
);

router.get(
	'/getAllAddress',
	jwtServices.verify,
	Controller.GetAllAddressByUserAsync
);

router.get('/getPriceAddress', jwtServices.verify, Controller.GetPriceAddress);

module.exports = router;
