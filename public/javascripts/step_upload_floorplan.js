var selectedFile, floorNum, imageFilepath;

$("#select_floor_image").change(onFloorSelected);
$("#image_file").click(displayExistingFloorplanAlert);
$("#image_file").change(overlayFloorplan);
$("#floorplan_save_button").click(saveFloorplan);


function onFloorSelected() {
	clearFloorPlan();	
	var selectFloor = document.getElementById('select_floor_image');
	floorNum = selectFloor.options[selectFloor.selectedIndex].value;
	if (floorplanInfo != null && floorplanInfo[floorNum] != null){
		console.log(floorplanInfo[floorNum]);
		showFloorplanWithMarkersForLevel(floorNum);
	}
	document.getElementById('image_file').disabled = false;
}


function displayExistingFloorplanAlert() {
	if (floorplanInfo != null && floorplanInfo[floorNum] != null){
		console.log(floorplanInfo[floorNum]);
		alert("Warning: Uploading a new floorplan will cause all existing floorplan " +
		"data related to the this level to be deleted.");	
	}
}


function overlayFloorplan(imageFileEvent) {
	clearFloorPlan();

	// if (floorplanInfo != null && floorplanInfo[floorNum] != null){
	// 	//TODO: Delete exisiting POI data, image and coordinates data gets overwritten
	// }

	document.getElementById('floorplan_save_button').disabled = false;
	selectedFile = document.getElementById('image_file').files[0];
	console.log("Selected File Name");
	console.log(selectedFile.name);
	//save image to server
	saveImage(function(result){
		console.log("image saved");
		console.log(result);
		imageFilepath = result.filepath;   
		// code to display map
		editFloorplan(imageFilepath, coordinates);
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