var selectedFile, floorNum;
$("#image_file").change(overlayFloorplan);
$("#select_floor").change(overlayFloorplan);

function overlayFloorplan() {

  if(checkFields()) {
    console.log(selectedFile.name);
    console.log(coordinates);
    //save image to server
    saveFloorplanImage();
    // code to display map
  }

  // click on upload
  return;               
}


function checkFields() {
  var floorSelect = document.getElementById('select_floor');
  floorNum = floorSelect.options[floorSelect.selectedIndex].value;
  selectedFile = document.getElementById('image_file').files[0];

  if(floorNum == null || selectedFile == null){
    document.getElementById('floorplan_image_upload_btn').disabled = true;
    return false;
  }
  document.getElementById('floorplan_image_upload_btn').disabled = false;
  return true;    
}
  
function saveFloorplanImage() {
  console.log(selectedFile.name);

  var data = new FormData();
  data.append('floorplanImage',selectedFile);
  data.append('floor', floorNum);
  // append coordinates of polygon

  jQuery.ajax({
    url: '/addfloorplan/uploadimages',
    data: data,
    cache: false,
    contentType: false,
    processData: false,
    method: 'POST',
    type: 'POST', // For jQuery < 1.9
    success: function(data){
        console.log(data);
          // code to display map
        displayFloorplan(data.filepath, coordinates);
    },
    error : function(error) {
      console.log(error);
      alert("Error! Try again later.");
    }
  });
}
  
