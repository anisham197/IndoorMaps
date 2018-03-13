var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('rooms/add_room_form', { title: 'Room Form' });
});

module.exports = router;
