class Score extends THREE.Object3D {
  constructor() {
    super()

    this.score = 0

    let scoreText = new BaseText({
      text: '0', fillStyle: 'white', align: 'center',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 512,
      font: '72px luckiest-guy'
    })
    this.add(scoreText)

    let coin = AssetManager.clone('coin.001.glb')
    Utils.addOutline(coin)
    coin.scale.setScalar(0.25)
    coin.position.set(0.6, 1.4, 0)
    this.add(coin)

    this.position.set(0, 2.9, -10)

    let levelInfo = new LvlInfo()
    this.levelInfo = levelInfo
    this.add(levelInfo)
  }

  bump() {
    this.score += 1
    this.children[0].setText(this.score)
  }

  tick(tpf) {
    this.children[1].rotation.y += tpf
  }
}

class LvlInfo extends THREE.Object3D {
  constructor() {
    super()

    let width = 1.5
    this.position.set(-6 * width - width / 2, -8, -6)

    for (var i = 1; i <= 12; i++) {
      let tmp = new LvlIndicator(i % 4 == 0)
      tmp.position.x = i * width
      this.add(tmp)
    }

    this.opacity = 0
    this.setOpacity(this.opacity)
  }

  setLevel(index) {
    if (index < 0) { index = 0 }
    this.children.forEach((lvlIndicator, i) => {
      if (index < i) {
        lvlIndicator.setColor('black')
      } else if (index > i) {
        lvlIndicator.setColor('white')
      } else {
        lvlIndicator.setColor('orange')
      }
    })
    new FadeModifier(this, 0, 1).delay(500).start()
    new FadeModifier(this, 1, 0).delay(Config.instance.vax.gameStartDelay).start()
  }
}

class LvlIndicator extends THREE.Object3D {
  constructor(boss) {
    super()

    let base = AssetManager.clone('ammo.001.glb')

    if (boss) {
      let crown = AssetManager.clone('crown.001.glb')
      crown.scale.setScalar(0.6)
      crown.position.set(0, 0.4, 0)
      base.add(crown)
    }

    this.add(base)
  }

  setColor(color) {
    if (!(color instanceof THREE.Color)) {
      color = new THREE.Color(color)
    }
    this.children[0].children[0].material.color = color
  }
}
