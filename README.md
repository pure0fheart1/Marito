# 🍄 Super Mario Platform Game

A complete Mario-like platformer game built with HTML5 Canvas and JavaScript, featuring multiple levels, enemies, power-ups, physics, and sound effects.

## 🎮 Game Features

### Core Gameplay
- **6 Unique Levels** - Progress through increasingly challenging stages
- **Multiple Themes** - Overworld, Underground, and Castle environments
- **Smooth Physics** - Realistic gravity, jumping, and collision detection
- **Responsive Controls** - Precise movement and jumping mechanics

### Player Mechanics
- **Power-Up System** - Transform from Small Mario to Big Mario to Fire Mario
- **Fire Mario** - Shoot fireballs to defeat enemies
- **Lives System** - Multiple lives with game over mechanics
- **Scoring** - Collect points for enemies, coins, and level completion

### Enemies
- **Goomba** - Basic walking enemies
- **Koopa Troopa** - Shell mechanics with kick interactions
- **Bowser Boss** - Final boss battle in castle levels
- **Smart AI** - Enemies patrol platforms and turn at edges

### Collectibles & Power-ups
- **Coins** - Collect for points and extra lives (100 coins = 1 life)
- **Super Mushroom** - Transform to Big Mario
- **Fire Flower** - Transform to Fire Mario
- **Star** - Temporary invincibility
- **1-Up Mushroom** - Extra life

## 🎯 Controls

| Key | Action |
|-----|--------|
| ← → | Move Left/Right |
| ↑ ↓ | Look Up/Duck (Big Mario only) |
| Space | Jump |
| X | Fire (Fire Mario only) |
| Shift | Run (hold for faster movement) |
| P | Pause/Resume |

## 🚀 How to Play

1. **Open `index.html`** in a modern web browser
2. **Click "Start Game"** from the main menu
3. **Navigate levels** using arrow keys and spacebar
4. **Collect power-ups** by hitting question blocks from below
5. **Defeat enemies** by jumping on them or using fireballs
6. **Reach the flagpole** at the end of each level to complete it
7. **Complete all 6 levels** to win the game!

## 🏗️ Technical Architecture

### File Structure
```
/
├── index.html          # Main HTML file with game UI
├── js/
│   ├── utils.js        # Utility functions and helpers
│   ├── physics.js      # Physics engine and collision detection
│   ├── player.js       # Player character with animations and states
│   ├── enemies.js      # Enemy classes and AI
│   ├── powerups.js     # Power-ups and collectibles
│   ├── level.js        # Level generation and management
│   ├── particles.js    # Visual effects and particle system
│   ├── sound.js        # Audio management and sound effects
│   ├── game.js         # Main game state management
│   └── main.js         # Entry point and initialization
└── README.md           # This file
```

## 🎮 Have Fun Playing!

This is a fully functional Mario-like platformer with all the classic mechanics you love. Jump, collect power-ups, defeat enemies, and save the day!