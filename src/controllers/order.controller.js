const controller = require('./controller');
const cartServices = require('../services/cart.service');
const orderServices = require('../services/order.service');
const productServices = require('../services/product.service');
const discountService = require('../services/discount.service');

const ORDER = require('../models/Order.model');
const USER = require('../models/User.model');
const DEVICE = require('../models/Device.model');

const {
	pushNotification,
	pushMultipleNotification
} = require('../services/fcmNotify');
const axios = require('axios').default;
const {
	defaultRoles,
	defaultStatusCart,
	defaultPayment
} = require('../config/defineModel');
const {
	paymentMethod,
	FormatDollar,
	sortObject,
	RefundPayment
} = require('../helper');
const { configEnv } = require('../config');
const { string } = require('@hapi/joi');
exports.createOrderAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		req.value.body.customerId = id;
		var arrCart = [];
		var totalWeight = 0;
		var totalShip = 0;
		var totalMoney = 0;
		var totalMoneyProduct = 0;
		const staff = await USER.find({ role: 2 });

		for (let i = 0; i < req.value.body.cartId.length; i++) {
			var cartCurrent = await cartServices.getCartByIdAsync(
				req.value.body.cartId[i]
			);

			if (cartCurrent.success != true) {
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

			if (productCurrent.success != true) {
				return controller.sendSuccess(
					res,
					productCurrent.data,
					300,
					productCurrent.message
				);
			}

			totalWeight =
				totalWeight + cartCurrent.data.quantity * productCurrent.data.weight;
			totalMoneyProduct =
				totalMoneyProduct +
				productCurrent.data.price * cartCurrent.data.quantity;
			cartCurrent.data.status = defaultStatusCart.InActive;
			cartCurrent.data.save();
			var cartPush = {
				productId: productCurrent.data.id,
				price: productCurrent.data.price,
				quantity: cartCurrent.data.quantity,
				weight: productCurrent.data.weight,
				name: productCurrent.data.name,
				image: productCurrent.data.image,
				nameGroup: productCurrent.data.groupProduct.name
			};
			arrCart.push(cartPush);
		}

		var history = {
			title: 'Đơn hàng vừa mới tạo',
			createdAt: Date.now()
		};

		await axios
			.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
				params: {
					address: req.value.body.area.address,
					province: req.value.body.area.province,
					district: req.value.body.area.district,
					pick_province: 'Hồ Chí Minh',
					pick_district: 'Thủ Đức',
					weight: totalWeight * 1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then(function (response) {
				totalShip = response.data.fee.fee;
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});
		var discountOrder = 0;
		if(req.value.body.idDiscount != '')
		{
			var discount = await discountService.CheckDiscountActive(req.value.body.idDiscount)
			if(discount.data == null)
			{
				return controller.sendSuccess(
					res,
					null,
					300,
					"discount has expired"
				);
			}
			discountOrder = totalMoneyProduct * discount.data.percentDiscount;
			if(discountOrder > discount.data.maxDiscount)
				discountOrder = discount.data.maxDiscount
		}

		totalMoney = totalMoneyProduct + totalShip - discountOrder;
		req.value.body.area = req.value.body.area;
		req.value.body.product = arrCart;
		req.value.body.shipFee = totalShip;
		req.value.body.totalMoney = totalMoney;
		req.value.body.totalMoneyProduct = totalMoneyProduct;
		req.value.body.history = history;
		req.value.body.discountMoney = discountOrder;
		const resServices = await orderServices.createOrderAsync(req.value.body);
		var changePriceOrder = FormatDollar(totalMoney / 24000);
		var resultPayment;
		if (resServices.success) {
			var idOrderNew = resServices.data._id;
			if (req.value.body.typePaymentOrder == defaultPayment.PayPal) {
				paymentMethod(
					changePriceOrder,
					idOrderNew,
					async function (error, payment) {
						if (error) {
							resultPayment = error;
						} else {
							for (let i = 0; i < payment.links.length; i++) {
								if (payment.links[i].rel === 'approval_url') {
									resultPayment = payment.links[i].href;
									if (staff.length != 0) {
										var allDevice = [];
										for (let i = 0; i < staff.length; i++) {
											const devices = await DEVICE.find({
												creatorUser: staff[i]._id,
												statusDevice: 1
											});
											devices.forEach(element => {
												allDevice.push(element.fcm);
											});
											console.log('allDevice');

											console.log(allDevice);
										}
										pushMultipleNotification(
											'Khách hàng mới tạo đơn',
											'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
											'',
											{
												action: 'NEW_ORDER',
												_id: `${idOrderNew}`
											},
											allDevice
										);
									}

									return controller.sendSuccess(
										res,
										{ link: resultPayment },
										200,
										'success'
									);
								}
							}
						}
					}
				);
			} else if (req.value.body.typePaymentOrder == defaultPayment.VNPay) {
				var ipAddr =
					req.headers['x-forwarded-for'] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress;
				var tmnCode = 'ME42CH34';
				var secretKey = 'XNMGSWNPSCFQPUFDPXZBERQFLZFBKBKR';
				var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
				var returnUrl = 'https://befreshfood.tk/user/successVnPay';
				var date = new Date();
				var createDate =
					date.getFullYear() +
					('0' + (date.getMonth() + 1)).slice(-2) +
					('0' + date.getDate()).slice(-2) +
					('0' + date.getHours()).slice(-2) +
					('0' + date.getMinutes()).slice(-2) +
					('0' + date.getSeconds()).slice(-2);
				var orderId = createDate.slice(8, 14);
				var amount = totalMoney;
				var bankCode = 'NCB';
				var orderInfo = idOrderNew;
				var orderType = 'other';
				var locale = 'vn';
				var currCode = 'VND';
				var vnp_Params = {};
				vnp_Params['vnp_Version'] = '2.1.0';
				vnp_Params['vnp_Command'] = 'pay';
				vnp_Params['vnp_TmnCode'] = tmnCode;
				vnp_Params['vnp_Locale'] = locale;
				vnp_Params['vnp_CurrCode'] = currCode;
				vnp_Params['vnp_TxnRef'] = orderId;
				vnp_Params['vnp_OrderInfo'] = idOrderNew;
				vnp_Params['vnp_OrderType'] = orderType;
				vnp_Params['vnp_Amount'] = amount * 100;
				vnp_Params['vnp_ReturnUrl'] = returnUrl;
				vnp_Params['vnp_IpAddr'] = ipAddr;
				vnp_Params['vnp_CreateDate'] = createDate;
				if (bankCode !== null && bankCode !== '') {
					vnp_Params['vnp_BankCode'] = bankCode;
				}
				vnp_Params = sortObject(vnp_Params);
				var querystring = require('qs');
				var signData = querystring.stringify(vnp_Params, { encode: false });
				var crypto = require('crypto');
				var hmac = crypto.createHmac('sha512', secretKey);
				var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
				vnp_Params['vnp_SecureHash'] = signed;
				vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

				if (staff.length != 0) {
					var allDevice = [];
					for (let i = 0; i < staff.length; i++) {
						const devices = await DEVICE.find({
							creatorUser: staff[i]._id,
							statusDevice: 1
						});
						devices.forEach(element => {
							allDevice.push(element.fcm);
						});
						console.log('allDevice');

						console.log(allDevice);
					}

					pushMultipleNotification(
						'Khách hàng mới tạo đơn',
						'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
						'',
						{
							action: 'NEW_ORDER',
							_id: `${idOrderNew}`
						},
						allDevice
					);
				}
				return controller.sendSuccess(res, { link: vnpUrl }, 200, 'Success');
			} else {
				var updateOrder = await ORDER.findOneAndUpdate(
					{ _id: idOrderNew },
					{ typePayment: 'COD' },
					{ new: true }
				);

				if (staff.length != 0) {
					var allDevice = [];
					for (let i = 0; i < staff.length; i++) {
						const devices = await DEVICE.find({
							creatorUser: staff[i]._id,
							statusDevice: 1
						});

						devices.forEach(element => {
							allDevice.push(element.fcm);
						});
					}

					pushMultipleNotification(
						'Khách hàng mới tạo đơn',
						'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
						'',
						{
							action: 'NEW_ORDER',
							_id: `${idOrderNew}`
						},
						allDevice
					);
				}

				return controller.sendSuccess(res, updateOrder, 200, 'Success');
			}
		} else {
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		}
	} catch (error) {
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};

exports.changeStatusOrder = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const idUser = decodeToken.data.id;
		var history;
		if (req.value.body.status === 1) {
			history = {
				title: 'Đơn hàng vừa được xác nhận',
				createdAt: Date.now()
			};
		} else if (req.value.body.status === 2) {
			history = {
				title: 'Đơn hàng đang được vận chuyển',
				createdAt: Date.now()
			};
		} else if (req.value.body.status === 3) {
			history = {
				title: 'Đơn hàng đã giao thành công',
				createdAt: Date.now()
			};
		} else {
			history = {
				title: 'Đơn hàng đã bị hủy',
				createdAt: Date.now()
			};
		}
		var bodyNew = {
			status: req.value.body.status
		};

		var orderCurrent = await ORDER.findById(req.value.body.id);
		if (orderCurrent == null)
			return controller.sendSuccess(res, null, 404, 'Order not found');
		if (req.value.body.status === 4) {
			var user = await USER.findById(idUser);
			if (user == null)
				return controller.sendSuccess(res, null, 404, 'User not found');
			if (user.role == defaultRoles.Staff) {
				const userCreateOrder = await USER.findById(orderCurrent.customerId);
				if (userCreateOrder == null) {
					return controller.sendSuccess(res, null, 404, 'User not found');
				}

				if (orderCurrent.typePayment == 'PayPal') {
					await RefundPayment(
						req.value.body.id,
						async function (error, refund) {
							if (error) {
								resultRefund = error;
								return controller.sendSuccess(res, null, 300, resultRefund);
							} else {
								resultRefund = refund;
								bodyNew = {
									status: req.value.body.status,
									typePayment: 'Đã hoàn tiền'
								};
								const devices = await DEVICE.find({
									creatorUser: userCreateOrder._id,
									statusDevice: 1
								});

								var newArr = devices.map(val => {
									return val.fcm;
								});

								pushMultipleNotification(
									`Đơn hàng bị hủy bởi FreshFood`,
									`Kiểm tra ngay`,
									'',
									{
										action: 'UPDATE_STATUS_ORDER',
										_id: `${orderCurrent._id}`
									},
									newArr
								);

								const resServices = await orderServices.updateStatusOrderAsync(
									req.value.body.id,
									bodyNew
								);
								await resServices.data.history.push(history);
								await resServices.data.save();
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
							}
						}
					);
				}

				const devices = await DEVICE.find({
					creatorUser: userCreateOrder._id,
					statusDevice: 1
				});
				var newArr = devices.map(val => {
					return val.fcm;
				});

				pushMultipleNotification(
					`Đơn hàng bị hủy bởi FreshFood`,
					`Kiểm tra ngay`,
					'',
					{
						action: 'UPDATE_STATUS_ORDER',
						_id: `${orderCurrent._id}`
					},
					newArr
				);

				const resServices = await orderServices.updateStatusOrderAsync(
					req.value.body.id,
					bodyNew
				);
				await resServices.data.history.push(history);
				await resServices.data.save();
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
			} else if (user.role == defaultRoles.User) {
				const staff = await USER.find({ role: defaultRoles.Staff });

				if (staff.length == 0) {
					return controller.sendSuccess(
						res,
						null,
						404,
						'Staff not found push FCM'
					);
				}

				if (orderCurrent.typePayment == 'PayPal') {
					await RefundPayment(
						req.value.body.id,
						async function (error, refund) {
							if (error) {
								resultRefund = error;
								return controller.sendSuccess(res, null, 300, resultRefund);
							} else {
								resultRefund = refund;
								bodyNew = {
									status: req.value.body.status,
									typePayment: 'Đã hoàn tiền'
								};
								var allDevice = [];
								for (let i = 0; i < staff.length; i++) {
									const devices = await DEVICE.find({
										creatorUser: staff[i]._id,
										statusDevice: 1
									});
									devices.forEach(element => {
										allDevice.push(element.fcm);
									});
								}

								pushMultipleNotification(
									`Đơn hàng bị hủy bởi khách hàng`,
									`Đơn có mã ${orderCurrent.orderCode} đã bị hủy`,
									'',
									{
										action: 'UPDATE_STATUS_ORDER',
										_id: `${orderCurrent._id}`
									},
									allDevice
								);

								const resServices = await orderServices.updateStatusOrderAsync(
									req.value.body.id,
									bodyNew
								);
								await resServices.data.history.push(history);
								await resServices.data.save();
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
							}
						}
					);
				}

				var allDevice = [];
				for (let i = 0; i < staff.length; i++) {
					const devices = await DEVICE.find({
						creatorUser: staff[i]._id,
						statusDevice: 1
					});

					devices.forEach(element => {
						allDevice.push(element.fcm);
					});
				}

				pushMultipleNotification(
					`Đơn hàng bị hủy bởi khách hàng`,
					`Đơn có mã ${orderCurrent.orderCode} đã bị hủy`,
					'',
					{
						action: 'UPDATE_STATUS_ORDER',
						_id: `${orderCurrent._id}`
					},
					allDevice
				);

				const resServices = await orderServices.updateStatusOrderAsync(
					req.value.body.id,
					bodyNew
				);
				await resServices.data.history.push(history);
				await resServices.data.save();
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
			}
		} else {
			const userCreateOrder = await USER.findById(orderCurrent.customerId);
			if (userCreateOrder) {
				const devices = await DEVICE.find({
					creatorUser: userCreateOrder._id,
					statusDevice: 1
				});

				var newArr = devices.map(val => {
					return val.fcm;
				});

				pushMultipleNotification(
					'Đơn hàng của bạn mới chuyển trạng thái',
					'Hãy kiểm tra đơn hàng ngay',
					'',
					{
						action: 'UPDATE_STATUS_ORDER',
						_id: `${orderCurrent._id}`
					},
					newArr
				);

				const resServices = await orderServices.updateStatusOrderAsync(
					req.value.body.id,
					bodyNew
				);
				await resServices.data.history.push(history);
				await resServices.data.save();
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
			}
		}
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};

