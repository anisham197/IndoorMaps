module.exports = class Building {

    constructor (buildingId, encryptId, locationId, name, numFloors, numRooms, buildingCoordinates) {
        this.buildingId = buildingId;
        this.encryptId = encryptId;
        this.locationId = locationId;
        this.name = name;
        this.numFloors = numFloors;
        this.numRooms = numRooms;
        this.buildingCoordinates = buildingCoordinates;
    }
}
  
