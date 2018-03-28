module.exports = class Location {

    constructor (locationId, encryptId, userId, name, city, buildings) {
        this.locationId = locationId;
        this.encryptId = encryptId;
        this.userId = userId;
        this.name = name;
        this.city = city;
        this.buildings = buildings;
    }
}
  
