(function(app) {

  // Module namespace
  var exports = app.ground = {};


  // Exported functions
  exports.init          = init;


  // Internal constants
  var ANCHORS           = [ [0,   0],
                            [100, 10],
                            [50,  15],
                            [100, 0],
                            [75,  0],
                            [20,  -20],
                            [150, 10],
                            [100, 5],
                            [75,  10],
                            [75,  -10],
                            [120,  -20],
                            [150, 10],
                            [100, 20],
                            [200, 20],
                            [100, -5],
                            [75,  -15],
                          ];


  function init() {
    var ground = new Ground(0, 400);

    for (var i = 0; i < ANCHORS.length; i++) {
      ground.appendAnchor(ANCHORS[i][0], ANCHORS[i][1]);
    }

    app.scene.add(ground);
  }


  function Ground(x, y) {
    this.x = x;
    this.y = y;
    this.anchors = [];
    this.last = null;
  }


  Ground.prototype.appendAnchor = function(offsetX, offsetY) {
    var anchor;
    var x;
    var y;

    x = (this.last ? this.last.x : 0) + offsetX;
    y = (this.last ? this.last.y : 0) + offsetY;

    anchor = new Anchor(x, y);
    this.anchors.push(anchor);

    this.last = anchor;
  };


  Ground.prototype.addAnchor = function(a) {
    this.anchors.push(a);
  };


  Ground.prototype.render = function(ctx) {
    var camera = app.camera;
    var anchors = this.anchors;
    var anchor;
    var first;
    var last;

    ctx.save();
    ctx.fillStyle = "black";
    ctx.beginPath();

    for (var i = 0, l = anchors.length; i < l; i++) {
      anchor = anchors[i];
      anchor.render(ctx);
    }

    first = anchors[0];
    last = anchors[anchors.length - 1];

    ctx.lineTo(last.x, camera.getBottom(last));
    ctx.lineTo(0, camera.getBottom(last));
    ctx.lineTo(0, first.y);

    ctx.closePath();
    ctx.fill();
    ctx.restore();
  };


  function Anchor(x, y) {
    this.x = x;
    this.y = y;
    this.bounds = {}
  }


  Anchor.prototype.render = function(ctx) {
    ctx.lineTo(this.x, this.y);
    // ctx.quadraticCurveTo(this.x, this.y, this.cpx, this.cpy);
  };

})(window.tartarus || (window.tartarus = {}));