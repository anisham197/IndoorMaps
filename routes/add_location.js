var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var helper = require('../helpers.js');
global.userId;

router.get('/', function(req, res, next) {
  // if(!helper.isAuthenticated(req, res)) {
  //   return res.redirect("/");
  // }
  global.userId = helper.decrypt(req.query.id);
  return res.render('locations/add_location_form', { title: 'Add Location'});
});


router.post('/', function(req, res, next) {
  var data = {
    name: req.body.name,
    userId: global.userId,
    metadata:  {
      numBuildings: req.body.number_buildings,
      city: req.body.city
    }
  };
  var setDoc = db.collection('locations').doc().set(data);
  return res.redirect('/locations');
});

module.exports = router;
