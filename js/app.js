(function(app) {


  // Exported functions
  app.run               = run;

  // Internal variables
  var time              = (new Date()).getTime();


  // Capture input, render stuff
  function sceneloop() {
    var oldtime = time;
    var delta;

    time = (new Date()).getTime();

    delta = time - oldtime;

    setTimeout(sceneloop, 1000 / 60);

    app.scene.update(delta);
    app.scene.render();
  }


  // Entry point for our application
  function run() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    app.viewport.init(width, height);

    app.scene.init();

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