const express = require('express');
const app = express();
var fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
	apiKey: "AIzaSyDXY_aO0xDGZX4BSOkw8w88wLpp0Q7HTIQ"
};

var geocoder = NodeGeocoder(options);

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3001, () => {
	console.log('listening on 3001')
});

let db = new sqlite3.Database('jerusalem.db');

app.get('/', (req, res) => {
  let sql = 'SELECT * FROM main';
  db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  posts = []
  rows.forEach((row) => {
    posts.push(row);
  });
  console.log(posts)
  res.render('index.ejs', {posts})
  });
});

app.post('/search', (req, ress) => {
  console.log(req.body)
  var reqreq = req.body
	geocoder.geocode(reqreq.address, function(err, res) {
	  console.log(res[0].latitude);
		console.log(res[0].longitude);
		reqreq.x = res[0].latitude;
		reqreq.y = res[0].longitude;
		let latcalcup = parseFloat(reqreq.x) + (parseFloat(reqreq.distance) / 111)
	  let latcalcdown = parseFloat(reqreq.x) - (parseFloat(reqreq.distance) / 111)
	  let loncalcup = parseFloat(reqreq.y) + (parseFloat(reqreq.distance) / 95)
	  let loncalcdown = parseFloat(reqreq.y) - (parseFloat(reqreq.distance) / 95)
	  let calculated = ' WHERE X < ' + latcalcup.toString() + ' AND X > ' + latcalcdown.toString() + ' AND Y < ' + loncalcup.toString() + ' AND Y > ' + loncalcdown.toString()
	  let sql = 'SELECT * FROM main' + calculated;
	  console.log(sql)
	  db.all(sql, [], (err, rows) => {
	  if (err) {
	    throw err;
	  }
	  posts = []
	  rows.forEach((row) => {
	    posts.push(row);
	  });
	  console.log(posts)
	  ress.render('index.ejs', {posts})
	});
	});
});
