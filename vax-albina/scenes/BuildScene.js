class BuildScene extends Scene {
  init(options) {
    addBaseLight(this)
    Utils.setCursor('assets/hand.png')

    let camera = this.getCamera()
    camera.position.set(0, 10, 15)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let barrel = AssetManager.clone('barrel.001.glb')
    barrel.position.set(0, -4.5, 0)
    barrel.shadowReceive()
    this.add(barrel)

    for (var i = 0; i < 10; i++) {
      let wall = AssetManager.clone('wall.001.glb')
      wall.position.set(-30 + i * 6, -4.5, -10)
      wall.rotation.set(0, Math.PI, 0)
      this.add(wall)
    }

    let ground = Utils.plane({width: 60, height: 20,
      materialType: THREE.MeshLambertMaterial,
      color: Config.instance.vax.groundColor })
    ground.position.set(0, -4.5, 0)
    ground.rotation.set(Math.PI / 2, 0, 0)
    ground.shadowReceive()
    this.add(ground)

    this.buttons = []

    let tank = new Tank()
    tank.position.set(0, 0, 1)
    tank.fromJsonModel(Persist.getJson('skin'))
    tank.shadowCastAndNotReceive()
    this.add(tank)
    this.tank = tank

    let sky = Utils.plane({size: 1000, color: Config.instance.vax.skyColor })
    sky.position.set(0, 0, -30)
    this.add(sky)

    // let sky = new Sky()
    // sky.updateSun(sky.distance, 0.1, sky.azimuth)
    // this.add(sky)
    // this.sky = sky

    this.mouseDown = false
    this.stopAutoRotate = false
    this.heldButton = undefined

    let chassisButton = new MenuButton('chassis')
    chassisButton.position.set(-7, 4.75, -3)
    chassisButton.lookAt(Hodler.get('camera').position)
    chassisButton.onClick = () => {
      let tank = Hodler.get('scene').tank
      tank.nextChassis()
      tank.shadowCastAndNotReceive()
    }
    this.add(chassisButton)
    this.buttons.push(chassisButton)

    let weaponButton = new MenuButton('weapon')
    weaponButton.position.set(0, 5, -3)
    weaponButton.lookAt(Hodler.get('camera').position)
    weaponButton.onClick = () => {
      let tank = Hodler.get('scene').tank
      tank.nextWeapon()
      tank.shadowCastAndNotReceive()
    }
    this.add(weaponButton)
    this.buttons.push(weaponButton)

    let wheelButton = new MenuButton('wheels')
    wheelButton.position.set(7, 4.75, -3)
    wheelButton.lookAt(Hodler.get('camera').position)
    wheelButton.onClick = () => {
      let tank = Hodler.get('scene').tank
      tank.nextWheels()
      tank.shadowCastAndNotReceive()
    }
    this.add(wheelButton)
    this.buttons.push(wheelButton)

    let saveButton = new MenuButton('save')
    saveButton.position.set(5, -2, 4)
    saveButton.lookAt(Hodler.get('camera').position)
    saveButton.onClick = () => {
      saveButton.isEnabled = false
      Persist.setJson('skin', this.tank.toJsonModel())
      Engine.switch(optionsScene)
    }
    this.add(saveButton)
    this.buttons.push(saveButton)

    let backButton = new MenuButton('back')
    backButton.position.set(-5, -2, 4)
    backButton.lookAt(Hodler.get('camera').position)
    backButton.onClick = () => {
      backButton.isEnabled = false
      Engine.switch(optionsScene)
    }
    this.add(backButton)
    this.buttons.push(backButton)

    this.resetMenu()
    this.lastGamepadEventTime = 0
  }

  resetMenu() {
    this.topMenu = [0, 1, 2].toCyclicArray()
    this.bottomMenu = [3, 4].toCyclicArray()
  }

  tick(tpf) {
    this.tank.wheels.wheelFL.tick(-tpf)
    this.tank.wheels.wheelFR.tick(tpf)
    this.tank.wheels.wheelBL.tick(-tpf)
    this.tank.wheels.wheelBR.tick(tpf)
    this.tank.rotation.y += tpf
    this.buttons.forEach((button) => {
      button.tick(tpf)
    })
  }

  doMouseEvent(event, raycaster) {
    if (event.type == 'mousedown') {
      this.mouseDown = true
    }
    if (event.type == 'mouseup') {
      this.mouseDown = false
    }
    this.buttons.forEach((button) => {
      button.doMouseEvent(event, raycaster)
    })
  }

  doKeyboardEvent(event) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      if (event.type !== 'keydown') { return }

      if (event.code == 'ArrowUp') {
        this.resetMenu()
        this.buttons[0].isHovered = true
        this.buttons[1].isHovered = false
        this.buttons[2].isHovered = false
        this.buttons[3].isHovered = false
        this.buttons[4].isHovered = false
      }
      if (event.code == 'ArrowDown') {
        this.resetMenu()
        this.buttons[0].isHovered = false
        this.buttons[1].isHovered = false
        this.buttons[2].isHovered = false
        this.buttons[3].isHovered = true
        this.buttons[4].isHovered = false
      }

      let topIsHovered = this.buttons[0].isHovered || this.buttons[1].isHovered || this.buttons[2].isHovered
      let bottomIsHovered = this.buttons[3].isHovered || this.buttons[4].isHovered

      if (event.code == 'ArrowLeft') {
        if (topIsHovered) {
          this.buttons[this.topMenu.get()].isHovered = false
          this.buttons[this.topMenu.prev()].isHovered = true
        }
        if (bottomIsHovered) {
          this.buttons[this.bottomMenu.get()].isHovered = false
          this.buttons[this.bottomMenu.prev()].isHovered = true
        }
      }
      if (event.code == 'ArrowRight') {
        if (topIsHovered) {
          this.buttons[this.topMenu.get()].isHovered = false
          this.buttons[this.topMenu.next()].isHovered = true
        }
        if (bottomIsHovered) {
          this.buttons[this.bottomMenu.get()].isHovered = false
          this.buttons[this.bottomMenu.next()].isHovered = true
        }
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
      this.doKeyboardEvent({type: 'keydown', code: 'Space'})
      this.setTimeout(() => {
        this.doKeyboardEvent({type: 'keyup', code: 'Space'})
      }, 100)
      this.lastGamepadEventTime = this.uptime
    }
  }
}
