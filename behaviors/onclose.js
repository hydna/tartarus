
var hexid             = connection.id.toString(16);
var message           = null;

channel.rem("users", new RegExp("^" + hexid));
channel.decr("count");

message = {
  "method": "user-disconnect",
  "params": {
    "id": hexid
  }
};


channel.emit(JSON.stringify(message));