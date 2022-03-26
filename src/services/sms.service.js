const twilio = require('twilio');
require('dotenv');
const client = twilio(process.env.Account_SID,process.env.Auth_Token);

exports.sendSmsTwilio = async body => {
	var tachSoDienThoai = '';
	for (let i = 1; i < body.phoneSend.length; i++) {
		tachSoDienThoai = tachSoDienThoai + body.phoneSend[i];
	}

	 return await client.messages
		.create({
			body: 'Mã OTP của bạn là: ' + `${body.Otp}`,
			from: process.env.Phone,
			to: '+84' + `${tachSoDienThoai}` //replace this with your registered phone number
		})
		.then(data => {
			console.log(data);
			return true;
		})
		.catch(error => {
			console.log(error);
			return false;
		});
};
