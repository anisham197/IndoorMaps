var express = require('express');
var router = express.Router();

/* GET Rooms page. */
router.get('/', function(req, res, next) {
  res.render('rooms/rooms', { title: 'Room' });
});

module.exports = router;
