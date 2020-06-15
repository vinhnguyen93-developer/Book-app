var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary').v2;
var jwt = require('jsonwebtoken');

var User = require('../../models/user.model');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

module.exports.index = (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

  User.findOne({
    _id: decoded._id
  })
  .then(user => {
    if(user) {
      res.json(user);
    } else {
      res.send("User does not exist");
    }
  })
  .catch(err => {
    res.send('error: ' + err);
  })
};

module.exports.postCreate = async function(req, res) {
  var hash = bcrypt.hashSync(req.body.password, 10);
  var user = await User.create({
    password: hash,
    wrongLoginCount: req.body.wrongLoginCount,
    name: req.body.name,
    email: req.body.email,
    profilePictureUrl: req.body.profilePictureUrl
  });
  res.json(user);
};

module.exports.postLogin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
  .then(user => {
    if(user) {
      if(bcrypt.compareSync(req.body.password, user.password)) {
        const payload = {
          _id: user._id,
          name: user.name,
          email: user.email,
          profilePictureUrl: user.profilePictureUrl
        }

        let token = jwt.sign(payload, process.env.SECRET_KEY, {
          expiresIn: 1440
        });

        res.send(token);
      } else {
        res.json({error: "User does not exist"});
      }
    } else {
      res.json({error: "User does not exist"});
    }
  })
  .catch(err => {
    res.send('Error: ' + err);
  })
}

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