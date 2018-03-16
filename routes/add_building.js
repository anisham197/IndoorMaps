var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();

router.get('/', function(req, res, next) {
  res.render('buildings/add_building_form', { title: 'Building Form' });
});

router.post('/', function(req, res, next) {

  var locationID = 'nJeZn71ShzyQitMjicdK';

  var data = {
    name: req.body.building_name,
    locationID: locationID,
    metadata:  {
      numFloors: req.body.num_floors,
    }
  };
  var setDoc = db.collection('buildings').doc().set(data);
  res.redirect('/buildings');
});

module.exports = router;
