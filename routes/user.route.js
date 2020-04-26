var express = require('express');

var controllerUser = require('../controllers/user.controller');

var router = express.Router();

router.get('/', controllerUser.index);

router.get('/search', controllerUser.search);

router.get('/create', controllerUser.create);

router.get('/:userId/delete', controllerUser.delete);

router.get('/:userId', controllerUser.getUpdate);

router.post('/create', controllerUser.postCreate);

router.post('/update', controllerUser.postUpdate);

module.exports = router;