const USER = require('../models/User.model');
const ORDER = require('../models/Order.model');
const PRODUCT = require('../models/Product.model');
const uploadServices = require('../services/uploadS3.service');
const { defaultRoles, defaultModel } = require('../config/defineModel');

exports.staticByOrder = async body => {
	try {
		const { timeStart, timeEnd} = body;
    const currentTime = new Date(timeStart);
    const start = new Date(currentTime.getTime()-7*3600*1000);
		let endTimeByDay = new Date(timeEnd).setHours(23, 59, 59, 999);
		const end = new Date(new Date(endTimeByDay).getTime()-7*3600*1000);

    var listOrder = await ORDER.find({
      status: { $in: [0, 1, 2, 3] },
			createdAt: {
				$gte: start,
				$lt: end
			}
    });
    var totalMoney = 0 ;
    var totalOrder = listOrder.length ;
    listOrder.forEach(e => {
      totalMoney =  e.totalMoney + totalMoney;
    });

		var result = {
			totalOrder: totalOrder,
			totalMoney: totalMoney
		}
		return {
			message: 'Successfully Statistic By Time',
			success: true,
			data: result
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server',
			success: false
		};
	}
};
exports.staticByProduct = async body => {
	try {
		var listProduct = await PRODUCT.find().sort({sold:-1});
		var arrayListProduct = [];
		if(listProduct.length<5)
		{
			for(let i = 0; i < listProduct.length;i++)
			{
				var arrayImage = [];
				arrayImage.push(listProduct[i].image[0]);
				listProduct[i].image = arrayImage;
				arrayListProduct.push(listProduct[i]);
			}
		}
		else
		{
			for(let i = 0; i < 5;i++)
			{
				var arrayImage = [];
				arrayImage.push(listProduct[i].image[0]);
				listProduct[i].image = arrayImage;
				arrayListProduct.push(listProduct[i]);
			}
		}
		return {
			message: 'Successfully Statistic By Time',
			success: true,
			data: arrayListProduct
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server',
			success: false
		};
	}
};
exports.staticByUser = async id => {
	try {
		var listProduct = await ORDER.find({customerId: id});
		var totalMoney =  0;
		var totalOrder = 0;
		listProduct.forEach(element => {
			totalMoney = element.totalMoney+ totalMoney;
			totalOrder = totalOrder +1;
		});
		
		var result = {
			totalMoney: totalMoney,
			totalOrder: totalOrder
		}
		return {
			message: 'Successfully Statistic By Time',
			success: true,
			data: result
		};
	} catch (err) {
		console.log(err);
		return {
			error: 'Internal Server',
			success: false
		};
	}
};