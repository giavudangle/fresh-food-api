const controller = require('./controller');
const productUserServices = require('../services/productUser.service');
const productServices = require('../services/product.service');
const uploadServices = require('../services/uploadS3.service');

const { defaultRoles } = require('../config/defineModel');
exports.createProductUserAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		req.value.body.customerId = id;
		const productUser =
			await productUserServices.findProductByIdUserAndProductAsync(
				req.value.body
			);

		if (productUser.success == true && productUser.data.length == 0) {
			const resServices = await productUserServices.createProductUserAsync(
				req.value.body
			);
			if (resServices.success) {
				return controller.sendSuccess(
					res,
					resServices.data,
					200,
					resServices.message
				);
			}

			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		} else if (productUser.data != null && productUser.success == true) {
			const resServices = await productUserServices.updateProductUserAsync(
				req.value.body
			);
			if (resServices.success) {
				return controller.sendSuccess(
					res,
					resServices.data,
					200,
					resServices.message
				);
			}

			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		}
		return controller.sendSuccess(res, null, 300, "Don't create product User");
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
exports.GetAllProductUserByUserAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		var query = {
			limit: req.query.limit || '10',
			skip: req.query.skip || '1'
		};
		query.customerId = id;
		const resServices = await productUserServices.findProductByIdUserAsync(
			query
		);

		if (resServices.success) {
			var arrResult = [];
			for (let i = 0; i < resServices.data.length; i++) {
				var productCurrent = await productServices.findProductByIdAsync(
					resServices.data[i].productId
				);
				if (productCurrent.success == false) {
					return controller.sendSuccess(
						res,
						productCurrent.data,
						300,
						productCurrent.message
					);
				}
				
				arrResult.push(productCurrent.data);
			}

			return controller.sendSuccess(
				res,
				arrResult,
				200,
				'Success Get Product Recomend'
			);
		}
		return controller.sendSuccess(
			res,
			resServices.data,
			300,
			resServices.message
		);
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};
