const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const CART = require('../models/Cart.model');
const PRODUCT = require('../models/Product.model');
const uploadServices = require('../services/uploadS3.service');

exports.createCartAsync = async body => {
	try {
		const productCurrent = await PRODUCT.findById(body.productId);
		if (productCurrent == null) {
			return {
				message: 'An error occurred',
				success: false
			};
		}
		if (
			productCurrent.quantity == 0 ||
			productCurrent.quantity < body.quantity
		) {
			return {
				message: 'Do not quantity product',
				success: false
			};
		}
		const cart = new CART(body);
		await cart.save();
		return {
			message: 'Successfully create Cart',
			success: true,
			data: cart
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateCartAsync = async (id, body) => {
	try {
		const cart = await CART.findOneAndUpdate({ _id: id }, body, {
			new: true
		});

		return {
			message: 'Successfully update Cart',
			success: true,
			data: cart
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.deleteCartAsync = async id => {
	try {
		const cart = await CART.deleteOne({ _id: id });
		return {
			message: 'Successfully delete Cart',
			success: true
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getCartByIdAsync = async id => {
	try {
		const cart = await CART.findById(id);
		return {
			message: 'Successfully delete Cart',
			success: true,
			data: cart
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllCartByIdUser = async body => {
	try {
		const { customerId, skip, limit } = body;
		const cartsCurrent = await CART.find({
			customerId: customerId,
			status: defaultStatusCart.Active
		})
			.sort({ createdAt: -1 })
			.skip(Number(limit) * Number(skip) - Number(limit))
			.limit(Number(limit));
		console.log(cartsCurrent.length);
		let arrResult = [];
		for (let i = 0; i < cartsCurrent.length; i++) {
			var productCurrent = await PRODUCT.findById(cartsCurrent[i].productId);
			var costCart = 0;
			costCart = productCurrent.price * cartsCurrent[i].quantity;
			var newCart = {
				status: cartsCurrent[i].status,
				quantity: cartsCurrent[i].quantity,
				name: cartsCurrent[i].name,
				nameGroup: cartsCurrent[i].nameGroup,
				_id: cartsCurrent[i].id,
				productId: cartsCurrent[i].productId,
				customerId: cartsCurrent[i].customerId,
				image: cartsCurrent[i].image,
				cost: productCurrent.price,
				totalCost: costCart,
				createdAt: cartsCurrent[i].createdAt,
				updatedAt: cartsCurrent[i].updatedAt,
				weight: productCurrent.weight
			};

			arrResult.push(newCart);
		}

		return {
			message: 'Successfully Get Cart',
			success: true,
			data: arrResult
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getCartByProductAndUserAsync = async body => {
	try {
		const { productId, customerId } = body;
		const cart = await CART.findOne({
			productId: productId,
			customerId: customerId
		});
		
		return {
			message: 'Successfully delete Cart',
			success: true,
			data: cart
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
