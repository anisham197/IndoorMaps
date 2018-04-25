var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Room = require('../models/room_model.js');

var helper = require('../helpers.js');

/* GET Rooms page. */
router.get('/', function(req, res, next) {
    // if(!helper.isAuthenticated(req, res)) {
    //     return res.redirect("/");
    // }
    var encryptBuildingId = req.query.id;
    var buildingId = helper.decrypt(encryptBuildingId);
    
    var rooms = [];
    var query = db.collection('rooms').where('buildingId', '==', buildingId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var room = new Room(doc.id, buildingId, doc.data().name, doc.data().label, doc.data().metadata.floor);
            rooms.push(room);            
        });
        rooms.sort(helper.compare);
        return res.render('rooms/room_main', { title: 'Rooms', rooms: rooms, buildingId: encryptBuildingId});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
