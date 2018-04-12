var express = require('express');
var fs = require('fs');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var Building = require('../models/building_model.js')

var helper = require('../helpers.js');

var buildingId;

router.get('/', function(req, res, next) {

  // if(!helper.isAuthenticated(req, res)) {
  //   return res.redirect("/");
  // }
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


router.post('/savecoordinates', function(req, res, next) {

  console.log(req.body);
  console.log("\nbuildingID " + buildingId);
  var object = JSON.parse(req.body.coordinates);
  db.collection("coordinates").doc(buildingId).set({
    sw: object.sw,
    nw: object.nw,
    ne: object.ne
  })
  .then(function() {
    return res.status(200).send("Document successfully written!");
  })
  .catch(function(error) {
    return res.status(500).send("Error writing document: ", error);
  });
});


router.post('/uploadimages', function(req, res, next) {
  var floorNum = req.body.floor;
  console.log(req.body);

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var floorplanImage = req.files.floorplanImage;
  console.log(floorplanImage);

  if(!floorplanImage){
    res.status(400).send("Bad request");
  }

  var dir = process.cwd() + '/floorplans';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }
  var fileExt = floorplanImage.name.split('.').pop();

  var filename = buildingId + '_' + floorNum + '.' + fileExt;
  var filePath = process.cwd() + '/floorplans/' + filename;

  console.log("\nfile path " + filePath);
  
  // Use the mv() method to place the file somewhere on your server
  console.log(filename);
  fs.writeFile(filePath, floorplanImage.data, (err) => {
    if (err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("File saved");
    res.status(200).send( {msg: "Success", filepath: filename} );
  });

});


router.post('/savefloorplan', function(req, res,next) {
  console.log(req.body);
  var object = JSON.parse(req.body.data);

  db.collection("floorplans").doc(buildingId).collection("floorNum").doc(object.floorNum).set({
    imageFilepath: object.imageFilepath,
    sw: object.coordinates.sw,
    nw: object.coordinates.nw,
    ne: object.coordinates.ne
  })
  .then(function() {
    return res.status(200).send("Document successfully written!");
  })
  .catch(function(error) {
    return res.status(500).send("Error writing document: ", error);
  });
});

module.exports = router;
