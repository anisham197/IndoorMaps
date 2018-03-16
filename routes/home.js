var express = require('express');
var router = express.Router();

var Location = require('../models/location_model.js')

var admin = require('firebase-admin');
var db = admin.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {

  var userId = '6y4JCw75hQWokw2Nqfl4lXGEl4H3';
  var locations = [];
  var query = db.collection('locations').where('userID', '==', userId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var loc = new Location(doc.id, doc.data().userID, doc.data().name, doc.data().metadata.city, doc.data().metadata.numBuildings);
            locations.push(loc);            
        });
        console.log("" + locations.length);
        res.render('home/homepage', { title: 'Home', locations: locations});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
