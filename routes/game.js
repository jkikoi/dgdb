const express = require('express');
const router = express.Router();

const common = require('../common');

router.get('/new', common.require_login, function(req, res, next) {
  res.render('game/new', {
    title: req.__('game/new:title') + ' - ' + common.website_name,
    form: {} });
});

module.exports = router;
