class Level4 extends BaseLevel
  constructor: ->
    super()

    @player.say ":D"

    @ground = new Ground()
    @scene.add @ground.mesh

    @prize = new Door("prize")
    @prize.mesh.position.set 0, 0.2, -1.5
    @scene.add @prize.mesh

    @finished = 0

    @addSpotlight(0, 2.5, 2)

  tick: (delta, now) ->
    super(delta, now)

    if keyboard.pressed("space")
      if @player.mesh.position.distanceTo(@prize.mesh.position) < 0.3
        @scene.remove @prize.mesh


    if @player.mesh.position.y < -3
      SceneManager.get().setScene(5)
