const express = require('express');
const router = express.Router();

const common = require('../common');

router.get('/register', function(req, res, next) {
  res.render('user/register', {
    title: req.__('user/register:title') + ' - ' + common.website_name });
});

module.exports = router;
