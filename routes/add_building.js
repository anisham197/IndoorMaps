var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var helper = require('../helpers.js');
global.locationId;

router.get('/', function(req, res, next) {
  // if(!helper.isAuthenticated(req, res)) {
  //   return res.redirect("/");
  // }
  global.locationId = helper.decrypt(req.query.id);
  return res.render('buildings/add_building_form', { title: 'Add Building' });
});

router.post('/', function(req, res, next) {
  console.log(req.body);
   var data = {
    name: req.body.building_name,
    locationId: global.locationId,
    metadata:  {
      numFloors: req.body.num_floors,
      numRooms: req.body.num_rooms,
    },
    initialCoordinates: JSON.parse(req.body.coordinates)
  };
  db.collection('buildings').doc().set(data).catch(function(error) {
    return res.status(500).send("Error writing document ", error);
  });

  return res.redirect('/buildings?id=' + helper.encrypt(global.locationId));
});

module.exports = router;
