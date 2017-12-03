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

    @hitting = true
    @mesh.position.set point.x, point.y + 3, point.z + 7
    duration = 500
    Helper.tween(
      duration: duration
      mesh: @mesh
      kind: 'Elastic'
      direction: 'Out'
      target:
        rX: -Math.PI / 2 + 0.2
    ).start()
    new FadeModifier(@, 0, 0.5, 200).start()

    setTimeout =>
      SoundManager.play('hit')
      gameScene = Hodler.item('gameScene')
      mole = gameScene.moles.filter((e) -> e.moleId == moleId).first()
      if mole.hittable
        mole.animate('hit')
        gameScene.score += 1
        gameScene.updateScore()
    , duration / 3

    setTimeout =>
      new FadeModifier(@, 0.5, 0, 200).start()
      Helper.tween(
        duration: duration / 2
        kind: 'Cubic'
        direction: 'Out'
        mesh: @mesh
        target:
          rX: 0
      ).start()
      setTimeout =>
        @hitting = false
      , duration / 2
    , duration

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

  appear: ->
    return if @hittable
    @hittable = true
    duration = 500
    stay = 500

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
      , duration / 2
    , duration + stay

class GameScene extends BaseScene
  init: (options) ->
    @score = 0
    @timer = 10
    @updateScore()
    window.score.style.visibility = ''
    window.time.style.visibility = ''

    Utils.addCEButton(size: '32px', padding: '30px', position: 'bottom-right')
    Utils.addCEButton(size: '32px', padding: '30px', position: 'bottom-left', type: 'reinit')

    camera = LoadingScene.LOADING_OPTIONS.camera
    camera.position.set 0, 16, 16
    camera.lookAt(Helper.zero)
    @tweenMoveTo(position: new THREE.Vector3(0, 11, 11), camera, 4000, TWEEN.Easing.Quartic.Out)

    SoundManager.play('hammer-time')

    engine = Hodler.item('engine')
    engine.setClearColor('#2d882d')

    plane = Helper.plane(size: 30, color: '#2d882d')
    plane.rotation.x = -Math.PI / 2
    @scene.add plane

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    Hodler.item('afterEffects').enable(@scene, camera)

    # hemi = Helper.hemiLight()
    # hemi.position.set 0, 100, 0
    # @scene.add hemi

    # fence = @jmm.clone('fence')
    # @scene.add fence

    nature = @jmm.clone('nature')
    @scene.add nature

    @moles = []
    moleId = -1
    for i in [0..2]
      for j in [0..2]
        moleId += 1
        mole = new Mole(moleId)
        mole.mesh.position.set -4 + 4 * i, 0, -4 + 4 * j
        @moles.push mole
        @scene.add mole.mesh

    @hammer = new Hammer()
    @scene.add @hammer.mesh

    # Helper.orbitControls(engine)

    @popGoesThe = setInterval =>
      moles = @moles.filter((e) -> e.hittable == false)
      tMole = moles.shuffle().first()
      tMole.appear() if tMole?
    , 500

  uninit: ->
    window.score.style.visibility = 'hidden'
    window.time.style.visibility = 'hidden'
    clearInterval(@popGoesThe)
    @finished = undefined
    Hodler.item('afterEffects').disable()
    super()

  updateScore: ->
    window.score.innerHTML = @score

  tick: (tpf) ->
    @timer -= tpf
    if @timer < 0
      timer = '0.0'
      if !@finished?
        SoundManager.play('hammer-time')
      @finished = true
    else
      timer = parseFloat(Math.round(@timer * 10) / 10).toFixed(1)

    window.time.innerHTML = timer

  doKeyboardEvent: (event) ->

  doMouseEvent: (event, raycaster) ->
    return if event.type != 'mousedown'

    if @timer > 0
      rumbles = @moles.map((e) -> e.rumble)
      intersections = raycaster.intersectObjects(rumbles, true)
      if intersections.any()
        @hammer.hit(intersections.last())
