const express = require('express');
const app = express();
var fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
var bodyParser = require('body-parser');

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3001, () => {
	console.log('listening on 3001')
});

let db = new sqlite3.Database('jerusalemGEO.db');

app.get('/', (req, res) => {
  let sql = 'SELECT * FROM idk';
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

app.post('/search', (req, res) => {
  console.log(req.body)
  var reqreq = req.body
  let latcalcup = parseInt(reqreq.x) + parseInt(reqreq.distance)
  let latcalcdown = parseInt(reqreq.x) - parseInt(reqreq.distance)
  let loncalcup = parseInt(reqreq.y) + parseInt(reqreq.distance)
  let loncalcdown = parseInt(reqreq.y) - parseInt(reqreq.distance)
  let calculated = ' WHERE X < ' + latcalcup.toString() + ' AND X > ' + latcalcdown.toString() + ' AND Y < ' + loncalcup.toString() + ' AND Y > ' + loncalcdown.toString()
  let sql = 'SELECT * FROM idk' + calculated;
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
  res.render('index.ejs', {posts})
  });
});
