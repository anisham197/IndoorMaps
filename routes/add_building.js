var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var helper = require('../helpers.js');
global.locationId;

router.get('/', function(req, res, next) {
  if(!helper.isAuthenticated(req, res)) {
    return res.redirect("/");
  }
  global.locationId = helper.decrypt(req.query.id);
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
  return res.redirect('/buildings?id=' + helper.encrypt(global.locationId));
});

module.exports = router;
