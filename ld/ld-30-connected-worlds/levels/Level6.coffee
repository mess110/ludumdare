class Level6 extends BaseLevel
  constructor: ->
    super()

    @player.say ":D"

    @ground = new Ground()
    @scene.add @ground.mesh

    @counter = new Door("19")
    @counter.mesh.position.set 0, 0.2, -1
    @scene.add @counter.mesh

    @addSpotlight(0, 2.5, 2)

  tick: (delta, amount) ->
    super(delta, amount)

    timeLeft = (parseFloat(@counter.s) - delta).toFixed(2)
    @counter.say timeLeft.toString()

    if @counter.mesh.position.distanceTo(@player.mesh.position) > 2
      @player.jumpCount = 0

    if timeLeft < 3
      @player.say ":'("
      @spotlights[0].setColor("#ff0000")
    else
      if timeLeft < 6
        @player.say ":("
        @spotlights[0].setColor("#fc2500")
      else
        if timeLeft < 9
          @player.say ":|"
          @spotlights[0].setColor("#f48900")
        else
          if timeLeft < 12
            @player.say ":)"
            @spotlights[0].setColor("#ebf300")

    if timeLeft <= 0.8
      @scene.remove @spotlights[0].spotLight
      @scene.remove @spotlights[0].volumetricSpotlight
