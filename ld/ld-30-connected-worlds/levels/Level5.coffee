class Level5 extends BaseLevel
  constructor: ->
    super()

    @player.say ":D"
    @player.mesh.position.set 0, 2, 0
    @player.canMove = false
    @player.jumping = true

    @ground = new Ground()
    @scene.add @ground.mesh

    @counter = new Door("0")
    @counter.mesh.position.set 0, 0.2, -1
    @scene.add @counter.mesh

    @addSpotlight(0, 2.5, 2)

  tick: (delta, amount) ->
    super(delta, amount)

    if @player.mesh.position.y > @player.baseLevel
      if @player.touchedGround == false
        @player.mesh.position.y -= 2 * delta
    else
      @player.touchedGround = true
      @player.canMove = true

    @counter.say @player.jumpCount.toString()

    if @counter.mesh.position.distanceTo(@player.mesh.position) > 2
      @player.jumpCount = 0

    if @player.jumpCount >= 3
      SceneManager.get().setScene(6)
