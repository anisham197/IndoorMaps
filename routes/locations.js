var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Location = require('../models/location_model.js');
var helper = require('../helpers.js');
global.userId;
global.encryptUserId;

/* GET home page. */
router.get('/', function(req, res, next) {
  // if(!helper.isAuthenticated(req, res)) {
  //   return res.redirect("/");
  // }
  if(req.query.uid) {
    encryptUserId = req.query.uid;
    userId = helper.decrypt(encryptUserId);
    console.log("userId " + userId);
  }

  var locations = [];
  var query = db.collection('locations').where('userId', '==', userId).get()
  .then(snapshot => {
      snapshot.forEach(doc => {
		var encryptId = helper.encrypt(doc.id);
		var loc = new Location(doc.id, encryptId, doc.data().userId, doc.data().name, doc.data().metadata.city, doc.data().metadata.numBuildings);
		locations.push(loc);            
      }); 
      locations.sort(helper.compare);  
      return res.render('locations/location_main', { title: 'Locations', locations: locations, userId: encryptUserId } );      
  })
  .catch(err => {
      console.log('Error getting documents', err);
  });
});


router.post('/deletelocation', function(req, res, next) {
	var locationId = req.body.locationId;

	var query = db.collection('locations').doc(locationId).delete().then(function() {
		console.log("Document successfully deleted!");
		return res.redirect('/locations?uid=' + userId);
	}).catch(function(error) {
		console.error("Error removing document: ", error);
	});
  
});

module.exports = router;
