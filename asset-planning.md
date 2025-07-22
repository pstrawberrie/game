# Asset Planning

The game is a 2d isometric MMORPG with turn-based combat. The game engine being used is [LittleJS](https://github.com/KilledByAPixel/LittleJS). I need help creating the assets, so we will be using AI to generate the assets for our MVP.

## Asset Creation

Base Rules for AI asset generation:

- **The art style must be consistent** (content can vary wildly, but style should be consistent)
  - For inspiration,
- Player Character sprites, Clothing sprites, and Weapon sprites need to have consistent indexed coloring: they will be using WebGL shaders for dynamic sprite coloring.
- All asset types should be standardized according to the most efficient sprite loading method available in LittleJS Engine (ie. player character sprite actions should be 6 frames, row x is walk N, row x is walk NE, etc.)

## Asset Sizes & General Requirements

Here are the constraints for generating assets:

- PC Sprites and NPC Sprites must be exactly 64×96 pixels
- PC Sprite Actions must have 6 frames each
- PC Sprite Actions must have 5 directions - 3 of them can be reused/mirrored: NE mirrors NW, SE mirrors SW, E mirrors W
- Tile Sprites must be 64×32 pixels

## Player Character Sprites

- PC Sprite frames must be exactly 64×96 pixels
- PC Sprite Actions must have 8 directions (isomorphic)
  - 3 directions can be reused/mirrored: NW mirrors NE, SW mirrors SE, W mirrors E
- PC Sprites must be created in such a way that they can have additional actions added in the future
- PC must be created in such a way that they can equip any of the game's wearables (AI IGNORE)

### Player Character Sprite Base Actions

- Walk
  - walk N
  - walk NE
  - walk E
  - walk SE (NE mirror)
  - walk S
  - walk SW (SE mirror)
  - walk W (E mirror)

### Player Character Sprite Additional Actions (AI IGNORE)

- idle_standing
- action_generic
- death
- hurt
- sit
- idle_sitting
- run
- eat
- drink
- sleep
- cheer
- heal
- buff
- dance
- hug
- kiss

### Player Character Wearables (AI IGNORE)

- tbd, still need to get base PC sprite down and then map the positions for wearables

### Player Character Special Wearables (AI IGNORE)

- tbd, still need to get base PC sprite down and then map the positions for wearables

## NPCs

- NPC Sprites must be 64×96 pixels
- NPCs should have a standard set of animations with the option to add more in the future

### NPC Sprite Base Actions

- Walk

  - walk N
  - walk NE
  - walk E
  - walk SE (NE mirror)
  - walk S
  - walk SW (SE mirror)
  - walk W (E mirror)

### NPC Sprite Additional Actions (AI IGNORE)

- idle_standing
- action_generic
- death
- hurt
- sit
- idle_sitting
- eat
- drink
- sleep
- cheer
- heal
- buff

## Tiles

- Tile Sprites must be 64×32 pixels

### Zones (AI IGNORE)

- tbd, will use tile advice from chatgpt-littlejs-sprite-tile-guide.md

### Structures (AI IGNORE)

- tbd, will use tile sprite advice from chatgpt-littlejs-sprite-tile-guide.md

## Music (AI IGNORE)

- tbd, will use [ZzFX](https://killedbyapixel.github.io/ZzFX/) for sound

## AI Generation Prompt

First, please read the attached markdown file `chatgpt-littlejs-sprite-tile-guide.md` for context.

After that, please read this markdown document to gather requirements. Ignore any children requirements which are nested within parent headers that have the text "(AI IGNORE)". Ignore any single-line requirements which end with the text "(AI IGNORE)". Using this document's requirements, please generate the following assets:

- 1 Player Character Sprite: human male
- 1 NPC Sprite (skeleton)
- 1 Tile Sprite (grass)
