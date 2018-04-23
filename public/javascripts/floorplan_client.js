var map; 
var accordion;
var coordinates = buildingCoordinates;
var floorplanInfo = null;
var buildingInfo = null;

$(document).ready(function(){
  accordion = document.getElementsByClassName("accordion");

  for (var i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight){
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
  // ajax call
  getFloorplanInfo(function(result){
    floorplanInfo = result.floorplans;
    console.log(floorplanInfo);
    console.log(result.msg);
    accordion[0].disabled = false;
    if (floorplanInfo != null){
      accordion[1].disabled = false;
    }
  });

  //Get details of all rooms
  getBuildingInfo(function(result){
    buildingInfo= result.buildingInfo;
    console.log(buildingInfo);
    console.log(result.msg);
  });

  
});


function initMap() {
  var location = {lat: coordinates.nw.lat, lng: coordinates.nw.lng};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 20,
    center: location,
    clickableIcons: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: true
  });
}

function getFloorplanInfo(callback) {
  jQuery.ajax({
      url: '/addfloorplan/getFloorplanInfo?id=' + buildingEncryptId,
      cache: false,
      method: 'GET',
      type: 'GET', // For jQuery < 1.9
      success: function(data){
        callback(data);
      },
      error : function(error) {
        console.log(error);
      }
  });
}


function getBuildingInfo(callback) {
  jQuery.ajax({
      url: '/addfloorplan/getBuildingInfo?id=' + buildingEncryptId,
      cache: false,
      method: 'GET',
      type: 'GET', // For jQuery < 1.9
      success: function(data){
        callback(data);
        // buildingInfo = data.buildingInfo;
        // console.log(buildingInfo);
      },
      error : function(error) {
        console.log(error);
      }
  });
}

google.maps.event.addDomListener(window, 'load', initMap);