$("#select_floor_pois").change(onFloorSelected);
$("#select_room").change(onRoomSelected);

function onFloorSelected() {
    clearFloorPlan();
    var selectFloor = document.getElementById('select_floor_pois');
    floorNum = selectFloor.options[selectFloor.selectedIndex].value;
    
    var selectDiv = document.getElementById('select_room');

    while (selectDiv.childNodes.length > 1) {
        selectDiv.removeChild(selectDiv.lastChild);
    }

    var option = document.createElement('option');
    option.value = '';
    option.text = 'Select Room';
    option.disabled = true;
    option.hidden = true;
    option.selected = true;
    selectDiv.appendChild(option);

    selectDiv.disabled = false;

     //Display alert message if room hasn't been added for a floor yet
     if(!buildingInfo.floors[floorNum-1].rooms) {
        alert("no room added");
        return;
    }
    
    //Dynamically add Room names to the dropsown
    buildingInfo.floors[floorNum-1].rooms.forEach( function (room) {
        var option = document.createElement('option');
        option.value = room.roomId;
        option.text = room.roomName;
        selectDiv.appendChild(option);
    });


    // if (floorplanInfo != null){
    //   // show non editable overlay with markers using saved coordinates
    // }
}



function onRoomSelected() {
    var selectRoom = document.getElementById('select_room');
    roomId = selectRoom.options[selectRoom.selectedIndex].value;
    console.log(roomId);
}