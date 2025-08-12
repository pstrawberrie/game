// Game Menu scene – shows a Play button and continues on click/keypress

import { UIButton, UICheckbox, UISelect, UISlider } from '../ui/components.js';
import { getCanvasSize, uiDrawTextCentered, uiBeginFrame } from '../ui/common.js';

export class GameMenuScene {
  constructor(onPlay) {
    this.onPlay = onPlay;
    this.disableEffects = false;
    this.ui = [];
  }

  _center() { return getCanvasSize().scale(.5); }

  start() {
    const center = this._center();

    // UI components
    this.fullscreenToggle = new UICheckbox({
      center: center.add(vec2(-80, -10)),
      label: 'Fullscreen',
      checked: false,
      onChange: (v) => { /* hook fullscreen here */ },
    });

    this.soundToggle = new UICheckbox({
      center: center.add(vec2(-80, 20)),
      label: 'Sound',
      checked: true,
      onChange: (v) => { /* hook sound here */ },
    });

    this.regionSelect = new UISelect({
      center: center.add(vec2(150, 5)),
      width: 220,
      options: [
        { label: 'Region: US-East', value: 'us-east' },
        { label: 'Region: US-West', value: 'us-west' },
        { label: 'Region: EU', value: 'eu' },
      ],
      onChange: (v) => { /* hook region here */ },
    });

    this.volumeSlider = new UISlider({
      center: center.add(vec2(150, 40)),
      width: 220,
      value: 0.7,
      onChange: (v) => { /* hook volume here */ },
    });

    this.playButton = new UIButton({
      center: center.add(vec2(0, 100)),
      label: 'Play',
      onClick: () => { if (this.onPlay) this.onPlay({ disableEffects: this.disableEffects }); },
      hotkeys: [typeof KEY_ENTER !== 'undefined' ? KEY_ENTER : undefined, typeof KEY_SPACE !== 'undefined' ? KEY_SPACE : undefined].filter(Boolean),
    });

    this.ui = [this.fullscreenToggle, this.soundToggle, this.regionSelect, this.volumeSlider, this.playButton];
  }

  update() {
    uiBeginFrame();
    if (!this.ui.length) this.start();
    // Update higher priority inputs first (dropdowns > others)
    const sortedByInput = [...this.ui].sort((a,b) => (b.getInputPriority?.()||0) - (a.getInputPriority?.()||0));
    for (const c of sortedByInput) c.update();
  }

  render() {}

  renderPost() {
    const center = this._center();
    uiDrawTextCentered('Game Menu', center.add(vec2(0, -100)), 28, new Color(1,1,1,1));
    uiDrawTextCentered('Select options, then press Play', center.add(vec2(0, -70)), 16, new Color(.9,.9,.9,1));
    // Render base layers of all components
    for (const c of this.ui) {
      const layers = c.getRenderLayers ? c.getRenderLayers() : [{ z: 0, draw: () => c.renderPost() }];
      for (const layer of layers) if (layer.z <= 50) layer.draw();
    }
    // Render popups/overlays after (e.g., open dropdown)
    for (const c of this.ui) {
      const layers = c.getRenderLayers ? c.getRenderLayers() : [];
      for (const layer of layers) if (layer.z > 50) layer.draw();
    }
  }
}


