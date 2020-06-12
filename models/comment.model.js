var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId, 
    ref: 'Post'
  },
	userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
	content: String
});

var Comment = mongoose.model('Comment', commentSchema, 'comments');

module.exports = Comment;