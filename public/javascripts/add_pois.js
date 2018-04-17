var buildingInfo = null;

$("#select_floor_pois").change(onFloorSelected);

$(document).ready(function() {
    getBuildingInfo();
});

function onFloorSelected() {
    clearFloorPlan();
    var selectFloor = document.getElementById('select_floor_pois');
    floorNum = selectFloor.options[selectFloor.selectedIndex].value;
    // if (floorplanInfo != null){
    //   // show non editable overlay with markers using saved coordinates
    // }
    document.getElementById('image_file').disabled = false;
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