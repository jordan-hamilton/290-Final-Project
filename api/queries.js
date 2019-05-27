var Pool = require('pg').Pool;

if (!process.env.DATABASE_URL) {
  var conn = require('../dbCon.js')
}

var pool = new Pool({
  connectionString: process.env.DATABASE_URL || conn.DATABASE_URL,
  ssl: true
})

var getBuildings = function(request, response) {
  pool.query('SELECT * FROM buildings ORDER BY id ASC', function(error, result) {
    if (error) {
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
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

var getTechnicians = function(request, response) {
  pool.query('SELECT * FROM technicians ORDER BY id ASC', function(error, result) {
    if (error) {
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
      console.error(error.stack);
    } else {
      response.status(200);
      response.json(result.rows);
    }
  });
}

module.exports = {
  getBuildings,
  getBuildingById,
  getDevices,
  getDeviceById,
  getTechnicians,
  getTechnicianById
}
