class Mole extends BaseModel
  constructor: (moleId) ->
    super()
    @moleId = moleId
    @hittable = false
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

    possibleTaunts = ['taunt1']
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

    Helper.tween(
      duration: duration
      mesh: @mole
      kind: 'Elastic'
      direction: 'Out'
      target:
        y: 0
    ).start()

    return if Hodler.item('gameScene').finished

    SoundManager.volume('pop1', 0.1)
    SoundManager.play('pop1')
    setTimeout =>
      Helper.tween(
        duration: duration
        mesh: @mole
        kind: 'Elastic'
        direction: 'Out'
        target:
          y: -3
      ).start()
      setTimeout =>
        @hittable = false
        @hideStars()
      , duration / 2
    , duration + stay
