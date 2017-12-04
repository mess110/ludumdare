config = Config.get()
config.fillWindow()
# config.toggleStats()

Helper.orientation('landscape')

AfterEffects::effects = ->
  @renderModel = new (THREE.RenderPass)(undefined, undefined) # scene, camera
  effectBloom = new (THREE.BloomPass)(1.25)
  # effectCopy = new (THREE.ShaderPass)(THREE.CopyShader)
  # effectCopy.renderToScreen = true
  effectFilm = new (THREE.FilmPass)(0.15, 0.95, 2048, false)
  effectFilm.renderToScreen = true
  @composer = new (THREE.EffectComposer)(@engine.renderer)
  @composer.addPass @renderModel
  @composer.addPass effectBloom
  # @composer.addPass effectCopy
  @composer.addPass effectFilm

engine = Hodler.add('engine', new Engine3D())
Hodler.add('afterEffects', new AfterEffects(engine))

Hodler.add('menuScene', new MenuScene())
Hodler.add('gameScene', new GameScene())

loadingScene = new RealLoadingScene([
  "assets/scenes/start.save.json"
  "assets/logo.png"
  "assets/mole.json"
])
engine.addScene(loadingScene)

engine.start()
