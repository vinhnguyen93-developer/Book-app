var express = require('express');
var multer = require("multer");

var controllerPost = require('../controllers/post.controller');

var upload = multer({ dest: "uploads/" });

var router = express.Router();

router.get('/', controllerPost.index);

// router.get('/search', controllerBook.search);

// router.get('/create', controllerBook.create);

router.get('/:id/delete', controllerPost.delete);

// router.get('/:id/update', controllerBook.getUpdate);

router.post('/create', upload.single("bookCover"), controllerPost.postCreate);

// router.post('/:id/update', upload.single("bookCover"), controllerPost.postUpdate);

module.exports = router;