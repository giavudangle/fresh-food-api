const controller = require('./controller');
const cartServices = require('../services/cart.service');
const orderServices = require('../services/order.service');
const productServices = require('../services/product.service');
const eveluateServices = require('../services/eveluate.service');
const { defaultRoles, defaultStatusOrder } = require('../config/defineModel');

exports.createEveluateAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		var resultEveluate = [];
		for (let i = 0; i < req.body.length; i++) {
			req.body[i].customerId = id;
			const eveluateCurrent =
				await eveluateServices.getEveluateByOrderAndUserAndProductAsync(
					req.body[i].customerId,
					req.body[i].orderId,
					req.body[i].productId
				);

			if (eveluateCurrent.data.length > 0) {
				return controller.sendSuccess(
					res,
					'',
					300,
					'Your order has been evaluated'
				);
			}
			const productCurrent = await productServices.findProductByIdAsync(
				req.body[i].productId
			);
			const orderCurrent = await orderServices.findOrderByIdAsync(
				req.body[i].orderId
			);
			if (
				productCurrent.success != true ||
				orderCurrent.success != true ||
				orderCurrent.data.status != defaultStatusOrder.DaGiao
			) {
				return controller.sendSuccess(res, null, 300, 'Create Eveluate Fail');
			}

			const resServices = await eveluateServices.createEveluateAsync(
				req.body[i]
			);
			if (resServices.success) {
				resultEveluate.push(resServices.data);
			}
		}
		if (resultEveluate.length == req.body.length) {
			return controller.sendSuccess(
				res,
				resultEveluate,
				200,
				'Create Eveluate Success'
			);
		}

		return controller.sendSuccess(res, null, 300, 'Create Eveluate Fail');
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};

exports.deleteEveluate = async (req, res, next) => {
	try {
		const resServices = await eveluateServices.deleteEveluateAsync(
			req.query.id
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
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
exports.GetEveluateByProductAsync = async (req, res, next) => {
	try {
		var query = {
			productId: req.query.productId,
			limit: req.query.limit || '15',
			skip: req.query.skip || '1'
		};

		const resServices = await eveluateServices.getEveluateByProduct(query);

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
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
