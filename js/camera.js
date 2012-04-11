(function(app) {

  // Module namespace
  var exports = app.camera = {};


  // Exported functions
  exports.panningCamera = panningCamera;
  exports.followCamera  = followCamera;


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
    var amp = 0.02;
    var x = -850;
    var y = -340;

    camera.left = 0;
    camera.top = -40;

    camera.update = function(dt) {
      if (this.left >= 900) {
        amp = -0.02;
      } else if (this.left < 0) {
        amp = 0.02;
      }
      this.move(amp * dt);
      this.top = camera.height - (camera.height * 1.3);
    };

    return camera;
  }


  function followCamera(point) {
    var camera = new Camera();

    camera.update = function(dt) {
      this.left = point.x - (this.width / 2);
      this.top = point.y - ((this.height / 2) + (this.height * 0.2));
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


  Camera.prototype.intersects = function(bounds) { };

})(window.tartarus || (window.tartarus = {}));