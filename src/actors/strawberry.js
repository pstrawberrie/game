// Pixel strawberry sprite as an EngineObject (LittleJS)
// - Uses a small pixel grid per frame rendered with drawRect in world space
// - Supports 4 facing directions and a simple 2-frame walk cycle placeholder
// - Movement uses LittleJS input (KEY_LEFT/RIGHT/UP/DOWN) and engine physics

export class Strawberry extends EngineObject {
  constructor(pos = vec2(0, 0)) {
    // Base size in world units; computed from pixel grid and cell size below
    const cell = 0.1; // world units per pixel
    const grid = Strawberry.frames.south[0];
    const width = grid[0].length * cell;
    const height = grid.length * cell;
    super(pos, vec2(width, height));

    this.cell = cell;
    this.facing = 'south'; // 'north'|'east'|'south'|'west'
    this.frameIndex = 0;
    this.frameTime = 0;
    this.frameDuration = 0.18; // seconds per anim frame
    this.moveSpeed = 3; // world units per second

    // Physics tweaks (arcade)
    this.mass = 1;
    this.damping = 0.9; // strong damping so it stops quickly when not moving
    this.collideSolid = false; // no world solids yet

    // Debug helpers
    this._dbgInitLogged = false;
    this._dbgLast = { left: false, right: false, up: false, down: false };
    this._dbgAccum = 0;
  }

