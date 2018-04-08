config = {};

config.db = {
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'password',
  database: 'dgdb',
  ssl: true,
  max: 10,
  idleTimeoutMillis: 30000 };

module.exports = config;
