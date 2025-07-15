/*
    Space MMORPG - LittleJS Game
    - A simple space-themed game with player movement
    - Uses LittleJS engine with global namespace
*/

'use strict';

// show the LittleJS splash screen
setShowSplashScreen(true);

// game variables
let player;

///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    // engine settings
    gravity = 0; // no gravity in space
    cameraScale = 32;
    
    // create player
    player = new EngineObject(vec2(0, 0), vec2(1, 1));
    player.color = hsl(0, 1, 0.5); // green color
    
    console.log('Game initialized! Use WASD or arrow keys to move.');
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    // handle player movement
    const moveSpeed = 0.1;
    let moveX = 0;
    let moveY = 0;
    
    if (keyIsDown('KeyW') || keyIsDown('ArrowUp')) moveY -= moveSpeed;
    if (keyIsDown('KeyS') || keyIsDown('ArrowDown')) moveY += moveSpeed;
    if (keyIsDown('KeyA') || keyIsDown('ArrowLeft')) moveX -= moveSpeed;
    if (keyIsDown('KeyD') || keyIsDown('ArrowRight')) moveX += moveSpeed;
    
    // normalize diagonal movement
    if (moveX !== 0 && moveY !== 0) {
        const length = Math.sqrt(moveX * moveX + moveY * moveY);
        moveX /= length;
        moveY /= length;
    }
    
    // update player position
    player.pos.x += moveX;
    player.pos.y += moveY;
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
    // update camera to follow player
    cameraPos = player.pos;
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // draw space background
    drawRect(vec2(0, 0), vec2(100, 100), hsl(0, 0, 0.1), 0, true);
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // draw UI
    drawTextScreen('Space MMORPG', 
        vec2(mainCanvasSize.x/2, 20), 40,   // position, size
        hsl(0, 0, 1), 2, hsl(0, 0, 0));     // color, outline size and color
    
    drawTextScreen('Use WASD or Arrow Keys to Move', 
        vec2(mainCanvasSize.x/2, 70), 20,   // position, size
        hsl(0, 0, 0.8), 1, hsl(0, 0, 0));   // color, outline size and color
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost); 