const joi = require('@hapi/joi');
const schemas = {
	createProductUser: joi.object().keys({
    productId: joi.string().required(),
	}),
	
	deleteProductUser: joi.object().keys({
    productId: joi.string().required(),
	}),
};
module.exports = schemas;
