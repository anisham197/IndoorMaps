var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();

router.get('/', function(req, res, next) {
  res.render('home/add_location_form', { title: 'Location Form' });
});


router.post('/', function(req, res, next) {

  var userID = "";

  var data = {
    name: req.body.name,
    userID: userID,
    metadata:  {
      city: req.body.city
    }
  };
  var setDoc = db.collection('locations').doc().set(data);
  res.redirect( '/home');
});

module.exports = router;
