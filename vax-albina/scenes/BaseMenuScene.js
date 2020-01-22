class BaseMenuScene extends Scene {
  init(options) {
    addBaseLight(this)
    Utils.setCursor('assets/hand.png')

    let camera = Hodler.get('camera')

    let sky = Utils.plane({size: 1000, color: Config.instance.vax.skyColor})
    sky.position.set(0, 0, -50)
    sky.lookAt(camera.position)
    this.add(sky)

    this.initClouds()

    let island = AssetManager.clone('island.002.glb')
    this.add(island)
    island.shadowReceive()
    this.island = island

    this.clickedWithGamepad = false
    this.buttons = []
    this.lastGamepadEventTime = 0
  }

  initClouds() {
    let om = Utils.outlineMaterial('white', 0.001)

    let cloud = AssetManager.clone('cloud.001.glb')
    cloud.position.set(-50, 15, -30)
    cloud.rotation.set(-0.25, 0, 0)
    cloud.setOpacity(0.4)
    Utils.addOutline(cloud, 10, om)
    cloud.outline.setOpacity(0.1)
    this.add(cloud)

    let scanEasing = TWEEN.Easing.Quadratic.InOut
    let scanDuration = 4000
    var up = new BaseModifier(cloud.rotation, { x: '+0.5' }, scanDuration, scanEasing)
    var down = new BaseModifier(cloud.rotation, { x: '-0.5' }, scanDuration, scanEasing)
    up.chain(down)
    down.chain(up)
    up.start()

    scanDuration = 20000
    var left = new BaseModifier(cloud.position, { x: '+100' }, scanDuration, scanEasing)
    var right = new BaseModifier(cloud.position, { x: '-100' }, scanDuration, scanEasing)
    left.chain(right)
    right.chain(left)
    left.start()
  }

  tick(tpf) {
    this.island.rotation.y += tpf / 100

    this.buttons.forEach((button) => {
      button.tick(tpf)
    })
  }

  doMouseEvent(event, raycaster) {
    this.buttons.forEach((button) => {
      button.doMouseEvent(event, raycaster)
    })
  }

  doGamepadEvent(event) {
    if (event.type !== 'gamepadtick-vrum') { return }
    if (this.lastGamepadEventTime + 0.2 > this.uptime) {
      return
    }
    let gamepad = event[0]
    if (gamepad.axes[1] > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowDown'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.axes[1] < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowUp'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.axes[0] < -0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowLeft'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.axes[0] > 0.5) {
      this.doKeyboardEvent({type: 'keydown', code: 'ArrowRight'})
      this.lastGamepadEventTime = this.uptime
    }
    if (gamepad.buttons[0].pressed) {
      this.clickedWithGamepad = true
      this.doKeyboardEvent({type: 'keydown', code: 'Enter'})
      this.setTimeout(() => {
        this.doKeyboardEvent({type: 'keyup', code: 'Enter'})
      }, 100)
      this.lastGamepadEventTime = this.uptime
    }
  }
}
