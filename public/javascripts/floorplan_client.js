var map; 
var markers = {sw : null, nw : null, ne : null};
var latitude, longitude;
var coordinates = {sw : null, nw : null, ne : null};

var acc = document.getElementsByClassName("accordion");
for (var i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}

function initMap() {
  var location = {lat: 13.030713, lng: 77.564665};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: location,
    clickableIcons: false
  });
}

function addCoordinates(btnEvent) {
  
  var mapListener = google.maps.event.addListener(map,'click',function(event) {
    latitude = event.latLng.lat();
    longitude =  event.latLng.lng();

    if(markers[btnEvent.id] == null) {
      console.log("add marker \n lat lng " + event.latLng + "\n id " + btnEvent.id);  
      markers[btnEvent.id] = new google.maps.Marker({
        position: {lat: latitude, lng: longitude},
        draggable: true,
        map: map
      });

      document.getElementById(btnEvent.id + "_input" ).value= latitude.toFixed(6) + " , " + longitude.toFixed(6);
      coordinates[btnEvent.id] = {lat: latitude, lng: longitude};

      google.maps.event.addListener(markers[btnEvent.id], 'dragend', function(evt){
        var lat = evt.latLng.lat();
        var lng = evt.latLng.lng() ;
        console.log("marker dropped: Current Lat: ' " + lat + " ' Current Lng: ' " + lng);
        console.log(btnEvent.id);
        document.getElementById(btnEvent.id + "_input" ).value= lat.toFixed(6) + " , " + lng.toFixed(6);
        coordinates[btnEvent.id] = {lat: lat, lng: lng};
      });
    }
    google.maps.event.removeListener(mapListener);
    latitude = null;
    longitude = null;
  });

}

function floorSelected() {
  var floorSelect = document.getElementById('floor-select');
  var floorNum = floorSelect.options[floorSelect.selectedIndex].value;

  console.log("floor selected " + floorNum);
}

function uploadFloorplan(event) {
  console.log(document.getElementById('image').files );
  // var imagePath = document.getElementById('image').value

}