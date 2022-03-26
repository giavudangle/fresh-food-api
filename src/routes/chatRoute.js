const express = require('express');
const { defaultRoles } = require('../config/defineModel');
const Controller = require('../controllers/chat.controller');
const { checkRole } = require('../middleware/checkRole.middleware');
const jwtServices = require('../services/jwt.services');
const router = express.Router();

router.get('/getMessage', jwtServices.verify, Controller.getMessages);

router.get(
	'/getRoom',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.getRooms
);

module.exports = router;
