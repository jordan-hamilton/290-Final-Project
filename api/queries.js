const Pool = require("pg").Pool;

let conn;
// Import our database connection credentials if they're not stored in an environment variable
if (!process.env.DATABASE_URL) {
  conn = require("../credentials.js");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || conn.DATABASE_URL,
  ssl: false,
});

const getBuildings = (req, res) => {
  pool.query("SELECT * FROM buildings ORDER BY name ASC", (err, data) => {
    if (err) {
      res.status(400);
      console.error(err.stack);
    } else {
      res.status(200);
      res.json(data.rows);
    }
  });
};

const getBuildingById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM buildings WHERE id = $1", [id], (err, data) => {
    if (err) {
      res.status(400);
      console.error(err.stack);
    } else {
      res.status(200);
      res.json(data.rows);
    }
  });
};

const getDevices = (req, res) => {
  pool.query("SELECT * FROM devices ORDER BY id ASC", (err, data) => {
    if (err) {
      res.status(400);
      console.error(err.stack);
    } else {
      res.status(200);
      res.json(data.rows);
    }
  });
};

const getDeviceById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM devices WHERE id = $1", [id], (err, data) => {
    if (err) {
      res.status(400);
      console.error(err.stack);
    } else {
      res.status(200);
      res.json(data.rows);
    }
  });
};

const getLocationById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    'SELECT current.address AS "devLoc", destination.address AS "devDest" \
  FROM devices \
  INNER JOIN buildings AS current ON devices."buildingId"=current.id \
  INNER JOIN buildings AS destination ON devices."destinationId"=destination.id \
  WHERE devices.id = $1',
    [id],
    (err, data) => {
      if (err) {
        res.status(400);
        console.error(err.stack);
      } else {
        res.status(200);
        res.json(data.rows);
      }
    }
  );
};

const createDevice = (req, res) => {
  const name = req.body.devName;
  const type = req.body.devType;
  const techId = parseInt(req.body.techId);
  const devLoc = parseInt(req.body.devLoc);
  const devDest = parseInt(req.body.devDest);
  const time = new Date();
  pool.query(
    'INSERT INTO devices (name, type, "createdAt", "updatedAt", "technicianId", "buildingId", "destinationId") VALUES ($1, $2, $3, $3, $4, $5, $6)',
    [name, type, time, techId, devLoc, devDest],
    (err, data) => {
      if (err) {
        res.status(400);
        console.error(err.stack);
      } else {
        res.status(201);
        res.send(`Device added to the devices table.`);
      }
    }
  );
};

const getTechnicians = (req, res) => {
  pool.query("SELECT * FROM technicians ORDER BY id ASC", (err, data) => {
    if (err) {
      res.status(400);
      console.error(err.stack);
    } else {
      res.status(200);
      res.json(data.rows);
    }
  });
};

const getTechnicianById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM technicians WHERE id = $1", [id], (err, data) => {
    if (err) {
      res.status(400);
      console.error(err.stack);
    } else {
      res.status(200);
      res.json(data.rows);
    }
  });
};

const getTechnicianByName = (req, res) => {
  const techName = req.params.techName;
  pool.query(
    "SELECT * FROM technicians WHERE name = $1",
    [techName],
    (err, data) => {
      if (err) {
        res.status(400);
        console.error(err.stack);
      } else {
        res.status(200);
        res.json(data.rows);
      }
    }
  );
};

const createTechnician = (req, res) => {
  const techName = req.body.techName;
  const time = new Date();
  pool.query(
    'INSERT INTO technicians (name, "updatedAt", "createdAt") VALUES ($1, $2, $2)',
    [techName, time],
    (err, data) => {
      if (err) {
        res.status(400);
        console.error(err.stack);
      } else {
        res.status(201);
        res.send(`Technician added to the technicians table.`);
      }
    }
  );
};

module.exports = {
  getBuildings,
  getBuildingById,
  getDevices,
  getDeviceById,
  getLocationById,
  createDevice,
  getTechnicians,
  getTechnicianById,
  getTechnicianByName,
  createTechnician,
};
