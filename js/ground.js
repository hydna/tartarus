(function(app) {

  // Module namespace
  var exports               = app.ground = {};
  var entities              = null;


  // Exported functions
  exports.init              = init;
  exports.render            = render;
  exports.intersection      = intersection;
  exports.getBounds         = getBounds;

  // Internal constants
  var MAP_ANCHORS           = app.constant.MAP_ANCHORS
  var MAP_ARTIFACTS         = app.constant.MAP_ARTIFACTS;
  var MAP_KILLZONE_OFFSET   = app.constant.MAP_KILLZONE_OFFSET;

  // Internal variables
  var pos                   = { x: 0, y: 350 };
  var bounds                = { x: pos.x, y: pos.y, x2: 0, y2: 0};
  var anchors               = [];
  var artifacts             = [];
  var last                  = null;


  function init () {
    for (var i = 0; i < MAP_ARTIFACTS.length; i++) {
      appendArtifact.apply(null, MAP_ARTIFACTS[i]);
    }
    for (var i = 0; i < MAP_ANCHORS.length; i++) {
      appendAnchor.apply(null, MAP_ANCHORS[i]);
    }
  }


  function intersection (p) {
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

    if (p.y > bounds.y2 + MAP_KILLZONE_OFFSET) {
      return { isKillZone: true, y: bounds.y2 + MAP_KILLZONE_OFFSET };
    }

    return null;
  }


  function getBounds () {
    return bounds;
  }


  function render (ctx, camera) {
    var point = camera.translate(pos);
    var artifact;
    var anchor;
    var first;
    var last;

    ctx.save();
    ctx.translate(point.x, point.y);

    for (var i = 0, l = artifacts.length; i < l; i++) {
      artifact = artifacts[i];
      artifact.render(ctx);
    }

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


  function appendAnchor (offsetX, offsetY) {
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


  function appendArtifact (x, y, type) {
    var artifact;

    artifact = new Artifact(x, y, "images/arti-" + type + ".png");
    artifacts.push(artifact);
  }


  function Artifact (x, y, image) {
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = image;
  }


  Artifact.prototype.render = function (ctx) {
    try {
      ctx.drawImage(this.image, this.x, this.y);
    } catch (err) {
    }
  };


  function Anchor (sibling, x, y) {
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


  Anchor.prototype.getBounds = function (offX, offY) {
    var bounds = this.bounds;
    return { x: bounds.x + offX,
             y: bounds.y + offY,
             x2: bounds.x2 + offX,
             y2: bounds.y2 + offY};
  };


  Anchor.prototype.render = function (ctx) {
    ctx.lineTo(this.x, this.y);
  };


})(window.tartarus || (window.tartarus = {}));