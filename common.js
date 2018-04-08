const website_name = 'DGDB';

/**
 * Returns the current date and time - to the millisecond - as an ISO string.
 * This will also be in UTC time, i.e. will have no timezone information.
 * This format allows us to easily store timestamps in a database.
 * Time manipulation/localization can then be done in JS, where it is simple.
 *
 * @return {string}
 */
function get_timestamp() {
  return new Date(new Date().getTime()).toISOString();
}

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
  website_name, get_timestamp,
  pg_pool };
