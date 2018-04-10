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

// ------------------------------------------------------------------ Sessions
const sessions = require('client-sessions');
const keygen = require('generate-key');

const one_week = 1000 * 60 * 60 * 24 * 7;

const client_sessions = sessions({
  cookieName: 'session',
  secret: keygen.generateKey(60),
  duration: one_week,
  activeDuration: one_week,
  cookie: { httpOnly: true }});

// Middleware that forwards the logged in user's info to pages
const client_sessions_mw = function(req, res, next) {
  if (req.session && req.session.user) {
    res.locals.user = req.session.user;
  }

  next();
};

module.exports = {
  website_name, get_timestamp,
  pg_pool,
  client_sessions, client_sessions_mw };
