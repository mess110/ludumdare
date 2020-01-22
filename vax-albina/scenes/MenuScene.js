class MenuScene extends BaseMenuScene {
  init(options) {
    super.init(options)
    Utils.addCEButton({ type: 'fullscreen', position: 'bottom-left' })

    let camera = Hodler.get('camera')
    camera.position.set(0, 15, 25)
    camera.lookAt(new THREE.Vector3(0, 0, -15))

    this.island.position.set(0, 0, 11)
    this.island.rotation.set(-0.6, 0, 0)

    let tank = new Tank()
    tank.position.set(30.36359783235107, -11.252880241081213, -5.879320361621825)
    tank.rotation.set(-0.5880026035475676, -1, 0)
    tank.scale.setScalar(3)
    tank.setModel(CHASSISES.shuffle().first())
    tank.changeWheels(WHEELS.shuffle().first())
    tank.changeWeapon(WEAPONS.shuffle().first())
    tank.shadowCastAndNotReceive()
    // tank.visible = false
    this.add(tank)

    let duration = 2000
    let pos = {
      x: 10.168294196961579,
      y: -4.0599411590172,
      z: 4.9100882614742005
    }
    new BaseModifier(tank.position, pos, duration, TWEEN.Easing.Bounce.Out).start()
    new BaseModifier(tank.wheels.wheelFR.rotation, { x: '+9' }, duration, TWEEN.Easing.Bounce.Out).start()
    new BaseModifier(tank.wheels.wheelFL.rotation, { x: '+9' }, duration, TWEEN.Easing.Bounce.Out).start()
    new BaseModifier(tank.wheels.wheelBL.rotation, { x: '+9' }, duration, TWEEN.Easing.Bounce.Out).start()
    new BaseModifier(tank.wheels.wheelBR.rotation, { x: '+9' }, duration, TWEEN.Easing.Bounce.Out).start()

    let scanEasing = TWEEN.Easing.Elastic.Out
    let scanDuration = 4000
    var up = new BaseModifier(tank.weapon.rotation, { y: '+0.5' }, scanDuration, scanEasing)
    var down = new BaseModifier(tank.weapon.rotation, { y: '-0.5' }, scanDuration, scanEasing)
    down.delay(4000)
    up.delay(4000)
    up.chain(down)
    down.chain(up)
    this.setTimeout(() => {
      let left = new BaseModifier(tank.weapon.rotation, { y: '-0.25' }, scanDuration / 2, scanEasing)
      left.chain(up)
      left.start()
    }, duration + 100)

    let buttonModels = new THREE.Object3D()

    let tutorialButton = new MenuButton('tutorial')
    tutorialButton.position.set(0, 3, 0)
    tutorialButton.onClick = () => {
      tutorialButton.isEnabled = false
      Engine.switch(tutorialScene, undefined, { clickedWithGamepad: this.clickedWithGamepad })
    }
    buttonModels.add(tutorialButton)
    this.buttons.push(tutorialButton)

    let playButton = new MenuButton('play')
    playButton.position.set(0, 0, 0)
    playButton.onClick = () => {
      playButton.isEnabled = false
      Engine.switch(campaignScene)
    }
    buttonModels.add(playButton)
    this.buttons.push(playButton)

    let multiplayerButton = new MenuButton('options')
    // multiplayerButton.isEnabled = false
    multiplayerButton.position.set(0, -3, 0)
    multiplayerButton.onClick = () => {
      multiplayerButton.isEnabled = false
      Engine.switch(optionsScene)
    }
    buttonModels.add(multiplayerButton)
    this.buttons.push(multiplayerButton)

    let creditsButton = new MenuButton('credits')
    creditsButton.position.set(0, -6, 0)
    creditsButton.onClick = () => {
      creditsButton.isEnabled = false
      Engine.switch(creditsScene)
    }
    buttonModels.add(creditsButton)
    this.buttons.push(creditsButton)

    let p = AssetManager.clone('plaque.001.glb')
    Utils.addOutline(p)
    p.position.set(0, -2.75, -0.5)
    buttonModels.add(p)

    buttonModels.position.set(-6.95, 8.5, 7.9)
    buttonModels.lookAt(camera.position)

    this.buttonModels = buttonModels
    this.add(buttonModels)

    let gameName = new BaseText({
      text: 'Vax Albina', fillStyle: 'white', align: 'center',
      strokeStyle: 'black', strokeLineWidth: 2,
      canvasW: 512, canvasH: 512,
      w: 15, h: 15,
      font: '86px luckiest-guy'})
    gameName.position.set(0, 10, 0)
    gameName.lookAt(camera.position)
    this.add(gameName)

    this.leftArray = [0, 1, 2, 3].toCyclicArray()
    this.leftArray.prev()
  }

  uninit() {
    Utils.removeCEButtons()
  }

  doKeyboardEvent(event) {
    if (['ArrowUp', 'ArrowDown'].includes(event.code)) {
      if (event.type !== 'keydown') { return }

      let hasHover = false
      this.buttons.forEach((button) => {
        hasHover = hasHover || button.isHovered
        button.isHovered = false
      })

      if (event.code == 'ArrowDown') {
        this.buttons[this.leftArray.next()].isHovered = true
      }

      if (event.code == 'ArrowUp') {
        if (!hasHover) {
          this.leftArray.next()
        }
        this.buttons[this.leftArray.prev()].isHovered = true
      }
    }

    if (event.code == 'Space' || event.code == 'Enter') {
      this.buttons.forEach((button) => {
        if (button.isHovered) {
          if (event.type == 'keyup') {
            button.click()
          }
          button.isPressed = event.type == 'keydown'
        }
      })
    }
  }
}
