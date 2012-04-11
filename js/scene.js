(function(app) {

  // Module namespace
  var exports               = app.scene = {};


  // Exported functions
  exports.init              = init;
  exports.start             = start;
  exports.add               = add;
  exports.remove            = remove;
  exports.render            = render;
  exports.update            = update;
  exports.getUser           = getUser;
  exports.setSize           = setSize;


  // Internal constants
  var JUMPING               = app.constant.JUMPING;
  var DUCKING               = app.constant.DUCKING;
  var TRAVEL_WEST           = app.constant.TRAVEL_WEST;
  var TRAVEL_EAST           = app.constant.TRAVEL_EAST;


  // Internal variables
  var textbox               = null;
  var entities              = null;
  var renderqueue           = null;
  var camera                = null;
  var user                  = null;
  var planet                = null;
  var clouds                = null;
  var stars                 = null;


  // Initializes the scene by creating a panning
  // camera that scrolls to the right.
  function init () {
    var body;

    body = document.getElementsByTagName("body")[0];
    textbox = document.createElement("input");

    planet = new Image();
    planet.src = "images/planet.png";

    clouds = new Image();
    clouds.src = "images/clouds.png";

    stars = new Image();
    stars.src = "images/stars.png";

    textbox.className = "speech hide";

    function onkeydown (event) {
      var value;

      switch (event.keyCode) {

        case 13:

          // Strip the value of the textbox if 30 characters
          // has been reached.
          if ((value = textbox.value) && value.length > 30) {
            value = value.substr(0, 30);
          }

          // Set text of current user.
          user.setText(value);

          // Broadcast to all other users that 
          // out text has changed.
          app.network.say(value);

          textbox.value = "";
          speakerBoxVisible(false);
          event.stopPropagation();
          event.preventDefault();
          break;

        case 27:
          textbox.value = "";
          speakerBoxVisible(false);
          event.stopPropagation();
          event.preventDefault();
          break;
      }
    }

    textbox.addEventListener("keydown", onkeydown, false);

    body.appendChild(textbox);

    entities = [];
    app.ground.init();
    camera = app.camera.panningCamera();
  }


  function start (type, name) {
    console.log("start %s %s", type, name);

    // Start capturing of keyboard input
    app.input.startCapture();

    user = app.character.create(type, name, 200, 100);

    user.ondeath = function () {
      setTimeout(function () {
        user.spawn(200, 100);
      }, 1200);
    };

    add(user);

    camera = app.camera.followCamera(user);
  }


  function update (dt) {
    var state = app.input.stateOf;
    var entity;

    if (state("ENTER")) {
      speakerBoxVisible(true);
      return;
    }

    if (user) {
      user.state = 0;
      user.state |= state("LEFT") && TRAVEL_WEST || 0;
      user.state |= state("RIGHT") && TRAVEL_EAST || 0;
      user.state |= state("UP") && JUMPING || 0;
      user.state |= state("DOWN") && DUCKING || 0;
    }


    renderqueue = [];

    for (var i = 0, l = entities.length; i < l; i++) {
      entity = entities[i];

      if ("update" in entity) {
        entity.update(dt);
      }

      renderqueue.push(entity);
    }

    camera && camera.update(dt);
  }


  function getUser () {
    return user;
  }


  function setSize (width, height) {
    camera && camera.setSize(width, height);
  }


  function render (ctx) {
    var point;
    var object;

    try {
      ctx.drawImage(stars, 40, 40);
      ctx.drawImage(planet, camera.right - planet.width, 0);
      ctx.drawImage(clouds, 200, 400);
    } catch (err) {
      console.log(err);
    }

    ctx.save();
    ctx.translate(0, 0);

    app.ground.render(ctx, camera);

    for (var i = 0, l = renderqueue.length; i < l; i++) {
      object = renderqueue[i];
      point = camera.translate(object);
      ctx.save();
      ctx.translate(point.x, point.y);
      object.render(ctx);
      ctx.restore();
    }

    ctx.restore();
  }


  function speakerBoxVisible (state) {
    if (state) {

      // First, stop capturing all keyobard inputs. We want to give
      // them to the textbox instead.

      app.input.stopCapture();

      setTimeout(function () {
        textbox.className = "speech";
        textbox.focus();
      }, 12);

    } else {

      setTimeout(function () {
        app.input.startCapture();
        textbox.className = "speech hide";
        textbox.blur();
      }, 0);
    }
  }


  function add (entity) {
    entities.push(entity);
  }


  function remove (entity) {
    var index = entities.indexOf(entity);

    if (index !== -1) {
      entities.splice(index, 1);
    }
  }

})(window.tartarus || (window.tartarus = {}));