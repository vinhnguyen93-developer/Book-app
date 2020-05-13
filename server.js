// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
require('dotenv').config();

var express = require("express");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

mongoose.set("useUnifiedTopology", true);
mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true});

var userRoute = require('./routes/user.route');
var bookRoute = require('./routes/book.route');
var transactionRoute = require('./routes/transaction.route');
var authRoute = require('./routes/auth.route');
var cartRoute = require('./routes/cart.route');

var apiAuthRoute = require('./api/routes/auth.route');
var apiTransaction = require('./api/routes/transaction.route');
var apiUser = require('./api/routes/user.route');
var apiBook = require('./api/routes/book.route');

var authMiddleware = require('./middlewares/auth.middleware');
var sessionMiddleware = require('./middlewares/session.middleware');

var app = express();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/auth', apiAuthRoute);
app.use('/api/transactions', apiTransaction);
app.use('/api/users', apiUser);
app.use('/api/books', apiBook);

app.use(cookieParser(process.env.SESSION_SECRET));
app.use(sessionMiddleware);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.render('index');
});

//book
app.use('/books', bookRoute);

//user
app.use('/users', authMiddleware.requireAuth, userRoute);

//transaction
app.use('/transactions', authMiddleware.requireAuth, transactionRoute);

//login
app.use('/auth', authRoute);

//cart
app.use('/cart', cartRoute);

// listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

 