var coordinates = {sw : null, nw : null, ne : null};

var selectedFile, floorNum ,imageFilepath;
$("#image_file").change(overlayFloorplan);
$("#select_floor").change(onFloorSelected);
$("#floorplan_save_button").click(saveFloorplan);

function onFloorSelected() {
  clearFloorPlan();
  var selectFloor = document.getElementById('select_floor');
  floorNum = selectFloor.options[selectFloor.selectedIndex].value;
  if (floorplanInfo != null){
    // show non editable overlay with markers using saved coordinates
  }
  document.getElementById('image_file').disabled = false;
}

function overlayFloorplan(event) {
  clearFloorPlan();
  document.getElementById('floorplan_save_button').disabled = false;
  selectedFile = document.getElementById('image_file').files[0];
  //save image to server
  saveImage(function(){
    event.target.value = '';
  });
  // code to display map
  return;               
}
  
function saveImage(callback) {

  var data = new FormData();
  data.append('floorplanImage',selectedFile);
  data.append('floor', floorNum);

  jQuery.ajax({
    url: '/addfloorplan/uploadimages',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function(data){
      console.log("image saved");
      console.log(data);
      // code to display map
      imageFilepath = data.filepath;
      displayFloorplan(imageFilepath, coordinates);
      callback();
    },
    error : function(error) {
      console.log(error);
      alert("Error! Try again later.");
    }
  });
}
  
function saveFloorplan() {

  var data = {
    'imageFilepath': imageFilepath,
    'floorNum': floorNum,
    'coordinates': finalCoordinates
  };

  jQuery.ajax({
    url: '/addfloorplan/savefloorplan',
    data: {data: JSON.stringify(data)},
    cache: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function(data){
      console.log(data);
      alert("Floor plan updated");
      clearFloorPlan();
    },
    error : function(error) {
      console.log(error);
      alert("Error! Try again later.");
    }
  });
  accordion[1].disabled = false;
}