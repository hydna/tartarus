(function(app) {

  // Module namespace
  var exports = app.ground = {};


  // Exported functions
  exports.init          = init;
  exports.render        = render;
  exports.intersection  = intersection;


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
                            [100, 20],
                            [75,  25],
                            [175,  25],
                            [50,  15],
                            [100, 0],
                            [75,  0],
                            [20,  -20],
                            [150, 10],
                            [100, 5],
                            [150, 10],
                            [100, 20],
                            [200, 20],
                            [100, -5]
                          ];

  // Internal variables
  var pos               = { x: 0, y: 250 };
  var bounds            = { x: pos.x, y: pos.y, x2: 0, y2: 0};
  var anchors           = [];
  var last              = null;


  function init() {
    for (var i = 0; i < ANCHORS.length; i++) {
      appendAnchor(ANCHORS[i][0], ANCHORS[i][1]);
    }
  }

  function intersection(p) {
    var boundsy;
    var anchor;
    var abounds;
    var w;

    // Only check for intersection if point is inside
    // bounding box of the ground.
    if (p.x >= bounds.x && p.y >= bounds.y &&
        p.x <= bounds.x2) {

      for (var i = 0, l = anchors.length; i < l; i++) {
        anchor = anchors[i];
        abounds = anchor.getBounds(pos.x, pos.y);
        boundsy = Math.min(abounds.y, abounds.y2);

        if (p.x >= abounds.x && p.y >= boundsy && p.x <= abounds.x2) {

          w = (p.x - abounds.x) / (abounds.x2 - abounds.x);
          anchor.r = 1;
          return { x: abounds.x,
                   y: abounds.y + (w * (abounds.y2 - abounds.y))
                 };
        }
      }

    }

    return null;
  }


  function render(ctx, camera) {
    var point = camera.translate(pos);
    var anchor;
    var first;
    var last;

    ctx.save();
    ctx.translate(point.x, point.y);

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
  }


  function appendAnchor(offsetX, offsetY) {
    var sibling;
    var anchor;
    var x;
    var y;

    x = (last ? last.x : 0) + offsetX;
    y = (last ? last.y : 0) + offsetY;

    bounds.x2 += offsetX;
    bounds.y2 = Math.max(bounds.y2, bounds.y2 + offsetY);

    anchor = new Anchor(last, x, y);

    anchors.push(anchor);

    last = anchor;
  }


  // Ground.prototype.renderBounds = function(ctx) {
  //   var anchors = this.anchors;
  //   var anchor;
  //   var bounds;
  // 
  //   for (var i = 0, l = anchors.length; i < l; i++) {
  //     anchor = anchors[i];
  //     bounds = anchor.bounds
  //     ctx.strokeStyle = anchor.r ? "green" : "red";
  //     anchor.r = 0;
  //     ctx.strokeRect(bounds.x, bounds.y, bounds.x2 - bounds.x, bounds.y2 - bounds.y);
  //   }
  // 
  // };
  // 

  function Anchor(sibling, x, y) {
    this.sibling = sibling;
    this.x = x;
    this.y = y;
    if (sibling) {
      this.bounds = {
        x: sibling.x,
        y: sibling.y,
        x2: x,
        y2: y,
      };
    } else {
      this.bounds = { x: 0, y: 0, x2: 0, y2: 0 };
    }
  }


  Anchor.prototype.getBounds = function(offX, offY) {
    var bounds = this.bounds;
    return { x: bounds.x + offX,
             y: bounds.y + offY,
             x2: bounds.x2 + offX,
             y2: bounds.y2 + offY};
  };


  Anchor.prototype.render = function(ctx) {
    ctx.lineTo(this.x, this.y);
  };


})(window.tartarus || (window.tartarus = {}));