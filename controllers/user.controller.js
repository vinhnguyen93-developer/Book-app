var shortid = require('shortid');
var bcrypt = require('bcrypt');

var db = require('../db');

module.exports.index = function(req, res) {
  var users = db.get('users').value();
  
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var perPage = 5;
  
  var start = (page - 1) * perPage;
  var end = page * perPage;  
  var lengthPage = Math.ceil(users.length / perPage);

  res.render('users/index', {
    users: users.slice(start, end),
    page,
    lengthPage
  });
};

module.exports.search = function(req, res) {
  var q = req.query.q;
  var matchedUser = db.get('users').value().filter((user) => {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  
  res.render('users/index', {
    users: matchedUser
  });
};

module.exports.create = function(req, res) {
  var hash = bcrypt.hashSync('123123', 5);

  res.render('users/create', {
    hashedPassword: hash
  });
};

module.exports.delete = function(req, res) {
  var id = req.params.userId;
  
  db.get('users')
    .remove({ userId: id })
    .write();
  
  res.redirect('/users');
};

module.exports.getUpdate = function(req, res) {
	var id = req.params.userId;

	var user = db.get('users').find({ userId: id }).value();

	res.render('users/update', {
		user: user,
    userId: id
	});
};

module.exports.postCreate = function(req, res) {
  req.body.userId = shortid.generate();
  
  db.get('users')
    .push(req.body)
    .write();
  
  res.redirect('/users');
};

module.exports.postUpdate = function(req, res) {
  var id = req.body.userId;
  
  db.get('users')
    .find({ userId: id })
    .assign({ name: req.body.name })
    .write();
  
  res.redirect('/users');
};