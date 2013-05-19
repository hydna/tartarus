
hydna.onopen = function(request, channel, connection, domain) {
  var token = request.token.split(":");
  var name = token[0];
  var type = token[1];
  var hexid = connection.id.toString(16);
  var message;

  channel.set('users:' + hexid, hexid + ":" + type + ":" + name);

  message = {
    "method": "user-connect",
    "params": {
      "id": hexid,
      "name": name,
      "type": type
    }
  };

  channel.emit(JSON.stringify(message));

  request.allow(hexid);
};


hydna.onemit = function(msg, channel, connection, domain) {
  switch (msg) {

    case 'get_user_list':
    channel.findall('users:*', function (users) {
      var message;
      var splitted;

      message = {
        'method': 'user-list',
        'params': []
      };

      for (var i = 0; i < users.length; i++) {
        splitted = users[i].split(":");

        message.params.push({
          "id": splitted[0],
          "type": parseInt(splitted[1], 10),
          "name": splitted[2]
        });

      }

      channel.emit(JSON.stringify(message));
    });
    break;
  }
};


hydna.onclose = function(channel, connection, domain) {
  var hexid = connection.id.toString(16);
  var message;

  message = {
    "method": "user-disconnect",
    "params": {
      "id": hexid
    }
  };

  channel.del('users:' + hexid);
  channel.emit(JSON.stringify(message));
};
