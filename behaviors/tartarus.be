behavior('/players/', {

  open: function(event) {
    var token = request.token.split(":");
    var name = token[0];
    var type = token[1];
    var hexid = event.connection.id.toString(16);
    var message;

    event.channel.set('users:' + hexid, hexid + ":" + type + ":" + name);

    message = {
      "method": "user-connect",
      "params": {
        "id": hexid,
        "name": name,
        "type": type,
        "event.token": event.token

      }
    };

    event.channel.emit(JSON.stringify(message));

    event.allow(hexid);
  },

  emit: function(event) {
    switch (event.data) {

      case 'get_user_list':
      event.channel.findall('users:*', function (users) {
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

        event.channel.emit(JSON.stringify(message));
      });
      break;
    }
  },

  close: function(event) {
    var hexid = event.connection.id.toString(16);
    var message;

    message = {
      "method": "user-disconnect",
      "params": {
        "id": hexid
      }
    };

    event.channel.del('users:' + hexid);
    event.channel.emit(JSON.stringify(message));
  }

});