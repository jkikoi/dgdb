const express = require('express');
const router = express.Router();

const common = require('../common');

router.get('/new', common.require_login, function(req, res, next) {
  res.render('game/new', {
    title: req.__('game/new:title') + ' - ' + common.website_name,
    form: {} });
});

router.post('/new', common.require_login, function(req, res, next) {
  const form = req.body;
  let error;

  if (form.title_jp      > 100 ||
      form.title_romaji  > 100 ||
      form.title_english > 100 ||
      form.title_other   > 100 ||
      form.homepage      > 200 ||
      form.download      > 200)
  {
    error = 'game/new:error-field-too-long';
  }
  else if (!form.title_jp && !form.title_romaji && !form.title_english) {
    error = 'game/new:error-title-missing';
  }

  if (error) {
    res.render('game/new', {
      title: req.__('game/new:title') + ' - ' + common.website_name,
      error: req.__(error),
      form: form });
  }
  else {
    const query = `
      INSERT INTO games (
        title_jp,
        title_romaji,
        title_english,
        title_other,
        homepage,
        download,
        created,
        created_by )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;`;

    const vars = [
      form.title_jp      ? form.title_jp      : null,
      form.title_romaji  ? form.title_romaji  : null,
      form.title_english ? form.title_english : null,
      form.title_other   ? form.title_other   : null,
      form.homepage      ? form.homepage      : null,
      form.download      ? form.download      : null,
      common.get_timestamp(),
      req.session.user.id ];

    common.pg_pool.query(query, vars, (err, res2) => {
      if (err) {
        console.error(err);

        res.render('game/new', {
          title: req.__('game/new:title') + ' - ' + common.website_name,
          error: req.__('db-generic-error'),
          form: form });
      }
      else {
        res.redirect('/game/' + res2.rows[0].id);
      }
    });
  }
});

module.exports = router;
