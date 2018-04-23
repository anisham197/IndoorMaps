FPOverlay.prototype = new google.maps.OverlayView();
function FPOverlay(image, map, bearings, vertices) {
  console.log("FPOverlay called");

  this.image    = image;
  this.bearings = bearings;
  this.vertices = vertices;
  this.map      = map;
  this.div      = null;
  this.setMap(map);
  console.log(this);
}

FPOverlay.prototype.onAdd = function() {
  this.div = document.createElement('div');
  this.div.style.cssText='border:0px none;position:absolute';
  this.getPanes().overlayLayer.appendChild(this.div);
};

FPOverlay.prototype.draw = function() {
  var prj = this.getProjection();
  var points = {sw:null, nw:null, ne:null, se:null};
  for(var k in points) {
    points[k]= prj.fromLatLngToDivPixel(new google.maps.LatLng(
                                          this.vertices[k].lat,
                                          this.vertices[k].lng));
  }

  if(this.div.childNodes.length){
    this.div.replaceChild(document.createElement('canvas'),this.div.firstChild);
  }
  else{
    this.div.appendChild(document.createElement('canvas'));
  }

  var canvas_style  = {
    width : (Math.max(points.ne.x,points.se.x) - Math.min(points.nw.x,points.sw.x)),
    height: (Math.max(points.se.y,points.sw.y) - Math.min(points.nw.y,points.ne.y)),
    top   : Math.min(points.nw.y,points.ne.y),
    left  : Math.min(points.sw.x,points.nw.x)
  };
  var canvas = this.div.firstChild;
  var img = this.image;
  var context;
    
  for(var k in canvas_style){
    this.div.style[k] = canvas_style[k]+'px';  
  }

  var img_width = (img.naturalWidth*LatLon(this.vertices.nw.lat,this.vertices.nw.lng)
                      .distanceTo(LatLon(this.vertices.ne.lat,this.vertices.ne.lng))
                  ); 
  canvas.width = canvas_style.width;
  canvas.height = canvas_style.height;

  context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas_style.width, canvas_style.height);
  context.setTransform(1, Math.tan( -(90-this.bearings.x)*Math.PI/180 ), 
    Math.tan( (180-this.bearings.y)*Math.PI/180 ), 1, 
    ((Math.max(points.sw.x,points.nw.x)===points.sw.x) ? 0 : points.nw.x-canvas_style.left), 
    points.nw.y-canvas_style.top);
  context.drawImage(img, 0, 0, points.ne.x-points.nw.x, points.sw.y-points.nw.y);      
};

FPOverlay.prototype.onRemove = function() {
  console.log("onRemove called");
  if(this.div){
    this.div.parentNode.removeChild(this.div);
    this.div = null;
  }
};