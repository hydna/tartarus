(function(app) {

  // Module namespace
  var exports = app.character = {};


  // Exported functions
  exports.create        = create;


  // Internal constants
  var JUMPING           = 1;
  var DUCKING           = 2;
  var TRAVEL_WEST       = 4;
  var TRAVEL_EAST       = 8;
  var MOVE_ACC_MAX      = 0.3;
  var MOVE_COST         = 0.03;
  var MOVE_ACC          = 0.05;
  var JUMP_ACC_MAX      = 0.35;
  var JUMP_ACC          = 0.18;
  var JUMP_MAX          = 40;
  var GRAVITY           = 0.0004;

  var MARIO             = { "src": "images/mario.png",
                            "width": 16,
                            "height": 32,
                            "still": [6],
                            "duckwest": [0],
                            "duckeast": [13],
                            "jumpwest": [1],
                            "jumpeast": [12],
                            "runwest": [3, 4, 5],
                            "runeast": [8, 9, 10]
                          };



  function create(x, y) {
    var character = new Character(MARIO);
    character.x = x;
    character.y = y;
    return character;
  }


  function getUser() {
    return user;
  }


  function renderSpeechBouble(ctx, x, y, text) {
    var radius = 5;
    var width = 150;
    var height = 30;

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = "white"
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.font = "10px Arial Black";
    ctx.fillStyle = "black";
    ctx.textAlign = "left"
    ctx.fillText(text, 10, 15, width);

    ctx.restore();

  }

  function Character(skin, name) {
    var self = this;
    var image;

    this.name = name || "kungen";
    // this.text = "hej";
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.jumping = false;
    this.skin = skin;
    this.buffer = null;
    this.animation = null;
    this.frame = 0;

    this.state = 0;

    // This will prevent safari from complain
    // about 'not-loaded-image'.
    image = new Image();
    image.src = skin.src;
    image.onload = function() {
      self.buffer = image;
    };

    this.setAnimation("still");
  }


  Character.prototype.is = function(flag) {
    return this.state & flag;
  }


  Character.prototype.setAnimation = function(name) {

    if (this.animation == name) {
      return;
    }

    if (name in this.skin) {
      this.animation = name;
      this.frames = this.skin[name];
      this.frame = 0;
    }
  };


  Character.prototype.update = function(dt) {
    var intersect;

    // Travel west-east is only relevant if we are not
    // falling or jumping.
    if (this.vely == 0) {

      if (this.is(TRAVEL_WEST) && !this.is(DUCKING)) {
        this.velx += -MOVE_ACC;
        if (this.velx <= -MOVE_ACC_MAX) {
          this.velx = -MOVE_ACC_MAX;
        }
      } else if (this.is(TRAVEL_EAST) && !this.is(DUCKING)) {
        this.velx += MOVE_ACC;
        if (this.velx >= MOVE_ACC_MAX) {
          this.velx = MOVE_ACC_MAX;
        }
      } else {

        if (this.velx < 0) {
          this.velx += MOVE_COST;
          if (this.velx > 0) this.velx = 0;
        } else if (this.velx > 0) {
          this.velx -= MOVE_COST;
          if (this.velx < 0) this.velx = 0;
        }
      }

    }

    if (this.is(JUMPING) && !this.jumping) {
      this.vely += -JUMP_ACC;
      if (this.vely <= -JUMP_ACC_MAX) {
        this.jumping = true;
        this.vely = -JUMP_ACC_MAX;
      }
    }

    // Apply gravity
    this.vely += GRAVITY * dt;

    this.x += this.velx * dt;
    this.y += this.vely * dt;

    intersect = app.ground.intersection(this);

    if (intersect && intersect.y < this.y) {
      this.y = intersect.y;
      this.vely = 0;
      this.jumping = false;
    }

    if (this.velx < 0) {
      if (this.jumping) {
        this.setAnimation("jumpwest");
      } else {
        this.setAnimation("runwest");
      }
    } else if (this.velx > 0) {
      if (this.jumping) {
        this.setAnimation("jumpeast");
      } else {
        this.setAnimation("runeast");
      }
    } else {
      this.setAnimation("still");
    }

    if (this.is(DUCKING)) {
      this.setAnimation(this.velx > 0 ? "duckeast" : "duckwest");
    }

    this.frame += Math.abs((this.velx * 0.05) * dt);
  }


  Character.prototype.render = function(ctx) {
    var w = this.skin.width;
    var h = this.skin.height;
    var sx;
    var c;

    if (this.buffer) {
      c = parseInt(this.frame) % this.frames.length;
      sx = this.frames[c] * w;
      ctx.drawImage(this.buffer, sx, 0, w, h, -(w / 2), -h, w, h);
    }

    ctx.save();
    ctx.font = "10px Arial Black";
    ctx.fillStyle = "white";
    ctx.textAlign = "center"
    ctx.fillText(this.name, 0, 18);
    ctx.restore();

    if (this.text) {
      renderSpeechBouble(ctx, -25, -75, this.text);
    }
  }



})(window.tartarus || (window.tartarus = {}));