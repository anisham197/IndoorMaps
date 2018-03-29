var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Building = require('../models/building_model.js')

var helper = require('../helpers.js');

/* GET Buildings page. */
router.get('/', function(req, res, next) {
    if(!helper.isAuthenticated(req, res)) {
        return res.redirect("/");
    }
    var encryptLocId = req.query.id;
    var locationId = helper.decrypt(encryptLocId);

    var buildings = [];
    var query = db.collection('buildings').where('locationId', '==', locationId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var encryptId = helper.encrypt(doc.id);
            var building = new Building(doc.id, encryptId, doc.data().locationId, doc.data().name, doc.data().metadata.numFloors, doc.data().metadata.numRooms);
            buildings.push(building);            
        });
        buildings.sort(helper.compare);
        return res.render('buildings/building_main', { title: 'Buildings', buildings: buildings, locationId: encryptLocId});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
