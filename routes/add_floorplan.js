var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  return res.render('add_floorplan', { title: 'Add floorplan' });
});


module.exports = router;
