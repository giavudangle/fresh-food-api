const express = require('express');
const Controller = require('../controllers/product.controller');
const router = express.Router();
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');
const Validate = require('../validators');
const SchemaValidateProduct = require('../validators/product.validator');

router.post(
	'/createProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Validate.body(SchemaValidateProduct.createProduct),
	Controller.createProductAsync
);

router.put(
	'/updateProduct',
	jwtServices.verify,
	Validate.body(SchemaValidateProduct.updateProduct),
	checkRole([defaultRoles.Admin]),
	Controller.updateProductAsync
);

router.delete(
	'/deleteProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteProductAsync
);

router.get('/findAllProduct', Controller.findAllProductAsync);

router.get('/getProductRecommend', Controller.GetProductRecommend);

router.get('/getDetailProduct', Controller.findDetailProduct);

module.exports = router;
