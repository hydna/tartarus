(function(app) {

  // Module namespace
  var exports = app.scene = {};


  // Exported functions
  exports.init          = init;
  exports.start         = start;
  exports.add           = add;
  exports.remove        = remove;
  exports.render        = render;
  exports.update        = update;
  exports.getUser       = getUser;
  exports.setSize       = setSize;


  // Internal constants
  var JUMPING           = 1;
  var DUCKING           = 2;
  var TRAVEL_WEST       = 4;
  var TRAVEL_EAST       = 8;


  // Internal variables
  var entities          = null;
  var renderqueue       = null;
  var camera            = null;
  var user              = null;


  // Initializes the scene
  function init() {
    entities = [];
    app.ground.init();
    camera = app.camera.panningCamera();
  }


  function start(name, skin) {
    user = app.character.create(200, 100);
    user.name = name;
    add(user);
    camera = app.camera.followCamera(user);
  }


  function update(dt) {
    var state = app.input.stateOf;
    var entity;

    if (user) {
      user.state = 0;
      user.state |= state("LEFT") && TRAVEL_WEST || 0;
      user.state |= state("RIGHT") && TRAVEL_EAST || 0;
      user.state |= state("UP") && JUMPING || 0;
      user.state |= state("DOWN") && DUCKING || 0;
    }

    // app.character.update(dt);

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


  function getUser() {
    return user;
  }


  function setSize(width, height) {
    camera && camera.setSize(width, height);
  }

// var bg = new Image();
// bg.src = "images/background.png";

  function render(ctx) {
    var point;
    var object;


//  app.camera.centerTo(app.character.getUser());

    // try {
    //   ctx.drawImage(bg, 0, -370);
    // } catch (err) {
    //   console.log(err);
    // }

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


    // ctx.save();
    // ctx.translate(0, 0);
    // // ctx.scale(camera.getZoom(), camera.getZoom());
    // // ctx.translate(camera.getPos().x, camera.getPos().y);
    // for (var i = 0, l = renderqueue.length; i < l; i++) {
    //   object = renderqueue[i];
    //   if (object.renderBounds) {
    //     point = camera.translate(object);
    //     ctx.save();
    //     ctx.translate(point.x, point.y);
    //     object.renderBounds(ctx);
    //     ctx.restore();
    //   }
    // }
    // 
    // ctx.restore();

  }


  function add(entity) {
    entities.push(entity);
  }


  function remove(entity) {
    var index = entities.indexOf(entity);

    if (index !== -1) {
      entities.splice(index, 1);
    }
  }

})(window.tartarus || (window.tartarus = {}));