const express = require('express');
const app = express();
var fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var NodeGeocoder = require('node-geocoder');

const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport);
const db = require('./config/keys').MongoURI;

mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

var options = {
  provider: 'google',
	apiKey: "AIzaSyDXY_aO0xDGZX4BSOkw8w88wLpp0Q7HTIQ",
  language: "HE"
};

var geocoder = NodeGeocoder(options);

app.set('view engine', 'ejs')
app.use(expressLayouts);
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

app.listen(process.env.PORT || 3001, () => {
	console.log('listening on 3001')
});

let dbsqlite = new sqlite3.Database('jerusalem.db');

/*app.get('/', (req, res) => {
  let sql = 'SELECT * FROM jer';
  dbsqlite.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  posts = []
  rows.forEach((row) => {
    posts.push(row);
  });
  reqreq = []
  res.render('index.ejs', {posts, reqreq})
  });
});*/

/*app.post('/search', (req, ress) => {
  console.log(req.body)
  var reqreq = req.body
	geocoder.geocode(reqreq.address + ", ירושלים", function(err, res) {
	  console.log(res[0].latitude);
		console.log(res[0].longitude);
    console.log(res)

		reqreq.x = res[0].latitude;
		reqreq.y = res[0].longitude;
    reqreq.address2 = res[0].formattedAddress;

		let latcalcup = parseFloat(reqreq.x) + (parseFloat(reqreq.distance) / 111)
	  let latcalcdown = parseFloat(reqreq.x) - (parseFloat(reqreq.distance) / 111)
	  let loncalcup = parseFloat(reqreq.y) + (parseFloat(reqreq.distance) / 95)
	  let loncalcdown = parseFloat(reqreq.y) - (parseFloat(reqreq.distance) / 95)
	  let calculated = ' WHERE X < ' + latcalcup.toString() + ' AND X > ' + latcalcdown.toString() + ' AND Y < ' + loncalcup.toString() + ' AND Y > ' + loncalcdown.toString()
	  let sql = 'SELECT * FROM jer' + calculated;
	  console.log(sql)
	  dbsqlite.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  posts = []
	  rows.forEach((row) => {
	    posts.push(row);
	  });
	  ress.render('index.ejs', {posts, reqreq})
	});
	});
});*/
