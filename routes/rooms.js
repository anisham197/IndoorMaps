var express = require('express');
var router = express.Router();

var Room = require('../models/room_model.js')

var admin = require('firebase-admin');
var db = admin.firestore();

/* GET Rooms page. */
router.get('/', function(req, res, next) {

  var userId = '6y4JCw75hQWokw2Nqfl4lXGEl4H3';
  var locationId = 'nJeZn71ShzyQitMjicdK';
  var buildingId = 'innlMAfq9RY59C9eNjbg';
  var rooms = [];

  var query = db.collection('rooms').where('buildingId', '==', buildingId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            var room = new Room(doc.id, buildingId, locationId, userId, doc.data().name, doc.data().label, doc.data().metadata.floor);
            rooms.push(room);            
        });
        console.log("" + rooms.length);
        res.render('rooms/rooms', { title: 'Room', rooms: rooms});
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });   
});

module.exports = router;
