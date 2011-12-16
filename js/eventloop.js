(function(app) {

  // Module namespace
  var exports = app.eventloop = {};


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



  function start() {
    running = true;
    eventloop();
  }


  function stop() {
    running = false;
  }

  // if (!app.input.stateOf("ESC"))

  // Capture input, render stuff
  function eventloop() {
    var oldtime = time;
    var delta;

    time = (new Date()).getTime();

    delta = time - oldtime;

    app.scene.update(delta);
    app.network.update(delta);

    app.viewport.render(delta);

    running && requestAnimationFrame(eventloop);
  }


  // Entry point for our application
  function run() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    app.viewport.init(width, height);

    app.scene.init();
    app.network.init("Johan", "mario");
    app.camera.init(width, height);

    // Move camera to the center of scene
    app.camera.move(-800, -540);

    app.input.init();

    // Start capture keyboard input
    app.input.startCapture();

  }



})(window.tartarus || (window.tartarus = {}));