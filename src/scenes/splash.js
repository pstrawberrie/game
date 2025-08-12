// Splash scene with twinkling stars and a cozy space gradient, plus a large pixel-art logo
// Uses LittleJS screen-space helpers per examples: drawRectScreen, timeDelta, Color, vec2

import { anyKeyPressed, uiIsInputLocked, uiClearAnyKeyFlag } from '../ui/common.js';
import { Starfield } from '../ui/starfield.js';

export class SplashScene {
  constructor(onDone) {
    this.onDone = onDone;
    this.disableEffects = false;

    // Reusable starfield background
    this.starfield = new Starfield({ starCount: 80 });

    // Logo timing
    this.minShowTime = 0.8; // allow quick skip after a moment
    this.elapsed = 0;
    this.shineTime = 0; // for text shine effect
    this.shineSpeed = 0.8; // cycles per second (~1.25s per cycle)

    this._doneTriggered = false;
  }

  start() {}

  // 5x7 pixel font for lowercase and dot (1=filled)
  _font() {
    const F = {
      p: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
      s: ['01111', '10000', '11110', '00001', '00001', '11110', '00000'],
      t: ['11111', '00100', '00100', '00100', '00100', '00100', '00000'],
      r: ['11110', '10001', '10000', '11100', '10010', '10001', '00000'],
      a: ['01110', '00001', '01111', '10001', '01111', '00000', '00000'],
      w: ['10001', '10001', '10101', '10101', '01010', '01010', '00000'],
      n: ['10010', '10110', '11010', '10010', '10010', '10010', '00000'],
      e: ['11111', '10000', '11111', '10000', '11111', '00000', '00000'],
      '.': ['00000', '00000', '00000', '00000', '00000', '00100', '00100'],
    };
    return F;
  }

  _textCells(text) {
    const font = this._font();
    const letters = [];
    const height = 7; // rows
    for (const ch of text) {
      const glyph = font[ch] || font['.'];
      const rows = glyph.map((r) => r.split('').map((c) => (c === '1' ? 1 : 0)));
      letters.push(rows);
    }
    return { letters, height, widthPerChar: 5 };
  }

  update() {
    const dt = typeof timeDelta === 'number' && timeDelta > 0 ? timeDelta : 1 / 60;
    if (uiIsInputLocked()) {
      uiClearAnyKeyFlag();
      return;
    }

    this.elapsed += dt;
    this.shineTime += dt;
    const mouse = typeof mouseWasPressed === 'function' && mouseWasPressed(0);
    if (!this._doneTriggered && this.elapsed >= this.minShowTime && (anyKeyPressed() || mouse)) {
      this._doneTriggered = true;
      if (this.onDone) this.onDone({ disableEffects: this.disableEffects });
      return;
    }

    // Auto-transition after one full shine cycle (~2 seconds)
    if (!this._doneTriggered && this._shineProgress() >= 1) {
      // Finish one shine cycle; add a small delay before transitioning
      this._doneTriggered = true;
      this._finishDelay = 0.3; // slight pause to let the effect settle
    }

    if (this._doneTriggered && this._finishDelay != null) {
      this._finishDelay -= dt;
      if (this._finishDelay <= 0) {
        if (this.onDone) this.onDone({ disableEffects: this.disableEffects });
        return;
      }
    }

    // Update starfield
    this.starfield.update(dt);

    // no auto-transition; input-only skip
  }

  render() {}

