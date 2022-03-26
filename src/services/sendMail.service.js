const nodemailer = require('nodemailer');
const { configEnv } = require('../config');

exports.sendMail = async mailOptions => {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({
			service: 'gmail', //smtp.gmail.com  //in place of service use host...
			secure: false, //true
			port: 25, //465
			auth: {
				user: configEnv.Email,
				pass: configEnv.Password
			},
			tls: {
				rejectUnauthorized: false
			}
		});

		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log('error is ' + error);
				resolve(false); // or use rejcet(false) but then you will have to handle errors
			} else {
				console.log('Email sent: ' + info.response);
				resolve(true);
			}
		});
	});
};
