const { defaultChatSocket } = require('../config/defineModel');
const chatService = require('../services/chat.service');
const sockets = require('./index');
const USER = require('../models/User.model');
const ROOM = require('../models/Room.model');
const DEVICE = require('../models/Device.model');
const { pushNotification, pushMultipleNotification } = require('../services/fcmNotify');
const { convertObjectFieldString } = require('../helper');
exports.joinRoom = async (socket, data) => {
	console.log('Join Room');
	const { idUser } = data;
	console.log('Room: ', idUser);
	socket.Room = idUser;
	socket.join(idUser);
	const user = sockets.findUserById(socket.id);
  console.log(user)
	await chatService.updateSendByUser(user.userId);
};
exports.leaveRoom = (socket, data) => {
	console.log('Leave Room');
	const { idUser } = data;
	console.log('Room_IdUser: ', idUser);
	socket.leave(idUser);
	socket.removeAllListeners(idUser);
	delete socket.Room;
};

exports.chatMessage = async (socket, data) => {
	console.log(data);
	const user = sockets.findUserById(socket.id);
	if (user) {
		console.log(`LHA:  ===> file: chat.socket.js ===> line 86 ===> user`, user);
		const admin = await USER.findOne({
			role: 1
		});
    console.log("admin")
    console.log(admin);
    let obj;
    if(user.role == 0)
    {
      obj= Object.assign(data, {
        creatorUser: user.userId,
        seenByUser: [user.userId],
				idRoom: socket.Room
      });
    }
    else if(user.role ==1)
    {
      obj= Object.assign(data, {
        creatorUser: user.userId,
        seenByUser: [user.userId],
				idRoom: socket.Room
      });
    }
		console.log(obj);
		const message = await chatService.createChat(obj);
    console.log("message");
    console.log(message);
		const userRoom = await USER.findById(socket.Room);
		sockets.emitRoom(
			socket.Room,
			defaultChatSocket.sendMessageSSC,
			message.data
		);
		const room = await ROOM.findOne({idRoom: socket.Room})

		if(room!= null)
		{
			room.idLastMessage = message.data._id
			await room.save();
		}
		else
		{
			var bodyRoom = {
				idRoom: socket.Room,
				idLastMessage:message.data._id,
				name:  userRoom.name
			}
			await ROOM.create(bodyRoom);
		}
		const dataMessage = Object.assign(
			{},
			JSON.parse(JSON.stringify(message.data)),
			{
				action: 'MESSAGE',
				name: userRoom.name
			}
		);
		if (user.role === 0) {
			//User
			const admin = await USER.findOne({
				role: 1
			});
			const devicesAdmin = await DEVICE.find({ creatorUser: admin._id });
			const user1 = await USER.findById(socket.Room);
			const datafcm = convertObjectFieldString(Object.assign(dataMessage));
			var newArr = devicesAdmin.map((val) => {
				return val.fcm;
			})

			pushMultipleNotification(`Tin nhắn từ ${user1.email}`,`${message.data.message}`,'',datafcm,newArr);
		} else if (user.role === 1) {
			//Admin
			const deviceUser = await DEVICE.find({creatorUser: socket.Room});
			const datafcm = convertObjectFieldString(
				Object.assign(dataMessage)
			);

			var newArr = deviceUser.map((val) => {
				return val.fcm;
			})
			
			pushMultipleNotification(`CSKH Trực Tuyến`,`${message.data.message}`,'',datafcm,newArr);
		}
	} else {
		sockets.emitToSocketId(socket.id, defaultChatSocket.sendMessageSSC, {
			message: 'Do not find User'
		});
	}
};