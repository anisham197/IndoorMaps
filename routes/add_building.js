var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var transform = require('../helpers.js');
global.locationId;

router.get('/', function(req, res, next) {
  global.locationId = transform.decrypt(req.query.id);
  return res.render('buildings/add_building_form', { title: 'Add Building' });
});

router.post('/', function(req, res, next) {
   var data = {
    name: req.body.building_name,
    locationId: global.locationId,
    metadata:  {
      numFloors: req.body.num_floors,
      numRooms: req.body.num_rooms,
    }
  };
  var setDoc = db.collection('buildings').doc().set(data);
  return res.redirect('/buildings?id=' + transform.encrypt(global.locationId));
});

module.exports = router;
