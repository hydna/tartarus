
var ROOM_CHANNEL      = script.env.ROOM_CHANNEL;
var NUMBER_OF_ROOMS   = script.env.NUMBER_OF_ROOMS;
var MAX_USERS         = script.env.MAX_USERS;

var token             = script.env.TOKEN.split(":");
var name              = token[0];
var type              = token[1];
var hexid             = connection.id.toString(16);
var length            = ROOM_CHANNEL + NUMBER_OF_ROOMS;
var message;
var room;

for (var id = ROOM_CHANNEL; id < length; id++) {
  room = domain.getChannel(id);
  if (room.incr("count", MAX_USERS)) {
    room.push("users", hexid + ":" + type + ":" + name);
    message = {
      "method": "user-connect",
      "params": {
        "id": hexid,
        "name": name,
        "type": type
      }
    };
    room.emit(JSON.stringify(message));
    exit(room.id, hexid);
  }
}

exit(0, "SERVER_IS_FULL");