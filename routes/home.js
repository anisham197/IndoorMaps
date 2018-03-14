var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {

  var userID = '6y4JCw75hQWokw2Nqfl4lXGEl4H3';
  var query = db.collection('locations').where('userID', '==', userID).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
  
  res.render('home/homepage', { title: 'home' });
});

module.exports = router;
