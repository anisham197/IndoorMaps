var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();

router.get('/', function(req, res, next) {
  res.render('home/add_location_form', { title: 'Location Form' });
});


router.post('/', function(req, res, next) {

  var userID = '6y4JCw75hQWokw2Nqfl4lXGEl4H3';

  var data = {
    name: req.body.name,
    userID: userID,
    metadata:  {
      numBuildings: req.body.number_buildings,
      city: req.body.city
    }
  };
  var setDoc = db.collection('locations').doc().set(data);
  res.redirect('/home');
});

module.exports = router;
