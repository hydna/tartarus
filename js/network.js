(function(app) {

  // Module namespace
  var exports = app.network = {};


  // Exported functions
  exports.join          = join;
  exports.init          = init;
  exports.update        = update;


  // Internal constants
  var HANDSHAKE_CHANNEL = 2


  // Internal variables
  var connectionid      = null;
  var roomChannel       = null;
  var characters        = {};
  var framecount        = 0;


  function join(name, skin, C) {
    initRoomChannel(name, skin, C);
  }


  function init(name, skin) {
    initRoomChannel(name, skin);
  }

  function update(dt) {
    var user = app.scene.getUser();
    var message;
    var user;

    if (user && connectionid && (framecount++) % 4 == 0) {

      message = {
        id: connectionid,
        x: user.x,
        y: user.y,
        velx: user.velx,
        vely: user.vely,
        state: user.state
      };

      roomChannel.send(JSON.stringify(message));
    }

  }

  function initRoomChannel(name, skin, C) {
    roomChannel = new HydnaChannel("localhost:7010/2?" + name + ":" + skin, "rwe");

    roomChannel.onJoinCallback = C;

    roomChannel.onopen = function(event) {
      console.log("connected with %s %s", event.message, this.id);
      connectionid = event.message;
      roomChannel.emit("get_user_list");
    };


    roomChannel.onmessage = function(e) {
      var graph = getJSON(e.data);
      var character;

      if (!graph) return;

      if (graph.id == connectionid) {
        // console.log("ignoring my own message");
        return;
      } else {
        // console.log(graph.id, connectionid);
      }

      if ((character = characters[graph.id])) {
        character.state = graph.state;
        character.x = graph.x;
        character.y = graph.y;
        character.velx = graph.velx;
        character.vely = graph.vely;
      }
    };


    roomChannel.onsignal = function(event) {
      handleSignal.apply(null, event.message.split(":"));
    };

    roomChannel.onerror = function(err) {
      console.log("Error connecting to hydna");
      console.error(err.message);
      return C(err);
    };
  }


  function handleSignal(op, arg1, arg2, arg3) {
    console.log(arguments);
    switch (op) {
      case "user-connect":
        onuserconnect(arg1, arg2, arg3);
        break;
      case "user-disconnect":
        onuserdisconnect(arg1);
        break;
      case "user-list":
        onuserlist(arg1);
        if (roomChannel.onJoinCallback) {
          roomChannel.onJoinCallback();
          roomChannel.onJoinCallback = null;
        }
        break;
      default:
        console.error("unknown operator %s", op);
        break;
    }
  }


  function onuserconnect(id, name, skin) {
    var character;

    character = app.character.create(0, 0, skin);
    characters[id] = character;

    app.scene.add(character);
  }


  function onuserdisconnect(id) {
    if (id in characters) {
      app.scene.remove(characters[id]);
      delete characters[id];
    }
  }

  function onuserlist(data) {
    var ids = data.split(",");
    var character;
    var id;

    for (var i = 0; i < ids.length; i++) {
      id = ids[i];
      if (id == connectionid) continue;
      character = app.character.create(0, 0);
      characters[id] = character;
      app.scene.add(character);
    }

    console.log(characters);
  }


  function getJSON(data) {
    try { return JSON.parse(data); } catch (err) { return null; }
  }

})(window.tartarus || (window.tartarus = {}));