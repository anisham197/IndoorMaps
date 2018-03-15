module.exports = class Room {

    constructor (roomId, buildingId, locationId, userId, name, label, floor) {
        this.roomId = roomId;
        this.buildingId = buildingId;
        this.locationId = locationId;
        this.userId = userId;
        this.name = name;
        this.label = label;
        this.floor = floor;
    }
}
  
