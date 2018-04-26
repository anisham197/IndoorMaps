var express = require('express');
var request = require('request');
var admin = require('firebase-admin');

var db = admin.firestore();
var router = express.Router();

// data : {"group": groupLocationID,
// 		"username", UID,
// 		"location", location,
// 		"time", timestamp,
// 		"wifi-fingerprint", finalFingerprint
// 	}
router.post('/', function(req, res, next) {
	var data = req.body;
	var userId = data.username;
	getCurrentRoomId(data, function(result) {
		if(result == null) {
			updateCurrentLocation(userId, result, function(status){
				if(status) {
					return res.status(500).send("Error getting current roomId");
				} else {
					return res.status(500).send("Error setting user's current location to null");
				}
			});
		} else if(result == "") {
			updateCurrentLocation(userId, null, function(status){
				if(status) {
					return res.status(200).send("No fingerprints found to track");
				} else {
					return res.status(500).send("Error updating user's current location to null");
				}
			});
		} else {
			getRoomLocation(result, function(locationResult) {
				if(locationResult == null) {
					updateCurrentLocation(userId, locationResult, function(status){
						if(status) {
							return res.status(500).send("Error getting current room location details");
						} else {
							return res.status(500).send("Error updating use'r current location to null");
						}
					});
				}
				updateCurrentLocation(userId, locationResult, function(status){
					if(status) {
						return res.status(200).send("Successful");
					} else {
						return res.status(500).send("Error updating use'r current location");
					}
				});
			});
		}
	});
});


function getCurrentRoomId(data, callback) {
	request.post({
		url: 'http://maps.goflo.in/track',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(data)
		},function(error,res,body){
			console.log(body);
			var result = JSON.parse(body).success;
			if(result) {
				var roomId = JSON.parse(body).location;
				if(roomId != null) {
					callback(roomId);
				} else {
					callback("");
				}
				
			} else {
				callback(null);
			}			
	});
}


function getRoomLocation (roomId, callback) {
	var currentLocation;
	db.collection('rooms').get()
		.then(snapshot => {
			snapshot.forEach(doc => {
				if(doc.id.toLowerCase() == roomId) {
					currentLocation = doc.data().location;
					currentLocation['roomLabel'] = doc.data().label;
					currentLocation['buildingId'] = doc.data().buildingId;
					currentLocation['floorNum'] = doc.data().metadata.floor;
					console.log(currentLocation);
					callback(currentLocation);
				}
			});
			//If roomId doesnt match with any of existing roomIds
			if(currentLocation == null) {
				callback(null);
			}
		})
		.catch(err => {
			console.log('Error getting documents', err);
			callback(null);
		});   
}


function updateCurrentLocation(userId, data, callback) {
	var docRef = db.collection('customers').doc(userId);
	docRef.update({
			currentLocation: data
		})
	.then(function() {
		console.log("Document successfully updated!");
		callback(true);
	})
	.catch(function(error) {
		console.error("Error updating document: ", error);
		callback(false);
	});
}


module.exports = router;
