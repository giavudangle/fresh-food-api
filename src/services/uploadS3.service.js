const { configEnv } = require('../config');
const aws = require("aws-sdk");

exports.uploadImageS3 = async (body,expires = 300) => {
	try {
		var s3 = SetUpS3();
		const s3Params = {
			Bucket: configEnv.BUCKET,
			Key: body.name,
			Expires: expires,
			ContentType: body.type
		};
		const signedUrl = await s3.getSignedUrl('putObject', s3Params);
		return signedUrl;
	} catch (e) {
		console.log(e);
		return null;
	}
};

exports.getImageS3 = async (body,expires = 60*60*24) => {
	try {
		var s3 = SetUpS3();
		const s3Params = {
			Bucket: configEnv.BUCKET,
			Key: body,
			Expires: expires,
		};
		const signedUrl = await s3.getSignedUrl('getObject', s3Params);
		return signedUrl;
	} catch (e) {
		console.log(e);
		return null;
	}
};

function SetUpS3() {
	return new aws.S3({
		accessKeyId: configEnv.AWS_ACCESS_KEY,
		secretAccessKey: configEnv.AWS_SECRET_KEY,
		region: configEnv.REGION,
	});
}

