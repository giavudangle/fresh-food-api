const joi = require('@hapi/joi');
const schemas = {
	createProduct: joi.object().keys({
	name: joi.string(),
    detail: joi.string(),
    price: joi.number(),
    groupProduct: joi.string(),
    weight: joi.number(),
    quantity: joi.number(),
    image: joi.array()
	}),

    updateProduct: joi.object().keys({
        id: joi.string().required(),
        name: joi.string().required(),
        detail: joi.string().required(),
        price: joi.number().required(),
        groupProduct: joi.string().required(),
        weight: joi.number().required(),
        quantity: joi.number().required(),
        image: joi.array().required()
        }),
    
	updateShipFee: joi.object().keys({
    id: joi.string().required(),
    address: joi.string().required(),
    fee: joi.number().required(),
	}),
};
module.exports = schemas;
