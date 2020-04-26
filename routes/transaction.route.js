var express = require('express');

var controllerTransaction = require('../controllers/transaction.controller');

var router = express.Router();

router.get('/', controllerTransaction.index);

router.get('/create', controllerTransaction.create);

router.get('/:tranId/complete', controllerTransaction.complete);

router.post('/create', controllerTransaction.postCreate);

module.exports = router;