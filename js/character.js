(function(app) {

  // Module namespace
  var exports = app.character = {};


  // Exported functions
  exports.init          = init;
  exports.create        = create;
  exports.update        = update;


  // Internal constants
  var MOVE_ACC_MAX      = 10;
  var MOVE_COST         = 0.03;
  var MOVE_ACC          = 0.05;
  var JUMP_ACC_MAX      = 10;
  var JUMP_ACC          = 0.18;
  var JUMP_MAX          = 40;

  // Internal variables
  var user              = null;


  function init() {
    user = create(200, 200);
    app.scene.add(user);
  }


  function update(dt) {
    var state = app.input.stateOf;

    app.camera.centerTo(user);

    if (state("LEFT") && !user.inair) {
      user.velx += -(MOVE_ACC * dt);
      if (user.velx <= -MOVE_ACC_MAX) {
        user.velx = -MOVE_ACC_MAX;
      }
    }

    if (state("RIGHT") && !user.inair) {
      user.velx += (MOVE_ACC * dt);
      if (user.velx >= MOVE_ACC_MAX) {
        user.velx = MOVE_ACC_MAX;
      }
    }

    if (state("UP") && !user.jumping) {
      user.inair = true;
      if (!user.maxy) {
        user.maxy = JUMP_MAX + user.y;
      }
      user.vely += -(JUMP_ACC * dt);
      if (user.vely <= -JUMP_ACC_MAX) {
        user.vely = -JUMP_ACC_MAX;
        user.jumping = true;
      }
    }

    if (state("DOWN")) {
      user.move(0, (dt * 1));
    }

  }


  function create(x, y) {
    var character = new Character();
    character.x = x;
    character.y = y;
    return character;
  }


  function Character() {
    this.x = 0;
    this.y = 0;
    this.velx = 0;
    this.vely = 0;
    this.maxy = 0;
    this.inair = false;
    this.jumping = false;
  }


  Character.prototype.update = function(dt) {

    if (this.inair == false) {
      if (this.velx < 0) {
        this.velx += MOVE_COST * dt;
        if (this.velx > 0) this.velx = 0;
      } else if (user.velx > 0) {
        this.velx -= MOVE_COST * dt;
        if (this.velx < 0) this.velx = 0;
      }
    }

    if (this.vely < 0) {
      this.vely += MOVE_COST * dt;
      if (this.vely > 0) this.vely = 0;
    }

    if (this.y < 200) {
      this.vely += 0.01 * dt;
    }

    this.x += user.velx;
    this.y += user.vely;

    if (this.y > 200) {
      this.y = 200;
      this.inair = false;
      this.jumping = false;
    }

  }


  // Character.prototype.move = function(offx, offy) {
  //   this.x += offx;
  //   this.y += offy;
  // }


  Character.prototype.render = function(ctx) {
    ctx.beginPath();
    ctx.rect(0, 0, 20, 30);
    ctx.closePath();
    ctx.fill();
  }



})(window.tartarus || (window.tartarus = {}));