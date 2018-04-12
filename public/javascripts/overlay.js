var polygon;
var canvas;
var isPolygonDragged = false;
var finalCoordinates;

function displayFloorplan(imageFilepath, coordinates){

    console.log("displayFloorplan() function called");
    console.log("filepath " + imageFilepath);

    var image = new Image();
    // var canvas;
    image.src = imageFilepath;
    
    polygon =  new google.maps.Polygon({
        fillColor: 'white',
        strokeWeight: 1,
        strokeColor: "#BC1D0F",
        map: null,
        path: [],
        draggable: false,
        editable: true
    });
  
    polygon.addListener('dragstart', function(){
        // polygon was dragged
        isPolygonDragged = true;
    });
  
    polygon.addListener('dragend', function(){
        // Polygon was dragged
        isPolygonDragged = false;
    });

    google.maps.event.addListener(polygon, 'click', function () {
        polygon.setEditable(true);
    });
  
    google.maps.event.addListener(map, 'click', function () {
        polygon.setEditable(false);
    });

    var bearingY = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.sw.lat, coordinates.sw.lng));
    var bearingX = LatLon(coordinates.nw.lat, coordinates.nw.lng).bearingTo(LatLon(coordinates.ne.lat, coordinates.ne.lng));
    var distanceY = LatLon(coordinates.nw.lat, coordinates.nw.lng).distanceTo(LatLon(coordinates.sw.lat, coordinates.sw.lng));
    var distanceX = LatLon(coordinates.nw.lat, coordinates.nw.lng).distanceTo(LatLon(coordinates.ne.lat, coordinates.ne.lng));
    var se = LatLon(coordinates.ne.lat, coordinates.ne.lng).destinationPoint(bearingY, distanceY);
    var path = [coordinates.sw, coordinates.nw, coordinates.ne, {lat: se.lat, lng: se.lon}];

    finalCoordinates = {sw: coordinates.sw, nw: coordinates.nw, ne: coordinates.ne, se: {lat: se.lat, lng: se.lon}};
        
    var bounds = new google.maps.LatLngBounds(
        // Lower Bound
        new google.maps.LatLng(Math.min(se.lat, coordinates.sw.lat),
        // Left Bound
        Math.min(coordinates.sw.lng, coordinates.nw.lng)),
        // Upper Bound
        new google.maps.LatLng(Math.max(coordinates.ne.lat, coordinates.nw.lat),
        // Right Bound
        Math.max(se.lon, coordinates.ne.lng))
    );

    map.setCenter(bounds.getCenter());
 
    polygon.setOptions({path: path, map: map});

    polygon.getPaths().forEach(function(iPath, index){

        google.maps.event.addListener(iPath, 'insert_at', function(){
            // New point
            console.log("insert_at called");
            console.log("Length: "+this.length);
        });

        google.maps.event.addListener(iPath, 'remove_at', function(){
            // Point was removed
            console.log("remove_at called");
        });

        google.maps.event.addListener(iPath, 'set_at', function(){
            // Point was moved
            if(!isPolygonDragged){
                console.log("set_at called");
                console.log("Length: "+this.length);
 
                swLatLon = LatLon(this.getAt(0).lat(), this.getAt(0).lng());
                nwLatLon = LatLon(this.getAt(1).lat(), this.getAt(1).lng());
                neLatLon = LatLon(this.getAt(2).lat(), this.getAt(2).lng());

                var iBearingY = nwLatLon.bearingTo(swLatLon);
                var iBearingX = nwLatLon.bearingTo(neLatLon);
                var iDistanceY = nwLatLon.distanceTo(swLatLon);
                var iDistanceX = nwLatLon.distanceTo(neLatLon);
                var seLatLon = neLatLon.destinationPoint(iBearingY, iDistanceY);

                var iPath = {
                    sw: {lat: swLatLon.lat, lng: swLatLon.lon},
                    nw: {lat: nwLatLon.lat, lng: nwLatLon.lon},
                    ne: {lat: neLatLon.lat, lng: neLatLon.lon},
                    se: {lat: seLatLon.lat, lng: seLatLon.lon}
                };
                finalCoordinates = iPath;

                canvas.setMap(null);

                canvas = new FPOverlay( 
                    image, 
                    map,
                    {x: iBearingX, y: iBearingY},
                    {sw: iPath.sw, nw: iPath.nw, ne: iPath.ne, se: iPath.se}
                );
            }
        });
    });

    canvas = new FPOverlay( 
        image, 
        map,
        {x: bearingX, y: bearingY},
        {sw: path[0], nw: path[1], ne: path[2], se: path[3]}
    );
}