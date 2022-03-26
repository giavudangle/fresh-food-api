const sendSuccess = (res, data, status = 200, message = 'success') => {
	return res.status(status).json({
		message: message,
		data: data,
		statusCode: status
	});
};

const sendError = (res, message) => {
	return res.status(500).json({
		message: message || 'Internal server error'
	});
};

const sendSuccessError = (
	res,
	data,
	status = 300,
	message = 'Unknown error'
) => {
	return res.status(status).json({
		message: message,
		data: data,
		statusCode: status
	});
};

const sendSuccessPaging = (
	res,
	data,
	numberPage,
	status = 200,
	message = 'Success'
) => {
	return res.status(status).json({
		message: message,
		data: data,
		numberPage: numberPage,
		statusCode: status
	});
};

module.exports = {
	sendSuccess,
	sendError,
	sendSuccessPaging,
	sendSuccessError
};
