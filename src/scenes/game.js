// Main game scene with a controllable strawberry sprite
import { Strawberry } from '../actors/strawberry.js';

export class GameScene {
  constructor() {
    this.disableEffects = false; // per-scene override example
    this.player = null;
  }

  start() {
    this.player = new Strawberry(vec2(0, 0));
    // Optional: make the player a bit faster for visibility
    this.player.moveSpeed = 6;
  }

  end() {
    // Cleanup if needed; EngineObjects are managed by the engine, but we can null refs
    this.player = null;
  }

  update() {
    // Follow the player with the camera
    if (this.player && typeof cameraPos !== 'undefined') {
      cameraPos = this.player.pos.copy();
    }
  }

  render() {
    // Simple checkerboard ground for visual reference
    const half = 12; // tiles from center
    const tileSize = 1;
    for (let y = -half; y <= half; y++) {
      for (let x = -half; x <= half; x++) {
        const isDark = (x + y) % 2 === 0;
        const c = isDark ? new Color(0.08, 0.09, 0.12, 1) : new Color(0.12, 0.13, 0.16, 1);
        drawRect(
          vec2(x * tileSize + tileSize / 2, y * tileSize + tileSize / 2),
          vec2(tileSize, tileSize),
          c
        );
      }
    }
  }

  renderPost() {
    // drawTextScreen('Use Arrow Keys to move', mainCanvasSize.scale(0.5), 16);
  }
}
