const CHAT = require('../models/Chat.model');
const ROOM = require('../models/Room.model');
const USER = require('../models/User.model');
const uploadServices = require('../services/uploadS3.service');

exports.createChat = async body => {
	try {
		const newChat = await CHAT.create(body);
		return {
			message: 'Successfully create chat',
			success: true,
			data: newChat
		};
	} catch (error) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.updateChat = async (body, optional = {}) => {
	try {
		const newChat = await CHAT.findOneAndUpdate(
			query,
			body,
			Object.assign(
				{
					new: true
				},
				optional
			)
		);
		return {
			message: 'Successfully create chat',
			success: true,
			data: newChat
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};

exports.updateSendByUser = async idUser => {
	try {
		const chats = await CHAT.find({
			seenByUser: {
				$exists: true,
				$nin: [idUser]
			}
		}).sort({
			createAt: -1
		});
		for (chat of chats) {
			chat.seenByUser.push(idUser);
			await chat.save();
		}
		return {
			message: 'Successfully create chat',
			success: true,
			data: chats
		};
	} catch (error) {
		console.log(error);
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getMessages = async body => {
	try {
		const { idRoom, skip, limit } = body;
		console.log(body);
		const chatGetByRoom = await CHAT.find({
			idRoom
		})
			.sort({
				createdAt: -1
			})
			.skip(Number(skip))
			.limit(Number(limit));
		return {
			message: 'Successfully get chat',
			success: true,
			data: chatGetByRoom
		};
	} catch (err) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
exports.getRoomAdmin = async body => {
	try {
		const { skip, limit } = body;
		const getRoomByAdmin = await ROOM.find()
			.sort({
				updatedAt: -1
			})
			.skip(Number(skip))
			.limit(Number(limit));

		let arrResult = [];
		for (let i = 0; i < getRoomByAdmin.length; i++) {
			let chat = await CHAT.findById(getRoomByAdmin[i].idLastMessage);
			var userChat = await USER.findById(getRoomByAdmin[i].idRoom);
			var roomNew = {
				idRoom: getRoomByAdmin[i].idRoom,
				idLastMessage: getRoomByAdmin[i].idLastMessage,
				name: getRoomByAdmin[i].name,
				seenByUser: chat.seenByUser,
				message: chat.message,
				avatar: userChat.avatar,
				updatedAt: getRoomByAdmin[i].updatedAt
			};
			arrResult.push(roomNew);
		}

		return {
			message: 'Successfully get room',
			success: true,
			data: arrResult
		};
	} catch (err) {
		return {
			message: 'An error occurred',
			success: false
		};
	}
};
