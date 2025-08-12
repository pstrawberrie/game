// Simple reusable starfield effect rendered in screen space using LittleJS overlay
// Draws twinkling stars with pulsing alpha similar to examples that render UI in gameRenderPost

import { getCanvasSize, rectFromCenter, uiFillRect } from './common.js';

export class Starfield {
  constructor(options = {}) {
    const {
      starCount = 80,
      minSize = 1,
      maxSize = 2,
      minTwinkleSpeed = 1.5,
      maxTwinkleSpeed = 3.5,
    } = options;

    this.starCount = starCount;
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.minTwinkleSpeed = minTwinkleSpeed;
    this.maxTwinkleSpeed = maxTwinkleSpeed;

    this.stars = [];
    this._lastCanvasSize = null;
    this._initStars();
  }

  _initStars() {
    const size = getCanvasSize();
    this._lastCanvasSize = vec2(size.x, size.y);
    this.stars = [];
    for (let i = 0; i < this.starCount; i++) {
      const p = vec2(Math.random() * size.x, Math.random() * size.y);
      const sizePx = Math.random() < 0.2 ? this.maxSize : this.minSize;
      const speed =
        this.minTwinkleSpeed + Math.random() * (this.maxTwinkleSpeed - this.minTwinkleSpeed);
      const phase = Math.random() * Math.PI * 2;
      this.stars.push({ p, sizePx, speed, phase });
    }
  }

  update(dt) {
    // Re-initialize on resize to fill screen nicely
    const size = getCanvasSize();
    if (
      !this._lastCanvasSize ||
      this._lastCanvasSize.x !== size.x ||
      this._lastCanvasSize.y !== size.y
    ) {
      this._initStars();
    }
    for (const s of this.stars) s.phase += s.speed * dt;
  }

  render() {
    // Draw stars with subtle twinkle
    for (const s of this.stars) {
      const alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(s.phase));
      const color = `rgba(255,255,255,${alpha.toFixed(3)})`;
      const rect = rectFromCenter(s.p, vec2(s.sizePx, s.sizePx));
      uiFillRect(rect, color);
    }
  }
}
