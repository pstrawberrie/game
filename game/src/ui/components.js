import { getCanvasSize, getMouseScreen, isMousePressed, isKeyPressed, isMouseDown, rectFromCenter, rectContains, uiFillRect, uiStrokeRect, uiDrawTextCentered, uiTryConsumeClick, uiTryConsumeKeys } from './common.js';

export class UIButton {
  constructor({ center, size = vec2(240, 56), label = 'Button', onClick, hotkeys = [] }) {
    this.center = center;
    this.size = size;
    this.label = label;
    this.onClick = onClick;
    this.hotkeys = hotkeys; // array of key constants
    this.hover = false;
    this.enabled = true;
  }

  getInputPriority() { return 0; }

  get rect() { return rectFromCenter(this.center, this.size); }

  update() {
    const mouse = getMouseScreen();
    this.hover = rectContains(this.rect, mouse);
    const click = this.hover && uiTryConsumeClick(this.rect);
    const key = this.hotkeys.length && uiTryConsumeKeys(this.hotkeys);
    if (this.enabled && (click || key)) {
      if (this.onClick) this.onClick();
    }
  }

  render() {}

  renderPost() {
    const rect = this.rect;
    const bg = this.enabled ? (this.hover ? 'rgba(60,120,255,0.95)' : 'rgba(40,90,200,0.95)') : 'rgba(60,60,60,0.8)';
    uiFillRect(rect, bg);
    uiStrokeRect(rect, 'rgba(255,255,255,0.15)', 2);
    uiDrawTextCentered(this.label, this.center.add(vec2(0, -8)), 20, new Color(1,1,1,1));
  }

  getRenderLayers() {
    return [{ z: 0, draw: () => this.renderPost() }];
  }
}

export class UICheckbox {
  constructor({ center, label = 'Option', checked = false, onChange }) {
    this.center = center;
    this.label = label;
    this.checked = checked;
    this.onChange = onChange;
    this.size = vec2(22, 22);
    this.hover = false;
  }

  getInputPriority() { return 0; }

  get boxRect() { return rectFromCenter(this.center, this.size); }

  update() {
    const mouse = getMouseScreen();
    this.hover = rectContains(this.boxRect, mouse);
    if (this.hover && uiTryConsumeClick(this.boxRect)) {
      this.checked = !this.checked;
      if (this.onChange) this.onChange(this.checked);
    }
  }

  renderPost() {
    const rect = this.boxRect;
    uiFillRect(rect, 'rgba(20,20,20,0.9)');
    uiStrokeRect(rect, this.hover ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', 2);
    if (this.checked) {
      uiFillRect({ x: rect.x + 4, y: rect.y + 4, w: rect.w - 8, h: rect.h - 8 }, 'rgba(90,190,60,0.9)');
    }
    uiDrawTextCentered(this.label, this.center.add(vec2(90, -4)), 16, new Color(1,1,1,1));
  }

  getRenderLayers() {
    return [{ z: 0, draw: () => this.renderPost() }];
  }
}

export class UISelect {
  constructor({ center, width = 280, options = [], value = null, onChange }) {
    this.center = center;
    this.width = width;
    this.options = options;
    this.value = value ?? (options.length ? options[0].value ?? options[0] : null);
    this.onChange = onChange;
    this.open = false;
    this.hover = false;
    this.itemHeight = 28;
  }

  get rect() { return rectFromCenter(this.center, vec2(this.width, 40)); }

  getInputPriority() { return this.open ? 100 : 0; }

