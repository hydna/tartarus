var ROOM_CHANNEL = script.env.ROOM_CHANNEL;
var NUMBER_OF_ROOMS = script.env.NUMBER_OF_ROOMS;

var resource = require("resource");
var connection = require("connection");
var signal = require("signal");



function onhandshake() {
  var message;
  var name;
  var cache;
  var skin;
  var slotid;
  var hexid;
  var length;

  name = script.env.TOKEN.split(":")[0];
  skin = script.env.TOKEN.split(":")[1];
  hexid = connection.getID().toString(16);

  length = ROOM_CHANNEL + NUMBER_OF_ROOMS;

  try {
    for (var channel = ROOM_CHANNEL; channel < length; channel++) {
      cache = resource.load("tartarus:room" + channel);
      if ((slotid = cache.alloc(hexid))) {
        message = ["user-connect", hexid, name, skin].join(":");
        signal.emitChannel(channel, message);
        connection.redirect(channel, hexid);
      }
    }
  } catch (err) {
    connection.deny("SERVER_IS_FULL");
  }


  return null;
}


function ondisconnect() {
  var cache;
  var slotid;
  var hexid;

  cache = resource.load("tartarus:room" + script.env.CHANNEL);

  hexid = connection.getID().toString(16);

  slotid = cache.find(hexid);
  cache.dealloc(slotid);

  message = ["user-disconnect", hexid].join(":");
  signal.emitChannel(script.env.CHANNEL, message);
  throw new Error(script.env.CHANNEL);
}


function getUserList() {
  var message;
  var cache;
  var ids;

  cache = resource.load("tartarus:room" + script.env.CHANNEL);

  message = [];

  ids = cache.findall();
  ids.forEach(function(id) {
    message.push(cache.find(id));
  });

  signal.reply("user-list:" + message.join(","));
}


if (script.argv[0] == "handshake") {
  onhandshake();
} else if (script.argv[0] == "disconnect") {
  ondisconnect();
} else if (script.argv[0] == "get_user_list") {
  getUserList();
} else {
  throw new Error("Bad API method '" + script.argv[0] +  "'");
}