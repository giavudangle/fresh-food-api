const express = require('express');
const Controller = require('../controllers/statistic.controller');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.get(
	'/getStatisticByOrder',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.statisticByOrder
);

router.get(
	'/getStatisticByProduct',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.statisticByProduct
);

router.get(
	'/getStatisticByOrderMobile',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.statisticByOrderPhone
);

router.get(
	'/getStatisticByUser',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.statisticByUser
);

module.exports = router;
