function gameInit() {
  // Start at splash; it will transition to main game
  console.log('gameInit');
}

function gameUpdate() {
  // console.log('gameUpdate');
}

function gameUpdatePost() {
  // console.log('gameUpdatePost');
}

function gameRender() {
  // console.log('gameRender');
}

function gameRenderPost() {
  // console.log('gameRenderPost');
}

// Start LittleJS engine (from global littlejs build)
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
