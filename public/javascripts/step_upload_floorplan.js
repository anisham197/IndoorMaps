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


function displayExistingFloorplanAlert(event) {
	// allow reslecting same image and still trigger a re-render
	$(this).val(null);

	if (floorplanInfo != null && floorplanInfo[floorNum] != null){
		console.log(floorplanInfo[floorNum]);
		alert("Warning: Uploading a new floorplan will cause all existing floorplan " +
		"data related to the this level to be deleted.");	
	}
}


function overlayFloorplan(imageFileEvent) {
	clearFloorPlan();
	document.getElementById('select_floor_image').disabled = true;

	// if (floorplanInfo != null && floorplanInfo[floorNum] != null){
	// 	//TODO: Delete exisiting POI data, image and coordinates data gets overwritten
	// }

	document.getElementById('floorplan_save_button').disabled = false;
	selectedFile = document.getElementById('image_file').files[0];
	console.log("Selected File Name");
	console.log(selectedFile.name);
	//save image to server
	editFloorplan(selectedFile,coordinates);

	// TODO uncomment
	// saveImage(function(result){
	// 	console.log("image saved");
	// 	console.log(result);
	// 	imageFilepath = result.filepath;   
	// 	// code to display map
	// 	editFloorplan(imageFilepath, coordinates);
	// 	imageFileEvent.target.value = '';
	// });
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
		success: function(res){
			callback(res);
		},
		error : function(error) {
			console.log(error);
			alert("Error! Try again later.");
		}
	});
}
  

function saveFloorplan() {
	if(!$("#image_file").val()){
		alert("Choose an image first");
		return;
	}
	document.getElementById('loader').style.display = "block";
	console.log("Save Floorplan called");
	console.log("Step1: save image to Google Cloud Storage");
	saveImage(function(result){
		console.log("Step 1 completed!");
		console.log("image saved");
		console.log("Step2: save coordinated and floorplan path to Firebase");
		console.log(result);
		imageFilepath = result.filepath;   
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
				console.log("Step 2 completed!");
				console.log(data);
				alert("Floor plan updated");
				//clearFloorPlan();
				setPolygonEditable(false);
				$("#image_file").val(null);
				document.getElementById('select_floor_image').disabled = false;
				document.getElementById('loader').style.display = "none";
			},
			error : function(error) {
				console.log(error);
				alert("Error! Try again later.");
				document.getElementById('select_floor_image').disabled = false;
				document.getElementById('loader').style.display = "none";
			}
		});

		accordion[1].disabled = false;
	});
}