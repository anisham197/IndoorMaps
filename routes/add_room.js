var express = require('express');
var router = express.Router();

var admin = require('firebase-admin');
var db = admin.firestore();
var helper = require('../helpers.js');
global.buildingId;


router.get('/', function(req, res, next) {
  if(!helper.isAuthenticated(req, res)) {
    return res.redirect("/");
  }
  global.buildingId = helper.decrypt(req.query.id);
  return res.render('rooms/add_room_form', { title: 'Add Room' });
});


router.post('/', function(req, res, next) {
  var data = {
    name: req.body.name,
    label: req.body.label,
    buildingId: global.buildingId,
    metadata:  {
      floor: req.body.floor,
    }
  };
  var setDoc = db.collection('rooms').doc().set(data);
  res.redirect('/rooms?id=' + helper.encrypt(global.buildingId));
});

module.exports = router;
