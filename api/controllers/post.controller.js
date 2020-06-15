var cloudinary = require('cloudinary').v2;

var Post = require('../../models/post.model');
var User = require('../../models/user.model');

cloudinary.config({ 
  cloud_name: process.env.CLOUND_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

module.exports.index = async function(req, res) {
  var posts = await Post.find();
  res.json(posts);
};

module.exports.postCreate = async function(req, res) {
  
  var file = await cloudinary.uploader.upload(req.file.path, (error, result)  => {
    console.log(result, error)
  });
  var post = await Post.create(req.body);
  res.json(post);
};

// module.exports.postUpdate = async function(req, res) {
//   var id = req.params.id;
//   await Book.findByIdAndUpdate(id, {
//     name: req.body.name,
//     avatar: req.body.avatar
//   });
  
//   var book = await Book.findById(id);
//   res.json(book);
// };

module.exports.delete = async function(req, res) {
  var id = req.params.id;
  var post = await Post.findByIdAndDelete(id);
  res.json(post);
};