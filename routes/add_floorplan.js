var express = require('express');
var fs = require('fs');
var HashMap = require('hashmap');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
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


router.get('/getBuildig', function(req, res, next) {

});


router.get('/getBuildingInfo', function(req,res, next) {
  var buildingId = req.query.id;
  var object = {};
  var floors = [];
  var floormap = new HashMap();
  db.collection('rooms').where('buildingId', '==', buildingId).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
          floorNum = doc.data().metadata.floor;
          var room = {
            roomId: doc.id,
            roomName: doc.data().name 
          };

          var rooms = floormap.get(floorNum);
          if(rooms == null)
            rooms = [];
          rooms.push(room);
          floormap.set(floorNum, rooms);
        });
        floormap.forEach(function(value, key) {
          floors.push({
            'floorNum': key,
            'rooms': value
          })
        });
        object = {
          'numFloors': numFloors,
          'floors': floors
        };
      console.log(object);
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
  return res.send(object);
});


// Request body contains roomId and location 
// Ex. data: { roomId: 4ijtMdXC96jyn9VhtRr8,
//             location: {
//                lat: 13.4454,
//                lng: 77.343
//              }
//            }
router.post('/saveRoomLoc', function(req, res, next) {
  var object = JSON.parse(req.body.data);
  var roomId = object.roomId;
  var location = object.location;
  var docRef = db.collection('rooms').doc(roomId);
  docRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        docRef.update({
          'location': location
        }).then(function() {
            return res.status(200).send("Document successfully updated!");
          }).catch(function(error) {
          return res.status(500).send("Error updating document ", error);
        })
      } else {
        console.log("doc doesnt exist");
        return res.status(500).send("Document doesn't exist ", error);
      }
  }).catch(function(error) {
    return res.status(500).send("Error getting document ", error);
  });
  return res.status(500).send("Error occured while saving room locations", error);
});


router.post('/savecoordinates', function(req, res, next) {

  console.log(req.body);
  console.log("\nbuildingID " + buildingId);
  var coordinates = JSON.parse(req.body.coordinates);

  var docRef = db.collection('floorplans').doc(buildingId);

  docRef.get()
    .then((docSnapshot) => {
      if (docSnapshot.exists) {
        docRef.update({
          initialCoordinates: coordinates
        }).then(function() {
            return res.status(200).send("Document successfully updated!");
          }).catch(function(error) {
          return res.status(500).send("Error updating document: ", error);
        })
      } else {
        console.log("doc doesnt exist");
        docRef.set({
          initialCoordinates: coordinates
        }).then(function() {
            return res.status(200).send("Document successfully written!");
          }).catch(function(error) {
          return res.status(500).send("Error writing document: ", error);
        }) 
      }
  }).catch(function(error) {
    return res.status(500).send("Error getting document: ", error);
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
  var filename = buildingId + '_' + floorNum;
  var fileExt = floorplanImage.name.split('.').pop();
  var filePath = dir + '/' + filename + '.' + fileExt;

  var file;
  if(fs.existsSync(file = dir + '/' + filename + '.' + 'png')) {
    console.log("png file exists");
    fs.unlink(file, (err) => {
      if (err) 
        throw err;
      console.log('file was deleted');
    });
  }
  else if(fs.existsSync(file = dir + '/' + filename + '.' + 'jpg')) {
    console.log("jpg file exists");
    fs.unlink(file, (err) => {
      if (err)
        throw err;
      console.log('file was deleted');
    });
  }
  if(fs.existsSync(file = dir + '/' + filename + '.' + 'jpeg'))
  {
    console.log("jpeg file exists");
    fs.unlink(file, (err) => {
      if (err)
        throw err;
      console.log('file was deleted');
    });
  }

  console.log("\nfile path " + filePath);
  
  // Use the mv() method to place the file somewhere on your server
  fs.writeFile(filePath, floorplanImage.data, (err) => {
    if (err){
      console.log(err);
      return res.status(500).send("Internal Server Error");
    }
    console.log("File saved");
    res.status(200).send( {msg: "Success", filepath: filename + '.' + fileExt} );
  });

});


router.post('/savefloorplan', function(req, res,next) {
  console.log(req.body);
  var object = JSON.parse(req.body.data);

  db.collection("floorplans").doc(buildingId).update({
    [object.floorNum]: {
      imageFilepath: object.imageFilepath,
      sw: object.coordinates.sw,
      nw: object.coordinates.nw,
      ne: object.coordinates.ne
    }
  }).then(function() {
    return res.status(200).send("Document successfully updated!");
  }).catch(function(error) {
    return res.status(500).send("Error updating document: ", error);
  });
});

module.exports = router;
