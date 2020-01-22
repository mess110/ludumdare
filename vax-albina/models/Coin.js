class Coin extends THREE.Object3D {
  constructor() {
    super()

    let coin = AssetManager.clone('coin.001.glb')
    Utils.addOutline(coin)
    this.add(coin)

    this.shadowCastAndNotReceive()
    this.reset()
  }

  reset() {
    this.pickedUp = false
    this.speed = 1
    this.scale.setScalar(1)
  }

  tick(tpf) {
    this.rotation.y += tpf * this.speed

    if (this.pickedUp) {
      if (this.speed < 50) {
        this.speed += tpf * 100
      }
      if (this.scale.x > 0.1) {
        this.scale.setScalar(this.scale.x * 0.95)
      } else {
        PoolManager.release(this)
      }
    }
  }

  pickup() {
    if (this.pickedUp) { return }
    this.pickedUp = true
  }
}
