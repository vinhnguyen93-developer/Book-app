var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reactionSchema = new Schema({
  postId: {
    type: Schema.Types.ObjectId, 
    ref: 'Post'
  },
	userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User'
  },
	type: String
});

var Reaction = mongoose.model('Reaction', reactionSchema, 'reactions');

module.exports = Reaction;