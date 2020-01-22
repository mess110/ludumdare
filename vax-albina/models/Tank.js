class Tank extends THREE.Object3D {
  constructor() {
    super()

    this.chassisModels = Utils.shallowClone(CHASSISES).toCyclicArray()
    this.wheelModels = Utils.shallowClone(WHEELS).toCyclicArray()
    this.weaponModels = Utils.shallowClone(WEAPONS).toCyclicArray()

    this.setModel(this.chassisModels.get())

    let wheelKey = this.wheelModels.get()

    let wheels = new Wheels(wheelKey)
    this.wheels = wheels
    this.add(wheels)

    let weapon = new Weapon(this.weaponModels.get())
    weapon.position.set(0, 2.65, 0)
    this.add(weapon)
    this.weapon = weapon
  }

  nextChassis() {
    this.setModel(this.chassisModels.next())
  }

  setModel(key) {
    this.remove(this.chassis)
    this.chassisModels.setIndexByValue(key)
    let chassis = AssetManager.clone(key)
    Utils.addOutline(chassis)
    this.chassis = chassis
    this.add(chassis)
  }

  nextWheels() {
    this.changeWheels(this.wheelModels.next())
  }

  changeWheels(key) {
    this.wheels.setModel(key)
    this.wheelModels.setIndexByValue(key)
  }

  nextWeapon() {
    this.changeWeapon(this.weaponModels.next())
  }

  changeWeapon(key) {
    this.weapon.setModel(key)
    this.weaponModels.setIndexByValue(key)
  }

  defaultSkin() {
    this.chassisModels.index = 0
    this.setModel(this.chassisModels.get())
    this.wheelModels.index = 0
    this.changeWheels(this.wheelModels.get())
    this.weaponModels.index = 0
    this.changeWeapon(this.weaponModels.get())
    this.shadowCastAndNotReceive()
  }

  toJsonModel() {
    return {
      chassis: this.chassisModels.get(),
      wheels: this.wheelModels.get(),
      weapon: this.weaponModels.get(),
    }
  }

  fromJsonModel(model) {
    if (isBlank(model)) { return }
    this.setModel(model.chassis)
    this.changeWheels(model.wheels)
    this.changeWeapon(model.weapon)
    this.shadowCastAndNotReceive()
  }
}

class Wheels extends THREE.Object3D {
  constructor(key) {
    super()

    let wheelFL = new Wheel(key)
    wheelFL.position.set(1.35, 0.5, 0.9)
    this.add(wheelFL)
    this.wheelFL = wheelFL

    let wheelFR = new Wheel(key)
    wheelFR.position.set(-1.35, 0.5, 0.9)
    this.add(wheelFR)
    this.wheelFR = wheelFR

    let wheelBL = new Wheel(key)
    wheelBL.position.set(1.35, 0.5, -0.9)
    this.add(wheelBL)
    this.wheelBL = wheelBL

    let wheelBR = new Wheel(key)
    wheelBR.position.set(-1.35, 0.5, -0.9)
    this.add(wheelBR)
    this.wheelBR = wheelBR
  }

  setModel(key) {
    this.wheelFL.setModel(key)
    this.wheelFR.setModel(key)
    this.wheelBL.setModel(key)
    this.wheelBR.setModel(key)
  }

  tick(tpf) {
    this.wheelFL.tick(tpf)
    this.wheelFR.tick(tpf)
    this.wheelBL.tick(tpf)
    this.wheelBR.tick(tpf)
  }
}

class Wheel extends THREE.Object3D {
  constructor(key) {
    super()
    this.setModel(key)
  }

  setModel(key) {
    this.remove(this.wheel)
    this.wheel = AssetManager.clone(key)
    Utils.addOutline(this.wheel)
    this.add(this.wheel)
  }

  tick(tpf) {
    this.wheel.rotation.x += tpf * 5
  }
}

class Weapon extends THREE.Object3D {
  constructor(key) {
    super()
    this.setModel(key)
  }

  setModel(key) {
    this.remove(this.weapon)
    this.weapon = AssetManager.clone(key)
    Utils.addOutline(this.weapon)
    this.add(this.weapon)
  }
}
