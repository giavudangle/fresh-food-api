const express = require('express');
const Controller = require('../controllers/groupProduct.controller');
const SchemaValidateGroupProduct = require('../validators/groupProduct.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createGroupProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateGroupProduct.createGroupProduct),
	Controller.createGroupProductAsync
);

router.put(
	'/updateGroupProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateGroupProduct.updateGroupProduct),
	Controller.updateGroupProductAsync
);

router.delete(
	'/deleteGroupProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteGroupProductAsync
);

router.get('/getAllGroupProduct', Controller.GetAllGroupProductAsync);

module.exports = router;
