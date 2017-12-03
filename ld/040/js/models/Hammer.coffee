class Hammer extends BaseModel
  constructor: ->
    super()
    @mesh = JsonModelManager.clone('hammer')
    @setOpacity(0)

    @hitting = false

  hit: (intersection) ->
    return if @hitting
    point = intersection.point
    moleId = intersection.object.moleId

    gameScene = Hodler.item('gameScene')
    @displayCooldown.stop() if @displayCooldown?
    @displayCooldown = new FadeModifier(gameScene.cooldown, 0.5, 0, 200).start()

    @hitting = true
    @mesh.position.set point.x, point.y + 3, point.z + 7
    duration = 500

    @goDown.stop() if @goDown?
    @mesh.rotation.x = 0
    @goDown = Helper.tween(
      duration: duration
      mesh: @mesh
      kind: 'Elastic'
      direction: 'Out'
      target:
        rX: -Math.PI / 2 + 0.2
    )
    @goDown.start()

    @fadeIn.stop() if @fadeIn?
    @fadeIn = new FadeModifier(@, 0, 0.5, 200).start()

    clearTimeout(@hitDetection) if @hitDetection?
    @hitDetection = setTimeout =>
      SoundManager.play('hit')
      gameScene = Hodler.item('gameScene')
      mole = gameScene.moles.filter((e) -> e.moleId == moleId).first()
      return unless mole?
      if mole.hittable && mole.wasHit == false
        ouchSound = ['ouch1', 'ouch2', 'ouch3'].shuffle().first()
        SoundManager.volume(ouchSound, 0.2)
        SoundManager.play(ouchSound)
        mole.showStars()
        mole.animate('hit')
        gameScene.score += 1
        mole.cancelNormalMove()
        gameScene.updateScore()
        gameScene.timer += 1
        if gameScene.stayTime == 400
          gameScene.timer -= 0.2
        if gameScene.stayTime == 300
          gameScene.timer -= 0.4
      else
        gameScene.timer -= 5
    , duration / 3

    clearTimeout(@reloadStuff) if @reloadStuff?
    @reloadStuff = setTimeout =>
      @fadeOut.stop() if @fadeOut?
      @fadeOut = new FadeModifier(@, 0.5, 0, 200).start()

      @backUp.stop() if @backUp?
      @backUp = Helper.tween(
        duration: duration / 2
        kind: 'Cubic'
        direction: 'Out'
        mesh: @mesh
        target:
          rX: 0
      )
      @backUp.start()
      # setTimeout =>
      @hitting = false
      @displayCooldown2.stop() if @displayCooldown2?
      @displayCooldown2 = new FadeModifier(gameScene.cooldown, 0, 0.5, 200).start()
      # , duration / 2
    , duration
