const express = require('express');
const app = express();
var fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.listen(process.env.PORT || 3001, () => {
	console.log('listening on 3001')
});

let db = new sqlite3.Database('jerusalemGEO.db');

let sql = `SELECT * FROM idk`;

app.get('/', (req, res) => {
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
