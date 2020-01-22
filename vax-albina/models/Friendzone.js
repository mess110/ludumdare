class Friendzone extends THREE.Object3D {
  constructor() {
    super()

    this.unit = 5.25
    this.size = 1
    this.opacity = 0.5
    this.maxOpacity = 0.5

    let model1 = AssetManager.clone('friendzone.001.glb')
    model1.setDoubleSided()
    this.model1 = model1
    this.add(model1)

    let model2 = AssetManager.clone('friendzone.001.glb')
    model2.setDoubleSided()
    this.model2 = model2
    this.add(model2)

    this.setSize(1)
    this.setColors('lightblue', 'cyan')
  }

  setSize(size) {
    let percent = 1.10
    this.size = size
    this.model1.scale.set(size, 1, size)
    this.model2.scale.set(size * percent, 1, size * percent)
  }

  setColors(color1, color2) {
    if (!(color1 instanceof THREE.Color)) {
      color1 = new THREE.Color(color1)
    }
    if (!(color2 instanceof THREE.Color)) {
      color2 = new THREE.Color(color2)
    }
    this.model1.children[0].material.color = color1
    this.model2.children[0].material.color = color2
  }

  tick(tpf, lerpTarget, characters) {
    this.position.copy(lerpTarget)

    this.furthestAway = 0
    let allIn = true
    characters.forEach((character) => {
      let distance = Measure.distanceBetween(character, lerpTarget)
      if (Math.abs(distance) > this.furthestAway) {
        this.furthestAway = Math.abs(distance)
      }
      if (distance > this.size * this.unit) {
        allIn = false
      }
    })
    if (allIn) {
      this.opacity += tpf
      if (this.opacity > this.maxOpacity) { this.opacity = this.maxOpacity }
    } else {
      this.opacity -= tpf
      if (this.opacity < 0) { this.opacity = 0 }
    }
    this.allIn = allIn

    if (characters.size() < 2) {
      this.opacity = 0
    }
    this.position.y = this.opacity * 2 - this.maxOpacity * 2
    this.setOpacity(this.opacity)

    this.model1.rotation.y += tpf
    this.model2.rotation.y -= tpf
  }
}
