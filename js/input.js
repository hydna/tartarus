(function(app) {

  // Module namespace
  var exports = app.input = {};


  // Exported functions
  exports.init          = init;
  exports.startCapture  = startCapture;
  exports.stopCapture   = stopCapture;
  exports.stateOf       = stateOf;


  // Module level variables
  var states            = null;


  // Internal variables
  var KEY_MAP           = { ESC:    27,
                            LEFT:   37,
                            UP:     38,
                            RIGHT:  39,
                            DOWN:   40
                          };

  var KEY_MAP_REV       = { "27":   "ESC",
                            "37":   "LEFT",
                            "38":   "UP",
                            "39":   "RIGHT",
                            "40":   "DOWN"
                          };


  // Initializes the input module.
  function init() {
    states = {};
    for (var k in KEY_MAP) states[k] = 0;
  }


  function startCapture() {
    window.addEventListener("keyup", onkeyup, false);
    window.addEventListener("keydown", onkeydown, false);
  }


  function stopCapture() {
    window.removeEventListener("keyup", onkeyup, false);
    window.removeEventListener("keydown", onkeydown, false);
  }


  function stateOf(name) {
    return !(!states[name]);
  }


  function onkeyup(event) {
    var code = event.keyCode;
    states[KEY_MAP_REV[code]] = 0;
  }


  function onkeydown(event) {
    var code = event.keyCode;
    states[KEY_MAP_REV[code]] = 1;
  }


})(window.tartarus || (window.tartarus = {}));