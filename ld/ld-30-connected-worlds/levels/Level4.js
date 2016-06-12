// Generated by CoffeeScript 1.4.0
var Level4,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Level4 = (function(_super) {

  __extends(Level4, _super);

  function Level4() {
    Level4.__super__.constructor.call(this);
    this.player.say(":D");
    this.ground = new Ground();
    this.scene.add(this.ground.mesh);
    this.prize = new Door("prize");
    this.prize.mesh.position.set(0, 0.2, -1.5);
    this.scene.add(this.prize.mesh);
    this.finished = 0;
    this.addSpotlight(0, 2.5, 2);
  }

  Level4.prototype.tick = function(delta, now) {
    Level4.__super__.tick.call(this, delta, now);
    if (keyboard.pressed("space")) {
      if (this.player.mesh.position.distanceTo(this.prize.mesh.position) < 0.3) {
        this.scene.remove(this.prize.mesh);
      }
    }
    if (this.player.mesh.position.y < -3) {
      return SceneManager.get().setScene(5);
    }
  };

  return Level4;

})(BaseLevel);
