const express = require('express');
const router = express.Router();

const common = require('../common');

router.get('/register', function(req, res, next) {
  res.render('user/register', {
    title: req.__('user/register:title') + ' - ' + common.website_name });
});

router.post('/register', function(req, res, next) {
  const form = req.body;
  let error;

  if (!form.username || !form.password || !form.password_confirm) {
    error = 'user/register:error-missing-fields';
  }
  else if (form.username.length < 3 || form.username.length > 20) {
    error = 'user/register:error-username-length';
  }
  else if (form.password.length < 10 || form.password.length > 100) {
    error = 'user/register:error-password-length';
  }

  if (error) {
    res.render('user/register', {
      title: req.__('user/register:title') + ' - ' + common.website_name,
      error: req.__(error) });
  }
});

module.exports = router;
