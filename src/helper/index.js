const sharp = require('sharp');
const { encode } = require('blurhash');
const PaypalModel = require('../models/Paypal.model');
const paypal = require('paypal-rest-sdk');

exports.convertObjectFieldString = (obj = {}) => {
	const entries = Object.entries(obj);
	return entries.reduce((t, v) => {
		t[v[0]] = `${v[1]}`;
		return t;
	}, {});
};

exports.encodeImageToBlurhash = path =>
	new Promise((resolve, reject) => {
		sharp(path)
			.resize(300, 300)
			.raw()
			.ensureAlpha()
			.toBuffer((err, buffer, { width, height }) => {
				if (err) return reject(err);
				resolve(encode(new Uint8ClampedArray(buffer), width, height, 6, 4));
			});
	});

exports.FormatDollar = tienDo => {
	var tienDo2f = Math.round(tienDo * 100) / 100;
	var tienDo3f = Math.round(tienDo * 1000) / 1000;
	return tienDo % tienDo2f == 0
		? tienDo2f
		: tienDo2f > tienDo3f
		? tienDo2f
		: tienDo2f + 0.01;
};

exports.paymentMethod = async (price, idOrder, next) => {
	const create_payment_json = {
		intent: 'sale',
		payer: {
			payment_method: 'paypal'
		},
		redirect_urls: {
			return_url: `https://befreshfood.tk/user/successPayPal?price=${price}&idDonHang=${idOrder}`,
			cancel_url: 'https://befreshfood.tk/user/cancelPayPal'
		},
		transactions: [
			{
				item_list: {
					items: [
						{
							name: 'Tổng Tiền đơn hàng',
							sku: '001',
							price: `${price}`,
							currency: 'USD',
							quantity: 1
						}
					]
				},
				amount: {
					currency: 'USD',
					total: `${price}`
				},
				description: 'Phí thanh toán ở FreshFood'
			}
		]
	};
	paypal.payment.create(create_payment_json, async (error, payment) => {
		await next(error, payment);
	});
};

exports.RefundPayment = async (idOrder, next) => {
	const resultPaypal = await PaypalModel.findOne({ idOrder });
	const data = {
		amount: {
			total: `${resultPaypal.Transaction}`,
			currency: 'USD'
		}
	};

	paypal.sale.refund(
		resultPaypal.idPaypal,
		data,
		async function (error, refund) {
			await next(error, refund);
		}
	);
};

exports.sortObject = obj => {
	var sorted = {};
	var str = [];
	var key;

	for (key in obj) {
		if (obj.hasOwnProperty(key)) {
			str.push(encodeURIComponent(key));
		}
	}

	str.sort();
	for (key = 0; key < str.length; key++) {
		sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
	}
	return sorted;
};

exports.formatDateYYMMDD = date => {
	var d = new Date(date),
		month = '' + (d.getMonth() + 1),
		day = '' + d.getDate(),
		year = d.getFullYear();

	if (month.length < 2) month = '0' + month;

	if (day.length < 2) day = '0' + day;

	return [year, month, day].join('-');
};
