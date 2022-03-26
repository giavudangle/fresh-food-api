const express = require('express');
const Controller = require('../controllers/productUser.controller');
const router = express.Router();
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');
const Validate = require('../validators');
const SchemaValidateProduct = require('../validators/productUser.validator');

router.post(
	'/createProductUser',
	jwtServices.verify,
	Validate.body(SchemaValidateProduct.createProductUser),
	Controller.createProductUserAsync
);

router.get(
	'/getAllProductUser',
	jwtServices.verify,
	Controller.GetAllProductUserByUserAsync
);

module.exports = router;
