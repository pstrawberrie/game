// Minimal scene manager with extensible transition effects

let globalEffectsEnabled = true;

export function setSceneEffectsEnabled(enabled) {
  globalEffectsEnabled = !!enabled;
}

// ---- Effect Registry ----
class FadeEffect {
  constructor(options = {}) {
    const { inDuration = 0.35, outDuration = 0.25, color = new Color(0, 0, 0, 1) } = options;
    this.inDuration = inDuration;
    this.outDuration = outDuration;
    this.baseColor = color;
    this.phase = 'idle'; // 'in' | 'out' | 'idle'
    this.elapsed = 0;
  }

  begin(phase) {
    this.phase = phase;
    this.elapsed = 0;
  }

  update(dt) {
    if (this.phase === 'idle') return false;
    this.elapsed += dt;
    const duration = this.phase === 'in' ? this.inDuration : this.outDuration;
    if (this.elapsed >= duration) {
      return true; // phase done
    }
    return false;
  }

  renderPost() {
    if (this.phase === 'idle') return;
    const duration = this.phase === 'in' ? this.inDuration : this.outDuration;
    const raw = this.elapsed / (duration > 0 ? duration : 0.0001);
    const t = raw < 0 ? 0 : raw > 1 ? 1 : raw;
    const alpha = this.phase === 'in' ? (1 - t) : t;

    // Draw a fullscreen overlay on the overlay canvas
    if (typeof overlayContext !== 'undefined' && overlayContext && typeof overlayCanvas !== 'undefined' && overlayCanvas) {
      const r = Math.round(this.baseColor.r * 255) || 0;
      const g = Math.round(this.baseColor.g * 255) || 0;
      const b = Math.round(this.baseColor.b * 255) || 0;
      overlayContext.save();
      overlayContext.globalCompositeOperation = 'source-over';
      overlayContext.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      overlayContext.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);
      overlayContext.restore();
    }
  }
}

const effectRegistry = {
  fade: (options) => new FadeEffect(options),
};

export function registerSceneEffect(name, factoryFn) {
  effectRegistry[name] = factoryFn;
}

// ---- Scene Manager ----
class SceneManager {
  constructor() {
    this.currentScene = null;
    this.transition = null; // { effect, phase, toScene, options }
    this.defaultEffectName = 'fade';
    this.defaultEffectOptions = {};
    this.layers = { background: 0, world: 1, ui: 2, overlay: 3 };
  }

  setDefaults({ effectName, effectOptions } = {}) {
    if (effectName) this.defaultEffectName = effectName;
    if (effectOptions) this.defaultEffectOptions = effectOptions;
  }

  changeScene(nextScene, options = {}) {
    const { disableEffects = false, effectName, effectOptions } = options;

    const effectsEnabled = globalEffectsEnabled && !disableEffects;

    // If no current scene, start with an intro (fade-in only)
    if (!this.currentScene) {
      this.currentScene = nextScene;
      if (effectsEnabled) {
        this.transition = this.createTransition(null, nextScene, 'in', effectName, effectOptions);
      }
      return;
    }

    if (!effectsEnabled) {
      this.currentScene = nextScene;
      this.transition = null;
      return;
    }

    // Start fade-out of current, then swap and fade-in new
    this.transition = this.createTransition(this.currentScene, nextScene, 'out', effectName, effectOptions);
  }

  createTransition(fromScene, toScene, startPhase, effectName, effectOptions) {
    const name = effectName || this.defaultEffectName;
    const factory = effectRegistry[name] || effectRegistry.fade;
    const effect = factory({ ...this.defaultEffectOptions, ...effectOptions });
    effect.begin(startPhase);
    return { effect, phase: startPhase, fromScene, toScene };
  }

  update() {
    // Update active scene
    if (this.currentScene && this.currentScene.update) this.currentScene.update();

    // Update transition if any
    if (this.transition) {
      const dt = (typeof timeDelta === 'number' && timeDelta > 0) ? timeDelta : 1/60;
      const phaseDone = this.transition.effect.update(dt);
      if (phaseDone) {
        if (this.transition.phase === 'out') {
          // switch scene and start fade-in
          this.currentScene = this.transition.toScene;
          this.transition.effect.begin('in');
          this.transition.phase = 'in';
        } else {
          // in done
          this.transition = null;
        }
      }
    }
  }

  render() {
    if (this.currentScene && this.currentScene.render) this.currentScene.render();
  }

  renderPost() {
    // world post-effects first
    if (this.currentScene && this.currentScene.renderPost) this.currentScene.renderPost();
    if (this.transition && this.transition.effect && this.transition.effect.renderPost) {
      this.transition.effect.renderPost();
    }
  }
}

export const sceneManager = new SceneManager();

export function changeScene(nextScene, options) {
  sceneManager.changeScene(nextScene, options);
}


