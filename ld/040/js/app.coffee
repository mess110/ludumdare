config = Config.get()
config.fillWindow()
# config.toggleStats()

Helper.orientation('landscape')

# Used to store user id for high scores because I don't have time
# to implement asking for a name
Persist.PREFIX = 'ce.smackem'
unless Persist.get('guid')?
  Persist.set('guid', Helper.guid())

hsm = HighScoreManager.get()
# best security is no security. pls don't quote me, I have less than 40 min left
hsm.auth('ldsmackem', 'ldsmackem')

Hodler.reload = ->
  gameScene = Hodler.item('gameScene')
  if gameScene.readyBaby == true
    gameScene.readyBaby = false
    Hodler.item('engine').initScene(gameScene)

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

Hodler.add('gameScene', new GameScene())

loadingScene = new RealLoadingScene([
  "assets/scenes/start.save.json"
  "assets/logo.png"
  "assets/mole.json"
])
engine.addScene(loadingScene)

engine.start()
