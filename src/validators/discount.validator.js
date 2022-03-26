const joi = require('@hapi/joi');
const schemas = {
	createDiscount: joi.object().keys({
		idProduct: joi.string().required(),
    idGroupProduct: joi.string().allow(''),
		totalProduct: joi.bool().required(),
		percentDiscount: joi.number().required(),
		duration: joi.date().required(),
		maxDiscount: joi.number().required()
	}),
  
	updateDiscount: joi.object().keys({
    id: joi.string().required(),
		idProduct: joi.string().allow(''),
    idGroupProduct: joi.string().allow(''),
		totalProduct: joi.bool().required(),
		percentDiscount: joi.number(),
		duration: joi.date(),
		maxDiscount: joi.number()
	}),
};
module.exports = schemas;