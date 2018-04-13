$('#btn_picker').click(function() { addPois(); });
var floorplanInfo = null;
var buildingInfo = null;
var buttons = [];

function addPois() {    
    console.log("Number of Floors: " + numFloors);
    console.log("Building Encrypted Id: " + buildingEncryptId);

    getFloorplanInfo();
    getBuildingInfo();

    displayLevelPicker();
}


function getFloorplanInfo() {
    jQuery.ajax({
        url: '/addfloorplan/getFloorplanInfo?id=' + buildingEncryptId,
        cache: false,
        method: 'GET',
        type: 'GET', // For jQuery < 1.9
        success: function(data){
          floorplanInfo = data.floorplans;
          console.log(floorplanInfo);
          level = 1;
          displayLevel(level);
        },
        error : function(error) {
          console.log(error);
        }
    });
}


function getBuildingInfo() {
    jQuery.ajax({
        url: '/addfloorplan/getBuildingInfo?id=' + buildingEncryptId,
        cache: false,
        method: 'GET',
        type: 'GET', // For jQuery < 1.9
        success: function(data){
          buildingInfo = data.buildingInfo;
          console.log(buildingInfo);
        },
        error : function(error) {
          console.log(error);
        }
    });
}

function displayLevelPicker() {
    var picker = document.createElement('level_picker');
    picker.style['padding-right'] = '40px';
    picker.style['padding-top'] = '20px';
    picker.style['padding-bottom'] = '20px';

    var levelPickerControl = new LevelPickerControl(picker);
    picker.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(picker);
}


function LevelPickerControl(div) {
    buttons.push(0);
    for(var i = 1; i <= numFloors; i++){
        buttons.push(document.createElement("button"));
        buttons[i].setAttribute('id', i);
        // buttons[i].style['background-color'] = '#4CAF50';
        // buttons[i].style['color'] = '#FFFFFF';
        buttons[i].style.display = 'block';
        buttons[i].innerHTML = i;        
        buttons[i].addEventListener('click', changeFloor);
    }

    for(var i = numFloors; i >= 1; i--){
        div.appendChild(buttons[i]);
    }
}

function changeFloor(event) {
    console.log("Floor clicked " + event.target.id);
    var level = event.target.id;
    displayLevel(level);
}


function displayLevel(level) { 
    pickerSelectUI(level);   
    if(floorplanInfo != null ){
        if(floorplanInfo[level] != null ){
            clearFloorPlan();
            var image = new Image();
            image.src = floorplanInfo[level].imageFilepath;
            var coordinates = {
                sw: floorplanInfo[level].sw ,
                se: floorplanInfo[level].se ,
                nw: floorplanInfo[level].nw ,
                ne: floorplanInfo[level].ne
            };
            var bearingY = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.sw.lat, coordinates.sw.lng));
            var bearingX = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.ne.lat, coordinates.ne.lng));
            canvas = new FPOverlay( 
                image, 
                map,
                {x: bearingX, y: bearingY},
                {sw: coordinates.sw, nw: coordinates.nw, ne: coordinates.ne, se: coordinates.se}
            );          
        }
        else {
            clearFloorPlan();
            console.log("No floorplan available for level " + level);
        }
    }
    else {
        console.log("No floorplans available");
    }
}

function pickerSelectUI(level){
    for(var i = 1; i <= numFloors; i++) {
        if( i == level){
            buttons[i].style['background-color'] = '#4CAF50';
        }
        else {
            buttons[i].style['background-color'] = "buttonface";
        }
    }   
}

