class InviteScene extends BaseMenuScene {
  init(options) {
    super.init(options)

    console.log(getInviteLink())
    console.log(getJoystickLink())

    let camera = Hodler.get('camera')
    camera.position.set(0, 15, 25)
    // camera.lookAt(new THREE.Vector3(0, 0, 0))
    camera.lookAt(new THREE.Vector3(0, 0, -25))

    let buttonModels = new THREE.Object3D()

    let tutorialButton = new MenuButton('net url')
    tutorialButton.position.set(0, 3, 0)
    tutorialButton.onClick = () => {
      Utils.copyToClipboard(getInviteLink())
    }
    buttonModels.add(tutorialButton)
    this.buttons.push(tutorialButton)

    let playButton = new MenuButton('joystick url')
    playButton.position.set(0, 0, 0)
    playButton.onClick = () => {
      Utils.copyToClipboard(getJoystickLink())
    }
    buttonModels.add(playButton)
    this.buttons.push(playButton)

    // let multiplayerButton = new MenuButton('options')
    // multiplayerButton.position.set(0, -3, 0)
    // multiplayerButton.onClick = () => {
      // multiplayerButton.isEnabled = false
      // Engine.switch(optionsScene)
    // }
    // buttonModels.add(multiplayerButton)
    // this.buttons.push(multiplayerButton)

    let creditsButton = new MenuButton('back')
    creditsButton.position.set(0, -6, 0)
    creditsButton.onClick = () => {
      creditsButton.isEnabled = false
      Engine.switch(optionsScene)
    }
    buttonModels.add(creditsButton)
    this.buttons.push(creditsButton)

    let p = AssetManager.clone('plaque.001.glb')
    Utils.addOutline(p)
    p.position.set(0, -2.75, -0.5)
    buttonModels.add(p)

    // buttonModels.position.set(-6.95, 8.5, 7.9)
    buttonModels.position.set(0, 8.5, 7.9)
    // buttonModels.lookAt(camera.position)

    this.buttonModels = buttonModels
    this.add(buttonModels)

    let gameName = new BaseText({
      text: '   copy to    clipboard', fillStyle: 'white', align: 'center',
      strokeStyle: 'black', strokeLineWidth: 2,
      canvasW: 512, canvasH: 512,
      w: 15, h: 15,
      font: '86px luckiest-guy'})
    gameName.position.set(0, 12, 0)
    gameName.lookAt(camera.position)
    this.add(gameName)
  }

  tick(tpf) {
    super.tick(tpf)
  }
}
