const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const common = require('../common');

router.get('/register', function(req, res, next) {
  res.render('user/register', {
    title: req.__('user/register:title') + ' - ' + common.website_name,
    form: {} });
});

router.post('/register', async function(req, res, next) {
  const form = req.body;
  let error;

  const username_error = await validUsername(form.username);

  if (!form.username || !form.password || !form.password_confirm) {
    error = 'user/register:error-missing-fields';
  }
  else if (form.username.length < 3 || form.username.length > 20) {
    error = 'user/register:error-username-length';
  }
  else if (username_error) { // Executes if validUsername() returned an error
    error = username_error;
  }
  else if (form.password.length < 10 || form.password.length > 100) {
    error = 'user/register:error-password-length';
  }
  else if (form.password != form.password_confirm) {
    error = 'user/register:error-password-confirm';
  }

  if (error) {
    res.render('user/register', {
      title: req.__('user/register:title') + ' - ' + common.website_name,
      error: req.__(error),
      form: form });
  }
  else {
    registerUser(form, (err) => {
      if (err) {
        res.render('user/register', {
          title: req.__('user/register:title') + ' - ' + common.website_name,
          error: req.__(err),
          form: form });
      }
      else {
        res.redirect('/user/login');
      }
    });
  }
});

/**
 * Returns an error if a given username uses invalid characters or is taken.
 * @param {string} username
 * @return {string}
 */
function validUsername(username) {
  return new Promise((resolve, reject) => {
    // Usernames must use only certain plaintext characters
    const regex = /^[a-zA-Z0-9_]*$/;
    if (!regex.test(username)) {
      return 'user/register:error-username-invalid-chars';
    }

    // Users are unique and case-insensitive
    const query =
      'SELECT count(*) FROM users WHERE lower(username) = lower($1);';

    const vars = [ username ];

    common.pg_pool.query(query, vars, (err, res) => {
      if (err) {
        console.error(err);
        resolve('db-generic-error');
      }
      else {
        if (res.rows[0].count > 0) {
          resolve('user/register:error-username-taken');
        }
        else {
          resolve('');
        }
      }
    });
  });
}

/**
 * Given some user details, registers the user in the database.
 * @param {*} user
 * @param {function} callback
 */
function registerUser(user, callback) {
  // Hash the password so that it isn't stored in plaintext
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);

  const query =
    'INSERT INTO users (username, pw_hash, created) VALUES ($1, $2, $3);';

  const vars = [
    user.username, hash, common.get_timestamp() ];

  common.pg_pool.query(query, vars, (err, res) => {
    if (err) {
      console.error(err);
      callback('db-generic-error');
    }
    else {
      callback('');
    }
  });
}

module.exports = router;
