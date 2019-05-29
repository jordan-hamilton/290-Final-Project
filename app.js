var bodyParser = require('body-parser');
var express = require('express');
var handlebars = require('express-handlebars').create({
  defaultLayout: 'main'
});
var path = require('path');
var request = require('request');

var host = 'http://localhost:3000';
if (process.env.PORT) {
  // Change the url to the production URL if there's a PORT environment variable

  host = 'https://assettracker.jordanhamilton.me';
}

var api = require('./api/queries.js');

// Import our Google API key if it's not stored in an environment variable
var apiKey;
if (!process.env.apiKey) {
  var conn = require('./credentials.js')
  var apiKey = conn.apiKey;
} else {
  apiKey = process.env.apiKey;
}

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

app.get('/locate', function(req, res, next) {
  request(`${host}/api/devices`, function(error, response, body) {
    if (!error && response.statusCode < 400) {
      res.render('locate', parseJson(body));
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error.stack);
      next(error);
    }
  });
});

app.post('/locate', function(req, res, next) {
  request(`${host}/api/devices/locations/id/${req.body.devId}`, handleDevice);

  function handleDevice(error, response, body) {
    if (!error && response.statusCode < 400) {
      var results = JSON.parse(body);
      // Format our addresses with a + wherever there is a space, following the API guidelines
      // located here: https://developers.google.com/maps/documentation/distance-matrix/web-service-best-practices#BuildingURLs
      var origin = results[0].devLoc.split(' ').join('+');
      var destination = results[0].devDest.split(' ').join('+');
      var url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`
      request(url, handleLocation);
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error);
    }
  }

  function handleLocation(error, response, body) {
    if (!error && response.statusCode < 400) {
      res.status(200);
      res.send(body);
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error);
    }
  }
});

app.get('/list', function(req, res, next) {
  request(`${host}/api/devices`, function(error, response, body) {
    if (!error && response.statusCode < 400) {
      res.render('list', parseJson(body));
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error.stack);
      next(error);
    }
  });
});

app.get('/add', function(req, res, next) {
  request(`${host}/api/buildings`, function(error, response, body) {
    if (!error && response.statusCode < 400) {
      res.render('add', parseJson(body));
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error.stack);
      next(error);
    }
  });
});

app.post('/add', function(req, res, next) {
  for (var property in req.body) {
    if (req.body[property] == '') {
      res.status(422);
      res.send('Not enough information was provided to create this device.');
      console.error('Error: Could not create this device');
      return;
    }
  }

  //Check if the entered technician exists in the database
  request(`${host}/api/technicians/name/${req.body.techName}`, handleTechnician);

  function handleTechnician(error, response, body) {
    if (!error && response.statusCode < 400) {
      var results = JSON.parse(body);
      if (results === undefined || results.length == 0) {
        console.log(`Creating technician with name ${req.body.techName}`);
        var postTechBody = `{"techName": "${req.body.techName}"}`
        request({
          "url": `${host}/api/technicians`,
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "body": postTechBody
        }, handleTechnicianAdd);
      } else {
        // Parse the technician's ID if we had a result from our GET request
        var techId = results[0].id;
        // Form the body of a POST request to create the device based off of the
        // provided information in the request body and our retrieved technician ID
        var postDeviceBody = `{"techId": "${techId}",
                             "devName": "${req.body.devName}",
                             "devType": "${req.body.devType}",
                             "devLoc": "${req.body.devLoc}",
                             "devDest": "${req.body.devDest}"}`
        request({
          "url": `${host}/api/devices`,
          "method": "POST",
          "headers": {
            "Content-Type": "application/json"
          },
          "body": postDeviceBody
        }, handleDeviceAdd);
      }
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error);
    }
  }

  function handleTechnicianAdd(error, response, body) {
    if (!error && response.statusCode < 400) {
      request(`${host}/api/technicians/name/${req.body.techName}`, handleTechnician);
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error);
    }
  }

  function handleDeviceAdd(error, response, body) {
    if (!error && response.statusCode < 400) {
      res.status(201);
      res.send('Successfully created this device');
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error);
    }
  }
});

//Set requests for API queries
app.get('/api/buildings', api.getBuildings);
app.get('/api/buildings/id/:id', api.getBuildingById);
app.get('/api/devices', api.getDevices);
app.get('/api/devices/id/:id', api.getDeviceById);
app.get('/api/devices/locations/id/:id', api.getLocationById);
app.post('/api/devices', api.createDevice);
app.get('/api/technicians', api.getTechnicians);
app.post('/api/technicians', api.createTechnician);
app.get('/api/technicians/id/:id', api.getTechnicianById);
app.get('/api/technicians/name/:techName', api.getTechnicianByName);

// Handle 404 errors
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

// Handle server errors
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function() {
  console.log('Server started on http://localhost:' + app.get('port') + '.');
});

// Adds data from a HTTP request's response to a context,
// then returns the context for use in Handlebars
function parseJson(body) {
  var context = {};
  context.data = [];
  var content = JSON.parse(body);
  for (var item in content) {
    context.data.push({
      'name': content[item].name,
      'id': content[item].id
    });
  }
  return context;
}
