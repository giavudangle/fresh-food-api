const joi = require('@hapi/joi');
const schemas = {
    
	createEveluate: joi.object().keys({
	productId: joi.string().required(),
    orderId: joi.string().required(),
    content: joi.string().required(),
    star: joi.number().required(),
	}),

	updateCart: joi.object().keys({
    id: joi.string().required(),
    quantity: joi.number().required()
	}),
};
module.exports = schemas;


