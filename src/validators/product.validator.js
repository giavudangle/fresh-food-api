const joi = require('@hapi/joi');
const schemas = {
	createProduct: joi.object().keys({
	name: joi.string().required(),
    detail: joi.string().required(),
    price: joi.number().required(),
    groupProduct: joi.string().required(),
    weight: joi.number().required(),
    quantity: joi.number().required(),
    image: joi.array().required()
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
