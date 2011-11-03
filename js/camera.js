(function(app) {

  // Module namespace
  var exports = app.camera = {};


  // Exported functions
  exports.init          = init;
  exports.move          = move;
  exports.setPos        = setPos;
  exports.getPos        = getPos;
  exports.setLimits     = setLimits;
  exports.translate     = translate;
  exports.getBottom     = getBottom;
  exports.zoom          = zoom;
  exports.getZoom       = getZoom;
  exports.centerTo      = centerTo;


  // Internal variables
  var top               = 0;
  var left              = 0;
  var bottom            = 0;
  var right             = 0;
  var centerX           = 0;
  var centerY           = 0;
  var width             = 0;
  var height            = 0;
  var scale             = 1;


  // Creates a new viewport
  function init(w, h) {
    width = w;
    height = h;
    left = 0;
    top = 0;
    right = w;
    bottom = h;
    centerX = w / 2;
    centerY = h / 2
  }


  function move(offX, offY) {
    setPos(centerX + offX, centerY + offY);
  }


  function zoom(value) {
    if (scale + value < 0.3 || scale + value > 1.7) {
      return;
    }
    scale += value;
    setPos(centerX, centerY);
  }


  function getPos() {
    return { x: centerX, y: centerY };
  }


  function setPos(cx, cy) {
    var s = 1 + (1 - scale);
    // s = s * 6
    left = (cx / 2) * -s;
    top = (cy / 2) * -s;
    centerX = cx;
    centerY = cy;
    console.log(scale, (s), cx, cy, left, top);
  }

  function centerTo(point) {
    left = (-point.x / 2);
    top = (-point.y / 2);
    centerX = -point.x;
    centerY = -point.y;
  }

  function getZoom() {
    return scale;
  }


  function setZoom(z) {
    
  }


  function setLimits(w, h, z) {
    width = w;
    height = h;
    zooom = z;
  }


  function getBottom(point) {
    var s = (1 - scale);
    return height - point.y;
  }


  function translate(point) {
    return { x: left + point.x, y: top + point.y };
  }


})(window.tartarus || (window.tartarus = {}));