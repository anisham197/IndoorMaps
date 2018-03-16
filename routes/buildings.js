var express = require('express');
var router = express.Router();

var Building = require('../models/building.js')

var admin = require('firebase-admin');
var db = admin.firestore();

/* GET Buildings page. */
router.post('/', function(req, res, next) {

  var locationID = req.body.locationId;
  
  var buildings = [];
  console.log("\n\nloc id " + req.body.locationId);
  var query = db.collection('buildings').where('locationID', '==', locationID).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var building = new Building(doc.id, doc.data().locationID, doc.data().name, doc.data().metadata.numFloors);
            buildings.push(building);            
        });
        res.render('buildings/buildings', { title: 'Buildings', buildings: buildings});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
