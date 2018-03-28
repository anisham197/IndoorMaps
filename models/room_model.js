module.exports = class Room {

    constructor (roomId, buildingId, name, label, floor) {
        this.roomId = roomId;
        this.buildingId = buildingId;
        this.name = name;
        this.label = label;
        this.floor = floor;
    }
}
  
