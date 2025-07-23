# Game Planning

## Free Movement (Open World)

The game world will be broken into zones. Players have free movement within "free movement zones". Every free movement zone should have the ability to have interactable objects,
npcs, creatures, and structures. Combat zones should be inherited from free movement zones, but may have further restrictions (such as no structure placement allowed, etc.)

**Keys used in free movement mode:**

- Movement
  - UP (default bind: W)
  - LEFT (default bind: A)
  - DOWN (default bind: S)
  - RIGHT (default bind: D)
- Interaction (NPCs, Objects, etc.)
  - Open Proximity Interaction Menu (default bind: SPACEBAR)
    - player must be colliding with the object to open this menu
  - Open Skill Menu (default bind: Q)
    - player can use certain skills in free movement mode if they are within range and the object or creature can have skills used on it
- Zone (Trading, Player List, etc.)
  - Open Zone Menu (default bind: Z)

### Zone Types

#### Free Movement Zones

In free movement zones, characters can interact with objects

- Standard Zones

  - characters can freely walk around

- Flight Zones

  - characters must be in vehicles to be in these zones

- Structure Zones
  - combat structures (towers, dungeons, etc.)
  - public structures
  - player-owned structures (houses, shops, guild halls, etc.)

#### Municipal Zones

In municipal zones, players can place structures and objects.

- Municipal zones have a permission system
  - have an owner or multiple owners
  - can be public or private (player allow list, guild allow list)
  - permissions include: place items, pick up items, place structures, place NPCs
- Municipal zone owners can place municipal structures (town hall, town pub, town mini games) if they have the correct permissions

#### Combat Zones

- Open-world combat zones

  - these zones are open to everybody
  - these zones drop standard items

- Extraction combat zones

  - these zones are open to solo players or groups
  - these zones drop high quality items
  - if the player dies/group wipes in an extraction zone, they drop everything in their inventory

- PvP combat zones
  - these zones are open to solo players or groups
  - these zones drop high quality items
  - if the player dies/group wipes in pvp combat, they drop everyting in their inventory

#### Battle Stage Zones

These zones will be uniqe zones where combat takes place. Players will have tile-based movement and action points to spend on movements or skills.

## Inventory

Players will have various inventories. All variations of inventories will have search functionality. Some inventories will have permission systems (structure inventories, vehicle inventories)

- Player Wearable Inventory Slots
  - Head
  - Chest
  - Back (capes, wings, etc.)
  - Arms
  - Hands
  - Legs
  - Feet
- Player Special Inventory Slots
  - Weapon Left
  - Weapon Right
  - Backpack
- Player Item Inventory
  - more item slots can be acquired via skills
- Player Backpack Inventory
  - must have backpack equipped
  - items can be added to/removed from backpack via player inventory or shared structure/vehicle inventory
- Shared Structure Inventory, Shared Vehicle Inventory
  - Available in structures where players have item pickup permissions
  - Items in structures can be placed in containers or placed freely on the ground

## Items

### Wearables System (Clothing)

- No distinction between combat and non-combat wearables
- Crafting will determine if the wearable item has combat-specific attributes (see [combat damage types](#combat-damage-types))
- Crafting will determine if the wearable item has skill attributes or special abilities

## Skills

### Skill System

Skill system combines several different styles from popular games. Skills can be used in both free world and combat gameplay, and will cost sp (skill points) unless the player is in a zone which disables sp cost.

- Valheim-style character progression / "learn as you do": performing actions will passively gain experience for that action (ie. attacking with fists will give melee xp and unarmed xp, crafting with a saw will give general crafting xp and saw crafting xp, etc.)
- Star Wars Galaxies style character progression: set amount of skill points that can be spent on different professions and skills within those professions (non-linear/mix-and-match skill system). Players can drop and pick up skills at will
- Players can choose 1 meta-specialization for solo play and 1 meta-specialization for group play
  - Looter (gets better loot)
  - Slapper (does more damage to PvE)
  - Angel (increased heal potency), Puller (can pull 1-3 PvE monsters to them)
  - more to come

### Skill Trees (names will change)

- Melee (must be within x tiles)
  - Melee Attack (heals player or enemy)
  - Melee Heal (heals player or enemy)
  - Melee Buff (buffs next player or enemy action)
- Ranged(must be x tiles away)
  - Ranged Attack (heals player or enemy)
  - Ranged Heal (heals player or enemy)
  - Ranged Buff (buffs next player or enemy action)
- Crafting
  - Food Crafting
  - Drink Crafting
  - Weapon Crafting
  - Clothes Crafting
  - Armor Crafting

## Character Creation

- characters start with no skills

- as characters use the
- characters can pick

## Character Progression

- characters can use any items that require skill level 0
- when a players uses an item that has an associated skill, that skill gains passive XP
- characters can choose 1 specialization (more in the future)
  - Combat (increased damage)
  - Healing (increased healing)
  - Buffing (increased buffing)
  - Crafting (increased crafting)
  -

## Combat

### Combat System

#### Combat General

- Combat system will mirror XCOM 2 or Final Fantasy Tactics: turn-based combat with tile movement.
- Combat will comprise of both PvE and PvP.
- Combat will be initiated in Free Movement mode by colliding with the combatant (pokemon-style) or by using a special skill (ie. pull a combatant towards you)

#### Combat Damage Types

- Various damage types will exist (ie. kinetic, energy, wind, fire, water, earth, lightning, void, more to come)
- Damage type will depend on the skill and/or weapon
- Damage types can be enhanced by wearable stats and skill stats (ie. kinetic damage bonus, fire damage bonus, etc.)
- Damage types can be mitigated by wearable stats and skill stats (ie. kinetic resist, fire resist, etc.)

#### Combat State Types

- Various state types will exist (ie. stun, sleep, berserk, )

### Buff System

- Upon death, buffs are reset

#### Open World Buffing

- Open World Buff System will be Star Wars Galaxies-esque: players can receive time-limited buffs from other players who have the skills to buff (skills tbd)

#### Combat Buffing/Debuffing

- Buffs in combat affect specific skills and/or damage types for x amount of turns
- Some buffs will target a single player
- Some buffs will target multiple players
- Some buffs will target entire group
- Some buffs will target tiles

### Food/Drink System

- Players can have 1 food and 1 drink active (time-limited)
- Skills can unlock more food/drink slots
- Upon death, food/drink slots are reset

## Looting

- Random looting system to start, will refine later
- PvE Loot drops based off of enemy level
- PvP loot drops tbd

## Crafting

- Players can craft items (details tbd)

## Trading

- Players can trade items when they are in the same zone using the zone menu (default bind: Z)

## Taming

- Players can acquire skills to tame creatures (details tbd)
- Players can sell tamed creatures

## Mounting

- Tamed creatures can be mounted and will inherit from the vehicle type
