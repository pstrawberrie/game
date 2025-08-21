/**
 * Starfall
 */
new ParticleEmitter(
  vec2(),
  0, //position, angle
  100, // emitSize
  10, // emitTime
  20, // emitRate
  0, // emitConeAngle
  tile(2, 16), // tileIndex
  new Color(1, 1, 1, 1), // colorStartA
  new Color(1, 1, 1, 1), // colorStartB
  new Color(1, 1, 1, 1), // colorEndA
  new Color(1, 1, 1, 1), // colorEndB
  1, // particleTime
  1, // sizeStart
  0.2, // sizeEnd
  0.1, // speed
  0, // angleSpeed
  0, // damping
  0, // angleDamping
  5, // gravityScale
  0, // particleConeAngle
  0.69, // fadeRate
  0, // randomness
  0, // collideTiles
  0, // additive
  0 // randomColorLinear
); // particle emitter
