var bodyParser = require('body-parser');
var express = require('express');
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var path = require('path');

var api = require('./api/queries.js');

//Configure Express
var app = express();
app.set('port', process.env.PORT || 3000);
// Set the public as a static directory
app.use(express.static('public'));

// Configure body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

//Configure Handlebars
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
