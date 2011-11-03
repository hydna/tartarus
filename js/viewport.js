(function(app) {

  // Module namespace
  var exports = app.viewport = {};


  // Exported functions
  exports.init          = init;
  exports.clear         = clear;
  exports.setSize       = setSize;
  exports.getContext    = getContext;


  // Module level variables
  var body              = null;
  var canvas            = null;
  var context           = null;


  // Creates a new viewport
  function init(width, height) {

    body = document.getElementsByTagName("body")[0];
    canvas = document.createElement("canvas");

    canvas.style.top = "0px";
    canvas.style.left = "0px";
    canvas.style.bottom = "0px";
    canvas.style.right = "0px";

    context = canvas.getContext("2d");

    body.appendChild(canvas);

    setSize(width, height);
  }


  function clear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  }


  function setSize(width, height) {
    canvas.width = width;
    canvas.height = height;
  }


  function getContext() {
    return context;
  }

})(window.tartarus || (window.tartarus = {}));