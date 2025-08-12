// Game Menu scene – shows a Play button and continues on click/keypress

import { UIButton, UICheckbox, UISelect, UISlider } from '../ui/components.js';
import {
  getCanvasSize,
  uiDrawTextCentered,
  uiBeginFrame,
  uiFillRect,
  uiStrokeRect,
  rectFromCenter,
} from '../ui/common.js';

export class GameMenuScene {
  constructor(onPlay) {
    this.onPlay = onPlay;
    this.disableEffects = false;
    this.ui = [];
    this._lastCanvasSize = null;
  }

  _center() {
    return getCanvasSize().scale(0.5);
  }

  _panelRect() {
    const size = getCanvasSize();
    const panelW = Math.min(620, Math.max(420, size.x * 0.6));
    const panelH = 320;
    return rectFromCenter(this._center(), vec2(panelW, panelH));
  }

  start() {
    const center = this._center();

    // UI components (created once)
    this.fullscreenToggle = new UICheckbox({
      center: center, // will be positioned by layout()
      label: 'Fullscreen',
      checked: !!document.fullscreenElement,
      onChange: (checked) => {
        // Use standard Fullscreen API; LittleJS runs in page context
        try {
          if (checked && !document.fullscreenElement) {
            // Prefer the documentElement so the whole page enters fullscreen
            document.documentElement.requestFullscreen?.();
          } else if (!checked && document.fullscreenElement) {
            document.exitFullscreen?.();
          }
        } catch {}
      },
    });

    // Keep checkbox in sync if user exits fullscreen via ESC
    try {
      this._onFullscreenChange = () => {
        this.fullscreenToggle.checked = !!document.fullscreenElement;
      };
      document.addEventListener('fullscreenchange', this._onFullscreenChange);
    } catch {}

    this.soundToggle = new UICheckbox({
      center: center,
      label: 'Sound',
      checked: true,
      onChange: (v) => {
        /* hook sound here */
      },
    });

    this.regionSelect = new UISelect({
      center: center,
      width: 260,
      options: [
        { label: 'US-East', value: 'us-east' },
        { label: 'US-West', value: 'us-west' },
        { label: 'EU', value: 'eu' },
      ],
      onChange: (v) => {
        /* hook region here */
      },
    });

    this.volumeSlider = new UISlider({
      center: center,
      width: 260,
      value: 0.7,
      onChange: (v) => {
        /* hook volume here */
      },
    });

    this.playButton = new UIButton({
      center: center,
      label: 'Play',
      onClick: () => {
        if (this.onPlay) this.onPlay({ disableEffects: this.disableEffects });
      },
      hotkeys: [
        typeof KEY_ENTER !== 'undefined' ? KEY_ENTER : undefined,
        typeof KEY_SPACE !== 'undefined' ? KEY_SPACE : undefined,
      ].filter(Boolean),
    });

    this.ui = [
      this.fullscreenToggle,
      this.soundToggle,
      this.regionSelect,
      this.volumeSlider,
      this.playButton,
    ];
    this._applyLayout();
  }

  _applyLayout() {
    const size = getCanvasSize();
    const center = size.scale(0.5);
    const panel = this._panelRect();
    const leftX = panel.x + panel.w * 0.33 - 60;
    const rightX = panel.x + panel.w * 0.66 + 60;
    const row1Y = center.y - 30;
    const row2Y = center.y + 10;

    // Left column: checkboxes
    this.fullscreenToggle.center = vec2(leftX, row1Y);
    this.soundToggle.center = vec2(leftX, row2Y);

    // Right column: select and slider
    this.regionSelect.center = vec2(rightX, row1Y);
    this.volumeSlider.center = vec2(rightX, row2Y + 2);

    // Play button
    this.playButton.center = vec2(center.x, panel.y + panel.h - 44);
  }

  update() {
    uiBeginFrame();
    if (!this.ui.length) this.start();
    // Relayout on resize
    const size = getCanvasSize();
    if (
      !this._lastCanvasSize ||
      this._lastCanvasSize.x !== size.x ||
      this._lastCanvasSize.y !== size.y
    ) {
      this._applyLayout();
      this._lastCanvasSize = vec2(size.x, size.y);
    }
    // Update higher priority inputs first (dropdowns > others)
    const sortedByInput = [...this.ui].sort(
      (a, b) => (b.getInputPriority?.() || 0) - (a.getInputPriority?.() || 0)
    );
    for (const c of sortedByInput) c.update();
  }

  render() {}

  renderPost() {
    const center = this._center();
    const panel = this._panelRect();

    // Panel background
    uiFillRect(panel, 'rgba(10,10,16,0.85)');
    uiStrokeRect(panel, 'rgba(255,255,255,0.08)', 2);

    // Headings
    uiDrawTextCentered(
      'Game Menu',
      center.add(vec2(0, -panel.h / 2 + 24)),
      28,
      new Color(1, 1, 1, 1)
    );
    uiDrawTextCentered(
      'Select options, then press Play',
      center.add(vec2(0, -panel.h / 2 + 54)),
      16,
      new Color(0.9, 0.9, 0.9, 1)
    );

    // Column labels
    uiDrawTextCentered(
      'Display & Audio',
      vec2(panel.x + panel.w * 0.33, center.y - 60),
      14,
      new Color(0.8, 0.8, 1, 1)
    );
    uiDrawTextCentered(
      'Region & Volume',
      vec2(panel.x + panel.w * 0.66, center.y - 60),
      14,
      new Color(0.8, 1, 0.8, 1)
    );
    // Render base layers of all components
    for (const c of this.ui) {
      const layers = c.getRenderLayers
        ? c.getRenderLayers()
        : [{ z: 0, draw: () => c.renderPost() }];
      for (const layer of layers) if (layer.z <= 50) layer.draw();
    }
    // Render popups/overlays after (e.g., open dropdown)
    for (const c of this.ui) {
      const layers = c.getRenderLayers ? c.getRenderLayers() : [];
      for (const layer of layers) if (layer.z > 50) layer.draw();
    }
  }
}
