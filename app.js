var express = require('express');
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
var path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));

// Configure body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

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

/*app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});*/

app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});
