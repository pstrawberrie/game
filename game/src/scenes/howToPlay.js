// How To Play scene – waits for a click or keypress before continuing

export class HowToPlayScene {
  constructor(onDone) {
    this.onDone = onDone;
    this.disableEffects = false; // per-scene opt-out
  }

  update() {
    // Begin a UI input frame so layered input is consistent
    if (typeof uiBeginFrame === 'function') uiBeginFrame();
    const mouse = typeof mouseWasPressed === 'function' && mouseWasPressed(0);
    const spacePressed = (typeof keyWasPressed === 'function' && typeof KEY_SPACE !== 'undefined' && keyWasPressed(KEY_SPACE));
    const enterPressed = (typeof keyWasPressed === 'function' && typeof KEY_ENTER !== 'undefined' && keyWasPressed(KEY_ENTER));
    if (mouse || spacePressed || enterPressed) {
      if (this.onDone) this.onDone({ disableEffects: this.disableEffects });
    }
  }

  render() {}

  renderPost() {
    const center = mainCanvasSize.scale(.5);
    drawTextScreen('How to Play', center.add(vec2(0, -80)), 28, new Color(1,1,1,1));
    drawTextScreen('Placeholder controls:', center.add(vec2(0, -30)), 16, new Color(.9,.9,.9,1));
    drawTextScreen('- Move: WASD or Arrow Keys', center.add(vec2(0, -10)), 16, new Color(.8,.8,.8,1));
    drawTextScreen('- Action: Space/Enter', center.add(vec2(0, 10)), 16, new Color(.8,.8,.8,1));
    drawTextScreen('Click or press Enter/Space to continue', center.add(vec2(0, 60)), 16, new Color(1,1,1,1));
  }
}


