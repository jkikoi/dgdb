const website_name = 'DGDB';

// ------------------------------------------------------------------ Database
const pg = require('pg');
let pg_pool;

try {
  config = require('./config');
  pg_pool = new pg.Pool(config.db);

  pg_pool.on('error', function(err, client) {
    console.error('Idle client error: ', err.message, err.stack);
  });
}
catch (e) {
  console.error('Failed to load config file! DB queries will fail');
}

module.exports = {
  website_name,
  pg_pool };
