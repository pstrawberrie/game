// Main game scene placeholder

export class GameScene {
  constructor() {
    this.disableEffects = false; // per-scene override example
  }

  update() {
    // Game update logic placeholder
  }

  render() {}

  renderPost() {
    drawTextScreen('Main Game', mainCanvasSize.scale(0.5), 24);
  }
}
