var express = require('express');
var multer = require("multer");

var controllerBook = require('../../api/controllers/book.controller');

var upload = multer({ dest: "uploads/" });

var router = express.Router();

router.get('/', controllerBook.index);

// router.get('/search', controllerBook.search);

// router.get('/create', controllerBook.create);

router.get('/:id/delete', controllerBook.delete);

// router.get('/:id/update', controllerBook.getUpdate);

router.post('/create', controllerBook.postCreate);

router.post('/:id/update', upload.single("bookCover"), controllerBook.postUpdate);

module.exports = router;