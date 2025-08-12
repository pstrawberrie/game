// Splash scene placeholder using LittleJS helpers

import { anyKeyPressed, uiIsInputLocked, uiClearAnyKeyFlag } from '../ui/common.js';

export class SplashScene {
  constructor(onDone) {
    this.onDone = onDone;
    this.time = 0;
    this.duration = 1.35; // seconds
    this.disableEffects = false; // per-scene override example
    this._doneTriggered = false;
  }

  update() {
    const dt = (typeof timeDelta === 'number' && timeDelta > 0) ? timeDelta : 1/60;
    this.time += dt;
    if (uiIsInputLocked()) { uiClearAnyKeyFlag(); return; }
    if (!this._doneTriggered && this.time >= this.duration) {
      this._doneTriggered = true;
      if (this.onDone) this.onDone({ disableEffects: this.disableEffects });
    }
  }

  render() {}

  renderPost() {
    // dim background
    if (typeof drawRectScreen === 'function') {
      drawRectScreen(mainCanvasSize.scale(.5), mainCanvasSize, new Color(0,0,0,1));
    }
    // centered text in pixels
    drawTextScreen('LittleJS Starter', mainCanvasSize.scale(.5).add(vec2(0, -40)), 32, new Color(1,1,1,1));
  }
}


