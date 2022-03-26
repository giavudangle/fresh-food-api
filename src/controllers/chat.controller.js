const controller = require('./controller');
const chatService = require('../services/chat.service');
const getMessages = async (req, res, next) => {
	try {
		const query = {
			idRoom: req.query.idRoom,
			limit: req.query.limit || '15',
			skip: req.query.skip || '1'
		};

		const resServices = await chatService.getMessages(query);
		if (!resServices.success)
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);

		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		return controller.sendError(res);
	}
};
const getRooms = async (req, res, next) => {
	try {
		const query = {
			limit: req.query.limit || '10',
			skip: req.query.skip || '0'
		};

		const resServices = await chatService.getRoomAdmin(query);
		if (!resServices.success)
			return controller.sendSuccess(
				res,
				resServices.data,
				300,
				resServices.message
			);

		return controller.sendSuccess(
			res,
			resServices.data,
			200,
			resServices.message
		);
	} catch (err) {
		return controller.sendError(res);
	}
};

module.exports = {
	getMessages,
	getRooms
};
