const joi = require('@hapi/joi');
const schemas = {
	createAddress: joi.object().keys({
		name: joi.string().required(),
    phone: joi.string().required(),
    province: joi.string().required(),
    district: joi.string().required(),
    address: joi.string().required(),
    isMain: joi.bool().required()
	}),
  
	updateAddress: joi.object().keys({
    id: joi.string().required(),
		name: joi.string().required(),
    phone: joi.string().required(),
    province: joi.string().required(),
    district: joi.string().required(),
    address: joi.string().required(),
    isMain: joi.bool().required()
	}),
};
module.exports = schemas;


