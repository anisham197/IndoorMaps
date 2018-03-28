var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Building = require('../models/building_model.js')

var transform = require('../helpers.js');

/* GET Buildings page. */
router.get('/', function(req, res, next) {
    var encryptLocId = req.query.id;
    var locationId = transform.decrypt(encryptLocId);

    var buildings = [];
    var query = db.collection('buildings').where('locationId', '==', locationId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var encryptId = transform.encrypt(doc.id);
            var building = new Building(doc.id, encryptId, doc.data().locationId, doc.data().name, doc.data().metadata.numFloors, doc.data().metadata.numRooms);
            buildings.push(building);            
        });
        return res.render('buildings/building_main', { title: 'Buildings', buildings: buildings, locationId: encryptLocId});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
