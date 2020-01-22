class Difficulty {
  static initLevel(level) {
    if (!isNumeric(level)) { level = 0 }
    Difficulty[`initLevel${level}`]()
  }

  static initLevel0() {
    let scene = Hodler.get('scene')
    scene.addBot({position: { x: -25, z: -15 }, type: BotMeleeControls })
    scene.addBot({position: { x: 25, z: -15 }, type: BotMeleeControls })
    scene.addBot({position: { x: -25, z: 15 }, type: BotMeleeControls })
    scene.addBot({position: { x: 25, z: 15 }, type: BotMeleeControls })
  }
}
