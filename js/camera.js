(function(app) {

  // Module namespace
  var exports = app.camera = {};


  // Exported functions
  exports.panningCamera = panningCamera;
  exports.followCamera  = followCamera;
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


  function panningCamera() {
    var camera = new Camera();
    var x = -850;
    var y = -340;

    camera.left = 0;
    camera.top = -20;

    camera.update = function(dt) {
      this.move(0.02 * dt);
      this.top = -20;
    };

    return camera;
  }


  function followCamera(point) {
    var camera = new Camera();

    camera.update = function(dt) {
      this.center(point);
    };

    return camera;
  }


  function Camera() {
    var size = app.viewport.getSize();
    this.width = size.width;
    this.height = size.height;
    this.left = 0;
    this.top = 0;
    this.right = size.width;
    this.bottom = size.height;
    this.centerX = size.width / 2;
    this.centerY = size.height / 2;
  }


  Camera.prototype.translate = function(point) {
    return { x: point.x - this.left, y: point.y - this.top };
  };


  Camera.prototype.center = function(point) {
    this.left = point.x - (this.width / 2);
    this.top = point.y - (this.height / 2);
  };


  Camera.prototype.move = function(offX, offY) {
    this.setPos(offX && (this.centerX + offX) || null,
                offY && (this.centerY + offY) || null);
  };


  Camera.prototype.setPos = function(cx, cy) {
    if (cx) {
      this.left = (cx / 2);
      this.centerX = cx;
    }
    if (cy) {
      this.top = (cy / 2);
      this.centerY = cy;
    }
  };


  Camera.prototype.setSize = function(width, height) {
    this.width = width;
    this.height = height;
    this.right = width;
    this.bottom = height;
    this.centerX = width / 2;
    this.centerY = height / 2;
  };


  Camera.prototype.getBottom = function(point) {
    return this.height - (point.y - this.top);
  };


  Camera.prototype.intersects = function(bounds) {
    
  };


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
    // setPos(centerX, centerY);
    }


  function getPos() {
    return { x: left, y: top };
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
    left = point.x - (width / 2);
    top = point.y - (height / 2);
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
    return height - (point.y - top);
  }


  function translate(point) {
    return { x: point.x - left, y: point.y - top };
  }


})(window.tartarus || (window.tartarus = {}));