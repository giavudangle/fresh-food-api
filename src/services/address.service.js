const { defaultRoles, defaultStatusCart } = require('../config/defineModel');
const ADDRESS = require('../models/address.model');

const uploadServices = require('../services/uploadS3.service');
const { configEnv } = require('../config');
const axios = require('axios').default;

exports.createAddressAsync = async body => {
	try {
		if (body.isMain == true) {
			listAddress = await ADDRESS.find({ customerId: body.customerId });
			if (listAddress.length > 0) {
				for (let i = 0; i < listAddress.length; i++) {
					listAddress[i].isMain = false;
					listAddress[i].save();
				}
			}
		}
		const address = new ADDRESS(body);
		await address.save();
		return {
			message: 'Successfully create Address',
			success: true,
			data: address
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateAddressAsync = async (id, body) => {
	try {
		if (body.isMain == true) {
			listAddress = await ADDRESS.find({ customerId: body.customerId });

			if (listAddress.length > 0) {
				for (let i = 0; i < listAddress.length; i++) {
					if (listAddress[i].id != id) {
						listAddress[i].isMain = false;
						listAddress[i].save();
					}
				}
			}
		}

		const address = await ADDRESS.findOneAndUpdate({ _id: id }, body, {
			new: true
		});
		return {
			message: 'Successfully update Address',
			success: true,
			data: address
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.deleteAddressAsync = async id => {
	try {
		const address = await ADDRESS.deleteOne({ _id: id });
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

exports.getAddressByIdAsync = async id => {
	try {
		const address = await ADDRESS.findById(id);
		return {
			message: 'Successfully get Address',
			success: true,
			data: address
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.getAllAddressByIdUser = async id => {
	try {
		const arrAddress = await ADDRESS.find({ customerId: id }).sort({
			createdAt: -1
		});
		return {
			message: 'Successfully Get Address',
			success: true,
			data: arrAddress
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.priceAddrees = async body => {
	try {
		const { address, province, district, weight } = body;
		var totalShip = 0;
		await axios
			.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
				params: {
					address: address,
					province: province,
					district: district,
					pick_province: 'Hồ Chí Minh',
					pick_district: 'Thủ Đức',
					weight: weight * 1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then(function (response) {
				totalShip = response.data.fee.fee;
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		return {
			message: 'Successfully Get Address',
			success: true,
			data: {
				totalShip: totalShip
			}
		};
	} catch (e) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
