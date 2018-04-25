var express = require('express');
var router = express.Router();

var firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
var helper = require('../helpers.js');

// Initialize Firebase
var config = {
  apiKey: "AIzaSyB4IYLbkUq1KOhMYVus1WoPy4wxgmeHm0A",
  authDomain: "datastore-9fd58.firebaseapp.com",
  projectId: "datastore-9fd58",
  };
firebase.initializeApp(config);

// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.post('/login', function(req, res, next) {
  verifyWithFirebase(req.body.token).then(function(data){
    console.log(" uid " + firebase.auth().currentUser.uid);
    var currentUser = firebase.auth().currentUser;
    var uid = currentUser.uid;
    var encryptUserId = helper.encrypt(uid);
    req.session.encryptUid = encryptUserId;
    addUserToFirestore(currentUser, function(result){
		if(result == null) {
			res.status(500).send({msg: 'Sign in failed', redirectUrl: "/"});
		} else {
			res.status(200).send({uid: encryptUserId, redirectUrl: "/locations"});
		}
    });
  }).catch(function(err){
    console.log(err);
  });
});


function verifyWithFirebase(id_token) {
	// Build Firebase credential with the Google ID token.
	var credential = firebase.auth.GoogleAuthProvider.credential(id_token);

	// Sign in with credential from the Google user.
	return firebase.auth().signInWithCredential(credential);
}


function addUserToFirestore(currentUser, callback) {
	var docRef = db.collection('users').doc(currentUser.uid);

	var setUser = docRef.set({
		name: currentUser.displayName,
		email: currentUser.email
	}).then(function() {
		console.log("User added to firestore : ");
		callback(setUser);
	}).catch(function(error) {
		console.log("Error adding user to firestore : " + error);
		callback(null);
	});
}

router.post('/logout', function(req, res) {
	firebase.auth().signOut().then(function() {
    	req.session.destroy();
    	res.send({status:200});
  	}).catch(function(error) {
    	// An error happened.
    	res.send({status:500});
  	});
});

module.exports = router;



