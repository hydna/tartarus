(function(app) {

  // Module namespace
  var exports               = app.character = {};


  // Exported functions
  exports.create            = create;


  // Internal constants
  var JUMPING               = app.constant.JUMPING;
  var DUCKING               = app.constant.DUCKING;
  var TRAVEL_WEST           = app.constant.TRAVEL_WEST;
  var TRAVEL_EAST           = app.constant.TRAVEL_EAST;

  var SPEECH_FONT           = app.constant.SPEECH_FONT;
  var SPEECH_COLOR          = app.constant.SPEECH_COLOR;
  var SPEECH_BACKGROUND     = app.constant.SPEECH_BACKGROUND;

  var NAME_FONT             = app.constant.NAME_FONT;
  var NAME_COLOR            = app.constant.NAME_COLOR;

  var FACING_WEST           = app.constant.FACING_WEST;
  var FACING_EAST           = app.constant.FACING_EAST;

  var CHARACHTERS           = { "1": Mario,
                                "2": Bear,
                                "3": MegaMan,
                                "4": Link,
                                "5": Nemo };


  function create (type, name, x, y) {
    var Character;
    var character;

    if (!(Character = CHARACHTERS[type])) {
      throw new Error("Invalid character type");
    }

    if (/[A-Za-z0-9\_]{3,8}/.test(name) == false) {
      throw new Error("Invalid character name");
    }

    if (typeof x !== "number" || isNaN(x) ||
        typeof y !== "number" || isNaN(y)) {
      throw new Error("Invalid position");
    }

    character = new Character(name);
    character.spawn(x, y);

    return character;
  }


  function renderSpeechBouble(ctx, x, y, text) {
    var radius = 5;
    var height = 30;
    var width;
    var dim;

    ctx.font = SPEECH_FONT;
    ctx.textAlign = "left"

    dim = ctx.measureText(text);
    width = dim.width + 15;

    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    ctx.fillStyle = SPEECH_BACKGROUND;
    ctx.moveTo(radius, 0);
    ctx.lineTo(width - radius, 0);
    ctx.quadraticCurveTo(width, 0, width, radius);
    ctx.lineTo(width, height - radius);
    ctx.quadraticCurveTo(width, height, width - radius, height);
    ctx.lineTo(radius + 25, height);
    ctx.lineTo(radius + 20, height + 7);
    ctx.lineTo(radius + 15, height);
    ctx.lineTo(radius, height);
    ctx.quadraticCurveTo(0, height, 0, height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = SPEECH_COLOR;

    ctx.fillText(text, 10, 15, width);

    ctx.restore();
  }


  function Character (name) {
    var self = this;
    var image;

    this.name = name;
    this.text = null;
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.jumping = false;
    this.buffer = null;
    this.animation = null;
    this.frame = 0;
    this.state = 0;
    this.facing = FACING_WEST;
    this.dead = true;
    this.shoutTimeout = null;

    // This will prevent safari from complain
    // about 'not-loaded-image'.
    image = new Image();
    image.src = this.SKIN_SRC;
    image.onload = function() { self.buffer = image; };

    // Always default to animation 'still'.
    this.setAnimation(this.ANIM_STILLWEST);
  }


  // Placeholders for Character events
  Character.prototype.onspawn = function () {};
  Character.prototype.ondeath = function () {};



  Character.prototype.is = function (flag) {
    return this.state & flag;
  };


  Character.prototype.setAnimation = function (frames) {
    if (!frames || this.frames == frames) {
      return;
    }
    this.frames = frames;
    this.frame = 0;
  };


  Character.prototype.setText = function (text) {
    var self = this;

    if (text && text.length) {
      this.text = text;

      if (this.shoutTimeout) {
        clearTimeout(this.shoutTimeout);
        this.shoutTimeout = null;
      }

      this.shoutTimeout = setTimeout(function () {
        self.text = null;
      }, 6000);
    }
  };


  Character.prototype.spawn = function (x, y) {

    if (this.shoutTimeout) {
      clearTimeout(this.shoutTimeout);
      this.shoutTimeout = null;
    }

    this.x = x;
    this.y = y;
    this.state = 0;
    this.facing = FACING_WEST;
    this.dead = false;
    this.velx = 0;
    this.vely = 0;
    this.jumping = false;
    this.onspawn && this.onspawn();
  };


  Character.prototype.kill = function () {
    this.dead = true;
    this.ondeath && this.ondeath();
  };


  Character.prototype.update = function (dt) {
    var intersection;

    // Do not update positions character is "dead"
    if (this.dead) {
      return;
    }

    // Travel west-east is only relevant if we are not
    // falling or jumping.
    if (this.vely == 0) {

      if (this.is(TRAVEL_WEST) && !this.is(DUCKING)) {
        this.facing = FACING_WEST;
        this.velx += -this.MOVE_ACC;
        if (this.velx <= -this.MOVE_ACC_MAX) {
          this.velx = -this.MOVE_ACC_MAX;
        }
      } else if (this.is(TRAVEL_EAST) && !this.is(DUCKING)) {
        this.facing = FACING_EAST;
        this.velx += this.MOVE_ACC;
        if (this.velx >= this.MOVE_ACC_MAX) {
          this.velx = this.MOVE_ACC_MAX;
        }
      } else {

        if (this.velx < 0) {
          this.velx += this.MOVE_COST;
          if (this.velx > 0) this.velx = 0;
        } else if (this.velx > 0) {
          this.velx -= this.MOVE_COST;
          if (this.velx < 0) this.velx = 0;
        }
      }

    }

    if (this.is(JUMPING) && !this.jumping) {
      this.vely += -this.JUMP_ACC;
      if (this.vely <= -this.JUMP_ACC_MAX) {
        this.jumping = true;
        this.vely = -this.JUMP_ACC_MAX;
      }
    }

    // Apply gravity
    this.vely += this.GRAVITY * dt;

    this.x += this.velx * dt;
    this.y += this.vely * dt;

    intersection = app.ground.intersection(this);

    if (intersection && intersection.y < this.y) {
      if (intersection.isKillZone) {
        this.kill && this.kill();
        return;
      } else {
        this.y = intersection.y;
        this.vely = 0;
        this.jumping = false;
      }
    }

    this.checkAnimations();

    this.frame += Math.abs((this.velx * 0.05) * dt);
  };


  Character.prototype.render = function (ctx) {
    var w = this.SKIN_WIDTH;
    var h = this.SKIN_HEIGHT;
    var sx;
    var c;

    // Do not render target if "dead"
    if (this.dead) {
      return;
    }

    if (this.buffer) {
      c = parseInt(this.frame) % this.frames.length;
      sx = this.frames[c] * w;
      ctx.drawImage(this.buffer, sx, 0, w, h, -(w / 2), -h, w, h);
    }

    ctx.save();
    ctx.font = NAME_FONT;
    ctx.fillStyle = NAME_COLOR;
    ctx.textAlign = "center"
    ctx.fillText(this.name, 0, 18);
    ctx.restore();

    if (this.text) {
      renderSpeechBouble(ctx, -25, -75, this.text);
    }
  };


  Character.prototype.checkAnimations = function () {
    if (this.velx < 0) {
      if (this.jumping) {
        this.setAnimation(this.ANIM_JUMPWEST);
      } else {
        this.setAnimation(this.ANIM_RUNWEST);
      }
    } else if (this.velx > 0) {
      if (this.jumping) {
        this.setAnimation(this.ANIM_JUMPEAST);
      } else {
        this.setAnimation(this.ANIM_RUNEAST);
      }
    } else {
      this.setAnimation(this.facing == FACING_WEST ? this.ANIM_STILLWEST
                                                   : this.ANIM_STILLEAST);
    }

    if (this.is(DUCKING)) {
      this.setAnimation(this.facing == FACING_WEST ? this.ANIM_DUCKWEST
                                                   : this.ANIM_DUCKEAST);
    }
  };


  function Mario (name) { Character.call(this, name); }


  Mario.prototype               = Object.create(Character.prototype);


  // Skin attribute constants
  Mario.prototype.SKIN_SRC      = "images/mario.png";
  Mario.prototype.SKIN_WIDTH    = 16;
  Mario.prototype.SKIN_HEIGHT   = 32;


  // Animation attribute constants
  Mario.prototype.ANIM_STILLEAST= [6];
  Mario.prototype.ANIM_STILLWEST= [6];
  Mario.prototype.ANIM_DUCKWEST = [0];
  Mario.prototype.ANIM_DUCKEAST = [13];
  Mario.prototype.ANIM_JUMPWEST = [1];
  Mario.prototype.ANIM_JUMPEAST = [12];
  Mario.prototype.ANIM_RUNWEST  = [3, 4, 5];
  Mario.prototype.ANIM_RUNEAST  = [8, 9, 10];


  // Character attribute contants
  Mario.prototype.MOVE_ACC_MAX  = 0.3;
  Mario.prototype.MOVE_COST     = 0.03;
  Mario.prototype.MOVE_ACC      = 0.05;
  Mario.prototype.JUMP_ACC_MAX  = 0.35;
  Mario.prototype.JUMP_ACC      = 0.18;
  Mario.prototype.GRAVITY       = 0.0004;


  function Bear (name) { Character.call(this, name); }


  Bear.prototype               = Object.create(Character.prototype);


  // Skin attribute constants
  Bear.prototype.SKIN_SRC      = "images/bear.png";
  Bear.prototype.SKIN_WIDTH    = 18;
  Bear.prototype.SKIN_HEIGHT   = 33;


  // Animation attribute constants
  Bear.prototype.ANIM_STILLWEST= [3];
  Bear.prototype.ANIM_STILLEAST= [4];
  Bear.prototype.ANIM_JUMPWEST = [0];
  Bear.prototype.ANIM_JUMPEAST = [7];
  Bear.prototype.ANIM_RUNWEST  = [1, 2, 3];
  Bear.prototype.ANIM_RUNEAST  = [4, 5, 6];


  // Character attribute contants
  Bear.prototype.MOVE_ACC_MAX  = 0.2;
  Bear.prototype.MOVE_COST     = 0.05;
  Bear.prototype.MOVE_ACC      = 0.03;
  Bear.prototype.JUMP_ACC_MAX  = 0.39;
  Bear.prototype.JUMP_ACC      = 0.15;
  Bear.prototype.GRAVITY       = 0.0004;



  function MegaMan (name) { Character.call(this, name); }


  MegaMan.prototype               = Object.create(Character.prototype);


  // Skin attribute constants
  MegaMan.prototype.SKIN_SRC      = "images/megaman.png";
  MegaMan.prototype.SKIN_WIDTH    = 27;
  MegaMan.prototype.SKIN_HEIGHT   = 30;


  // Animation attribute constants
  MegaMan.prototype.ANIM_STILLWEST= [7];
  MegaMan.prototype.ANIM_STILLEAST= [0];
  MegaMan.prototype.ANIM_JUMPWEST = [8];
  MegaMan.prototype.ANIM_JUMPEAST = [9];
  MegaMan.prototype.ANIM_DUCKWEST = [11];
  MegaMan.prototype.ANIM_DUCKEAST = [10];
  MegaMan.prototype.ANIM_RUNWEST  = [4, 5, 6];
  MegaMan.prototype.ANIM_RUNEAST  = [1, 2, 3];


  // Character attribute contants
  MegaMan.prototype.MOVE_ACC_MAX  = 0.2;
  MegaMan.prototype.MOVE_COST     = 0.05;
  MegaMan.prototype.MOVE_ACC      = 0.03;
  MegaMan.prototype.JUMP_ACC_MAX  = 0.39;
  MegaMan.prototype.JUMP_ACC      = 0.15;
  MegaMan.prototype.GRAVITY       = 0.0004;



  function Link (name) { Character.call(this, name); }


  Link.prototype                  = Object.create(Character.prototype);


  // Skin attribute constants
  Link.prototype.SKIN_SRC         = "images/link.png";
  Link.prototype.SKIN_WIDTH       = 16;
  Link.prototype.SKIN_HEIGHT      = 32;


  // Animation attribute constants
  Link.prototype.ANIM_STILLWEST   = [5];
  Link.prototype.ANIM_STILLEAST   = [2];
  Link.prototype.ANIM_JUMPWEST    = [11];
  Link.prototype.ANIM_JUMPEAST    = [10];
  Link.prototype.ANIM_DUCKWEST    = [9];
  Link.prototype.ANIM_DUCKEAST    = [8];
  Link.prototype.ANIM_RUNWEST     = [4, 5, 6, 7];
  Link.prototype.ANIM_RUNEAST     = [0, 2, 1, 3];


  // Character attribute contants
  Link.prototype.MOVE_ACC_MAX     = 0.15;
  Link.prototype.MOVE_COST        = 0.06;
  Link.prototype.MOVE_ACC         = 0.03;
  Link.prototype.JUMP_ACC_MAX     = 0.43;
  Link.prototype.JUMP_ACC         = 0.18;
  Link.prototype.GRAVITY          = 0.0003;


  function Nemo (name) { Character.call(this, name); }


  Nemo.prototype                  = Object.create(Character.prototype);


  // Skin attribute constants
  Nemo.prototype.SKIN_SRC         = "images/nemo.png";
  Nemo.prototype.SKIN_WIDTH       = 24;
  Nemo.prototype.SKIN_HEIGHT      = 27;


  // Animation attribute constants
  Nemo.prototype.ANIM_STILLWEST   = [1];
  Nemo.prototype.ANIM_STILLEAST   = [0];
  Nemo.prototype.ANIM_JUMPWEST    = [9];
  Nemo.prototype.ANIM_JUMPEAST    = [8];
  Nemo.prototype.ANIM_RUNWEST     = [5, 6, 7];
  Nemo.prototype.ANIM_RUNEAST     = [2, 3, 4];


  // Character attribute contants
  Nemo.prototype.MOVE_ACC_MAX     = 0.15;
  Nemo.prototype.MOVE_COST        = 0.06;
  Nemo.prototype.MOVE_ACC         = 0.03;
  Nemo.prototype.JUMP_ACC_MAX     = 0.43;
  Nemo.prototype.JUMP_ACC         = 0.18;
  Nemo.prototype.GRAVITY          = 0.0003;


})(window.tartarus || (window.tartarus = {}));