const express = require('express');

const controllerReaction = require('../controllers/reaction.controller');

const router = express.Router();

router.get("/", controllerReaction.index);

module.exports = router;