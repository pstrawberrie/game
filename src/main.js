// Minimal LittleJS game entry
// According to LittleJS, define and pass the loop callbacks to engineInit

import { SplashScene } from './scenes/splash.js';
import { GameScene } from './scenes/game.js';
import { HowToPlayScene } from './scenes/howToPlay.js';
import { GameMenuScene } from './scenes/gameMenu.js';
import { sceneManager, changeScene, setSceneEffectsEnabled } from './sceneManager.js';

// Enable the official LittleJS splash/logo
// See engineSettings docs: showSplashScreen (global)
try { showSplashScreen = true; } catch { /* ignore if not available */ }

function gameInit() {
  // Start at splash; it will transition to main game
  setSceneEffectsEnabled(true);
  const toGame = (opts) => changeScene(new GameScene(), opts);
  const toMenu = (opts) => changeScene(new GameMenuScene(toGame), opts);
  const toHowTo = (opts) => changeScene(new HowToPlayScene(toMenu), opts);

  changeScene(new SplashScene(toHowTo));
}

function gameUpdate() {
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


