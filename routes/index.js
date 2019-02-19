const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const inside = require('point-in-geopolygon')

var fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');
var NodeGeocoder = require('node-geocoder');
var math = require('mathjs');

const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

let dbsqlite = new sqlite3.Database('jerusalem.db');

var options = {
  provider: 'google',
	apiKey: "AIzaSyDXY_aO0xDGZX4BSOkw8w88wLpp0Q7HTIQ",
  language: "HE"
};

var obj = JSON.parse(fs.readFileSync('rova.geojson', 'utf8'))

var myobj1 = obj.features[0].geometry.coordinates
var myobj2 = obj.features[1].geometry.coordinates
var myobj3 = obj.features[2].geometry.coordinates
var myobj4 = obj.features[3].geometry.coordinates
var myobj5 = obj.features[4].geometry.coordinates
var myobj6 = obj.features[5].geometry.coordinates
var myobj7 = obj.features[6].geometry.coordinates

var checkrova = function(point) {
  if(inside.polygon(myobj1,(point))){
  console.log("צפון")
} else if(inside.polygon(myobj2,(point))){
  console.log("אלונים")
} else if(inside.polygon(myobj3,(point))){
  console.log("מערב")
} else if(inside.polygon(myobj4,(point))){
  console.log("אורנים")
} else if(inside.polygon(myobj5,(point))){
  console.log("מרכז")
} else if(inside.polygon(myobj6,(point))){
  console.log("דרום")
} else if(inside.polygon(myobj7,(point))){
  console.log("מזרח")
}
}

checkrova([31.829611, 35.233159])

const User = require('../models/User');
const db = require('../config/keys').MongoURI;
mongoose.connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

var geocoder = NodeGeocoder(options);

// WELCOME PAGE
router.get('/', (req, res) => res.render('welcome'));
// DASHBOARD
router.get('/dashboard', ensureAuthenticated, (reqqq, res) =>{
  historyaddress = []
  historydistance = []
  User.findOne({ email: reqqq.user.email}, function (err, too) {for(var i = 0; i<too.mysearches.length; i++){historyaddress.push(too.mysearches[i].mysearch); historydistance.push(too.mysearches[i].mydistance)}
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
  res.render('dashboard', {posts, reqreq, reqqq, historyaddress, historydistance})
  });
});
});

router.post('/search', ensureAuthenticated, (req, ress) => {
  var reqreq = req.body
	geocoder.geocode(reqreq.address + ", ירושלים", function(err, res) {
	  console.log(res[0].latitude);
		console.log(res[0].longitude);

		reqreq.x = res[0].latitude;
		reqreq.y = res[0].longitude;
    reqreq.address2 = res[0].formattedAddress;
    historyaddress = []
    historydistance = []
    User.findOneAndUpdate({ email: req.user.email }, { $push:{mysearches: {mysearch: reqreq.address2, mydistance: req.body.distance}} }, { upsert: true, new: true }, function (err, yoyo) {console.log("Inserted search");
    User.findOne({ email: req.user.email}, function (err, too) {for(var i = 0; i<too.mysearches.length; i++){historyaddress.push(too.mysearches[i].mysearch); historydistance.push(too.mysearches[i].mydistance)}

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
	  postsbefore = []
    posts = []
	  rows.forEach((row) => {
	    postsbefore.push(row);
	  });
    /*User.findOne({ email: req.user.email }, function (err, yo) {console.log(yo)})*/

    for(var i = 0; i<postsbefore.length; i++){
      var x = postsbefore[i].X;
      var y = postsbefore[i].Y;
      var x1 = parseFloat(reqreq.x);
      var y1 = parseFloat(reqreq.y);
      var d = parseFloat(reqreq.distance);

      if(math.sqrt([111*(x - x1)]**2 + [95*(y - y1)]**2) <= d) {
        posts.push(postsbefore[i]);
      }
    }

    var reqqq = req

	  ress.render('dashboard', {posts, reqreq, reqqq, historyaddress, historydistance})
	});
	});

});

});
});

router.post('/search2', ensureAuthenticated, (req, ress) => {
  var reqreq = req.body
	geocoder.geocode(reqreq.address + ", ירושלים", function(err, res) {
	  console.log(res[0].latitude);
		console.log(res[0].longitude);

		reqreq.x = res[0].latitude;
		reqreq.y = res[0].longitude;
    reqreq.address2 = res[0].formattedAddress;
    historyaddress = []
    historydistance = []
    User.findOne({ email: req.user.email}, function (err, too) {for(var i = 0; i<too.mysearches.length; i++){historyaddress.push(too.mysearches[i].mysearch); historydistance.push(too.mysearches[i].mydistance)}

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
    /*User.findOne({ email: req.user.email }, function (err, yo) {console.log(yo)})*/
    var reqqq = req

	  ress.render('dashboard', {posts, reqreq, reqqq, historyaddress, historydistance})
	});
	});

});

});

/*router.post('/delete', ensureAuthenticated, (req, ress) => {
  var reqreq = req.body
    User.findOneAndUpdate({ email: req.user.email }, { $push:{mysearches: {mysearch: reqreq.address2, mydistance: req.body.distance}} }, { upsert: true, new: true }, function (err, yoyo) {console.log("Inserted search");
	  ress.redirect('dashboard')
	});
});*/


module.exports = router;
