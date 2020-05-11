var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary').v2;

var User = require('../models/user.model');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

module.exports.index = async function(req, res) {
  var users = await User.find();
  var id = req.signedCookies.userId;
  var user = await User.findById(id);
  
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var perPage = 5;
  
  var start = (page - 1) * perPage;
  var end = page * perPage;  
  var lengthPage = Math.ceil(users.length / perPage);
  
  if (user.isAdmin === true) {
    res.render('users/index', {
      users: users.slice(start, end),
      page,
      lengthPage
    });
    return;
  } else {
    res.render('users/index', {
      users: [ user ]
    });
    return;
  }
};

module.exports.search = async function(req, res) {
  var q = req.query.q;
  var users = await User.find();
  
  var matchedUser = users.filter((user) => {
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

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  
  await User.findByIdAndDelete(id)
  
  res.redirect('/users');
};

module.exports.profile = function(req, res) {
  res.render('users/profile');
};

module.exports.getUpdate = async function(req, res) {
	var id = req.params.id;

	var user = await User.findOne({ id: id });

	res.render('users/update', {
		user: user,
    id: id
	});
};

module.exports.postCreate = async function(req, res) {
  
  await User.create({
    wrongLoginCount: 0,
    avatar: 'https://res.cloudinary.com/vinhnguyen93/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1588557922/samples/bike.jpg',
    isAdmin: false,
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  
  res.redirect('/users');
};

module.exports.postUpdate = async function(req, res) {
  var id = req.body.id;
  
  await User.findByIdAndUpdate(id, {
    name: req.body.name
  });
  
  res.redirect('/users');
};

module.exports.postAvatar = async function(req, res) {
  var id = req.body.id;
  
  var user = await User.findById(id);
  
  var file = await cloudinary.uploader.upload(req.file.path, 
    function(error, result) {console.log(result, error)});
  
  await User.findByIdAndUpdate(id, {
    avatar: file.url
  });
  
  res.redirect('/users/profile');
};