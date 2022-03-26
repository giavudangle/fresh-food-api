const joi = require('@hapi/joi');
const schemas = {
	createCart: joi.object().keys({
		productId: joi.string().required(),
    quantity: joi.number().required()
	}),
	
	updateCart: joi.array().items({
    id: joi.string().required(),
		status: joi.number().required(),
    quantity: joi.number().required()
	}),
};
module.exports = schemas;


