Persist.PREFIX = 'vax.albina'
if (isBlank(Persist.get('roomId'))) {
  Persist.default('roomId', Utils.guid())
}

Config.instance.engine.prod = true
Config.instance.engine.debug = !Config.instance.engine.prod
Config.instance.window.showStatsOnStart = !Config.instance.engine.prod
// Config.instance.window.showStatsOnStart = false

Config.instance.vax = {
  skyColor: '#29bbf4',
  groundColor: '#55AA55',
  stoneColor: '#6C8D9A',
  lighColor: 0xffffff,

  gameStartDelay: 5500,

  WaitingPhase: 0,
  FightPhase: 1,
  ShopPhase: 2,
  EndPhase: 3,


  KEYBOARD: 'K',
  GAMEPAD1: 'G1',
  GAMEPAD2: 'G2',
  GAMEPAD3: 'G3',
  GAMEPAD4: 'G4',
  MOBILE: 'M',
  CONTROLLER: 'C',
  NETWORK: 'N',
  BOT: 'B',
  BOT_NETWORK: 'BN',
}

PoolManager.on('spawn', Explosion, (item, options) => {
  item.from(options.from)
  item.explosion.enable()
  Hodler.get('scene').add(item)
})
PoolManager.on('release', Explosion, (item) => {
  item.explosion.disable()
  Hodler.get('scene').remove(item)
})

PoolManager.on('spawn', Bullet, (item, options) => {
  item.from(options)
  Hodler.get('scene').add(item)
})
PoolManager.on('release', Bullet, (item) => {
  Hodler.get('scene').remove(item)
})

PoolManager.on('spawn', Coin, (item, options) => {
  item.reset()
  item.position.copy(options.position)
  Hodler.get('scene').add(item)
})
PoolManager.on('release', Coin, (item, options) => {
  Hodler.get('scene').remove(item)
})

let menuScene = new MenuScene()
let campaignScene = new CampaignScene()
let lobbyScene = new LobbyScene()
let buildScene = new BuildScene()
let screenshotScene = new ScreenshotScene()
let tutorialScene = new TutorialScene()
let optionsScene = new OptionsScene()
let inviteScene = new InviteScene()

let creditsScene = new AddsScene(menuScene, ["vrum-text.png", "credits.png"])

let sceneAfterLoading = menuScene
let directRoomId = MeshNetwork.getRoomId()
const myRoomId = Persist.get('roomId')
if (isBlank(directRoomId)) {
  directRoomId = myRoomId
} else {
  sceneAfterLoading = campaignScene
}
if (!Config.instance.engine.prod) { sceneAfterLoading = menuScene }

let loadingScene = new VaxLoadingScene(sceneAfterLoading, [
  { type: 'image', path: 'assets/hand.png' },

  { type: 'image', path: 'assets/spe_smokeparticle.png' },
  { type: 'image', path: 'assets/spe_star.png' },
  { type: 'json', path: 'assets/hit.json' },

  { type: 'model', path: 'assets/models/ammo.001.glb' },
  { type: 'model', path: 'assets/models/ammo.002.glb' },
  // { type: 'model', path: 'assets/models/barrel.001.glb' }, // already loaded
  { type: 'model', path: 'assets/models/button.bg.001.glb' },
  { type: 'model', path: 'assets/models/button.fg.001.glb' },
  { type: 'model', path: 'assets/models/button.bg.002.glb' },
  { type: 'model', path: 'assets/models/button.fg.002.glb' },
  { type: 'model', path: 'assets/models/button.bg.003.glb' },
  { type: 'model', path: 'assets/models/button.fg.003.glb' },
  { type: 'model', path: 'assets/models/crown.001.glb' },
  { type: 'model', path: 'assets/models/chassis.001.glb' },
  { type: 'model', path: 'assets/models/chassis.002.glb' },
  { type: 'model', path: 'assets/models/chassis.003.glb' },
  { type: 'model', path: 'assets/models/chassis.004.glb' },
  { type: 'model', path: 'assets/models/chassis.005.glb' },
  { type: 'model', path: 'assets/models/cloud.001.glb' },
  { type: 'model', path: 'assets/models/coin.001.glb' },
  { type: 'model', path: 'assets/models/flag.001.glb' },
  { type: 'model', path: 'assets/models/friendzone.001.glb' },
  { type: 'model', path: 'assets/models/ground.001.glb' },
  { type: 'model', path: 'assets/models/heart.001.glb' },
  { type: 'model', path: 'assets/models/rench.001.glb' },
  { type: 'model', path: 'assets/models/tower.001.glb' },
  { type: 'model', path: 'assets/models/island.002.glb' },
  { type: 'model', path: 'assets/models/island.002.walk.glb' },
  { type: 'model', path: 'assets/models/tree.001.glb' },
  { type: 'model', path: 'assets/models/plaque.001.glb' },
  { type: 'model', path: 'assets/models/practice.dummy.001.glb' },
  { type: 'model', path: 'assets/models/wall.001.glb' },
  { type: 'model', path: 'assets/models/wall.002.glb' },
  { type: 'model', path: 'assets/models/wall.corner.001.glb' },
  { type: 'model', path: 'assets/models/weapon.001.glb' },
  { type: 'model', path: 'assets/models/weapon.002.glb' },
  { type: 'model', path: 'assets/models/weapon.003.glb' },
  { type: 'model', path: 'assets/models/weapon.004.glb' },
  { type: 'model', path: 'assets/models/wheel.001.glb' },
  { type: 'model', path: 'assets/models/wheel.002.glb' },
  { type: 'model', path: 'assets/models/wheel.003.glb' },
])
let logosScene = new AddsScene(loadingScene, ["logo.png"])

const addBaseLight = (scene) => {
  PoolManager.releaseAll()

  let light = new THREE.PointLight(Config.instance.vax.lighColor, 0.25, 0, 2)
  light.position.set(0, 20, 0)
  scene.add(light)

  let ambient = new THREE.AmbientLight(Config.instance.vax.lighColor, 0.9)
  scene.add(ambient)

  if (Utils.isMobileOrTablet()) {
    Utils.setShadowDetails('low')
  } else {
    Utils.setShadowDetails('high')
  }
  Utils.toggleShadows()
}

let sceneAfterInit = Config.instance.engine.prod ? logosScene : loadingScene

Utils.setCursor('none')

const CHASSISES = ['chassis.001.glb', 'chassis.002.glb', 'chassis.003.glb', 'chassis.004.glb', 'chassis.005.glb']
const WHEELS = ['wheel.001.glb', 'wheel.002.glb', 'wheel.003.glb']
const WEAPONS = ['weapon.001.glb', 'weapon.002.glb', 'weapon.003.glb']

Engine.start(sceneAfterInit, [
  { type: 'font', path: 'assets/luckiest-guy' },
  { type: 'image', path: 'assets/vrum-text.png'},
  { type: 'image', path: 'assets/logo.png'},
  { type: 'image', path: 'assets/credits.png'},
  { type: 'model', path: 'assets/models/barrel.001.glb' },
])

initNetwork(directRoomId)
// AfterEffects.prototype.effects = AfterEffects.bloomFilm
// Hodler.get('afterEffects').enable()
