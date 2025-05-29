const bodyParser = require("body-parser");
const express = require("express");
const hbs = require("express-handlebars");
const path = require("path");
const request = require("request");

let host = "http://localhost:3000";
if (process.env.PORT) {
  // Change the url to the production URL if there's a PORT environment variable
  host = "https://assettracker.jordanhamilton.me";
}

const api = require("./api/queries.js");

// Import our Google API key if it's not stored in an environment variable
let apiKey;
if (!process.env.apiKey) {
  // Use the key in our credentials file
  const conn = require("./credentials.js");
  apiKey = conn.apiKey;
} else {
  apiKey = process.env.apiKey;
}

// Configure Express
const app = express();
app.set("port", process.env.PORT || 3000);
// Set the public folder as a static directory
app.use(express.static("public"));

// Configure body-parser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Configure Handlebars
app.engine("handlebars", hbs.engine());
app.set("view engine", "handlebars");

// Set the homepage to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "pages", "index.html"));
});

app.get("/locate", function (req, res, next) {
  request(`${host}/api/devices`, (err, res, body) => {
    if (!err && res.statusCode < 400) {
      res.render("locate", parseJson(body));
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err.stack);
      next(err);
    }
  });
});

app.post("/locate", function (req, res, next) {
  const handleLocation = (err, res, body) => {
    if (!err && res.statusCode < 400) {
      res.status(200);
      res.send(body);
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err);
    }
  };

  const handleDevice = (err, res, body) => {
    if (!err && res.statusCode < 400) {
      const results = JSON.parse(body);
      // Format our addresses with a + wherever there is a space, following the API guidelines
      // located here: https://developers.google.com/maps/documentation/distance-matrix/web-service-best-practices#BuildingURLs
      const origin = results[0].devLoc.split(" ").join("+");
      const destination = results[0].devDest.split(" ").join("+");
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origin}&destinations=${destination}&key=${apiKey}`;
      request(url, handleLocation);
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err);
    }
  };

  request(`${host}/api/devices/locations/id/${req.body.devId}`, handleDevice);
});

app.get("/list", (req, res, next) => {
  request(`${host}/api/devices`, (err, res, body) => {
    if (!err && res.statusCode < 400) {
      res.render("list", parseJson(body));
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err.stack);
      next(err);
    }
  });
});

app.get("/add", function (req, res, next) {
  request(`${host}/api/buildings`, function (error, response, body) {
    if (!error && response.statusCode < 400) {
      res.render("add", parseJson(body));
    } else {
      if (response) {
        console.log(response.statusCode);
      }
      console.error(error.stack);
      next(error);
    }
  });
});

app.post("/add", function (req, res, next) {
  for (let property in req.body) {
    if (req.body[property] === "") {
      res.status(422);
      res.send("Not enough information was provided to create this device.");
      console.error("Error: Could not create this device");
      return;
    }
  }

  const handleTechnician = (err, res, body) => {
    if (!err && res.statusCode < 400) {
      const results = JSON.parse(body);
      if (results === undefined || results.length === 0) {
        console.log(`Creating technician with name ${req.body.techName}`);
        const postTechBody = `{"techName": "${req.body.techName}"}`;
        request(
          {
            url: `${host}/api/technicians`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: postTechBody,
          },
          handleTechnicianAdd
        );
      } else {
        // Parse the technician's ID if we had a result from our GET request
        const techId = results[0].id;
        // Form the body of a POST request to create the device based off of the
        // provided information in the request body and our retrieved technician ID
        const postDeviceBody = `{"techId": "${techId}",
                             "devName": "${req.body.devName}",
                             "devType": "${req.body.devType}",
                             "devLoc": "${req.body.devLoc}",
                             "devDest": "${req.body.devDest}"}`;
        request(
          {
            url: `${host}/api/devices`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: postDeviceBody,
          },
          handleDeviceAdd
        );
      }
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err);
    }
  };

  // Check if the entered technician exists in the database
  request(
    `${host}/api/technicians/name/${req.body.techName}`,
    handleTechnician
  );

  const handleTechnicianAdd = (err, res, body) => {
    if (!err && res.statusCode < 400) {
      request(
        `${host}/api/technicians/name/${req.body.techName}`,
        handleTechnician
      );
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err);
    }
  };

  const handleDeviceAdd = (err, res, body) => {
    if (!err && res.statusCode < 400) {
      res.status(201);
      res.send("Successfully created this device");
    } else {
      if (res) {
        console.log(res.statusCode);
      }
      console.error(err);
    }
  };
});

//Set requests for API queries
app.get("/api/buildings", api.getBuildings);
app.get("/api/buildings/id/:id", api.getBuildingById);
app.get("/api/devices", api.getDevices);
app.get("/api/devices/id/:id", api.getDeviceById);
app.get("/api/devices/locations/id/:id", api.getLocationById);
app.post("/api/devices", api.createDevice);
app.get("/api/technicians", api.getTechnicians);
app.post("/api/technicians", api.createTechnician);
app.get("/api/technicians/id/:id", api.getTechnicianById);
app.get("/api/technicians/name/:techName", api.getTechnicianByName);

// Handle 404 errors
app.use((req, res) => {
  res.status(404);
  res.render("404");
});

// Handle server errors
app.use((req, res, next) => {
  // console.error(err.stack);
  res.status(500);
  res.render("500");
});

app.listen(app.get("port"), () => {
  console.log("Server started on http://localhost:" + app.get("port") + ".");
});

// Adds data from an HTTP request's response to a context,
// then returns the context for use in Handlebars
const parseJson = (body) => {
  const context = {};
  context.data = [];
  const content = JSON.parse(body);
  for (let item in content) {
    context.data.push({
      name: content[item].name,
      id: content[item].id,
    });
  }
  return context;
};
