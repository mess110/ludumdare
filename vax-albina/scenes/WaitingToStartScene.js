class WaitingToStartScene extends Scene {
  init(options) {
    addBaseLight(this)
    Utils.setCursor('assets/hand.png')

    let camera = Hodler.get('camera')
    camera.position.set(0, 10, 15)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    this.cube = new THREE.Object3D()

    let barrel = AssetManager.clone('barrel.001.glb')
    this.barrel = barrel

    this.cube.add(barrel)
    this.cube.rotation.set(0, 0, Math.PI / 2)
    this.add(this.cube)

    let text = new BaseText({
      text: 'waiting for host', fillStyle: 'white',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 256, align: 'center',
      w: 4, h: 2,
      font: '48px luckiest-guy'})
    text.position.set(0, 0, 6)
    text.scale.setScalar(1.8)
    text.lookAt(camera.position)
    this.add(text)

    let backButton = new MenuButton('leave')
    backButton.position.set(0, -5, 3)
    backButton.lookAt(camera.position)
    backButton.onClick = () => {
      backButton.isEnabled = false
      initNetwork()
      Engine.switch(menuScene)
    }
    this.add(backButton)
    this.backButton = backButton

    this.lastGamepadEventTime = 0
  }

  tick(tpf) {
    this.barrel.rotation.y -= tpf
    this.barrel.rotation.x += tpf
    this.backButton.tick(tpf)
  }

  doMouseEvent(event, raycaster) {
    this.backButton.doMouseEvent(event, raycaster)
  }

  doKeyboardEvent(event) {
    if (event.code == 'Space' || event.code == 'Enter') {
      if (event.type == 'keyup') {
        this.backButton.click()
      }
      this.backButton.isPressed = event.type == 'keydown'
    }
  }

  doGamepadEvent(event) {
    if (event.type !== 'gamepadtick-vrum') { return }
    if (this.lastGamepadEventTime + 0.2 > this.uptime) {
      return
    }

    let gamepad = event[0]
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
