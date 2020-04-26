var express = require('express');

var controllerTransaction = require('../controllers/transaction.controller');

var router = express.Router();

router.get('/', controllerTransaction.index);

router.get('/create', controllerTransaction.create);

router.post('/create', controllerTransaction.postCreate);

module.exports = router;