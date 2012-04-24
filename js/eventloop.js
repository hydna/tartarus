(function(app) {

  // Module namespace
  var exports           = app.eventloop = {};


  // Exported functions
  exports.start         = start;
  exports.stop          = stop;


  // Internal variables
  var time              = (new Date()).getTime();
  var running           = false;


  // Emulate requestAnimationFrame
  // Thanks http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  var requestAnimationFrame = window.requestAnimationFrame ||
    (function(){
       return  window.webkitRequestAnimationFrame ||
               window.mozRequestAnimationFrame    ||
               window.oRequestAnimationFrame      ||
               window.msRequestAnimationFrame     ||
               function(/* function */ callback, /* DOMElement */ element){
                 window.setTimeout(callback, 1000 / 60);
               };
     })();



  function start () {
    running = true;
    eventloop();
    renderloop();
  }


  function stop () {
    running = false;
  }

  // if (!app.input.stateOf("ESC"))

  // Capture input and update the world
  function eventloop() {
    var oldtime = time;
    var delta;

    time = (new Date()).getTime();

    delta = time - oldtime;

    app.scene.update(delta);
    app.network.update(delta);

    running && setTimeout(eventloop, 30);
  }

  // render stuff
  function renderloop () {
    app.viewport.render();
    running && requestAnimationFrame(renderloop);
  }


})(window.tartarus || (window.tartarus = {}));