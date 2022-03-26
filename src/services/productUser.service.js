const USER = require('../models/User.model');
const { defaultRoles } = require('../config/defineModel');
const PRODUCTUSER = require('../models/ProductUser.model');

exports.createProductUserAsync = async body => {
	try {
		const productUser = new PRODUCTUSER(body);
		await productUser.save();
		return {
			message: 'Successfully create Product User',
			success: true,
			data: productUser
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateProductUserAsync = async ( body) => {
	try {
		const productUser = await PRODUCTUSER.findOneAndUpdate({ customerId: body.customerId, productId: body.productId }, body, {
			new: true
		});
		return {
			message: 'Successfully update Product User',
			success: true,
			data: productUser
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.deleteProductUserAsync = async id => {
	try {
    const productUser = await PRODUCTUSER.deleteOne({_id: id});
		return {
			message: 'Successfully delete Product User',
			success: true,
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findProductByIdUserAsync = async body => {
	try {
		const { customerId,skip,limit} = body;
		const productUser = await PRODUCTUSER.find({customerId: customerId}).sort({updatedAt:-1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit));
		return {
			message: 'Successfully Get Product',
			success: true,
			data: productUser
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findProductByIdUserAndProductAsync = async (body) => {
	try {
		const productUser = await PRODUCTUSER.find({customerId: body.customerId, productId: body.productId});
		return {
			message: 'Successfully Get Product User',
			success: true,
			data: productUser
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};