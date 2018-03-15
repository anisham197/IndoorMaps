var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();


router.get('/', function(req, res, next) {
  res.render('rooms/add_room_form', { title: 'Room Form' });
});


router.post('/', function(req, res, next) {

  var buildingId = 'innlMAfq9RY59C9eNjbg';

  var data = {
    name: req.body.name,
    label: req.body.label,
    buildingId: buildingId,
    metadata:  {
      floor: req.body.floor,
    }
  };
  var setDoc = db.collection('rooms').doc().set(data);
  res.redirect('/rooms');
});

module.exports = router;
