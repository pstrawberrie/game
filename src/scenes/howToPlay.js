// How To Play scene – waits for a click or keypress before continuing

import { anyKeyPressed, uiIsInputLocked, uiClearAnyKeyFlag } from '../ui/common.js';

export class HowToPlayScene {
  constructor(onDone) {
    this.onDone = onDone;
    this.disableEffects = false; // per-scene opt-out
  }

  update() {
    // Begin a UI input frame so layered input is consistent
    if (typeof uiBeginFrame === 'function') uiBeginFrame();
    if (uiIsInputLocked()) {
      uiClearAnyKeyFlag();
      return;
    }
    // Update any background timers if needed
    const mouse = typeof mouseWasPressed === 'function' && mouseWasPressed(0);
    const anyKey = anyKeyPressed();
    if (mouse || anyKey) {
      if (this.onDone) this.onDone({ disableEffects: this.disableEffects });
    }
  }

  render() {}

  renderPost() {
    // Cozy gradient backdrop to match splash
    const center = mainCanvasSize.scale(0.5);
    drawTextScreen('How to Play', center.add(vec2(0, -80)), 28, new Color(1, 1, 1, 1));
    drawTextScreen(
      'Placeholder controls:',
      center.add(vec2(0, -30)),
      16,
      new Color(0.9, 0.9, 0.9, 1)
    );
    drawTextScreen(
      '- Move: WASD or Arrow Keys',
      center.add(vec2(0, -10)),
      16,
      new Color(0.8, 0.8, 0.8, 1)
    );
    drawTextScreen(
      '- Action: Space/Enter',
      center.add(vec2(0, 10)),
      16,
      new Color(0.8, 0.8, 0.8, 1)
    );
    drawTextScreen(
      'Click or press any key to continue',
      center.add(vec2(0, 60)),
      16,
      new Color(1, 1, 1, 1)
    );
  }
}
