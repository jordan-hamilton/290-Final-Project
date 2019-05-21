var express = require('express');
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/locate', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'locate.html'));
});

app.get('/list', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'list.html'));
});

app.get('/add', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'add.html'));
});

app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});