var map; 

$(document).ready(function(){
  var acc = document.getElementsByClassName("accordion");

  for (var i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (panel.style.maxHeight){
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      } 
    });
  }
  acc[1].disabled = true;
  acc[2].disabled = true;
  
  // $("#submitButton").click(uploadFloorplan);
});


function initMap() {
  var location = {lat: 13.030713, lng: 77.564665};
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 18,
    center: location,
    clickableIcons: false
  });
}

google.maps.event.addDomListener(window, 'load', initMap);