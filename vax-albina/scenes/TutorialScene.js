class TutorialScene extends GameScene {
  init(options) {
    super.init(options)

    let infoText = '    WASD KEYS   TO MOVE'
    if (VirtualController.isAvailable() || this.inputMapper.hasGamepad() || options.clickedWithGamepad) {
      infoText = '          LEFT              JOYSTICK     TO MOVE'
    } else {
    }
    this.setInfoMsg(infoText)

    this.tutorialStage = 0
  }

  tick(tpf) {
    super.tick(tpf)

    this.characters.forEach((player) => {
      player.tick(tpf)

      PoolManager.itemsInUse(Coin).forEach((coin) => {
        if (!coin.pickedUp) {
          this.hitVector.setFromMatrixPosition(player.boundingCube.matrixWorld)
          let distance = Measure.distanceBetween(coin, this.hitVector)
          if (distance < 3) {
            coin.pickup()
            this.score.bump()
          }
        }
      })

      if (this.tutorialStage == 4) {
        if (player.position.x > 35) {
          this.tutorialStage = 5
          Engine.switch(menuScene)
        }
      }

      if (this.tutorialStage == 3) {
        PoolManager.itemsInUse(Bullet).forEach((bullet) => {
          let distance = Measure.distanceBetween(bullet, this.practiceDummy)
          if (distance < 4) {
            PoolManager.release(bullet)
            this.tutorialStage = 4
            new FadeModifier(this.practiceDummy, 1, 0, 500).start()
            this.setTimeout(() => {
              this.setInfoMsg('  EXIT STAGE   RIGHT')
              this.remove(this.practiceDummy)
            }, 500)
          }
        })
      }

      if (this.tutorialStage == 2) {
        if (player.controlWeapon.isMoving()) {
          this.tutorialStage = 3
          let infoText = 'PRESS SPACE TO SHOOT'
          if (VirtualController.isAvailable() || this.inputMapper.hasGamepad()) {
            infoText = '          LEFT              JOYSTICK     TO SHOOT'
          }
          this.setInfoMsg(infoText)
        }
      }

      if (this.tutorialStage == 1) {
        if (this.score.score >= 7) {
          this.tutorialStage = 2

          let infoText = 'ARROW KEYS TO AIM'
          if (VirtualController.isAvailable() || this.inputMapper.hasGamepad()) {
            infoText = '          LEFT              JOYSTICK     TO AIM'
          }
          this.setInfoMsg(infoText)

          let practiceDummy = AssetManager.clone('practice.dummy.001.glb')
          practiceDummy.position.set(0, 0, -16)
          practiceDummy.shadowCastAndNotReceive()
          this.add(practiceDummy)
          this.practiceDummy = practiceDummy
        }
      }

      if (this.tutorialStage == 0) {
        if (player.control.isMoving()) {
          PoolManager.spawn(Coin, { position: new THREE.Vector3(9, 2, 16) })
          PoolManager.spawn(Coin, { position: new THREE.Vector3(6, 2, 18) })
          PoolManager.spawn(Coin, { position: new THREE.Vector3(3, 2, 19) })
          PoolManager.spawn(Coin, { position: new THREE.Vector3(0, 2, 20) })
          PoolManager.spawn(Coin, { position: new THREE.Vector3(-3, 2, 19) })
          PoolManager.spawn(Coin, { position: new THREE.Vector3(-6, 2, 18) })
          PoolManager.spawn(Coin, { position: new THREE.Vector3(-9, 2, 16) })

          this.tutorialStage = 1
          this.setInfoMsg(' PICK UP ALL  THE COINS')
        }
      }
    })
  }
}
