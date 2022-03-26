const paypal = require('paypal-rest-sdk');

async function connectPayPal(id, secret) {
	try {
		await paypal.configure({
			mode: 'sandbox',
			client_id: id,
			client_secret: secret
		});
		console.log('Success Paypal');
	} catch (error) {
		console.log(error);
	}
}

module.exports = { connectPayPal };
