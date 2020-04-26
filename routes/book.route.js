var express = require('express');

var controllerBook = require('../controllers/book.controller');

var router = express.Router();

router.get('/', controllerBook.index);

router.get('/search', controllerBook.search);

router.get('/create', controllerBook.create);

router.get('/:bookId/delete', controllerBook.delete);

router.get('/:bookId', controllerBook.getUpdate);

router.post('/create', controllerBook.postCreate);

router.post('/update', controllerBook.postUpdate);

module.exports = router