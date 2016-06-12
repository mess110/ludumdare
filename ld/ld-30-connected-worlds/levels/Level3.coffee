class Level3 extends BaseLevel
  constructor: ->
    super()

    @player.say ":("

    @ground = new Ground()
    @scene.add @ground.mesh

    @van = new Van("van")
    @van.mesh.position.z = -40
    @scene.add @van.mesh

    @addSpotlight(0, 2.5, 2)
    @spotlights[0].spotLight.position.z = 5
    @spotlights[0].setColor("#FF0000")

  tick: (delta, amount) ->
    super(delta, amount)

    if @van.mesh.position.z < 2
      @van.mesh.position.z += 6 * delta

    if @van.mesh.position.z > @player.mesh.position.z
      @player.canMove = false
