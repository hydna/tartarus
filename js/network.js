(function(app) {

  // Module namespace
  var exports               = app.network = {};


  // Exported functions
  exports.join              = join;
  exports.init              = init;
  exports.update            = update;
  exports.say               = say;


  // Internal constants
  var HYDNA_URI             = app.constant.HYDNA_URI;
  var HANDSHAKE_CHANNEL     = app.constant.HANDSHAKE_CHANNEL;


  // Internal variables
  var connectionid          = null;
  var roomChannel           = null;
  var characters            = {};
  var framecount            = 0;


  function join (name, chartype, C) {
    initRoomChannel(name, chartype, C);
  }


  function init (name, skin) {
    initRoomChannel(name, skin);
  }


  function say (text) {
    var user = app.scene.getUser();
    var message;
    var user;

    if (user && connectionid) {

      message = {
        type: "say",
        id: connectionid,
        text: text
      };

      roomChannel.send(JSON.stringify(message));
    }
  }


  function update (dt) {
    var user = app.scene.getUser();
    var message;
    var user;

    if (user && connectionid && (framecount++) % 4 == 0) {

      message = {
        type: "state",
        id: connectionid,
        x: user.x,
        y: user.y,
        velx: user.velx,
        vely: user.vely,
        state: user.state
      };

      roomChannel.send(JSON.stringify(message), 2);
    }

  }


  function initRoomChannel(name, chartype, C) {
    var uri;

    uri = [ HYDNA_URI, "/", HANDSHAKE_CHANNEL, "?", name, ":", chartype ].join("");

    roomChannel = new HydnaChannel(uri, "rwe");

    roomChannel.onJoinCallback = C;

    roomChannel.onopen = function(event) {
      connectionid = event.message;
      roomChannel.emit("get_user_list");
    };


    roomChannel.onmessage = function(e) {
      var graph = getJSON(e.data);
      var character;

      if (!graph) return;

      if (graph.id != connectionid && (character = characters[graph.id])) {
        switch (graph.type) {

          case "state":
            character.state = graph.state;
            character.x = graph.x;
            character.y = graph.y;
            character.velx = graph.velx;
            character.vely = graph.vely;
            break;

          case "say":
            character.setText(graph.text);
            break;
        }
      }
    };


    roomChannel.onsignal = function(event) {
      var graph;

      try {
        graph = JSON.parse(event.message);
      } catch (err) {
        // Ignore any signal that is not of type JSON.
        return;
      }

      switch (graph.method) {
        case "user-connect":
          onuserconnect(graph.params);
          break;
        case "user-disconnect":
          onuserdisconnect(graph.params);
          break;
        case "user-list":
          onuserlist(graph.params);
          if (roomChannel.onJoinCallback) {
            roomChannel.onJoinCallback();
            roomChannel.onJoinCallback = null;
          }
          break;
      }
    };


    roomChannel.onerror = function(err) {
      if (roomChannel.onJoinCallback) {
        roomChannel.onJoinCallback(err.message);
        roomChannel.onJoinCallback = null;
      } else {
        alert(err.message);
      }
    };
  }



  function onuserconnect(params) {
    var bounds = app.ground.getBounds();
    var character;
    var x;

    if (params.id == connectionid) {
      // Ignore if targeting the current connect. The signals from server
      // can sometime be faster than the actual "handshake".
      return;
    }

    x = bounds.x2 / 2
    character = app.character.create(params.type, params.name, x, 0);
    characters[params.id] = character;

    app.scene.add(character);
  }


  function onuserdisconnect(params) {
    if (params.id in characters) {
      app.scene.remove(characters[params.id]);
      delete characters[params.id];
    }
  }


  function onuserlist(params) {
    var bounds = app.ground.getBounds();
    var character;
    var graph;
    var id;
    var x;

    if (!params || !params.length) {
      return;
    }

    for (var i = 0; i < params.length; i++) {
      graph = params[i];

      if (graph.id == connectionid) {
        // Ignore current user
        continue;
      }

      try {
        x = bounds.x2 / 2;
        character = app.character.create(graph.type, graph.name, x, 0);
        characters[graph.id] = character;
        app.scene.add(character);
      } catch (err) {
        // Ignore any wrongly formatted objects
        continue;
      }
    }
  }


  function getJSON(data) {
    try { return JSON.parse(data); } catch (err) { return null; }
  }

})(window.tartarus || (window.tartarus = {}));