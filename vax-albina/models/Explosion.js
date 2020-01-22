class Explosion extends THREE.Object3D {
  constructor() {
    super()

    let jsonParticleData = AssetManager.get('hit.json').particle
    let explosion = new BaseParticle(jsonParticleData)
    this.add(explosion)

    this.explosion = explosion
  }

  from(target) {
    this.position.copy(target.position)
  }
}
