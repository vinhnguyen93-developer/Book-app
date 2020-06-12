var Comment = require('../../models/comment.model');

module.exports.index = async function(req, res) {
  var comments = await Comment.find();
  
  res.json(comments);
};

module.exports.postCreate = async function(req, res) {
  var comment = await Comment.create(req.body);
  
  res.json(comment);
};