var Pool = require('pg').Pool;

if (!process.env.DATABASE_URL) {
  var conn = require('../dbCon.js')
}

var pool = new Pool({
  connectionString: process.env.DATABASE_URL || conn.DATABASE_URL,
  ssl: true
})

var getBuildings = function(request, response) {
  pool.query('SELECT * FROM buildings ORDER BY name ASC', function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var getBuildingById = function(request, response) {
  var id = parseInt(request.params.id);
  pool.query('SELECT * FROM buildings WHERE id = $1', [id], function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var getDevices = function(request, response) {
  pool.query('SELECT * FROM devices ORDER BY id ASC', function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var getDeviceById = function(request, response) {
  var id = parseInt(request.params.id);
  pool.query('SELECT * FROM devices WHERE id = $1', [id], function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var createDevice = function(request, response) {
  var name = request.params.devName;
  var type = request.params.devType;
  var techId = request.params.devType;
  var devLoc = request.params.devLoc;
  var devDest = request.params.devDest;
  var time = new Date();
  pool.query('INSERT INTO technicians (name, type, createdAt, updatedAt, technicianId, buildingid, destinationid) VALUES ($1, $2, $3, $3, $4, $5, $6)', [name, type, time, techId, devLoc, devDest], function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(201);
      response.send(`Device ${result.insertId} added to the devices table.`);
    }
  });
}

var getTechnicians = function(request, response) {
  pool.query('SELECT * FROM technicians ORDER BY id ASC', function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var getTechnicianById = function(request, response) {
  var id = parseInt(request.params.id);
  pool.query('SELECT * FROM technicians WHERE id = $1', [id], function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var getTechnicianByName = function(request, response) {
  var techName = request.params.techName;
  pool.query('SELECT * FROM technicians WHERE name = $1', [techName], function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var createTechnician = function(request, response) {
  var name = request.params.techName;
  var time = new Date();
  pool.query('INSERT INTO technicians (name, createdAt, updatedAt) VALUES ($1, $2, $2)', [name, time, time], function(error, result) {
    if (error) {
      response.status(400);
      console.error(error.stack);
    } else {
      response.status(201);
      response.send(`Technician ${result.insertId} added to the technicians table.`);
    }
  });
}

module.exports = {
  getBuildings,
  getBuildingById,
  getDevices,
  getDeviceById,
  createDevice,
  getTechnicians,
  getTechnicianById,
  getTechnicianByName,
  createTechnician
}
