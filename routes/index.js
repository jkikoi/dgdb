const express = require('express');
const router = express.Router();

const common = require('../common');

router.get('/', function(req, res, next) {
  res.render('index', {
    title: req.__('home:title') + ' - ' + common.website_name });
});

module.exports = router;