  update() {
    const mouse = getMouseScreen();
    this.hover = rectContains(this.rect, mouse);

    // If open, first check option clicks so selection wins over close
    if (this.open) {
      const topLeft = vec2(this.rect.x, this.rect.y + this.rect.h);
      const menuRect = { x: topLeft.x, y: topLeft.y, w: this.rect.w, h: this.options.length * this.itemHeight };
      if (isMousePressed()) {
        const idx = Math.floor((mouse.y - topLeft.y) / this.itemHeight);
        const rowRect = { x: topLeft.x, y: topLeft.y + idx*this.itemHeight, w: this.rect.w, h: this.itemHeight };
        if (idx >= 0 && idx < this.options.length && uiTryConsumeClick(rowRect)) {
          const chosen = this.options[idx];
          this.value = chosen.value ?? chosen;
          this.open = false;
          if (this.onChange) this.onChange(this.value);
          return;
        }
      }
      // Close when clicking outside both control and menu
      if (isMousePressed()) {
        const outsideControl = !rectContains(this.rect, mouse);
        const outsideMenu = !(mouse.x >= menuRect.x && mouse.x <= menuRect.x + menuRect.w && mouse.y >= menuRect.y && mouse.y <= menuRect.y + menuRect.h);
        if (outsideControl && outsideMenu) {
          this.open = false;
        }
      }
    }

    // Toggle open/close on base control click
    if (isMousePressed() && this.hover) {
      if (uiTryConsumeClick(this.rect)) this.open = !this.open;
    }
  }

  renderPost() {
    const rect = this.rect;
    uiFillRect(rect, 'rgba(20,20,20,0.9)');
    uiStrokeRect(rect, this.hover ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)', 2);
    const text = this._displayText();
    uiDrawTextCentered(text, this.center.add(vec2(0,-6)), 16, new Color(1,1,1,1));
  }

  renderDropdown() {
    const rect = this.rect;
    const topLeft = vec2(rect.x, rect.y + rect.h);
    const menuRect = { x: topLeft.x, y: topLeft.y, w: rect.w, h: this.options.length * this.itemHeight };
    uiFillRect(menuRect, 'rgba(30,30,30,0.95)');
    uiStrokeRect(menuRect, 'rgba(255,255,255,0.2)', 1);
    for (let i = 0; i < this.options.length; i++) {
      const item = this.options[i];
      const rowRect = { x: topLeft.x, y: topLeft.y + i * this.itemHeight, w: rect.w, h: this.itemHeight };
      // highlight on hover
      const mouse = getMouseScreen();
      const isHover = mouse.y >= rowRect.y && mouse.y <= rowRect.y + rowRect.h && mouse.x >= rowRect.x && mouse.x <= rowRect.x + rowRect.w;
      if (isHover) uiFillRect(rowRect, 'rgba(255,255,255,0.06)');
      uiDrawTextCentered(String(item.label ?? item), vec2(rowRect.x + rowRect.w/2, rowRect.y + rowRect.h/2 - 6), 16, new Color(1,1,1,1));
    }
  }

  getRenderLayers() {
    const layers = [{ z: 0, draw: () => this.renderPost() }];
    if (this.open) layers.push({ z: 100, draw: () => this.renderDropdown() });
    return layers;
  }

  _displayText() {
    // Show label matching current value if available
    for (const opt of this.options) {
      const val = opt.value ?? opt;
      if (String(val) === String(this.value)) return String(opt.label ?? val);
    }
    return String(this.value);
  }
}

export class UISlider {
  getInputPriority() { return 0; }
  constructor({ center, width = 280, value = 0.5, onChange }) {
    this.center = center;
    this.width = width;
    this.value = Math.max(0, Math.min(1, value));
    this.onChange = onChange;
    this.height = 10;
    this.dragging = false;
  }

  get rect() { return rectFromCenter(this.center, vec2(this.width, this.height)); }

  update() {
    const mouse = getMouseScreen();
    if (!this.dragging) {
      // start drag on click in rect
      if (rectContains(this.rect, mouse) && uiTryConsumeClick(this.rect)) {
        this.dragging = true;
      }
    }
    if (this.dragging) {
      // update while mouse is held anywhere
      const t = (mouse.x - this.rect.x) / this.rect.w;
      const clamped = Math.max(0, Math.min(1, t));
      if (clamped !== this.value) {
        this.value = clamped;
        if (this.onChange) this.onChange(this.value);
      }
      if (!isMouseDown()) {
        this.dragging = false;
      }
    }
  }

  renderPost() {
    const rect = this.rect;
    uiFillRect(rect, 'rgba(255,255,255,0.2)');
    const knobX = rect.x + this.value * rect.w - 6;
    uiFillRect({ x: knobX, y: rect.y - 4, w: 12, h: rect.h + 8 }, 'rgba(60,120,255,0.9)');
  }

  getRenderLayers() {
    return [{ z: 0, draw: () => this.renderPost() }];
  }
}


