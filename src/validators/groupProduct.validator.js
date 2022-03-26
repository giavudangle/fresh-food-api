const joi = require('@hapi/joi');
const schemas = {
	createGroupProduct: joi.object().keys({
		name: joi.string().required(),
	}),
	
	updateGroupProduct: joi.object().keys({
    id: joi.string().required(),
		name: joi.string().required(),
	}),
};
module.exports = schemas;


