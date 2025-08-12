// Minimal LittleJS game entry
// According to LittleJS, define and pass the loop callbacks to engineInit

import { SplashScene } from './scenes/splash.js';
import { GameScene } from './scenes/game.js';
import { HowToPlayScene } from './scenes/howToPlay.js';
import { GameMenuScene } from './scenes/gameMenu.js';
import {
  sceneManager,
  changeScene,
  setSceneEffectsEnabled,
  isTransitionActive,
} from './sceneManager.js';
import { uiSetInputLocked } from './ui/common.js';

// Enable the official LittleJS splash/logo
// See engineSettings docs: showSplashScreen (global)
try {
  showSplashScreen = true;
} catch {
  /* ignore if not available */
}

// Improve key input reliability: ensure document can receive focus
try {
  if (document && document.body) {
    if (document.body.tabIndex === undefined || document.body.tabIndex === null)
      document.body.tabIndex = -1;
    document.body.focus();
    window.addEventListener('pointerdown', () => {
      try {
        window.focus();
        document.body.focus();
      } catch {}
    });
  }
} catch {}

function gameInit() {
  // Start at splash; it will transition to main game
  setSceneEffectsEnabled(true);
  const toGame = (opts) => changeScene(new GameScene(), opts);
  const toMenu = (opts) => changeScene(new GameMenuScene(toGame), opts);
  const toHowTo = (opts) => changeScene(new HowToPlayScene(toMenu), opts);

  changeScene(new SplashScene(toHowTo));
}

function gameUpdate() {
  // Lock UI input while transitions are active
  uiSetInputLocked(isTransitionActive());
  sceneManager.update();
}

function gameUpdatePost() {}

function gameRender() {
  sceneManager.render();
}

function gameRenderPost() {
  sceneManager.renderPost();
}

// Start LittleJS engine (from global littlejs build)
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
