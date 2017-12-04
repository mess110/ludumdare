class RealLoadingScene extends LoadingScene
  constructor: (urls) ->
    @engine = Hodler.item('engine')
    super(urls)

  preStart: ->
    camera = LoadingScene.LOADING_OPTIONS.camera
    camera.position.set 0, 5, 10
    camera.lookAt Helper.zero
    @engine.setCamera(camera)

    Hodler.item('afterEffects').enable(@scene, camera)

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    point = Helper.pointLight(distance: 10)
    point.position.y = 5
    @scene.add point
    hemi = Helper.hemiLight()
    hemi.position.set 0, 100, 0
    @scene.add hemi

    # @text = new BaseText(
      # w: 8
      # h: 8
      # fillStyle: 'white'
      # font: '82px smackem'
      # align: 'center'
      # text: 'Smack-Em!'
    # )
    # @text.mesh.position.set 0, -5, 0

  uninit: ->
    super()
    Hodler.item('afterEffects').disable()

  hasFinishedLoading: ->
    @hasFinishedLoading = ->
      if engine.uptime > 2000
        @engine.initScene(Hodler.item('gameScene'))
      else
        setTimeout =>
          @engine.initScene(Hodler.item('gameScene'))
        , 2000 - @engine.uptime

    assets = CinematicScene.getAssets('start')
    # logo = Helper.plane(width: 5.12, height: 5.12, map: 'logo')
    # logo.material.transparent = true
    # @scene.add logo

    mole = @jmm.clone('mole')
    @scene.add mole

    @text = Helper.plane(width: 3.82, height: 0.64, map: 'logo')
    @text.material.transparent = true
    @text.position.set 0, -2, 0
    @scene.add @text

    # sword.position.set -15, 0, -2
    # sword.scale.set 0.3, 0.3, 0.3
    # sword.rotation.set 0, Math.PI, Math.PI / 2
    # @scene.add sword

    # Helper.tween(
      # relative: false
      # kind: 'Exponential'
      # direction: 'In'
      # target:
        # x: -2.75
      # mesh: sword
    # ).start()

    @loadAssets(assets)
