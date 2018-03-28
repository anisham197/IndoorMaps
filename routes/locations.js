var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Location = require('../models/location_model.js');
var transform = require('../helpers.js');

/* GET home page. */
router.get('/', function(req, res, next) {

  var userId = '6y4JCw75hQWokw2Nqfl4lXGEl4H3';
  var encryptUserId = transform.encrypt(userId);

  var locations = [];
  var query = db.collection('locations').where('userId', '==', userId).get()
  .then(snapshot => {
      snapshot.forEach(doc => {
          var encryptId = transform.encrypt(doc.id);
          var loc = new Location(doc.id, encryptId, doc.data().userId, doc.data().name, doc.data().metadata.city, doc.data().metadata.numBuildings);
          locations.push(loc);            
      });
      console.log("" + locations.length);       
      return res.render('locations/location_main', { title: 'Locations', locations: locations, userId: encryptUserId } );      
  })
  .catch(err => {
      console.log('Error getting documents', err);
  }); 

});

module.exports = router;
