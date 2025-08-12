// Simple UI helpers for screen-space drawing using LittleJS overlay canvas

export function getOverlayContext() {
  if (typeof overlayContext !== 'undefined' && overlayContext) return overlayContext;
  return null;
}

export function getCanvasSize() {
  if (typeof mainCanvasSize !== 'undefined') return mainCanvasSize;
  // fallback
  return vec2(800, 600);
}

export function getMouseScreen() {
  // Prefer a screen-space mouse vector if provided by the engine
  if (typeof mousePosScreen !== 'undefined') return mousePosScreen;
  if (typeof mousePos !== 'undefined') return mousePos;
  return vec2(0, 0);
}

export function isMousePressed() {
  return typeof mouseWasPressed === 'function' ? mouseWasPressed(0) : false;
}

export function isKeyPressed(key) {
  return typeof keyWasPressed === 'function' && typeof key !== 'undefined' ? keyWasPressed(key) : false;
}

export function isMouseDown() {
  // Try common forms
  try {
    if (typeof mouseIsDown === 'function') return mouseIsDown(0);
  } catch {}
  if (typeof mouseIsDown === 'boolean') return mouseIsDown;
  if (typeof mouseDown === 'function') return mouseDown(0);
  if (typeof mouseDown === 'boolean') return mouseDown;
  return false;
}

export function anyKeyPressed() {
  // Prefer DOM event fallback for "any key"
  if (gAnyKeyPressedFlag) {
    gAnyKeyPressedFlag = false;
    return true;
  }
  // Fallback to engine keys if available
  if (typeof keyWasPressed === 'function') {
    for (let k = 0; k < 256; k++) {
      try { if (keyWasPressed(k)) return true; } catch {}
    }
  }
  return false;
}

// --- DOM key fallback for any-key detection ---
let gListenersBound = false;
let gAnyKeyPressedFlag = false;

function bindDomKeyListenerOnce() {
  if (gListenersBound) return;
  gListenersBound = true;
  try {
    window.addEventListener('keydown', () => { gAnyKeyPressedFlag = true; });
  } catch {}
}

bindDomKeyListenerOnce();

export function uiClearAnyKeyFlag() {
  gAnyKeyPressedFlag = false;
}

// Input consumption to respect layering (topmost handles input)
let _clickConsumed = false;
let _keyConsumed = false;
let _inputLocked = false;

export function uiBeginFrame() {
  _clickConsumed = false;
  _keyConsumed = false;
}

export function uiTryConsumeClick(rect) {
  if (_clickConsumed) return false;
  const mouse = getMouseScreen();
  const inside = rectContains(rect, mouse);
  if (inside && isMousePressed()) {
    _clickConsumed = true;
    return true;
  }
  return false;
}

export function uiTryConsumeKeys(keys) {
  if (_keyConsumed) return false;
  for (const k of keys) {
    if (typeof k !== 'undefined' && isKeyPressed(k)) {
      _keyConsumed = true;
      return true;
    }
  }
  return false;
}

export function uiSetInputLocked(locked) {
  _inputLocked = !!locked;
}

export function uiIsInputLocked() {
  return _inputLocked;
}

export function uiFillRect(rect, fillStyle) {
  const ctx = getOverlayContext();
  if (!ctx) return;
  ctx.save();
  ctx.fillStyle = fillStyle;
  ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

export function uiStrokeRect(rect, strokeStyle, lineWidth = 1) {
  const ctx = getOverlayContext();
  if (!ctx) return;
  ctx.save();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = strokeStyle;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.restore();
}

export function uiDrawTextCentered(text, rectCenter, sizePx, color = new Color(1,1,1,1)) {
  drawTextScreen(text, rectCenter, sizePx, color);
}

export function rectFromCenter(center, size) {
  return { x: center.x - size.x/2, y: center.y - size.y/2, w: size.x, h: size.y };
}

export function rectContains(rect, p) {
  return p.x >= rect.x && p.x <= rect.x + rect.w && p.y >= rect.y && p.y <= rect.y + rect.h;
}


