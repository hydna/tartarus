(function(app) {


  // Exported functions
  app.run               = run;


  // Internal variables
  var time              = (new Date()).getTime();


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



  // Capture input, render stuff
  function sceneloop(dt) {
    var oldtime = time;
    var delta;

    time = (new Date()).getTime();

    delta = time - oldtime;

    if (!app.input.stateOf("ESC"))
      requestAnimationFrame(sceneloop);

    app.scene.update(delta);
    app.network.update(delta);

    app.camera.centerTo(app.character.getUser());

    app.scene.render();
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

    // Start the scene loop
    sceneloop();

    // Resize viewport when window is resizing
    window.addEventListener("resize", onresize, false);
  }


  function onresize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    app.viewport.setSize(width, height);
    // app.camera.setActuals(width, height);
  }




})(window.tartarus || (window.tartarus = {}));