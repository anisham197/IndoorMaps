var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('home/add_location_form', { title: 'Location Form' });
});

module.exports = router;
