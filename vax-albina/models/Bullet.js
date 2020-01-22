class Bullet extends THREE.Object3D {
  constructor() {
    super()

    let coin = AssetManager.clone('ammo.002.glb')
    Utils.addOutline(coin)
    this.add(coin)
    this.maxLifeTime = 5

    this.shadowCastAndNotReceive()
  }

  from(options) {
    this.lifeTime = 0
    this.vrumKey = options.vrumKey
    this.vrumOwner = options.vrumOwner
    this.position.set(options.position.x, options.position.y, options.position.z)
    this.rotation.set(options.rotation.x, options.rotation.y, options.rotation.z)
    this.translateZ(2.5)
  }

  tick(tpf) {
    this.rotation.z += tpf * 5
    this.translateZ(tpf * 35)
    this.lifeTime += tpf
    if (this.lifeTime > this.maxLifeTime) {
      PoolManager.release(this)
    }
  }
}
