class Level0 extends BaseLevel
  constructor: ->
    super()

    @player.say ":)"

    @ground = new Ground()
    @scene.add @ground.mesh

    @door1 = new Door("door")
    @door1.mesh.position.set -1, 0.2, -2
    @scene.add @door1.mesh

    @door2 = new Door("door")
    @door2.mesh.position.set 1, 0.2, -2
    @scene.add @door2.mesh

    @addSpotlight(1, 2.5, 2)
    @addSpotlight(-1, 2.5, 2)

  tick: (delta, amount) ->
    super(delta, amount)

    if keyboard.pressed("space")
      if @player.mesh.position.distanceTo(@door1.mesh.position) < 0.3
        SceneManager.get().setScene(1)
      if @player.mesh.position.distanceTo(@door2.mesh.position) < 0.3
        SceneManager.get().setScene(4)
