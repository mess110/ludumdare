class VaxLoadingScene extends LoadingScene {
  initCallback() {
    addBaseLight(this)
    this.cube = new THREE.Object3D()

    let barrel = AssetManager.clone('barrel.001.glb')
    this.barrel = barrel

    this.cube.add(barrel)
    this.cube.rotation.set(0, 0, Math.PI / 2)
    this.add(this.cube)

    let text = new BaseText({
      text: 'loading', fillStyle: 'white',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 512, align: 'center',
      font: '84px luckiest-guy'})
    text.position.set(0, 0, 6)
    text.lookAt(Hodler.get('camera').position)
    this.add(text)
  }

  tick(tpf) {
    this.barrel.rotation.y -= tpf
    this.barrel.rotation.x += tpf
  }
}
