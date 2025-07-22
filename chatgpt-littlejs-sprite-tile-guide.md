# 🎮 Sprite and Tile Asset Guide for Your LittleJS Game

This guide combines best practices and recommendations for creating **character sprites** and **tile assets** for your isometric browser game using **LittleJS with WebGL2**.

---

## 👤 Character Sprite Guidelines

### ✅ Sprite Directions

- Use **8 directions**: N, NE, E, SE, S, SW, W, NW
- Mirror sprites to save work:
  - Draw only: N, NE, E, SE, S
  - Mirror: NW ← NE, W ← E, SW ← SE

### ✅ Ideal Sprite Size

- Minimum Target Resolution: **1024×768**
- Recommended size: **64×96** or **128×128** per frame
- Match sprite size to tile scale (e.g. 64×32 tiles)
- Avoid overly large sprites for performance reasons

### ✅ Sprite Sheet Layout

- Organize by direction and animation frame:
  - 8 directions × 6 frames = 48 frames
  - Total sheet: e.g. 512×576px

### ✅ Dynamic Coloring (Hair, Skin, Clothes)

- Use **flat placeholder colors** for colorable parts:
  - Skin: `#FF00FF`
  - Hair: `#00FF00`
  - Clothes: `#0000FF`
- Avoid anti-aliasing on color zones

### ✅ WebGL Shader Coloring

Use fragment shaders in LittleJS to replace placeholder colors at runtime.

Example shader fragment:

```glsl
vec4 color = texture2D(uSampler, vTextureCoord);

if (color.rgb == vec3(1.0, 0.0, 1.0))       // Skin
    color.rgb = skinColor;
else if (color.rgb == vec3(0.0, 1.0, 0.0))  // Hair
    color.rgb = hairColor;
else if (color.rgb == vec3(0.0, 0.0, 1.0))  // Clothes
    color.rgb = clothesColor;

gl_FragColor = color;
```

---

## 🧱 Tile Asset Guidelines

### ✅ Tile Size

- Use **64×32** (isometric) tile grid
- Supports clear visuals and reasonable performance

### ✅ Tilesheet Organization

Separate tiles into categories:

- `tileset_ground.png`
- `tileset_structures.png`
- `tileset_objects.png`
- `tileset_overlay.png`

### ✅ Zone Map Format (JSON)

Store zone layout like this:

```js
const zone = {
  ground: [
    [1, 1, 2, 2],
    [1, 1, 2, 2],
  ],
  structure: [
    [0, 0, 5, 0],
    [0, 6, 5, 6],
  ],
};
```

Each number corresponds to a tile index in a spritesheet.

### ✅ Layered Rendering Order

1. Ground
2. Structures
3. Interactables
4. Characters
5. Overlay

Use `z = y` logic for depth-sorting.

### ✅ Tile Metadata

Store metadata per tile ID:

```js
{
  1: { name: "Grass", walkable: true },
  5: { name: "Wall", walkable: false },
  6: { name: "Door", interact: "open_door" }
}
```

### ✅ Tools to Use

- Tiled Map Editor (for editing zone maps)
- TexturePacker (for sprite/tilesheet packing)
- Aseprite or Pyxel Edit (for pixel art)

---

## 🧪 Optimization Tips

- Batch draw tiles by texture
- Use object pooling for interactables
- Stream zone data as player moves
- Precompile metadata for runtime speed

---

## 🚀 Next Steps

- Set up tilesheet rendering logic using `drawImage`
- Implement player coloring shader
- Build tile metadata system
- Load zone JSON and render tiles based on layer

Enjoy building your world!
