var express = require('express');
var fs = require('fs');
var HashMap = require('hashmap');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var bucket = admin.storage().bucket();

var Building = require('../models/building_model.js')

var helper = require('../helpers.js');

var buildingId, numFloors;


router.get('/', function(req, res, next) {

  // if(!helper.isAuthenticated(req, res)) {
  //   return res.redirect("/");
  // }
  var encryptBuildingId = req.query.id;
  buildingId = helper.decrypt(encryptBuildingId);

  db.collection("buildings").doc(buildingId).get()
    .then(function(doc) {
      if (doc.exists) {
        numFloors = doc.data().metadata.numFloors;
        var building = new Building(doc.id, encryptBuildingId, doc.data().locationId, doc.data().name, numFloors, doc.data().metadata.numRooms, doc.data().buildingCoordinates);
        return res.render('floorplan/add_floorplan', { title: 'Add floorplan', building: building });
      } else {
          console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
  });
});


router.get('/getBuildingInfo', function(req,res, next) {
  var encryptBuildingId = req.query.id;
  var buildingId = helper.decrypt(encryptBuildingId);
  var object = {};
  var floors = [];
  var floormap = new HashMap();
  db.collection('rooms').where('buildingId', '==', buildingId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
          floorNum = doc.data().metadata.floor;
          var room = {
            roomId: doc.id,
            roomName: doc.data().name ,
            roomLocation: doc.data().location
          };

          var rooms = floormap.get(floorNum);
          if(rooms == null)
            rooms = [];
          rooms.push(room);
          floormap.set(floorNum, rooms);
        });

        for(var i = 1; i <= numFloors; i++) {
          var value = floormap.get(i.toString());
          console.log(i);
          console.log(value);
          floors.push({
            'floorNum': i,
            'rooms': value
          })
        }
        // floormap.forEach(function(value, key) {
        //   floors.push({
        //     'floorNum': key,
        //     'rooms': value
        //   })
        // });
        object = {
          'numFloors': numFloors,
          'floors': floors
        };
      console.log(object);
      return res.status(200).send( {msg: "Success", buildingInfo: object} );
    })
    .catch(err => {
        console.log('Error getting documents', err);
        return res.status(500).send("Error getting document: ", error);
    });
});

router.get('/getFloorplanInfo', function(req,res, next) {
  var encryptBuildingId = req.query.id;
  var buildingId = helper.decrypt(encryptBuildingId);

  db.collection("floorplans").doc(buildingId).get()
    .then(function(doc) {
      if (doc.exists) {
        return res.status(200).send( {msg: "Success", floorplans: doc.data()} );
      } 
      else {
        return res.status(200).send( {msg: "No Such Document", floorplans: null} );
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
      return res.status(500).send("Error getting document: ", error);
    });
});


// Request body data structure 
//  data: { 
//  [roomId] : [location],
//  [roomId] : [location],
//  }
//  Ex. data: {
//  p2oSQF3VIeNVZYykl3AY: { lat: 13.031, lng: 77.564 },
//  ehTz7kfCeXvm8whmxGB6: { lat: 13.031, lng: 77.564 }
//  }
router.post('/saveRoomLoc', function(req, res, next) {
  console.log("save room loc endpoint");
  var data = JSON.parse(req.body.data);
  console.log(data);

  var batch = db.batch();
  for (var roomId in data) {
    var location = data[roomId];
    var docRef = db.collection('rooms').doc(roomId);
    batch.update(docRef, { 'location': location });
  }

  batch.commit().then(function() {
    return res.status(200).send("Document successfully updated!");
  }).catch(function(error) {
    return res.status(500).send("Error updating document ", error);
  });
});


router.post('/uploadimages', function(req, res, next) {
  var floorNum = req.body.floor;
  console.log(req.body);

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  var floorplanImage = req.files.floorplanImage;
  console.log(floorplanImage);

  if(!floorplanImage) {
    res.status(400).send("Bad request");
  }

  var dir = process.cwd() + '/floorplans';
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }

  var fileExt = floorplanImage.name.split('.').pop().toLowerCase();
  var filename = buildingId + '_' + floorNum + '.' + fileExt;
  var filePath = dir + '/' + filename ;

  var gcsFile = bucket.file(filename);
  
  const stream = gcsFile.createWriteStream({
    metadata: {
      contentType: floorplanImage.mimetype
    }
  });

  stream.on('error', (err) => {
    console.log("error");
    res.status(400).send( {msg: "Error", error: err} );
  });

  stream.on('finish', () => {
    gcsFile.makePublic().then(() => {
      console.log(getPublicUrl(filename));
      res.status(200).send( {msg: "Success", filepath: getPublicUrl(filename)} );
    })
    .catch( err => {
      console.log("error");
      console.log(err);
      res.status(400).send( {msg: "Error", error: err} );
    });
  });

  stream.end(floorplanImage.data);
});


router.post('/savefloorplan', function(req, res,next) {
  console.log(req.body);
  var object = JSON.parse(req.body.data);

  db.collection("floorplans").doc(buildingId).set({
    locationId: object.locationId,
    [object.floorNum]: {
      imageFilepath: object.imageFilepath,
      sw: object.coordinates.sw,
      nw: object.coordinates.nw,
      ne: object.coordinates.ne,
      se: object.coordinates.se
    }
  }, {merge: true})
  .then(function() {
    return res.status(200).send("Document successfully updated!");
  }).catch(function(error) {
    return res.status(500).send("Error updating document: ", error);
  });
});

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/datastore-9fd58.appspot.com/${filename}`;
}

module.exports = router;
