class Mole extends BaseModel
  constructor: (moleId) ->
    super()
    @moleId = moleId
    @hittable = false
    @wasHit = false
    @mesh = new THREE.Object3D()
    @mesh.moleId = moleId

    @mole = JsonModelManager.clone('mole')
    @mole.moleId = moleId
    @mole.position.y = -3

    @rumble = JsonModelManager.clone('rumble')
    @rumble.rotation.y = Helper.random(0, Math.PI)
    @rumble.moleId = moleId

    @stars = JsonModelManager.clone('stars')
    @stars.rotation.x = Math.PI / 2
    @stars.position.z = -1.5
    stars = @stars
    @stars.animations[2].play()
    @mole.traverse (object) ->
      if object instanceof THREE.Bone && object.name == 'Head'
        object.add stars

    @hideStars()
    # @mole.add @stars

    light = Helper.pointLight(distance: 10)
    # light.add Helper.cube(size: 0.5)
    light.position.set 0, 5, 0
    Hodler.add("light#{moleId}", light)
    @mesh.add light

    @mesh.add @rumble
    @mesh.add @mole

  stopAnimations: ->
    for animation in @mole.animations
      if animation.isRunning()
        animation.stop()

  animate: (which) ->
    @stopAnimations()

    possibleTaunts = ['taunt1', 'taunt2', 'taunt3']
    possibleHits = ['hit1']

    if which == 'taunt'
      animationName = possibleTaunts.shuffle().first()
    if which == 'hit'
      animationName = possibleHits.shuffle().first()

    @mole.animations.filter((e) -> e._clip.name == animationName).first().play()

  hideStars: ->
    @stars.traverse (object) ->
      object.visible = false

  showStars: ->
    @stars.traverse (object) ->
      object.visible = true

  cancelNormalMove: ->
    @appearTween.stop() if @appearTween?
    @disappearTween.stop() if @disappearTween?
    clearTimeout(@oneTO) if @oneTO?
    clearTimeout(@twoTO) if @twoTO?

    @mole.position.y = 0
    @wasHit = true
    duration = 500
    setTimeout =>
      @disappearTween = Helper.tween(
        duration: duration
        mesh: @mole
        kind: 'Elastic'
        direction: 'Out'
        target:
          y: -3
      )
      @disappearTween.start()
      @twoTO = setTimeout =>
        @hittable = false
        @hideStars()
        @wasHit = false
      , duration / 3
    , duration

  appear: ->
    return if @hittable
    @hittable = true
    duration = 500
    stay = SceneManager.currentScene().stayTime

    @hideStars()
    @animate('taunt')

    pos = LoadingScene.LOADING_OPTIONS.camera.position.clone()
    pos.y -= 10
    @mole.lookAt(pos)

    @appearTween = Helper.tween(
      duration: duration
      mesh: @mole
      kind: 'Elastic'
      direction: 'Out'
      target:
        y: 0
    )
    @appearTween.start()

    return if Hodler.item('gameScene').finished

    appearSound = ['appear1', 'appear2', 'appear3'].shuffle().first()
    SoundManager.volume(appearSound, 0.2)
    SoundManager.play(appearSound)
    @oneTO = setTimeout =>
      @disappearTween = Helper.tween(
        duration: duration
        mesh: @mole
        kind: 'Elastic'
        direction: 'Out'
        target:
          y: -3
      )
      @disappearTween.start()
      @twoTO = setTimeout =>
        @hittable = false
        @hideStars()
      , duration / 3
    , duration + stay