exports.deleteCartAsync = async (req, res, next) => {
	try {
		const resServices = await orderServices.cancelOrderAsync(req.query.id);
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

exports.GetOrderByUserAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		let query = {
			search: req.query.search || '',
			limit: req.query.limit || '15',
			skip: req.query.skip || '1',
			status: req.query.status || '',
			customerId: id
		};

		const resServices = await orderServices.GetOrderByUser(query);
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

exports.GetOrderByAdminAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		let query = {
			search: req.query.search || '',
			limit: req.query.limit || '15',
			skip: req.query.skip || '1',
			status: req.query.status || '',
			customerId: id
		};

		const resServices = await orderServices.GetOrderByAdmin(query);
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
		// bug
		console.log(error);
		return controller.sendError(res);
	}
};

exports.CreateOrderWithByNowAsync = async (req, res, next) => {
	try {
		const { decodeToken } = req.value.body;
		const id = decodeToken.data.id;
		req.value.body.customerId = id;
		var arrProduct = [];
		var totalWeight = 0;
		var totalShip = 0;
		var totalMoney = 0;
		var totalMoneyProduct = 0;

		var productCurrent = await productServices.findProductByIdAsync(
			req.value.body.productId
		);

		totalWeight = req.value.body.quantity * productCurrent.data.weight;
		totalMoneyProduct = productCurrent.data.price * req.value.body.quantity;
		var productPush = {
			productId: productCurrent.data.id,
			price: productCurrent.data.price,
			quantity: req.value.body.quantity,
			weight: productCurrent.data.weight,
			name: productCurrent.data.name,
			nameGroup: productCurrent.data.groupProduct.name,
			image: productCurrent.data.image
		};
		arrProduct.push(productPush);
		var history = {
			title: 'Đơn hàng vừa mới tạo',
			createdAt: Date.now()
		};

		await axios
			.get('https://services.giaohangtietkiem.vn/services/shipment/fee', {
				params: {
					address: req.value.body.area.address,
					province: req.value.body.area.province,
					district: req.value.body.area.district,
					pick_province: 'Hồ Chí Minh',
					pick_district: 'Thủ Đức',
					weight: totalWeight * 1000
				},
				headers: { Token: configEnv.API_GHTK }
			})
			.then(function (response) {
				totalShip = response.data.fee.fee;
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
			})
			.then(function () {
				// always executed
			});

			var discountOrder = 0;
			if(req.value.body.idDiscount != '')
			{
				var discount = await discountService.CheckDiscountActive(req.value.body.idDiscount)
				if(discount.data == null)
				{
					return controller.sendSuccess(
						res,
						null,
						300,
						"discount has expired"
					);
				}
				discountOrder = totalMoneyProduct * discount.data.percentDiscount;
				if(discountOrder > discount.data.maxDiscount)
					discountOrder = discount.data.maxDiscount
			}

		totalMoney = totalMoneyProduct + totalShip - discountOrder;
		req.value.body.discountMoney = discountOrder;
		req.value.body.area = req.value.body.area;
		req.value.body.product = arrProduct;
		req.value.body.shipFee = totalShip;
		req.value.body.totalMoney = totalMoney;
		req.value.body.totalMoneyProduct = totalMoneyProduct;
		req.value.body.history = history;
		const resServices = await orderServices.createOrderAsync(req.value.body);
		var changePriceOrder = FormatDollar(totalMoney / 24000);
		var resultPayment;
		const staff = await USER.find({ role: 2 });
		if (resServices.success) {
			var idOrderNew = resServices.data._id;
			if (req.value.body.typePaymentOrder == defaultPayment.PayPal) {
				paymentMethod(
					changePriceOrder,
					idOrderNew,
					async function (error, payment) {
						if (error) {
							resultPayment = error;
						} else {
							for (let i = 0; i < payment.links.length; i++) {
								if (payment.links[i].rel === 'approval_url') {
									resultPayment = payment.links[i].href;

									if (staff.length != 0) {
										var allDevice = [];
										for (let i = 0; i < staff.length; i++) {
											const devices = await DEVICE.find({
												creatorUser: staff[i]._id,
												statusDevice: 1
											});

											devices.forEach(element => {
												allDevice.push(element.fcm);
											});
										}

										pushMultipleNotification(
											'Khách hàng mới tạo đơn',
											'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
											'',
											{
												action: 'NEW_ORDER',
												_id: `${idOrderNew}`
											},
											allDevice
										);
									}

									return controller.sendSuccess(
										res,
										{ link: resultPayment },
										200,
										'success'
									);
								}
							}
						}
					}
				);
			} else if (req.value.body.typePaymentOrder == defaultPayment.VNPay) {
				var ipAddr =
					req.headers['x-forwarded-for'] ||
					req.connection.remoteAddress ||
					req.socket.remoteAddress ||
					req.connection.socket.remoteAddress;
				var tmnCode = 'ME42CH34';
				var secretKey = 'XNMGSWNPSCFQPUFDPXZBERQFLZFBKBKR';
				var vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
				var returnUrl = 'https://befreshfood.tk/user/successVnPay';
				var date = new Date();
				var createDate =
					date.getFullYear() +
					('0' + (date.getMonth() + 1)).slice(-2) +
					('0' + date.getDate()).slice(-2) +
					('0' + date.getHours()).slice(-2) +
					('0' + date.getMinutes()).slice(-2) +
					('0' + date.getSeconds()).slice(-2);
				var orderId = createDate.slice(8, 14);
				var amount = totalMoney;
				var bankCode = 'NCB';
				var orderInfo = idOrderNew;
				var orderType = 'other';
				var locale = 'vn';
				var currCode = 'VND';
				var vnp_Params = {};
				vnp_Params['vnp_Version'] = '2.1.0';
				vnp_Params['vnp_Command'] = 'pay';
				vnp_Params['vnp_TmnCode'] = tmnCode;
				vnp_Params['vnp_Locale'] = locale;
				vnp_Params['vnp_CurrCode'] = currCode;
				vnp_Params['vnp_TxnRef'] = orderId;
				vnp_Params['vnp_OrderInfo'] = idOrderNew;
				vnp_Params['vnp_OrderType'] = orderType;
				vnp_Params['vnp_Amount'] = amount * 100;
				vnp_Params['vnp_ReturnUrl'] = returnUrl;
				vnp_Params['vnp_IpAddr'] = ipAddr;
				vnp_Params['vnp_CreateDate'] = createDate;

				if (bankCode !== null && bankCode !== '') {
					vnp_Params['vnp_BankCode'] = bankCode;
				}

				vnp_Params = sortObject(vnp_Params);
				var querystring = require('qs');
				var signData = querystring.stringify(vnp_Params, { encode: false });
				var crypto = require('crypto');
				var hmac = crypto.createHmac('sha512', secretKey);
				var signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
				vnp_Params['vnp_SecureHash'] = signed;
				vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
				if (staff.length != 0) {
					var allDevice = [];
					for (let i = 0; i < staff.length; i++) {
						const devices = await DEVICE.find({
							creatorUser: staff[i]._id,
							statusDevice: 1
						});

						devices.forEach(element => {
							allDevice.push(element.fcm);
						});
					}

					pushMultipleNotification(
						'Khách hàng mới tạo đơn',
						'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
						'',
						{
							action: 'NEW_ORDER',
							_id: `${idOrderNew}`
						},
						allDevice
					);
				}

				return controller.sendSuccess(res, { link: vnpUrl }, 200, 'Success');
			} else {
				var updateOrder = await ORDER.findOneAndUpdate(
					{ _id: idOrderNew },
					{ typePayment: 'COD' },
					{ new: true }
				);
				if (staff.length != 0) {
					var allDevice = [];
					for (let i = 0; i < staff.length; i++) {
						const devices = await DEVICE.find({
							creatorUser: staff[i]._id,
							statusDevice: 1
						});

						devices.forEach(element => {
							allDevice.push(element.fcm);
						});
					}

					pushMultipleNotification(
						'Khách hàng mới tạo đơn',
						'Hãy kiểm tra yêu cầu và xác nhận đơn hàng',
						'',
						{
							action: 'NEW_ORDER',
							_id: `${idOrderNew}`
						},
						allDevice
					);
				}
				return controller.sendSuccess(res, updateOrder, 200, 'Success');
			}
		} else {
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);
		}
	} catch (error) {
		console.log(error);
		return controller.sendError(res);
	}
};
