var map;
var markers = {sw: null, nw: null, ne: null};
var coordinates = {sw: null, nw: null, ne: null};

$('#sw').focus(function() { addCoordinates(this); });
$('#nw').focus(function() { addCoordinates(this); });
$('#ne').focus(function() { addCoordinates(this); });

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 13.031459, lng: 77.566337},
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    zoom: 13
  });
  var card = document.getElementById('pac-card');
  var input = document.getElementById('pac-input');

  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

  var autocomplete = new google.maps.places.Autocomplete(input);

  // Bind the map's bounds (viewport) property to the autocomplete object,
  // so that the autocomplete requests use the current map bounds for the
  // bounds option in the request.
  autocomplete.bindTo('bounds', map);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    map.setCenter(place.geometry.location);
    map.setZoom(19);
    var latitude = place.geometry.location.lat();
    var longitude = place.geometry.location.lng();

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-address'].textContent = address;
    infowindow.setPosition(place.geometry.location);
    infowindow.open(map);

    // Enable input fields for 3 coordinates of building
    document.getElementById('sw').disabled = false;
    document.getElementById('nw').disabled = false;
    document.getElementById('ne').disabled = false;
  });
}


function addCoordinates(inputEvent) {
  console.log("clicked " + inputEvent.id);
  var labels = {sw: 'Southwest Corner', nw: 'Northwest Corner', ne: 'Northeast Corner'}
  var mapListener = google.maps.event.addListener(map,'click',function(event) {

    var markerLat = event.latLng.lat();
    var markerLng =  event.latLng.lng();

    if(markers[inputEvent.id] == null) {
      markers[inputEvent.id] = new google.maps.Marker({
        position: {lat: markerLat, lng: markerLng},
        draggable: true,
        map: map,
        title: labels[inputEvent.id],
        label: inputEvent.id.toUpperCase()
      });

      document.getElementById(inputEvent.id).value= markerLat.toFixed(6) + " , " + markerLng.toFixed(6);
      coordinates[inputEvent.id] = {lat: markerLat, lng: markerLng};
      document.getElementById('coordinates').value = JSON.stringify(coordinates);      

      google.maps.event.addListener(markers[inputEvent.id], 'dragend', function(evt){
        var lat = evt.latLng.lat();
        var lng = evt.latLng.lng() ;
        console.log("marker dropped: Current Lat: ' " + lat + " ' Current Lng: ' " + lng);
        document.getElementById(inputEvent.id).value= lat.toFixed(6) + " , " + lng.toFixed(6);
        coordinates[inputEvent.id] = {lat: lat, lng: lng};
        document.getElementById('coordinates').value = JSON.stringify(coordinates);
      });
    }
    google.maps.event.removeListener(mapListener);
    markerLat = null;
    markerLng = null;
  });
}
