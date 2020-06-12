var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema({
  imageUrl: String,
	caption: String,
	userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User'
  }
});

var Post = mongoose.model('Post', postSchema, 'posts');

module.exports = Post;