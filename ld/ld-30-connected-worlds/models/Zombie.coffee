class Zombie
  DYNAMIC_TEXTURE_SIZE = 128

  constructor: (s) ->
    @s = s
    @dynamicTexture = new THREEx.DynamicTexture(DYNAMIC_TEXTURE_SIZE, DYNAMIC_TEXTURE_SIZE)
    @dynamicTexture.context.font = "30px Verdana"

    geometry = new THREE.CubeGeometry(0.3, 0.3, 0.3)
    material = new THREE.MeshPhongMaterial(
      map: @dynamicTexture.texture
    )
    @mesh = new THREE.Mesh(geometry, material)
    @baseLevel = geometry.height / 2
    @mesh.position.set 0, @baseLevel, 0
    @mesh.receiveShadow = true
    @mesh.castShadow = true

    @speed = 2
    @directionX = 0
    @directionZ = 0
    @jumping = false
    @maxJump = 1
    @currentJump = 0
    @dead = false
    @canMove = true
    @jumpCount = 0
    @touchedGround = false

    @position = @mesh.position

    @say s

  move: (delta) ->
    if @canMove
      @mesh.position.x += @speed * delta * @directionX
      @mesh.position.z += @speed * delta * @directionZ

      @mesh.rotation.y += @speed * delta * 8 if @directionX != 0 or @directionZ != 0

      if @jumping
        @currentJump += delta
        amount = @speed / 2 * delta

        if @currentJump > @maxJump / 2
          amount *= -1

        if @mesh.position.y < @baseLevel
          @jumping = false
          @mesh.position.y = @baseLevel
        else
          @mesh.position.y += amount

  jump: (delta) ->
    unless @jumping
      @jumpCount += 1
      @currentJump = 0
      @jumping = true

  say: (s) ->
    @s = s
    @dynamicTexture.clear()
    half = DYNAMIC_TEXTURE_SIZE / 2
    @dynamicTexture.drawText(s, half - s.length * 8, half, 'white')
