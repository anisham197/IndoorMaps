var selectedFile, floorNum, imageFilepath;

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

function overlayFloorplan(imageFileEvent) {
  clearFloorPlan();
  document.getElementById('floorplan_save_button').disabled = false;
  selectedFile = document.getElementById('image_file').files[0];
  //save image to server
  saveImage(function(result){
    console.log("image saved");
    console.log(result);
    imageFilepath = result.filepath;   
    // code to display map
    displayFloorplan(imageFilepath, coordinates);
    imageFileEvent.target.value = '';
  });

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
      callback(data);
    },
    error : function(error) {
      console.log(error);
      alert("Error! Try again later.");
    }
  });
}
  
function saveFloorplan() {
  console.log("Save Floorplan called");
  var data = {
    'imageFilepath': imageFilepath,
    'floorNum': floorNum,
    'coordinates': getFinalCoordinates()
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