  renderPost() {
    // Space gradient background (top -> bottom)
    this._drawBackgroundGradient();

    // Draw stars with twinkle
    this.starfield.render();

    // Large pixel-art text: "pstraw.net"
    const center = mainCanvasSize.scale(0.5);
    const text = 'pstraw.net';
    const { letters, height, widthPerChar } = this._textCells(text);
    const spacing = 1; // cell columns between chars

    // Compute total cell width
    let totalCells = 0;
    for (let i = 0; i < letters.length; i++) totalCells += widthPerChar + (i ? spacing : 0);

    // Choose cell pixel size to fit most of the screen
    const targetWidth = mainCanvasSize.x * 0.9;
    const targetHeight = mainCanvasSize.y * 0.6;
    const cellSize = Math.floor(Math.min(targetWidth / totalCells, targetHeight / height));
    const pixel = Math.max(4, cellSize); // keep readable

    const totalWidthPx = totalCells * pixel;
    const totalHeightPx = height * pixel;
    const startX = center.x - totalWidthPx / 2;
    const startY = center.y - totalHeightPx / 2;

    // Draw glyphs
    let offsetCellsX = 0;
    for (const glyph of letters) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < widthPerChar; x++) {
          if (glyph[y][x]) {
            const cx = startX + (offsetCellsX + x) * pixel + pixel / 2;
            const cy = startY + y * pixel + pixel / 2;
            const rect = { x: startX, y: startY, w: totalWidthPx, h: totalHeightPx };
            const base = this._gradientColorAt(cx, cy, rect);
            const shiny = this._applyShine(base, cx, cy, rect);
            this._drawRect(vec2(cx, cy), vec2(pixel, pixel), shiny);
          }
        }
      }
      offsetCellsX += widthPerChar + spacing;
    }
  }

  _drawRect(center, size, color) {
    if (typeof drawRectScreen === 'function') {
      drawRectScreen(center, size, color);
      return;
    }
    // Fallback to overlayContext if screen helper not available
    if (
      typeof overlayContext !== 'undefined' &&
      overlayContext &&
      typeof overlayCanvas !== 'undefined' &&
      overlayCanvas
    ) {
      const r = Math.round((color?.r ?? 0) * 255) || 0;
      const g = Math.round((color?.g ?? 0) * 255) || 0;
      const b = Math.round((color?.b ?? 0) * 255) || 0;
      const a = color?.a ?? 1;
      overlayContext.save();
      overlayContext.fillStyle = `rgba(${r},${g},${b},${a})`;
      overlayContext.fillRect(center.x - size.x / 2, center.y - size.y / 2, size.x, size.y);
      overlayContext.restore();
    }
  }

  _drawBackgroundGradient() {
    // Preferred: use overlayContext gradient for smoothness
    if (
      typeof overlayContext !== 'undefined' &&
      overlayContext &&
      typeof overlayCanvas !== 'undefined' &&
      overlayCanvas
    ) {
      const g = overlayContext.createLinearGradient(0, 0, 0, overlayCanvas.height);
      g.addColorStop(0, 'rgba(12,16,28,1)'); // deep navy
      g.addColorStop(0.5, 'rgba(20,26,42,1)'); // subtle mid
      g.addColorStop(1, 'rgba(26,16,38,1)'); // cozy purple
      overlayContext.save();
      overlayContext.fillStyle = g;
      overlayContext.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      overlayContext.restore();
      return;
    }
    // Fallback: banded rectangles
    const bands = 64;
    for (let i = 0; i < bands; i++) {
      const t = i / (bands - 1);
      const c = this._lerpRGB(
        { r: 12 / 255, g: 16 / 255, b: 28 / 255 },
        { r: 26 / 255, g: 16 / 255, b: 38 / 255 },
        t
      );
      const color = new Color(c.r, c.g, c.b, 1);
      const y = i * (mainCanvasSize.y / bands);
      this._drawRect(
        vec2(mainCanvasSize.x / 2, y + mainCanvasSize.y / bands / 2),
        vec2(mainCanvasSize.x, mainCanvasSize.y / bands),
        color
      );
    }
  }

  _lerpRGB(a, b, t) {
    return {
      r: a.r + (b.r - a.r) * t,
      g: a.g + (b.g - a.g) * t,
      b: a.b + (b.b - a.b) * t,
    };
  }

  _gradientColorAt(px, py, rect) {
    // CSS-like 135deg gradient across rect: 0% at top-left, 50% middle, 100% bottom-right
    const dx = rect.w;
    const dy = rect.h;
    const diagLen = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / diagLen;
    const uy = dy / diagLen;
    const qx = px - rect.x;
    const qy = py - rect.y;
    const proj = qx * ux + qy * uy; // 0..diagLen
    let t = proj / diagLen;
    if (t < 0) t = 0;
    else if (t > 1) t = 1;

    // Stops: 0 -> rgb(21,189,247), 0.5 -> rgb(252,211,77), 1 -> rgb(168,84,191)
    const c0 = { r: 21 / 255, g: 189 / 255, b: 247 / 255 };
    const c1 = { r: 252 / 255, g: 211 / 255, b: 77 / 255 };
    const c2 = { r: 168 / 255, g: 84 / 255, b: 191 / 255 };

    let c;
    if (t <= 0.5) {
      const k = t / 0.5;
      c = this._lerpRGB(c0, c1, k);
    } else {
      const k = (t - 0.5) / 0.5;
      c = this._lerpRGB(c1, c2, k);
    }
    return new Color(c.r, c.g, c.b, 1);
  }

  _applyShine(color, px, py, rect) {
    // Diagonal shine band moving along same axis
    const dx = rect.w;
    const dy = rect.h;
    const diagLen = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / diagLen;
    const uy = dy / diagLen;
    const qx = px - rect.x;
    const qy = py - rect.y;
    const s = (qx * ux + qy * uy) / diagLen; // 0..1 along diagonal
    // One-shot, accelerated sweep across the text
    const bandCenter = this._shineProgress();
    const bandWidth = 0.16; // fraction of diagonal covered by shine (slightly wider)
    const dist = Math.abs(s - bandCenter);
    const w = bandWidth * 0.5;
    let k = 0;
    if (dist < w) {
      // Smooth peak at center
      const t = 1 - dist / w;
      k = t * t;
    }
    const strength = 1.25; // extremely bright toward white
    if (k <= 0) return color;
    const r = color.r + (1 - color.r) * (k * strength);
    const g = color.g + (1 - color.g) * (k * strength);
    const b = color.b + (1 - color.b) * (k * strength);
    return new Color(r, g, b, color.a ?? 1);
  }

  _shineProgress() {
    // Non-repeating progress with gentle ease-in/out and a touch of linear blend
    // to avoid lingering at the start and end. Fastest near the center.
    const t = Math.min(1, Math.max(0, this.shineTime * this.shineSpeed));
    // Ease in/out cubic
    const eio = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    // Blend in some linear to ensure continuous motion and less slowdown at the end
    const blend = 0.25; // 0..1 (higher = closer to linear)
    return eio * (1 - blend) + t * blend;
  }
}
