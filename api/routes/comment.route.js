var express = require('express');

var controllerComment = require('../controllers/comment.controller');

var router = express.Router();

router.get('/', controllerComment.index);

router.post('/create', controllerComment.postCreate);

module.exports = router;