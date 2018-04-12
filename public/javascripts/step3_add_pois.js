$('#btn_picker').click(function() { addPois(); });

function addPois() {

    var picker = document.createElement('level_picker');
    picker.style['padding-right'] = '40px';
    picker.style['padding-top'] = '20px';
    picker.style['padding-bottom'] = '20px';

    var levelPickerControl = new LevelPickerControl(picker);
    picker.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(picker);
}

function LevelPickerControl(div) {
    numFloors = 3;
    var buttons = [];
    for(var i = 0; i < numFloors; i++){
        buttons.push(document.createElement("button"));
        buttons[i].setAttribute('id', (numFloors-i));
        // buttons[i].style['background-color'] = '#4CAF50';
        // buttons[i].style['color'] = '#FFFFFF';
        buttons[i].style.display = 'block';
        buttons[i].innerHTML = (numFloors-i);
        div.appendChild(buttons[i]);
        buttons[i].addEventListener('click', changeFloor);
    }
}

function changeFloor(event) {
    console.log(event);
    console.log("Floor clicked " + event.target.id);
}

