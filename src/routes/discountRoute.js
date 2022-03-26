const express = require('express');
const Controller = require('../controllers/discount.controller');
const SchemaValidatediscount = require('../validators/discount.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createDiscount',
	jwtServices.verify,
	Validate.body(SchemaValidatediscount.createDiscount),
	Controller.createDiscountAsync
);

router.put(
	'/updateDiscount',
	jwtServices.verify,
	Validate.body(SchemaValidatediscount.updateDiscount),
	Controller.updateDiscountAsync
);

router.delete(
	'/deleteDiscount',
	jwtServices.verify,
	Controller.deleteDiscountAsync
);

router.get(
	'/getAllDiscount',
	jwtServices.verify,
	Controller.GetAllDiscountUserAsync
);

router.get(
	'/getAllDiscountActiveProduct/:id',
	jwtServices.verify,
	Controller.GetAllDiscountActiveAsync
);

module.exports = router;



