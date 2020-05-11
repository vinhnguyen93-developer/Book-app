var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
  cart: [
    { 
      bookId: { type: Schema.Types.ObjectId, ref: 'Book'},
      count: Number
    }
  ]
});

var Session = mongoose.model('Session', sessionSchema, 'sessions');

module.exports = Session;