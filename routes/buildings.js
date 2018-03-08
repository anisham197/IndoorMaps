var express = require('express');
var router = express.Router();

/* GET Buildings page. */
router.get('/', function(req, res, next) {
  res.render('buildings/buildings', { title: 'home' });
});

module.exports = router;
