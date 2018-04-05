var express = require('express');
var fs = require('fs');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Building = require('../models/building_model.js')

var helper = require('../helpers.js');

var buildingId;

router.get('/', function(req, res, next) {
  var encryptBuildingId = req.query.id;
  buildingId = helper.decrypt(encryptBuildingId);

  db.collection("buildings").doc(buildingId).get()
    .then(function(doc) {
      if (doc.exists) {
          var building = new Building(doc.id, encryptBuildingId, doc.data().locationId, doc.data().name, doc.data().metadata.numFloors, doc.data().metadata.numRooms);
          return res.render('floorplan/add_floorplan', { title: 'Add floorplan', building: building });
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
  });
});

router.post('/', function(req, res, next) {
  var floorNum = req.body.floor;

   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
   var floorplanImage = req.files.image;
 
   var dir = process.cwd() + '/floorplans';
   if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

   var filename = process.cwd() + '/floorplans/' + buildingId + '_' + floorNum + '.jpg';
   // Use the mv() method to place the file somewhere on your server
   floorplanImage.mv(filename, function(err) {
     if (err)
       return res.status(500).send(err);
  
     res.send('File uploaded!');
   });

});

module.exports = router;
