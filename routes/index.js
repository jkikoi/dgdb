const express = require('express');
const router = express.Router();

const common = require('../common');
router.use(common.client_sessions);
router.use(common.client_sessions_mw);
router.use('/game', require('./game'));
router.use('/user', require('./user'));

router.get('/', function(req, res, next) {
  res.render('index', {
    title: req.__('home:title') + ' - ' + common.website_name });
});

module.exports = router;
