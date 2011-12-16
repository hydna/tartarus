(function(app) {

  // Module namespace
  var exports = app.viewport = {};


  // Exported functions
  exports.init          = init;
  exports.clear         = clear;
  exports.render        = render;
  exports.setSize       = setSize;
  exports.getSize       = getSize;
  exports.getContext    = getContext;


  // Module level constants
  var DIM_COLOR         = "#be3203";
  var CLEAR_COLOR       = "#d52900";


  // Module level variables
  var body              = null;
  var canvas            = null;
  var context           = null;
  var skybg             = null;
  var horizbg           = null;


  // Initializes the view-port.
  function init() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    body = document.getElementsByTagName("body")[0];
    canvas = document.createElement("canvas");

    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.bottom = "0px";
    canvas.style.right = "0px";

    context = canvas.getContext("2d");

    body.appendChild(canvas);

    setSize(width, height);

    // Resize viewport when window is resizing
    window.addEventListener("resize", onresize, false);
  }


  function render() {
    clear();
    app.scene.render(context);
  }


  function clear() {
    var width = canvas.width;
    var height = canvas.height;

    context.save();

    context.fillStyle = CLEAR_COLOR;
    context.fillRect(0, 0, width, height);

    context.fillStyle = skybg;
    context.fillRect(0, 0, width, height * 0.2);

    context.restore();
  }


  function setSize(width, height) {
    canvas.width = width;
    canvas.height = height;

    app.scene.setSize(width, height);

    skybg = context.createLinearGradient(0, 0, 0, height * 0.2);
    skybg.addColorStop(0, DIM_COLOR);
    skybg.addColorStop(0.8, CLEAR_COLOR);
  }


  function getSize() {
    return { width: canvas.width, height: canvas.height };
  }


  function onresize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    setSize(width, height);
  }



  function getContext() {
    return context;
  }

})(window.tartarus || (window.tartarus = {}));