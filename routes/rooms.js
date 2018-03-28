var express = require('express');
var router = express.Router();

var Room = require('../models/room_model.js')

var admin = require('firebase-admin');
var db = admin.firestore();

/* GET Rooms page. */
router.get('/', function(req, res, next) {

  var buildingId = transform.decrypt(req.query.id);
  var rooms = [];

  var query = db.collection('rooms').where('buildingId', '==', buildingId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var room = new Room(doc.id, buildingId, locationId, userId, doc.data().name, doc.data().label, doc.data().metadata.floor);
            rooms.push(room);            
        });
        console.log("" + rooms.length);
        return res.render('rooms/rooms', { title: 'Room', rooms: rooms});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
