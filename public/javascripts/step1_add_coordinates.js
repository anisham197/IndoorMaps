var markers = {sw : null, nw : null, ne : null};
var latitude, longitude;
var coordinates = {sw : null, nw : null, ne : null};

$('#sw').click(function() { addCoordinates(this); });
$('#nw').click(function() { addCoordinates(this); });
$('#ne').click(function() { addCoordinates(this); });
$("#save_coordinates").click(saveCoordinates);

function addCoordinates(btnEvent) {
  var mapListener = google.maps.event.addListener(map,'click',function(event) {
    latitude = event.latLng.lat();
    longitude =  event.latLng.lng();

    if(markers[btnEvent.id] == null) {
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
        document.getElementById(btnEvent.id + "_input" ).value= lat.toFixed(6) + " , " + lng.toFixed(6);
        coordinates[btnEvent.id] = {lat: lat, lng: lng};
      });
    }
    google.maps.event.removeListener(mapListener);
    latitude = null;
    longitude = null;
  });
}


function saveCoordinates() {
    if(coordinates.sw == null || coordinates.nw == null || coordinates.ne == null ){
      alert("Fill all 3 coordinates");
      return;
    }

    jQuery.ajax({
      url: '/addfloorplan/savecoordinates',
      data: {coordinates: JSON.stringify(coordinates)},
      cache: false,
      method: 'POST',
      type: 'POST', // For jQuery < 1.9
      success: function(data){
        console.log(data);
      },
      error : function(error) {
        console.log(error);
        alert("Error! Try again later.");
      }
    });
    var acc = document.getElementsByClassName("accordion");
    acc[1].disabled = false;
}
  