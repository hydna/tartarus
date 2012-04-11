(function(app) {

  // Module namespace
  var exports               = app.input = {};


  // Exported functions
  exports.startCapture      = startCapture;
  exports.stopCapture       = stopCapture;
  exports.stateOf           = stateOf;


  // Internal constants
  var KEY_MAP               = app.constant.KEY_MAP;
  var KEY_MAP_REV           = app.constant.KEY_MAP_REV;


  // Internal variables
  var states                = {};


  function startCapture () {
    for (var k in KEY_MAP) states[k] = 0;
    window.addEventListener("keyup", onkeyup, false);
    window.addEventListener("keydown", onkeydown, false);
  }


  function stopCapture () {
    states = {};
    window.removeEventListener("keyup", onkeyup, false);
    window.removeEventListener("keydown", onkeydown, false);
  }


  function stateOf (name) {
    return !(!states[name]);
  }


  function onkeyup (event) {
    var code = event.keyCode;
    var key = KEY_MAP_REV[code];

    if (key in states) {
      states[key] = 0;
      event.stopPropagation();
      event.preventDefault();
    }
  }


  function onkeydown (event) {
    var code = event.keyCode;
    var key = KEY_MAP_REV[code];

    if (key in states) {
      states[key] = 1;
      event.stopPropagation();
      event.preventDefault();
    }
  }


})(window.tartarus || (window.tartarus = {}));