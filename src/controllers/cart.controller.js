const controller = require('./controller');
const cartServices = require('../services/cart.service');
const productServices = require('../services/product.service');
const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
exports.createCartAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		req.value.body.customerId = id;
		var resServices;
		const productCurrent = await productServices.findProductByIdAsync(
			req.value.body.productId
		);

		if (productCurrent.success != true) {
			return controller.sendSuccess(
				res,
				productCurrent.data,
				300,
				productCurrent.message
			);
		}

		if (productCurrent.data.quantity >= req.value.body.quantity) {
			req.value.body.name = productCurrent.data.name;
			req.value.body.nameGroup = productCurrent.data.groupProduct.name;
			const cartCurrent = await cartServices.getCartByProductAndUserAsync(
				req.value.body
			);

			if (cartCurrent.success == true && cartCurrent.data == null) {
				resServices = await cartServices.createCartAsync(req.value.body);
				if (resServices.success) {
					return controller.sendSuccess(
						res,
						resServices.data,
						200,
						resServices.message
					);
				}
			} else if (cartCurrent.success == true && cartCurrent.data != null) {
				if (cartCurrent.data.status == defaultStatusCart.Active) {
					req.value.body.quantity =
						cartCurrent.data.quantity + req.value.body.quantity;
					resServices = await cartServices.updateCartAsync(
						cartCurrent.data.id,
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
				} else {
					req.value.body.status = defaultStatusCart.Active;
					resServices = await cartServices.updateCartAsync(
						cartCurrent.data.id,
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
				}
			}

			return controller.sendSuccess(
				res,
				cartCurrent.data,
				300,
				cartCurrent.message
			);
		} else {
			return controller.sendSuccess(res, null, 400, "Don't quantity product");
		}
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};

exports.updateCartAsync = async (req, res, next) => {
	try {
		var resultUpdate = [];
		for (let i = 0; i < req.value.body.array.length; i++) {
			var cartCurrent = await cartServices.getCartByIdAsync(
				req.value.body.array[i].id
			);
			if (cartCurrent.success == false) {
				return controller.sendSuccess(
					res,
					cartCurrent.data,
					300,
					cartCurrent.message
				);
			}
			var productCurrent = await productServices.findProductByIdAsync(
				cartCurrent.data.productId
			);
			if (productCurrent.success == false) {
				return controller.sendSuccess(
					res,
					productCurrent.data,
					300,
					productCurrent.message
				);
			}

			if (productCurrent.data.quantity < req.value.body.array[i].quantity) {
				return controller.sendSuccess(res, null, 400, "Don't quantity product");
			}
			const resServices = await cartServices.updateCartAsync(
				req.value.body.array[i].id,
				req.value.body.array[i]
			);
			if (resServices.success == false) {
				return controller.sendSuccess(
					res,
					resServices.data,
					300,
					resServices.message
				);
			}

			resultUpdate.push(resServices.data);
		}
		if (resultUpdate.length == req.value.body.array.length) {
			return controller.sendSuccess(
				res,
				resultUpdate,
				200,
				'Update Success Cart'
			);
		} else {
			return controller.sendSuccess(res, null, 300, "Don't update Cart");
		}
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};

exports.GetCartAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		var query = {
			customerId: id,
			limit: req.query.limit || '15',
			skip: req.query.skip || '1'
		};

		const resServices = await cartServices.getAllCartByIdUser(query);
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

exports.deleteCartAsync = async (req, res, next) => {
	try {
		const resServices = await cartServices.deleteCartAsync(req.query.id);
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
