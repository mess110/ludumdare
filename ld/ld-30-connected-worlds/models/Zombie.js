// Generated by CoffeeScript 1.4.0
var Zombie;

Zombie = (function() {
  var DYNAMIC_TEXTURE_SIZE;

  DYNAMIC_TEXTURE_SIZE = 128;

  function Zombie(s) {
    var geometry, material;
    this.s = s;
    this.dynamicTexture = new THREEx.DynamicTexture(DYNAMIC_TEXTURE_SIZE, DYNAMIC_TEXTURE_SIZE);
    this.dynamicTexture.context.font = "30px Verdana";
    geometry = new THREE.CubeGeometry(0.3, 0.3, 0.3);
    material = new THREE.MeshPhongMaterial({
      map: this.dynamicTexture.texture
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.baseLevel = geometry.height / 2;
    this.mesh.position.set(0, this.baseLevel, 0);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.speed = 2;
    this.directionX = 0;
    this.directionZ = 0;
    this.jumping = false;
    this.maxJump = 1;
    this.currentJump = 0;
    this.dead = false;
    this.canMove = true;
    this.jumpCount = 0;
    this.touchedGround = false;
    this.position = this.mesh.position;
    this.say(s);
  }

  Zombie.prototype.move = function(delta) {
    var amount;
    if (this.canMove) {
      this.mesh.position.x += this.speed * delta * this.directionX;
      this.mesh.position.z += this.speed * delta * this.directionZ;
      if (this.directionX !== 0 || this.directionZ !== 0) {
        this.mesh.rotation.y += this.speed * delta * 8;
      }
      if (this.jumping) {
        this.currentJump += delta;
        amount = this.speed / 2 * delta;
        if (this.currentJump > this.maxJump / 2) {
          amount *= -1;
        }
        if (this.mesh.position.y < this.baseLevel) {
          this.jumping = false;
          return this.mesh.position.y = this.baseLevel;
        } else {
          return this.mesh.position.y += amount;
        }
      }
    }
  };

  Zombie.prototype.jump = function(delta) {
    if (!this.jumping) {
      this.jumpCount += 1;
      this.currentJump = 0;
      return this.jumping = true;
    }
  };

  Zombie.prototype.say = function(s) {
    var half;
    this.s = s;
    this.dynamicTexture.clear();
    half = DYNAMIC_TEXTURE_SIZE / 2;
    return this.dynamicTexture.drawText(s, half - s.length * 8, half, 'white');
  };

  return Zombie;

})();
