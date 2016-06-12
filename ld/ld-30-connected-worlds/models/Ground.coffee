class Ground
  constructor: ->
    @x = 3
    @y = 0.1
    @z = 5

    geometry = new THREE.CubeGeometry(@x, 0.1, @z, @x, 1, @z)
    material = new THREE.MeshPhongMaterial(color: new THREE.Color("gray"))
    @mesh = new THREE.Mesh(geometry, material)
    @mesh.receiveShadow = true
    @mesh.castShadow = true
    @mesh.position.set 0, -geometry.height / 2, 0

    material = new THREE.MeshBasicMaterial(
      wireframe: true
      wireframeLinewidth: 2
      color: new THREE.Color("black")
    )
    mesh2 = new THREE.Mesh(geometry.clone(), material)
    mesh2.receiveShadow = true
    mesh2.castShadow = true
    mesh2.scale.multiplyScalar 1.01
    @mesh.add mesh2

  isAboveGround: (player) ->
    x = player.mesh.position.x
    y = player.mesh.position.y
    z = player.mesh.position.z
    -1 * @x / 2 < x and x < @x / 2 and -1 * @z / 2 < z and z < @z / 2 and y >= @y
