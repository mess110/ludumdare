class LobbyScene extends BaseMenuScene {
  init(options) {
    super.init(options)

    let camera = Hodler.get('camera')
    camera.position.set(0, 15, 25)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    let typeWriter = new TypeWriter({
      backCallback: () => {
        Engine.switch(menuScene)
      },
      enterCallback: () => {
        let roomId = typeWriter.getText()
        initNetwork(roomId)
        Engine.switch(buildScene, undefined, {})
      }
    })
    typeWriter.position.set(0, 8.5, 11)
    typeWriter.rotation.set(-0.5, 0, 0)
    this.add(typeWriter)
    this.typeWriter = typeWriter
  }

  tick(tpf) {
    super.tick(tpf)
    this.typeWriter.tick(tpf)
  }

  doKeyboardEvent(event) {
    this.typeWriter.doKeyboardEvent(event)
  }

  doMouseEvent(event, raycaster) {
    this.typeWriter.doMouseEvent(event, raycaster)
  }

  doGamepadEvent(event) {
    this.typeWriter.doGamepadEvent(event)
  }
}
