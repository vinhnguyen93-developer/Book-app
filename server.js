// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();

var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var cors = require('cors');

mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

var apiAuthRoute = require('./api/routes/auth.route');
var apiComment = require('./api/routes/comment.route');
var apiUser = require('./api/routes/user.route');
var apiPost = require('./api/routes/post.route');
//var apiReaction = require('./api/routes/reaction.route');

var app = express();

app.use(cors());

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', apiAuthRoute);
app.use('/api/comments', apiComment);
app.use('/api/users', apiUser);
app.use('/api/posts', apiPost);
//app.use('/api/reactions', apiReaction);

app.use(cookieParser(process.env.SESSION_SECRET));
//app.use(sessionMiddleware);

app.use(express.static('public'));

// listen for requests :)
const listener = app.listen(process.env.PORT || 5000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

 