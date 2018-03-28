var express = require('express');
var router = express.Router();

var Building = require('../models/building_model.js')

var admin = require('firebase-admin');
var db = admin.firestore();
var transform = require('../helpers.js');

/* GET Buildings page. */
router.get('/', function(req, res, next) {

  var userId = '6y4JCw75hQWokw2Nqfl4lXGEl4H3';
  var encryptId = req.query.id;
  var locationId = transform.decrypt(encryptId);
  
  var buildings = [];
  console.log("\n\nloc id " + req.body.locationId);
  var query = db.collection('buildings').where('locationId', '==', locationId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var building = new Building(doc.id, doc.data().locationId, userId, doc.data().name, doc.data().metadata.numFloors);
            buildings.push(building);            
        });
        res.render('buildings/building_main', { title: 'Buildings', buildings: buildings, locationId: encryptId});

    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
