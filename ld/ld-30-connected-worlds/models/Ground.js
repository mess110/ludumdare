// Generated by CoffeeScript 1.4.0
var Ground;

Ground = (function() {

  function Ground() {
    var geometry, material, mesh2;
    this.x = 3;
    this.y = 0.1;
    this.z = 5;
    geometry = new THREE.CubeGeometry(this.x, 0.1, this.z, this.x, 1, this.z);
    material = new THREE.MeshPhongMaterial({
      color: new THREE.Color("gray")
    });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.receiveShadow = true;
    this.mesh.castShadow = true;
    this.mesh.position.set(0, -geometry.height / 2, 0);
    material = new THREE.MeshBasicMaterial({
      wireframe: true,
      wireframeLinewidth: 2,
      color: new THREE.Color("black")
    });
    mesh2 = new THREE.Mesh(geometry.clone(), material);
    mesh2.receiveShadow = true;
    mesh2.castShadow = true;
    mesh2.scale.multiplyScalar(1.01);
    this.mesh.add(mesh2);
  }

  Ground.prototype.isAboveGround = function(player) {
    var x, y, z;
    x = player.mesh.position.x;
    y = player.mesh.position.y;
    z = player.mesh.position.z;
    return -1 * this.x / 2 < x && x < this.x / 2 && -1 * this.z / 2 < z && z < this.z / 2 && y >= this.y;
  };

  return Ground;

})();
