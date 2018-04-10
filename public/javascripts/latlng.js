
/** Extend Number object with method to convert numeric degrees to radians */
if (typeof Number.prototype.toRadians == 'undefined') {
    Number.prototype.toRadians = function() { return this * Math.PI / 180; };
  }
  
  
/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (typeof Number.prototype.toDegrees == 'undefined') {
  Number.prototype.toDegrees = function() { return this * 180 / Math.PI; };
}

/**
 * Creates a LatLon point on the earth's surface at the specified latitude / longitude.
 *
 * @classdesc Tools for geodetic calculations
 *
 * @constructor
 * @param {number} lat - Latitude in degrees.
 * @param {number} lon - Longitude in degrees.
 * @param {number} [height=0] - Height above mean-sea-level in kilometres.
 * @param {number} [radius=6371] - (Mean) radius of earth in kilometres.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119);
 */
function LatLon(lat, lon, height, radius) {
  // allow instantiation without 'new'
  if (!(this instanceof LatLon)) return new LatLon(lat, lon, height, radius);

  if (typeof height == 'undefined') height = 0;
  if (typeof radius == 'undefined') radius = 6371;
  radius = Math.min(Math.max(radius, 6353), 6384);

  this.lat    = Number(lat);
  this.lon    = Number(lon);
  this.height = Number(height);
  this.radius = Number(radius);
}


/**
 * Returns the distance from 'this' point to destination point (using haversine formula).
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Distance between this point and destination point, in km (on sphere of 'this' radius).
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var d = p1.distanceTo(p2); // d.toPrecision(4): 404.3
 */
LatLon.prototype.distanceTo = function(point) {
  var R = this.radius;
  var theta1 = this.lat.toRadians(),  lambda1 = this.lon.toRadians();
  var theta2 = point.lat.toRadians(), lambda2 = point.lon.toRadians();
  var deltatheta = theta2 - theta1;
  var deltalambda = lambda2 - lambda1;

  var a = Math.sin(deltatheta/2) * Math.sin(deltatheta/2) +
          Math.cos(theta1) * Math.cos(theta2) *
          Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;

  return d;
};


/**
 * Returns the (initial) bearing from 'this' point to destination point.
 *
 * @param   {LatLon} point - Latitude/longitude of destination point.
 * @returns {number} Initial bearing in degrees from north.
 *
 * @example
 *     var p1 = new LatLon(52.205, 0.119), p2 = new LatLon(48.857, 2.351);
 *     var b1 = p1.bearingTo(p2); // b1.toFixed(1): 156.2
 */
LatLon.prototype.bearingTo = function(point) {
  var theta1 = this.lat.toRadians(), theta2 = point.lat.toRadians();
  var deltalambda = (point.lon-this.lon).toRadians();

  // see http://mathforum.org/library/drmath/view/55417.html
  var y = Math.sin(deltalambda) * Math.cos(theta2);
  var x = Math.cos(theta1)*Math.sin(theta2) -
          Math.sin(theta1)*Math.cos(theta2)*Math.cos(deltalambda);
  var rad = Math.atan2(y, x);

  return (rad.toDegrees()+360) % 360;
};


/**
 * Returns the destination point from 'this' point having travelled the given distance on the
 * given initial bearing (bearing normally varies around path followed).
 *
 * @param   {number} brng - Initial bearing in degrees.
 * @param   {number} dist - Distance in km (on sphere of 'this' radius).
 * @returns {LatLon} Destination point.
 *
 * @example
 *     var p1 = new LatLon(51.4778, -0.0015);
 *     var p2 = p1.destinationPoint(300.7, 7.794); // p2.toString(): 51.5135°N, 000.0983°W
 */
LatLon.prototype.destinationPoint = function(brng, dist) {
  // see http://williams.best.vwh.net/avform.htm#LL

  var rad = Number(brng).toRadians();
  var delta = Number(dist) / this.radius; // angular distance in radians

  var theta1 = this.lat.toRadians();
  var lambda1 = this.lon.toRadians();

  var theta2 = Math.asin( Math.sin(theta1)*Math.cos(delta) +
                      Math.cos(theta1)*Math.sin(delta)*Math.cos(rad) );
  var lambda2 = lambda1 + Math.atan2(Math.sin(rad)*Math.sin(delta)*Math.cos(theta1),
                            Math.cos(delta)-Math.sin(theta1)*Math.sin(theta2));
  lambda2 = (lambda2+3*Math.PI) % (2*Math.PI) - Math.PI; // normalise to -180..+180°

  return new LatLon(theta2.toDegrees(), lambda2.toDegrees());
};
  
  