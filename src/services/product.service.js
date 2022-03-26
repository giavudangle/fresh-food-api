const USER = require('../models/User.model');
const { defaultRoles } = require('../config/defineModel');
const GROUPPRODUCT = require('../models/GroupProduct.model');
const PRODUCT = require('../models/Product.model');

exports.createProductAsync = async body => {
	try {
		var groupProduct = await GROUPPRODUCT.findOne({ key: body.groupProduct });
		if (groupProduct == null)
			return {
				message: 'GroupProduct not exit',
				success: false
			};

		body.groupProduct = {
			name: groupProduct.name,
			key: groupProduct.key
		};
		const product = new PRODUCT(body);
		await product.save();

		return {
			message: 'Successfully create Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateProductAsync = async (id, body) => {
	try {
		var groupProduct = await GROUPPRODUCT.findOne({ key: body.groupProduct });
		if (groupProduct == null)
			return {
				message: 'GroupProduct not exit',
				success: false
			};

		body.groupProduct = {
			name: groupProduct.name,
			key: groupProduct.key
		};
		const product = await PRODUCT.findOneAndUpdate({ _id: id }, body, {
			new: true
		});

		return {
			message: 'Successfully update Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.deleteProductAsync = async id => {
	try {
		const product = await PRODUCT.findOneAndUpdate(
			{ _id: id },
			{ status: 'DELETED' },
			{ new: true }
		);

		return {
			message: 'Successfully delete Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.findProductByIdAsync = async id => {
	try {
		const product = await PRODUCT.findById(id);
		if(product == null)
		{
			return {
				message: 'An error occurred',
				success: false
			};
		}

		return {
			message: 'Successfully Get Product',
			success: true,
			data: product
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.findAllProduct = async body => {
	try {
		const { groupProduct, search,skip,limit} = body;
		var product;
		var totalProduct = await PRODUCT.find();
		var numberPage = Math.ceil(totalProduct.length/limit);
		if(groupProduct === '')
		{
			totalProduct = await PRODUCT.find({ name: { $regex: `${search}`, $options: '$i' } });
			product = await PRODUCT.find({ name: { $regex: `${search}`, $options: '$i' } }).sort({createdAt: -1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit));
			numberPage = Math.ceil(totalProduct.length/limit);
		}
		else 
		{
			totalProduct = await PRODUCT.find({ name: { $regex: `${search}`, $options: '$i' },'groupProduct.key': groupProduct});
			product = await PRODUCT.find({ name: { $regex: `${search}`, $options: '$i' },
					'groupProduct.key': groupProduct
			}).sort({createdAt: -1}).skip(Number(limit) * Number(skip) - Number(limit)).limit(Number(limit));
			numberPage = Math.ceil(product.length/limit);
		}

		return {
			message: 'Successfully Get Product',
			success: true,
			data: product,
			numberPage: numberPage
		};
	} catch (e) {
		console.log(e);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getProductRecommend = async (id) => {
	try {
		const products = await PRODUCT.find().sort({sold: -1});
		var arrResult = [];
		for(let i=0;i<5;i++)
		{
			arrResult.push(products[i]);
		}
		
		return {
			message: 'Successfully get product recommend',
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