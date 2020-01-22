class InputMapper {
  constructor() {
    this.inputs = {}

    this.keyboard = undefined
    this.gamepad1 = undefined
    this.gamepad2 = undefined
    this.gamepad3 = undefined
    this.gamepad4 = undefined
    this.mobile = undefined
    this.sockets = {}
    this.peer2key = {}

    // the vrumKeys which are owned by this instance
    this.hostedVrumKeys = {
      keyboard: Utils.guid(),
      gamepad1: Utils.guid(),
      gamepad2: Utils.guid(),
      gamepad3: Utils.guid(),
      gamepad4: Utils.guid(),
      mobile: Utils.guid(),
    }
  }

  getVrumKey(which) {
    if (!(Object.keys(this.hostedVrumKeys).includes(which))) {
      throw 'invalid ${which} vrumKey'
    }
    return this.hostedVrumKeys[which]
  }

  isHosting(vrumKey) {
    return Object.values(this.hostedVrumKeys)
      .filter((e) => { return e == vrumKey })
      .any()
  }

  uuids() {
    return this.models().map((e) => { return e.uuid })
  }

  models() {
    let result = []
    if (!isBlank(this.keyboard)) { result.push(this.keyboard ) }
    if (!isBlank(this.gamepad1)) { result.push(this.gamepad1 ) }
    if (!isBlank(this.gamepad2)) { result.push(this.gamepad2 ) }
    if (!isBlank(this.gamepad3)) { result.push(this.gamepad3 ) }
    if (!isBlank(this.gamepad4)) { result.push(this.gamepad4 ) }
    if (!isBlank(this.mobile)) { result.push(this.mobile) }

    Hodler.get('scene').characters.forEach((char) => {
      if (!char.isBot) {
        result.push(char)
      }
    })
    return result
  }

  hasGamepad() {
    return !(isBlank(this.gamepad1) && isBlank(this.gamepad2) && isBlank(this.gamepad3) && isBlank(this.gamepad4))
  }
}
