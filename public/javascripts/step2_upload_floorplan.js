$("#image_file").change(chooseImage);
$("#select_floor").change(getSelectedFloor);

function chooseImage() {
    var floorNum = getSelectedFloor();
    if(!floorNum){
      document.getElementById('floorplan_image_upload_btn').disabled = true;
      return;
    }
    var selectedFile = document.getElementById('image_file').files[0];
    if(!selectedFile){        
      document.getElementById('floorplan_image_upload_btn').disabled = true;
      return;
    }

    document.getElementById('floorplan_image_upload_btn').disabled = false;
    console.log(selectedFile.name);
    console.log(coordinates);

    //save image to server
    saveFloorplanImage(selectedFile);
  
    // code to display map
    // displayFloorplan(imageFilepath, coordinates);

  
    // // click on upload
    // google.maps.event.trigger(document.getElementById('floorplans'),'change') ;
    return;               
  
}


function getSelectedFloor() {
    var floorSelect = document.getElementById('select_floor');
    var floorNum = floorSelect.options[floorSelect.selectedIndex].value;
    console.log("floor selected " + floorNum);

    var selectedFile = document.getElementById('image_file').files[0];
    if(selectedFile != null){
      document.getElementById('floorplan_image_upload_btn').disabled = false;
    }

    return floorNum;
}
  
  function saveFloorplanImage(imageFile) {
    console.log(imageFile.name);
  
    var data = new FormData();
    data.append('floorplanImage',imageFile);
    data.append('floor',getSelectedFloor());
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
  
