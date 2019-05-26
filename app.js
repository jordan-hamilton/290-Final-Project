var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var Sequelize = require('sequelize');

//Not required on Heroku since we're using environment variables
var dbConnection = require('./dbCon.js');

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(express.static('public'));

// Configure body-parser
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());


// Configure Sequelize
var sequelize = new Sequelize(process.env.DATABASE_URL || dbConnection.DATABASE_URL, {
  dialectOptions: {
    ssl: true
  }
});

var building = sequelize.define('building', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {});

var device = sequelize.define('device', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {});

var technician = sequelize.define('technicians', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
}, {});

device.belongsTo(technician);
device.hasOne(building);
technician.hasMany(device);


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    sequelize.sync({
      force: true
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

technician.create({
  // Create a dummy technician in the database
  name: 'John'
});

building.create({
  name: 'Admin Building',
  address: '1201 5th St'
});

var newDevice = device.create({
  name: 'MS17435'
});

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/test', function(req, res) {
  technician.findAll().then(technicians => {
    console.log("All users:", JSON.stringify(technicians, null, 4));
    res.sendFile(path.join(__dirname, 'pages', 'list.html'));
  });
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
