class GameScene extends BaseScene
  init: (options) ->
    @score = 0
    @timer = 30
    @readyBaby = false
    @updateScore()
    window.score.style.visibility = ''
    window.time.style.visibility = ''

    camera = LoadingScene.LOADING_OPTIONS.camera
    camera.position.set 0, 16, 16
    camera.lookAt(Helper.zero)
    @tweenMoveTo(position: new THREE.Vector3(0, 11, 11), camera, 4000, TWEEN.Easing.Quartic.Out)

    clearTimeout(@readyBabyTO) if @readyBabyTO?
    @readyBabyTO = setTimeout =>
      @readyBaby = true
    , 4000

    SoundManager.play('hammer-time')

    grassColor = '#2d882d'

    engine = Hodler.item('engine')
    engine.setClearColor(grassColor)

    plane = Helper.plane(size: 30, color: grassColor)
    plane.rotation.x = -Math.PI / 2
    @scene.add plane

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    Hodler.item('afterEffects').enable(@scene, camera)

    # @cooldown = new BaseModel()
    # @cooldown.mesh = @jmm.clone('hammer')
    # @cooldown.setOpacity(0.5)
    # @cooldown.mesh.position.set 0, -6, 8
    # @scene.add @cooldown.mesh

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
        mole.mesh.position.set -4 + 4 * i, 0, -4 + 4 * j - 1
        @moles.push mole
        @scene.add mole.mesh

    @hammer = new Hammer()
    @scene.add @hammer.mesh

    # Helper.orbitControls(engine)
    @setAppearCD(500)

  setAppearCD: (cd = 500) ->
    @stayTime = cd
    clearInterval(@popGoesThe) if @popGoesThe?
    @popGoesThe = setInterval =>
      moles = @moles.filter((e) -> e.hittable == false)
      tMole = moles.shuffle().first()
      tMole.appear() if tMole?
    , cd

  uninit: ->
    @readyBaby = false
    clearTimeout(@readyBabyTO) if @readyBabyTO?
    window.score.style.visibility = 'hidden'
    window.time.style.visibility = 'hidden'
    window.full.style.visibility = 'hidden'
    window.reload.style.visibility = 'hidden'
    clearInterval(@popGoesThe)
    @finished = undefined
    Hodler.item('afterEffects').disable()
    super()

  updateScore: ->
    window.score.innerHTML = @score
    if @score == 10
      @setAppearCD(400)
    if @score == 20
      @setAppearCD(300)

  tick: (tpf) ->
    @timer -= tpf
    if @timer < 0
      timer = '0.0'
      if !@finished?
        SoundManager.play('hammer-time')
        window.reload.style.visibility = ''
        window.full.style.visibility = ''
      @finished = true
    else
      timer = parseFloat(Math.round(@timer * 10) / 10).toFixed(1)

    for mole in @moles
      mole.stars.rotation.y += 5 * tpf
    window.time.innerHTML = timer

  doKeyboardEvent: (event) ->

  doMouseEvent: (event, raycaster) ->
    return if event.type != 'mousedown'

    if @timer > 0
      rumbles = @moles.map((e) -> e.rumble)
      moles = @moles.filter((e) -> e.hittable == true).map((e) -> e.mole)
      all = rumbles.concat(moles)
      intersections = raycaster.intersectObjects(all, true)
      if intersections.any()
        @hammer.hit(intersections.first())
