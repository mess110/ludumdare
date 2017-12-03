class MenuScene extends BaseScene
  init: (options) ->
    camera = LoadingScene.LOADING_OPTIONS.camera
    camera.position.set 0, 9, 6
    camera.lookAt(new THREE.Vector3(0, 2, -2))

    engine = Hodler.item('engine')
    engine.setClearColor('#2d882d')

    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()
    @scene.add Helper.ambientLight()

    light = Helper.pointLight(distance: 10)
    light.position.set 0, 5, 0
    @scene.add light

    @scene.add @jmm.clone('mole')

    hammer = @jmm.clone('hammer')
    hammer.position.set 4, 0, 0
    # hammer.rotation.set 0, Math.PI / 2, 0
    @hammer = hammer
    @scene.add hammer

    # Helper.orbitControls(engine)

  tick: (tpf) ->
    @hammer.rotation.x += tpf

  doKeyboardEvent: (event) ->
    return if event.type == 'keyup'
    Hodler.item('engine').initScene(Hodler.item('gameScene'))

  doMouseEvent: (event, raycaster) ->
