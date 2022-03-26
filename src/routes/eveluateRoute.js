const express = require('express');
const Controller = require('../controllers/eveluate.controller');
const SchemaValidateEveluate = require('../validators/eveluate.validator');
const router = express.Router();
const Validate = require('../validators');
const { checkRole } = require('../middleware/checkRole.middleware');
const { defaultRoles } = require('../config/defineModel');
const jwtServices = require('../services/jwt.services');

router.post(
	'/createEveluate',
	jwtServices.verify,
	Controller.createEveluateAsync
);

router.delete(
	'/deleteEveluate',
	jwtServices.verify,
	checkRole([defaultRoles.Admin]),
	Controller.deleteEveluate
);

router.get('/getEveluate', Controller.GetEveluateByProductAsync);

module.exports = router;
