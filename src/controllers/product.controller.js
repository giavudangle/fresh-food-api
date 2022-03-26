const controller = require('./controller');
const productServices = require('../services/product.service');
const uploadServices = require('../services/uploadS3.service');
const eveluateServices = require('../services/eveluate.service');

const { defaultRoles } = require('../config/defineModel');
const { configEnv } = require('../config');
var AWS = require('aws-sdk');
exports.createProductAsync = async (req, res, next) => {
	try {
		const resServices = await productServices.createProductAsync(
			req.value.body
		);

		if (resServices.success)
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);

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

exports.updateProductAsync = async (req, res, next) => {
	try {
		const resServices = await productServices.updateProductAsync(
			req.value.body.id,
			req.value.body
		);

		if (resServices.success)
			return controller.sendSuccess(
				res,
				resServices.data,
				200,
				resServices.message
			);

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
exports.deleteProductAsync = async (req, res, next) => {
	try {
		const resServices = await productServices.deleteProductAsync(req.query.id);

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
exports.findAllProductAsync = async (req, res, next) => {
	try {
		let query = {
			search: req.query.search || '',
			limit: req.query.limit || '15',
			skip: req.query.skip || '1',
			groupProduct: req.query.groupProduct || ''
		};

		const resServices = await productServices.findAllProduct(query);
		if (resServices.success) {
			return controller.sendSuccessPaging(
				res,
				resServices.data,
				resServices.numberPage,
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
exports.GetProductRecommend = async (req, res, next) => {
	try {
		const resServices = await productServices.getProductRecommend();
		if (resServices.success) {
			return controller.sendSuccess(res, resServices.data, 200, resServices.message);
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
exports.findDetailProduct = async (req, res, next) => {
	try {
		const resServices = await productServices.findProductByIdAsync(
			req.query.id
		);
		if (resServices.success) {
			var eveluates = await eveluateServices.getAllEveluateByProduct(
				resServices.data.id
			);
			var totalStar = 0;
			var starAVG = 0;
			var resultEveluate = [];
			if (eveluates.data.length <= 15) {
				resultEveluate = eveluates.data;
			} else {
				for (let i = 0; i < 15; i++) {
					resultEveluate.push(eveluates.data[i]);
				}
			}
			if (eveluates.data.length > 0) {
				eveluates.data.forEach(element => {
					totalStar = element.star + totalStar;
				});
				starAVG = totalStar / eveluates.data.length;
				starAVG = starAVG.toFixed(1);
			}

			var result = {
				price: resServices.data.price,
				image: resServices.data.image,
				status: resServices.data.status,
				weight: resServices.data.weight,
				sold: resServices.data.sold,
				quantity: resServices.data.quantity,
				_id: resServices.data._id,
				name: resServices.data.name,
				detail: resServices.data.detail,
				groupProduct: resServices.data.groupProduct,
				createdAt: resServices.data.createdAt,
				updatedAt: resServices.data.updatedAt,
				eveluates: resultEveluate,
				starAVG: starAVG,
				eveluateCount: eveluates.data.length
			};

			return controller.sendSuccess(res, result, 200, resServices.message);
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
