var markers = {};
var roomMap = {};

$("#select_floor_pois").change(onFloorSelected);
$("#select_room").change(onRoomSelected);
$("#save_pois").click(savePois);

function onFloorSelected() {
    var markerDraggable = true;
    clearFloorPlan();
    clearMarkers();
    console.log("markers on floor changed");
    console.log(markers);
    var selectFloor = document.getElementById('select_floor_pois');
    floorNum = selectFloor.options[selectFloor.selectedIndex].value;
    
    var selectRoom = document.getElementById('select_room');
    selectRoom.disabled = true;

    while (selectRoom.firstChild) {
        selectRoom.removeChild(selectRoom.firstChild);
    }
    var option = document.createElement('option');
    option.value = '';
    option.text = 'Select Room';
    option.disabled = true;
    option.hidden = true;
    option.selected = true;
    selectRoom.appendChild(option);

    // Return if objects are null
    if(floorplanInfo == null || buildingInfo == null) {
        return;
    }
    // If floorplan hasn't been uploaded for a floor, don't do anything
    if (floorplanInfo[floorNum] == null) {
        return;
    }
    console.log(floorplanInfo[floorNum]);
    showFloorplanWithMarkersForLevel(floorNum, markerDraggable);

    //Display alert message if room hasn't been added for a floor yet
    if(!buildingInfo.floors[floorNum-1].rooms) {
        alert("No room added for this floor");
        return;
    }

    showUnsavedMarkers();

    selectRoom.disabled = false;

    //Dynamically add Room names to the dropsown
    buildingInfo.floors[floorNum-1].rooms.forEach( function (room) {
        //Add room name only if marker hasn't been added for that room
        if(!markers[room.roomId]) {
            var option = document.createElement('option');
            option.value = room.roomId;
            option.text = room.roomName;
            selectRoom.appendChild(option);
        }
    });
}


function onRoomSelected() {
    var selectRoom = document.getElementById('select_room');
    var optionElement = selectRoom.options[selectRoom.selectedIndex];
    var roomId = optionElement.value;
    var roomName = optionElement.text;

    var mapListener = google.maps.event.addListener(map,'click',function(event) {

        var markerLat = event.latLng.lat();
        var markerLng =  event.latLng.lng();
    
        if(markers[roomId] == null) {
            markers[roomId] = new google.maps.Marker({
                position: {lat: markerLat, lng: markerLng},
                draggable: true,
                map: map,
                title: roomName
                // label: 'a
            });
        
            //Remove the room name from options when marker is added for that room
            optionElement.parentNode.removeChild(optionElement);

            selectRoom.firstChild.selected = true;

            roomMap[roomId] = { lat: markerLat, lng: markerLng };

            google.maps.event.addListener(markers[roomId], 'dragend', function(evt){
                var lat = evt.latLng.lat();
                var lng = evt.latLng.lng() ;
                console.log("marker dropped: Current Lat: ' " + lat + " ' Current Lng: ' " + lng);
                roomMap[roomId] = { lat: lat, lng: lng };
            });
        }
        google.maps.event.removeListener(mapListener);
        markerLat = null;
        markerLng = null;
    });

}


function clearMarkers() {
    for (var key in markers) {
        markers[key].setMap(null);
    }
    for (var key in staticMarkers) {
        staticMarkers[key].setMap(null);
    }
}


function showUnsavedMarkers() {
    buildingInfo.floors[floorNum-1].rooms.forEach( function (room) {
       if(!room.roomLocation && markers[room.roomId]) {
           markers[room.roomId].setMap(map);
       }
    });
}


function savePois() {
    console.log("room map");
    console.log(roomMap);

	jQuery.ajax({
		url: '/addfloorplan/saveRoomLoc',
		data: {data: JSON.stringify(roomMap)},
		cache: false,
		method: 'POST',
		type: 'POST', // For jQuery < 1.9
		success: function(data){
			console.log(data);
			alert("POIs added");
			// clearFloorPlan();
		},
		error : function(error) {
			console.log(error);
			alert("Error! Try again later.");
		}
	});
}