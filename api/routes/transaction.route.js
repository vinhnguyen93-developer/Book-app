var express = require('express');

var controllerTransaction = require('../../api/controllers/transaction.controller');

var router = express.Router();

router.get('/', controllerTransaction.index);

router.get('/:id/complete', controllerTransaction.complete);

router.post('/create', controllerTransaction.postCreate);

module.exports = router;