class BotRandomControls {
  constructor() {
    this.time = 0
    this.directions = {
      NORTH: 0,
      NORTHEAST: (0 + Math.PI / 2) / 2,
      EAST: Math.PI / 2,
      SOUTHEAST: (Math.PI + Math.PI / 2) / 2,
      SOUTH: Math.PI,
      SOUTHWEST: (Math.PI + Math.PI / 2 * 3) / 2,
      WEST: Math.PI / 2 * 3,
      NORTHWEST: (Math.PI * 2 + Math.PI / 2 * 3) / 2
    }
  }

  tick(tpf, bot) {
    this.time += tpf
    if (this.time > bot.shootCooldown) {
      this.time = 0
      this.action(bot)
    }
  }

  action(bot) {
    let direction = [
      'Forward', 'Backward', 'Left', 'Right',
      ['Forward', 'Left'],
      ['Forward', 'Right'],
      ['Backward', 'Left'],
      ['Backward', 'Right'],
    ]

    bot.shooting = true
    bot.move(direction.shuffle().first())
    bot.turn(direction.shuffle().first())
  }
}

class BotMeleeControls {
  constructor() {
    this.time = 0
    this.directions = {
      NORTH: 0,
      NORTHEAST: (0 + Math.PI / 2) / 2,
      EAST: Math.PI / 2,
      SOUTHEAST: (Math.PI + Math.PI / 2) / 2,
      SOUTH: Math.PI,
      SOUTHWEST: (Math.PI + Math.PI / 2 * 3) / 2,
      WEST: Math.PI / 2 * 3,
      NORTHWEST: (Math.PI * 2 + Math.PI / 2 * 3) / 2
    }
  }

  tick(tpf, bot) {
    this.time += tpf
    if (this.time > 1) {
      this.time = 0
      this.action(bot)
    }
    bot.controlWeapon.targetRotationY += tpf * 3
  }

  action(bot) {
    let direction = [
      'Forward', 'Backward', 'Left', 'Right',
      ['Forward', 'Left'],
      ['Forward', 'Right'],
      ['Backward', 'Left'],
      ['Backward', 'Right'],
    ]

    bot.move(direction.shuffle().first())
  }
}
