class Van
  constructor: (s) ->
    @dynamicTexture = new THREEx.DynamicTexture(256, 128)
    @dynamicTexture.context.font = "bolder 90px Verdana"

    geometry = new THREE.CubeGeometry(3, 1, 1.5)
    material = new THREE.MeshPhongMaterial(
      map: @dynamicTexture.texture
    )
    @mesh = new THREE.Mesh(geometry, material)
    @baseLevel = geometry.height / 2
    @mesh.position.set 0, geometry.height / 2, 0
    @mesh.receiveShadow = true
    @mesh.castShadow = true

    @dynamicTexture.clear()
    @dynamicTexture.drawText(s, 32, 64, 'white')
