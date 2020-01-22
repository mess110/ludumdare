class Player extends Tank {
  constructor() {
    super()

    this.speed = 10
    this.acceleration = 2
    this.shootCooldown = 0.2
    this.timeSinceLastShot = 0
    this.size = 4
    this.coinsPickedUp = 0
    this.shooting = false

    let control = new PositionXZRotationYControls()
    control.speed = this.speed
    control.acceleration = this.acceleration
    this.control = control

    let controlWeapon = new PositionXZRotationYControls()
    controlWeapon.keybindings = {
      'Forward': 'ArrowUp',
      'Backward': 'ArrowDown',
      'Left': 'ArrowLeft',
      'Right': 'ArrowRight',
    }
    controlWeapon.gamepadbindings = {
      'StickLeftRight': 2,
      'StickUpDown': 3,
    }
    controlWeapon.speed = this.speed
    controlWeapon.acceleration *= this.acceleration
    this.controlWeapon = controlWeapon

    let rayScanner = new RayScanner()
    // rayScanner.drawLines = Config.instance.engine.debug
    this.rayScanner = rayScanner

    let health = new Health()
    this.add(health)
    this.health = health

    let boundingCube = Utils.boundingBox({size: this.size})
    boundingCube.position.y = 2
    this.add(boundingCube)
    this.boundingCube = boundingCube
  }

  shoot() {
    if (this.timeSinceLastShot < this.shootCooldown) {
      return
    }

    let duration = this.shootCooldown * 1000 / 2
    let tween = new TWEEN.Tween(this.weapon.position)
    const amount = 0.5
    this.weapon.translateZ(amount * -1)
    let poscopy = this.weapon.position.clone()
    this.weapon.translateZ(amount)

    tween.easing(TWEEN.Easing.Quartic.Out)
    tween.to(poscopy, duration)
    tween.onUpdate((value) => {
      this.weapon.translateZ(-0.05)
    }).start()

    setTimeout(() => {
      let tween2 = new TWEEN.Tween(this.weapon.position)
      tween2.to(new THREE.Vector3(0, 2.65, 0), duration)
      tween2.easing(TWEEN.Easing.Cubic.Out)
      tween2.onUpdate((value) => {
        this.weapon.translateZ(0.05)
      }).start()
    }, duration)

    this.timeSinceLastShot = 0
    let netBullet = {
      vrumKey: this.vrumKey,
      vrumOwner: this.vrumOwner,
      position: { x: this.position.x, y: 2.65, z: this.position.z },
      rotation: { x: this.weapon.rotation.x, y: this.weapon.rotation.y, z: this.weapon.rotation.z },
    }

    if (this.isNetwork) {
      if (this.isController) {
        PoolManager.spawn(Bullet, netBullet)
      }
    } else {
      PoolManager.spawn(Bullet, netBullet)
      MeshNetwork.instance.bullets.push(netBullet)
    }
  }

  move(direction) {
    this._controlAction(this.control, direction)
  }

  turn(direction) {
    this._controlAction(this.controlWeapon, direction)
  }

  _controlAction(control, direction) {
    control.doKeyboardEvent({code: control.keybindings['Forward'], type: 'keyup'})
    control.doKeyboardEvent({code: control.keybindings['Backward'], type: 'keyup'})
    control.doKeyboardEvent({code: control.keybindings['Left'], type: 'keyup'})
    control.doKeyboardEvent({code: control.keybindings['Right'], type: 'keyup'})

    if (!isArray(direction)) {
      direction = [direction]
    }
    direction.forEach((dir) => {
      control.doKeyboardEvent({code: control.keybindings[dir], type: 'keydown'})
    })
  }

  tick(tpf) {
    this.timeSinceLastShot += tpf

    this.control.tick(tpf)
    this.controlWeapon.tick(tpf)
    if (this.shooting) {
      this.shoot()
    }
    this.health.tick(tpf)

    if (this.health.isImune()) {
      this.chassis.setOpacity(0.5)
      this.wheels.setOpacity(0.5)
      this.weapon.setOpacity(0.5)
    } else {
      this.chassis.setOpacity(1)
      this.wheels.setOpacity(1)
      this.weapon.setOpacity(1)
    }

    if (this.control.isMoving()) {
      this.wheels.tick(tpf * 2)
    }
    this.chassis.rotation.y = this.control.rotationY
    this.wheels.rotation.y = this.control.rotationY
    this.weapon.rotation.y = this.controlWeapon.rotationY

    let fromPosition = this.position.clone()
    fromPosition.y += 2
    this.rayScanner.scan(fromPosition, this.control.velocity)

    if (this.rayScanner.addX) {
      this.position.x += this.control.velocity.x
    }
    if (this.rayScanner.addZ) {
      this.position.z += this.control.velocity.z
    }
  }

  doKeyboardEvent(event) {
    this.control.doKeyboardEvent(event)
    this.controlWeapon.doKeyboardEvent(event)

    if (event.code == 'Space') {
      this.shooting = event.type == 'keydown'
    }
  }

  doGamepadEvent(event, gamepadIndex) {
    if (isBlank(gamepadIndex)) { gamepadIndex = 0 }
    this.control.doGamepadEvent(event, gamepadIndex)
    this.controlWeapon.doGamepadEvent(event, gamepadIndex)

    let gamepad = event[gamepadIndex]
    if (isBlank(gamepad)) { return }

    let xPressed = gamepad.buttons[0].pressed
    let gamepadExtremes = this.controlWeapon.getGamepadDeltaX(gamepad) > 0.85 ||
                          this.controlWeapon.getGamepadDeltaX(gamepad) < -0.85 ||
                          this.controlWeapon.getGamepadDeltaY(gamepad) > 0.85 ||
                          this.controlWeapon.getGamepadDeltaY(gamepad) < -0.85

    this.shooting = xPressed || gamepadExtremes
  }

  doMobileEvent(vj) {
    let joystickLeft = vj.joystickLeft
    let joystickRight = vj.joystickRight

    this.control.doMobileEvent(joystickLeft)
    this.controlWeapon.doMobileEvent(joystickRight)

    if (!isBlank(joystickRight)) {
      let deltaX = joystickRight.deltaX()
      let deltaY = joystickRight.deltaY()
      this.shooting = deltaX > 40 || deltaX < -40 || deltaY > 40 || deltaY < -40
    }
  }

  doVrumControllerEvent(event) {
    if (event.type !== 'vrum-controller') { return }

    let joystickLeft = event.joystickLeft
    let joystickRight = event.joystickRight

    this.control.doMobileEvent(this.control.vrumControl2Jostick(joystickLeft))
    this.controlWeapon.doMobileEvent(this.controlWeapon.vrumControl2Jostick(joystickRight))

    if (!isBlank(joystickRight)) {
      let deltaX = joystickRight.dX
      let deltaY = joystickRight.dY
      this.shooting = deltaX > 40 || deltaX < -40 || deltaY > 40 || deltaY < -40
    }
  }

  shadowCastAndNotReceive() {
    super.shadowCastAndNotReceive()
    this.health.shadowNone()
  }
}
