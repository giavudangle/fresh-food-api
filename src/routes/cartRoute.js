const express = require('express');
const Controller = require('../controllers/cart.controller');
const SchemaValidateCart = require('../validators/cart.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createCart',
	jwtServices.verify,
	Validate.body(SchemaValidateCart.createCart),
	Controller.createCartAsync
);

router.put(
	'/updateCart',
	jwtServices.verify,
	Validate.body(SchemaValidateCart.updateCart),
	Controller.updateCartAsync
);

router.delete('/deleteCart', jwtServices.verify, Controller.deleteCartAsync);

router.get('/getAllCart', jwtServices.verify, Controller.GetCartAsync);

module.exports = router;
