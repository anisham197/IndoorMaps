var selectedFile, floorNum ,imageFilepath;
$("#image_file").change(overlayFloorplan);
$("#select_floor").change(overlayFloorplan);
$("#floorplan_save_button").click(saveFloorplan);

function overlayFloorplan() {

  if(checkFields()) {
    console.log(selectedFile.name);
    console.log(coordinates);
    //save image to server
    saveImage();
    // code to display map
  }
  return;               
}


function checkFields() {
  var floorSelect = document.getElementById('select_floor');
  floorNum = floorSelect.options[floorSelect.selectedIndex].value;
  selectedFile = document.getElementById('image_file').files[0];

  if(floorNum == null || selectedFile == null){
    document.getElementById('floorplan_save_button').disabled = true;
    return false;
  }
  document.getElementById('floorplan_save_button').disabled = false;
  return true;    
}
  
function saveImage() {

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
  }

  jQuery.ajax({
    url: '/addfloorplan/savefloorplan',
    data: {data: JSON.stringify(data)},
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
}