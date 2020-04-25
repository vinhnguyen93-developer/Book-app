var express = require('express');
var shortid = require('shortid');

var db = require('../db');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('users/index', {
    users: db.get('users').value()
  });
});

router.get('/search', function(req, res) {
  var q = req.query.q;
  var matchedUser = db.get('users').value().filter((user) => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  
  res.render('users/index', {
    users: matchedUser
  });
});

router.get('/create', function(req, res) {
  res.render('users/create');
});

router.get('/:id/delete', function(req, res) {
  var id = req.params.id;
  
  db.get('users').remove({ id: id }).write();
  
  res.redirect('/users');
});

router.get('/:id', function(req, res) {
	var id = req.params.id;

	var user = db.get('users').find({ id: id }).value();

	res.render('users/update', {
		user: user,
    id: id
	});
});

router.post('/create', function(req, res) {
  req.body.id = shortid.generate();
  db.get('users').push(req.body).write();
  res.redirect('/users');
});

router.post('/update', function(req, res) {
  var id = req.body.id;
  
  db.get('users').find({ id: id }).assign({ name: req.body.name }).write();
  res.redirect('/users');
});

module.exports = router;