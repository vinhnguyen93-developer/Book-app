var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary').v2;

var User = require('../../models/user.model');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

module.exports.index = async function(req, res) {
  var users = await User.find();
  res.json(users);
};

module.exports.postCreate = async function(req, res) {
  var hash = bcrypt.hashSync('123123', 5);
  var user = await User.create({
    password: hash,
    wrongLoginCount: 0,
    name: req.body.name,
    email: req.body.email,
    profilePictureUrl: 'https://res.cloudinary.com/vinhnguyen93/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1588557922/samples/bike.jpg'
  });
  res.json(user);
};

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  var user = await User.findByIdAndDelete(id);
  
  res.json(user);
};

module.exports.postUpdate = async function(req, res) {
  var id = req.params.id;
  await User.findByIdAndUpdate(id, {
    name: req.body.name
  })
  
  var user = await User.findById(id);
  
  res.json(user);
};

module.exports.profile = async function(req, res) {
  var id = req.params.id;
  var user = await User.findById(id);
  
  res.json(user);
};

module.exports.postAvatar = async function(req, res) {
  var id = req.params.id;
  await User.findByIdAndUpdate(id, {
    avatar: req.body.avatar
  });
  
  var user = await User.findById(id);
  
  res.json(user);
};