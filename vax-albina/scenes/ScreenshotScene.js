class ScreenshotScene extends Scene {
  init(options) {
    addBaseLight(this)

    let camera = this.getCamera()
    camera.position.set(0, 5, 10)
    camera.lookAt(new THREE.Vector3(0, 0, 0))

    Hodler.get('renderer').setClearColor(0xFFFFFF)

    let barrel = AssetManager.clone('barrel.001.glb')
    barrel.position.set(0, 0, -6)
    // barrel.rotation.set(0, 0, Math.PI / 2)
    this.add(barrel)

    let geometry = new THREE.CircleGeometry( 6, 32 );
    let material = new THREE.MeshBasicMaterial( { color: '#55AA55' } );
    let circle = new THREE.Mesh( geometry, material );
    circle.position.set(0, 0, -4)
    circle.rotation.set(-Math.PI / 2, 0, 0)
    this.add( circle );

    this.tanks = []

    let tank1 = new Tank()
    tank1.position.set(-3, 0, -2)
    tank1.rotation.set(0, -0.4, 0)
    tank1.setModel('chassis.002.glb')
    this.tanks.push(tank1)
    this.add(tank1)

    let tank2 = new Tank()
    tank2.position.set(0, 0, 0)
    tank2.rotation.set(0, 0, 0)
    tank2.changeWeapon('weapon.003.glb')
    tank2.changeWheels('wheel.002.glb')
    this.tanks.push(tank2)
    this.add(tank2)

    let tank3 = new Tank()
    tank3.setModel('chassis.005.glb')
    tank3.changeWeapon('weapon.002.glb')
    tank3.position.set(3, 0, -2)
    tank3.rotation.set(0, 0.4, 0)
    this.tanks.push(tank3)
    this.add(tank3)

    let button = new MenuButton('vax albina')
    button.position.set(0, 0, 1.75)
    button.lookAt(Hodler.get('camera').position)
    this.add(button)
  }

  // tick(tpf) {
    // this.tanks.forEach((tank) => {
      // tank.tick(tpf)
    // })
  // }
}
