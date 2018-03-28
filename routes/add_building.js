var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();

router.post('/', function(req, res, next) {

  console.log("\n\nladdbuil loc id " + req.body.locationId);
  res.render('buildings/add_building_form', { title: 'Add Building' });
});

router.post('/submit', function(req, res, next) {

  var locationId = 'nJeZn71ShzyQitMjicdK';

  var data = {
    name: req.body.building_name,
    locationId: locationId,
    metadata:  {
      numFloors: req.body.num_floors,
    }
  };
  var setDoc = db.collection('buildings').doc().set(data);
  res.redirect(308, '/buildings');
});

module.exports = router;
