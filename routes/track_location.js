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
	// var data = JSON.parse(req.body.data);
	// var data = JSON.parse(req.body);
	data = req.body;
	console.log(data);
	// var data = {"group":"WwcCPsNYRnqXhe4WiL8q","username":"xxxx","location":"xxxxx","time":1524497347697,"wifi-fingerprint":[{"mac":"a0:04:60:19:3d:14","rssi":-57},{"mac":"48:ee:0c:d9:5a:10","rssi":-61},{"mac":"c4:12:f5:bb:da:11","rssi":-74},{"mac":"c8:3a:35:33:64:48","rssi":-79},{"mac":"c4:e9:84:84:7a:08","rssi":-84},{"mac":"14:9d:09:70:de:68","rssi":-87}]};

	// var userId = '3T3LV2w65RUUQl24MsHBrhu2t7G2';
	var userId = data.username;
	console.log("userId " + userId);

	getCurrentRoomId(data, function(result) {
		if(result == null) {
			return res.status(500).send("Error getting current roomId");
		}
		getRoomLocation(result, function(locationResult) {
			if(locationResult == null) {
				return res.status(500).send("Error getting current room location");
			}
			updateCurrentLocation(userId, locationResult, function(status){
				if(status) {
					return res.status(200).send("Successful");
				} else {
					return res.status(500).send("Error updating use'r current location");
				}
			});
		});
	});

});


function getCurrentRoomId(data, callback) {
	request.post({
		url: 'http://maps.goflo.in/track',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(data)
		},function(error,res,body){
			if(error) {
				callback(null);
			}
			var result = JSON.parse(body).location;
			console.log(body);
			callback(result);
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
	var docRef = db.collection('users').doc(userId);
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
