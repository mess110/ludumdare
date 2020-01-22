class Health extends THREE.Object3D {
  constructor() {
    super()

    let outlineScalePercent = 10

    let heart = AssetManager.clone('heart.001.glb')
    heart.position.set(-2, 0, 0)
    heart.rotation.set(-0.8, 0, 0)
    Utils.addOutline(heart, outlineScalePercent)
    this.add(heart)

    let heart2 = AssetManager.clone('heart.001.glb')
    heart2.position.set(0, 0, 0)
    heart2.rotation.set(-0.8, 0, 0)
    Utils.addOutline(heart2, outlineScalePercent)
    this.add(heart2)

    let heart3 = AssetManager.clone('heart.001.glb')
    heart3.position.set(2, 0, 0)
    heart3.rotation.set(-0.8, 0, 0)
    Utils.addOutline(heart3, outlineScalePercent)
    this.add(heart3)

    let text = new BaseText({
      text: '', fillStyle: 'white', align: 'center',
      material: THREE.MeshLambertMaterial,
      strokeStyle: 'black', strokeLineWidth: 3,
      w: 16, h: 4,
      canvasW: 1024, canvasH: 256,
      font: '72px luckiest-guy'
    })
    text.rotation.set(-0.9, 0, 0)
    text.position.set(0, -1.5, 4)
    text.material.depthTest = false
    this.add(text)
    this.text = text

    this.position.set(0, 4.5, -2)

    this.health = 3
    this.immuneDuration = 1
    this.timeSinceLastHit = 2
  }

  setText(s) {
    s = s.substring(0, 10);
    this.text.setText(s)
  }

  dmg() {
    if (this.isImune()) {
      return
    }
    this.timeSinceLastHit = 0
    this.health -= 1

    let fadeSpeed = 500
    let easing = TWEEN.Easing.Exponential.Out
    if (this.health == 2) {
      new FadeModifier(this.children[2], 1, 0, fadeSpeed, easing).start()
      new ScaleModifier(this.children[2], 1, 0.5, fadeSpeed, easing).start()
    } else if (this.health == 1) {
      new FadeModifier(this.children[1], 1, 0, fadeSpeed, easing).start()
      new ScaleModifier(this.children[1], 1, 0.5, fadeSpeed, easing).start()
    } else if (this.health == 0) {
      new FadeModifier(this.children[0], 1, 0, fadeSpeed, easing).start()
      new ScaleModifier(this.children[0], 1, 0.5, fadeSpeed, easing).start()
    }
  }

  isDead() {
    return this.health <= 0
  }

  isImune() {
    return this.timeSinceLastHit <= this.immuneDuration
  }

  tick(tpf) {
    this.timeSinceLastHit += tpf
  }
}
