const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const EVELUATE = require('../models/Eveluate.model');
const USER = require('../models/User.model');

const PRODUCT = require('../models/Product.model');
const uploadServices = require('../services/uploadS3.service');

exports.createEveluateAsync = async body => {
	try {
		console.log('eveluate ne');
		console.log(body);
		const eveluate = new EVELUATE(body);
		await eveluate.save();
		return {
			message: 'Successfully create eveluate',
			success: true,
			data: eveluate
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateEveluateAsync = async (id, body) => {
	try {
		const eveluate = await EVELUATE.findOneAndUpdate({ _id: id }, body, {
			new: true
		});
		return {
			message: 'Successfully update Eveluate',
			success: true,
			data: eveluate
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteEveluateAsync = async id => {
	try {
		const eveluate = await EVELUATE.deleteOne({ _id: id });
		return {
			message: 'Successfully delete Eveluate',
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
exports.getEveluateByOrderAndUserAndProductAsync = async (
	customerId,
	orderId,
	productId
) => {
	try {
		const eveluate = await EVELUATE.find({
			customerId: customerId,
			orderId: orderId,
			productId: productId
		});
		console.log('danh gia trc');
		console.log(customerId);
		console.log(orderId);
		console.log(productId);

		console.log(eveluate);
		return {
			message: 'Successfully get Eveluate',
			success: true,
			data: eveluate
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getEveluateByProduct = async body => {
	try {
		const { productId, skip, limit } = body;
		const eveluates = await EVELUATE.find({ productId: productId })
			.sort({ createdAt: -1 })
			.skip(Number(limit) * Number(skip) - Number(limit))
			.limit(Number(limit));

		var resultEveluate = [];
		if (eveluates.length > 0) {
			for (let i = 0; i < eveluates.length; i++) {
				var userCurrent = await USER.findById(eveluates[i].customerId);
				var result = {
					productId: eveluates[i].productId,
					customerId: eveluates[i].customerId,
					orderId: eveluates[i].orderId,
					image: eveluates[i].image,
					content: eveluates[i].content,
					star: eveluates[i].star,
					_id: eveluates[i]._id,
					createdAt: eveluates[i].createdAt,
					updatedAt: eveluates[i].updatedAt,
					avatar: userCurrent.avatar,
					name: userCurrent.name
				};
				resultEveluate.push(result);
			}
		}

		return {
			message: 'Successfully Get eveluates',
			success: true,
			data: resultEveluate
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getAllEveluateByProduct = async productId => {
	try {
		const eveluates = await EVELUATE.find({ productId: productId }).sort({
			createdAt: -1
		});

		var resultEveluate = [];
		if (eveluates.length > 0) {
			for (let i = 0; i < eveluates.length; i++) {
				var userCurrent = await USER.findById(eveluates[i].customerId);
				var result = {
					productId: eveluates[i].productId,
					customerId: eveluates[i].customerId,
					orderId: eveluates[i].orderId,
					image: eveluates[i].image,
					content: eveluates[i].content,
					star: eveluates[i].star,
					_id: eveluates[i]._id,
					createdAt: eveluates[i].createdAt,
					updatedAt: eveluates[i].updatedAt,
					avatar: userCurrent.avatar,
					name: userCurrent.name
				};
				resultEveluate.push(result);
			}
		}
		
		return {
			message: 'Successfully Get eveluates',
			success: true,
			data: resultEveluate
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
