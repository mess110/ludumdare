class MenuButton extends Button3D {
  constructor(s) {
    super(s, 'button.bg.001.glb', 'button.fg.001.glb')
  }

  initText(s) {
    let text = new BaseText({
      text: s, fillStyle: 'white',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 512, align: 'center',
      w: 4, h: 4,
      font: '72px luckiest-guy'})
    text.position.set(0, -1.4, 0.7)
    return text
  }
}

class LetterButton extends Button3D {
  constructor(s) {
    super(s, 'button.bg.002.glb', 'button.fg.002.glb')
  }

  initText(s) {
    let text = new BaseText({
      text: s, fillStyle: 'white',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 512, align: 'center',
      w: 2, h: 2,
      font: '144px luckiest-guy'})
    text.position.set(0, -0.8, 0.7)
    return text
  }
}

class LongLetterButton extends Button3D {
  constructor(s) {
    super(s, 'button.bg.003.glb', 'button.fg.003.glb')
  }

  initText(s) {
    let text = new BaseText({
      text: s, fillStyle: 'white',
      strokeStyle: 'black', strokeLineWidth: 1,
      canvasW: 512, canvasH: 512, align: 'center',
      w: 2, h: 2,
      font: '144px luckiest-guy'})
    text.position.set(0, -0.8, 0.7)
    return text
  }
}
