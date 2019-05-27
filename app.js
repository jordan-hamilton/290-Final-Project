var bodyParser = require('body-parser');
var express = require('express');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
var path = require('path');
var request = require('request');

var api = require('./api/queries.js');

// Configure Express
var app = express();
app.set('port', process.env.PORT || 3000);
// Set the public folder as a static directory
app.use(express.static('public'));

// Configure body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

// Configure Handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// Set the homepage to index.html
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

app.get('/test', function(req, res) {
  request('http://localhost:3000/api/buildings', function(error, response, body) {
    if (!error && response.statusCode < 400) {
      console.log(body);//DEBUG
      console.log(response.statusCode);//DEBUG
      console.log(response);//DEBUG
      res.render('test', parseJson(body));
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      next(err);
    }
  });
});

//Set GET requests for API queries
app.get('/api/buildings', api.getBuildings);
app.get('/api/buildings/:id', api.getBuildingById);
app.get('/api/devices', api.getDevices);
app.get('/api/devices/:id', api.getDeviceById);
app.get('/api/technicians', api.getTechnicians);
app.get('/api/technicians/:id', api.getTechnicianById);

app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});

function parseJson(body) {
  var context = {};
  context.data = [];
  var content = JSON.parse(body)
  for (var item in content) {
    context.data.push({
      'name': content[item].name,
      'value': content[item].id
    });
  }
  return context;
}