  static get frames() {
    // 12x12-ish strawberry; palette indices: 0=transparent,1=outline,2=red,3=light red,4=green,5=seed
    // Two frames per direction; for now east/west mirror, north/south share base
    const base = [
      [0, 0, 0, 4, 4, 4, 4, 0, 0, 0, 0, 0],
      [0, 0, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0],
      [0, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0],
      [4, 4, 3, 3, 2, 2, 3, 3, 4, 4, 0, 0],
      [0, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0],
      [0, 1, 2, 5, 2, 2, 5, 2, 1, 0, 0, 0],
      [0, 1, 2, 2, 2, 5, 2, 2, 1, 0, 0, 0],
      [0, 1, 2, 5, 2, 2, 5, 2, 1, 0, 0, 0],
      [0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 2, 2, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    // Second frame: tiny leg/arm nudge for a hint of motion
    const alt = base.map((row, j) =>
      row.map((v, i) => {
        // nudge a few outline/seed pixels
        if (j === 9 && (i === 3 || i === 6) && v === 1) return 1; // feet
        if (j === 5 && (i === 2 || i === 7) && v === 2) return 3; // subtle light
        return v;
      })
    );
    const mirror = (g) => g.map((row) => [...row].reverse());
    return {
      south: [base, alt],
      north: [base, alt],
      east: [mirror(base), mirror(alt)],
      west: [base, alt],
    };
  }

  static palette(index) {
    switch (index) {
      case 1:
        return new Color(0.08, 0.08, 0.08, 1);
      case 2:
        return new Color(0.85, 0.18, 0.25, 1);
      case 3:
        return new Color(1.0, 0.35, 0.45, 1);
      case 4:
        return new Color(0.22, 0.7, 0.3, 1);
      case 5:
        return new Color(1.0, 0.9, 0.3, 1);
      default:
        return null;
    }
  }

  update() {
    const dt = typeof timeDelta === 'number' && timeDelta > 0 ? timeDelta : 1 / 60;

    // Input (LittleJS provides keyIsDown/KEY_* constants) + numeric fallbacks
    const hasKFunc = typeof keyIsDown === 'function';
    const hasKArr = typeof keyIsDown !== 'undefined' && !hasKFunc && Array.isArray(keyIsDown);
    const isDown = (code) => {
      try {
        if (hasKFunc) return keyIsDown(code);
        if (hasKArr) return !!keyIsDown[code];
      } catch {}
      return false;
    };
    const keyNamed = (globalName) => {
      try {
        const v = typeof globalThis !== 'undefined' ? globalThis[globalName] : undefined;
        return typeof v !== 'undefined' ? isDown(v) : false;
      } catch {
        return false;
      }
    };
    const keyCode = (n) => isDown(n);
    const left = keyNamed('KEY_LEFT') || keyNamed('KEY_A') || keyCode(37) || keyCode(65);
    const right = keyNamed('KEY_RIGHT') || keyNamed('KEY_D') || keyCode(39) || keyCode(68);
    const up = keyNamed('KEY_UP') || keyNamed('KEY_W') || keyCode(38) || keyCode(87);
    const down = keyNamed('KEY_DOWN') || keyNamed('KEY_S') || keyCode(40) || keyCode(83);

    // Compute desired velocity (LittleJS EngineObject uses `vel` for motion)
    // In LittleJS world space, +x right, +y up
    const dir = vec2((right ? 1 : 0) - (left ? 1 : 0), (up ? 1 : 0) - (down ? 1 : 0));
    if (dir.length()) dir.normalize();
    this.vel = dir.scale(this.moveSpeed);

    // Facing priority: vertical over horizontal if non-zero
    if (dir.y > 0) this.facing = 'north';
    else if (dir.y < 0) this.facing = 'south';
    else if (dir.x > 0) this.facing = 'east';
    else if (dir.x < 0) this.facing = 'west';

    // Animate when moving
    if (dir.length()) {
      this.frameTime += dt;
      if (this.frameTime >= this.frameDuration) {
        this.frameTime = 0;
        this.frameIndex = (this.frameIndex + 1) % 2;
      }
    } else {
      this.frameTime = 0;
      this.frameIndex = 0;
    }

    // --- Console debugging (throttled) ---
    this._dbgAccum += dt;
    if (!this._dbgInitLogged) {
      this._dbgInitLogged = true;
      console.info('[Strawberry] Input init:', {
        hasKeyIsDownFunc: hasKFunc,
        hasKeyIsDownArray: hasKArr,
        KEY_LEFT: typeof KEY_LEFT !== 'undefined' ? KEY_LEFT : null,
        KEY_RIGHT: typeof KEY_RIGHT !== 'undefined' ? KEY_RIGHT : null,
        KEY_UP: typeof KEY_UP !== 'undefined' ? KEY_UP : null,
        KEY_DOWN: typeof KEY_DOWN !== 'undefined' ? KEY_DOWN : null,
        KEY_W: typeof KEY_W !== 'undefined' ? KEY_W : null,
        KEY_A: typeof KEY_A !== 'undefined' ? KEY_A : null,
        KEY_S: typeof KEY_S !== 'undefined' ? KEY_S : null,
        KEY_D: typeof KEY_D !== 'undefined' ? KEY_D : null,
      });
    }

    const keys = { left, right, up, down };
    const keysChanged =
      keys.left !== this._dbgLast.left ||
      keys.right !== this._dbgLast.right ||
      keys.up !== this._dbgLast.up ||
      keys.down !== this._dbgLast.down;
    if (keysChanged || this._dbgAccum >= 0.5) {
      this._dbgAccum = 0;
      this._dbgLast = keys;
      console.log(
        '[Strawberry] keys',
        keys,
        'dir',
        { x: +dir.x.toFixed(2), y: +dir.y.toFixed(2) },
        'vel',
        {
          x: +this.vel.x.toFixed(2),
          y: +this.vel.y.toFixed(2),
        },
        'pos',
        { x: +this.pos.x.toFixed(2), y: +this.pos.y.toFixed(2) }
      );
    }

    super.update();
  }

  render() {
    // Draw pixel grid in world space using drawRect
    const framesDir = Strawberry.frames[this.facing] || Strawberry.frames.south;
    const grid = framesDir[this.frameIndex] || framesDir[0];
    const pixel = this.cell;

    // Top-left from center pos
    const wCells = grid[0].length;
    const hCells = grid.length;
    const topLeft = vec2(this.pos.x - (wCells * pixel) / 2, this.pos.y - (hCells * pixel) / 2);

    for (let j = 0; j < hCells; j++) {
      for (let i = 0; i < wCells; i++) {
        const idx = grid[j][i];
        const col = Strawberry.palette(idx);
        if (!col) continue;
        const cx = topLeft.x + i * pixel + pixel / 2;
        // Flip vertically so the sprite is upright
        const cy = topLeft.y + (hCells - 1 - j) * pixel + pixel / 2;
        drawRect(vec2(cx, cy), vec2(pixel, pixel), col);
      }
    }
  }
}
