(function(app) {

  // Module namespace
  var exports = app.scene = {};


  // Exported functions
  exports.init          = init;
  exports.add           = add;
  exports.render        = render;
  exports.update        = update;


  // Internal constants
  var GRAVITY


  // Internal variables
  var entities          = null;
  var renderqueue       = null;

  // Creates a new viewport
  function init() {
    entities = [];
    app.ground.init();
    app.character.init();
  }


  function update(dt) {
    var entity;

    app.character.update(dt);

    renderqueue = [];

    for (var i = 0, l = entities.length; i < l; i++) {
      entity = entities[i];

      if ("update" in entity) {
        entity.update(dt);
      }

      renderqueue.push(entity);
    }
  }


  function render() {
    var ctx = app.viewport.getContext();
    var camera = app.camera;
    var point;
    var object;

    app.viewport.clear();

    ctx.save();
    // ctx.scale(camera.getZoom(), camera.getZoom());

    for (var i = 0, l = renderqueue.length; i < l; i++) {
      ctx.save();
      object = renderqueue[i];
      point = camera.translate(object);
      ctx.translate(point.x, point.y);
      object.render(ctx);
      ctx.restore();
    }

    ctx.restore();
  }


  function add(entity) {
    entities.push(entity);
  }


})(window.tartarus || (window.tartarus = {}));