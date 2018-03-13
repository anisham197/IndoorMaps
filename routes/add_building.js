var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('buildings/add_building_form', { title: 'Building Form' });
});

module.exports = router;
