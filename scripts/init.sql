CREATE TABLE technicians(
id SERIAL PRIMARY KEY,
name varchar(50),
createdAt TIMESTAMP,
updatedAt TIMESTAMP,
);

CREATE TABLE devices(
id SERIAL PRIMARY KEY,
createdAt TIMESTAMP,
updatedAt TIMESTAMP,
);

CREATE TABLE buildings(
id SERIAL PRIMARY KEY,
RoleName varchar(50),
);