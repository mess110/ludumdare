class Respawner {
  constructor() {
    this.items = {}
  }

  has(key) {
    return !isBlank(this.items[key])
  }

  add(item) {
    this.items[item.vrumKey] = item.uuid
  }
}
