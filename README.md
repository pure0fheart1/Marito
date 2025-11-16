# 🍄 Marito - Super Mario Platform Game

A fully-featured Mario-style platformer game built with HTML5 Canvas and vanilla JavaScript. Experience classic platforming action with modern web technologies, complete with physics simulation, power-ups, enemies, and multiple levels.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)

## ✨ Features

### Core Gameplay
- 🎮 **10 Epic Levels** - Progress through 3 worlds with increasing difficulty
- 🌍 **10 Unique Themes** - Overworld, Underground, Sky, Castle, Desert, Ice, Volcano, Sky Castle, Jungle, and Underwater
- 🏆 **Boss Battles** - Face challenging boss fights at the end of each world
- ⚡ **Smooth Physics Engine** - Realistic gravity, acceleration, and collision detection
- 🎯 **Responsive Controls** - Precise movement with coyote time and jump buffering
- 💾 **Save System** - LocalStorage integration for high scores and game progress
- 📱 **Mobile Support** - Touch controls for playing on mobile devices

### Player Mechanics
- **Three States**: Small Mario → Big Mario → Fire Mario
- **Fire Mario**: Shoot fireballs to defeat distant enemies
- **Lives System**: 3 lives to start, collect 100 coins for extra lives
- **Invulnerability**: Temporary immunity after taking damage
- **Power-Up Transformations**: Smooth animation transitions between states

### Enemies & AI
- **Goomba** - Basic walking enemies (100 points)
- **Koopa Troopa** - Shell mechanics with kick interactions (200 points)
- **Piranha Plant** - Emerges from pipes when player is far (200 points)
- **Buzzy** - Flying enemies with swoop attacks (300 points)
- **Smart AI** - Enemies patrol, detect ledges, and respond to player proximity

### Collectibles & Power-ups
- 🪙 **Coins** - Collect for points (100 coins = 1 extra life)
- 🍄 **Super Mushroom** - Grow to Big Mario
- 🌺 **Fire Flower** - Gain fireball shooting ability
- ⭐ **Star** - 10 seconds of invincibility
- 💚 **1-Up Mushroom** - Extra life

### Visual & Audio
- 🎨 **Particle Effects** - Explosions, sparkles, and visual feedback
- 🎵 **Sound System** - Procedurally generated sound effects using Web Audio API
- 🎬 **Smooth Animations** - Frame-based sprite animations for player and enemies
- 📷 **Camera System** - Follows player with smooth scrolling

## 🎮 Controls

### Keyboard (Desktop)
| Key | Action |
|-----|--------|
| ← → / A D | Move Left/Right |
| ↑ / W | Look Up |
| ↓ / S | Duck (Big Mario only) |
| Space | Jump |
| Z / Ctrl | Fire Fireball (Fire Mario) |
| Shift / X | Run (hold for faster movement) |
| P / Esc | Pause/Resume |
| M | Mute/Unmute |

### Touch Controls (Mobile)
- **Left D-Pad**: Move left (◄) and right (►)
- **Right Buttons**: Jump (A) and Fire (B)
- Touch controls automatically appear on touch-enabled devices

## 🚀 Quick Start

### Play Instantly
1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Click "Start Game" and enjoy!

### Using a Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8080

# Using Node.js (after npm install)
npm start

# Using PHP
php -S localhost:8080
```

Then open `http://localhost:8080` in your browser.

## 🏗️ Architecture

### Project Structure
```
Marito/
├── index.html              # Main HTML file with game UI
├── css/
│   └── styles.css          # External stylesheet with responsive design
├── js/
│   ├── config.js           # Centralized configuration and constants
│   ├── utils.js            # Utility functions and helpers
│   ├── storage.js          # LocalStorage management for saves/scores
│   ├── touch-controls.js   # Mobile touch control system
│   ├── physics.js          # Physics engine and collision detection
│   ├── player.js           # Player character logic and animations
│   ├── enemies.js          # Enemy classes and AI behaviors
│   ├── powerups.js         # Power-ups and collectibles system
│   ├── level.js            # Level generation and management
│   ├── particles.js        # Particle system with object pooling
│   ├── sound.js            # Audio management with Web Audio API
│   ├── game.js             # Main game state management
│   └── main.js             # Entry point and initialization
├── package.json            # Project metadata and dependencies
├── .eslintrc.json          # ESLint configuration for code quality
├── .editorconfig           # Editor configuration for consistency
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

### Key Technologies
- **HTML5 Canvas 2D** - All rendering and graphics
- **Vanilla JavaScript (ES6+)** - Game logic and mechanics
- **Web Audio API** - Procedural sound generation
- **LocalStorage API** - Data persistence
- **Touch Events API** - Mobile support

### Design Patterns Used
- **Object-Oriented** - Class-based architecture for game entities
- **Object Pooling** - Efficient particle system with pre-allocated objects
- **State Machine** - Game states (menu, playing, paused, game over)
- **Factory Pattern** - Dynamic enemy and power-up creation
- **Configuration Pattern** - Centralized constants in CONFIG object

## 🎯 How to Play

### Basic Gameplay
1. **Start**: Click "Start Game" from the main menu
2. **Move**: Use arrow keys or WASD to move and jump
3. **Collect**: Hit question blocks from below to get power-ups
4. **Fight**: Jump on enemies or shoot fireballs to defeat them
5. **Complete**: Reach the flagpole at the end of each level
6. **Win**: Complete all 10 levels across 3 challenging worlds!

### Tips & Tricks
- 💡 Collect 100 coins for an extra life
- 💡 Big Mario can break blocks and take one hit
- 💡 Fire Mario can defeat enemies from a distance
- 💡 Star power makes you invincible temporarily
- 💡 Time bonus: Complete levels quickly for extra points
- 💡 Jump on enemies for points and combos

### Scoring System
| Action | Points |
|--------|--------|
| Goomba | 100 |
| Koopa | 200 |
| Piranha Plant | 200 |
| Buzzy | 300 |
| Coin | 100 |
| Power-up | 1000 |

## 🗺️ Level Guide

Marito features **10 progressively challenging levels** across **3 worlds** with unique themes and mechanics:

### World 1: Green Lands (Easy - Medium)

#### 1-1: Green Hills Zone 🌳
- **Theme**: Overworld
- **Difficulty**: ★☆☆☆☆ (Tutorial)
- **Length**: 6400 pixels
- **Time**: 400 seconds
- **Features**: Basic platforming, introduction to enemies, power-ups
- **Enemies**: Goombas, Koopas, 1 Piranha Plant

#### 1-2: Underground Cavern 🕳️
- **Theme**: Underground
- **Difficulty**: ★★☆☆☆
- **Length**: 5120 pixels
- **Time**: 350 seconds
- **Features**: Tight corridors, pipes, narrow platforms over pits
- **Enemies**: Goombas, Buzzy Beetles, multiple Piranha Plants

#### 1-3: Cloud Garden ☁️
- **Theme**: Sky
- **Difficulty**: ★★★☆☆
- **Length**: 7200 pixels
- **Time**: 350 seconds
- **Features**: Cloud platforms, moving platforms, high jumps, bonus coins
- **Enemies**: Koopas, many flying Buzzy Beetles

#### 1-4: Castle Showdown 🏰
- **Theme**: Castle
- **Difficulty**: ★★★★☆ (Boss Level)
- **Length**: 4800 pixels
- **Time**: 300 seconds
- **Features**: Lava pits, narrow platforms, fire bars, **Bowser Boss Fight**
- **Boss**: Bowser (10 HP, fire breathing, jump attacks)

### World 2: Extreme Zones (Hard - Very Hard)

#### 2-1: Sandy Dunes 🏜️
- **Theme**: Desert
- **Difficulty**: ★★★★☆
- **Length**: 8000 pixels
- **Time**: 380 seconds
- **Features**: Sand dunes, quicksand, pyramid structures, long level
- **Enemies**: Increased enemy density, faster movement

#### 2-2: Frozen Tundra ❄️
- **Theme**: Ice
- **Difficulty**: ★★★★★
- **Length**: 7400 pixels
- **Time**: 320 seconds
- **Features**: **Slippery ice physics**, narrow platforms, icicle obstacles
- **Hazards**: Iceblocks, falling icicles
- **Special**: Reduced friction makes controls harder

#### 2-3: Volcanic Fury 🌋
- **Theme**: Volcano
- **Difficulty**: ★★★★★
- **Length**: 6800 pixels
- **Time**: 280 seconds
- **Features**: Lava pools, falling platforms, fireball launchers, crumbling platforms
- **Hazards**: Rising lava, fire bars, extreme danger
- **Special**: Star power-up critical for survival

#### 2-4: Sky Fortress 🏯
- **Theme**: Sky Castle
- **Difficulty**: ★★★★★ (Boss Level)
- **Length**: 5600 pixels
- **Time**: 260 seconds
- **Features**: Cloud platforms, moving platforms, Thwomp obstacles, **Flying Bowser Boss**
- **Boss**: Flying Bowser (15 HP, aerial attacks, fire breath)

### World 3: Ultimate Challenge (Extreme)

#### 3-1: Jungle Ruins 🌴
- **Theme**: Jungle
- **Difficulty**: ★★★★★+
- **Length**: 9600 pixels (longest level!)
- **Time**: 350 seconds
- **Features**: Swinging vines, spike traps, ancient ruins, waterfalls, hidden passages
- **Enemies**: Dense enemy placement, multiple types
- **Special**: Requires mastery of all mechanics

#### 3-2: Deep Sea Adventure 🌊
- **Theme**: Underwater
- **Difficulty**: ★★★★★★ (Max)
- **Length**: 7200 pixels
- **Time**: 300 seconds
- **Features**: **Underwater physics**, currents, whirlpools, kelp forest, shipwrecks
- **Enemies**: Cheep-Cheeps (fish), Bloopers (squid)
- **Special**: Completely different movement physics, air management

### Difficulty Progression

Each level increases difficulty through:
- **Enemy Speed**: 1.0x → 2.0x (doubles by level 10)
- **Enemy Count**: More enemies per level
- **Platform Complexity**: Narrower platforms, bigger gaps, moving platforms
- **Time Pressure**: Less time to complete each level
- **New Mechanics**: Ice physics, water physics, lava, moving obstacles

### Level Themes & Visual Variety

| Theme | Background | Ground | Special Features |
|-------|------------|--------|------------------|
| **Overworld** | Sky Blue | Brown | Classic grass levels |
| **Underground** | Black | Dark Brown | Caves, tight spaces |
| **Sky** | Light Blue | White Clouds | No solid ground, cloud platforms |
| **Castle** | Dark Gray | Gray Stone | Lava, fire bars |
| **Desert** | Sand Yellow | Tan | Quicksand, pyramids |
| **Ice** | Pale Blue | White Ice | Slippery surfaces |
| **Volcano** | Dark Red | Lava Rock | Falling platforms, fire |
| **Sky Castle** | Blue | Cloud/Stone Mix | High altitude fortress |
| **Jungle** | Green | Jungle Floor | Vines, ruins, waterfalls |
| **Underwater** | Deep Blue | Coral | Water physics, currents |

## 🛠️ Development

### Setup Development Environment
```bash
# Clone the repository
git clone https://github.com/pure0fheart1/Marito.git
cd Marito

# Install development dependencies
npm install

# Start local development server
npm start

# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

### Code Quality
- **ESLint** - Enforces code quality and consistency
- **EditorConfig** - Ensures consistent formatting across editors
- **JSDoc** - Comprehensive documentation for all classes and methods
- **Frozen Config** - Immutable configuration prevents accidental modifications

### Performance Optimizations
- ✅ **Object Pooling** - Particles pre-allocated (200-object pool)
- ✅ **Efficient Collision Detection** - Optimized AABB algorithm
- ✅ **Camera Culling** - Only render visible objects
- ✅ **Frozen Objects** - CONFIG frozen to prevent mutations
- ✅ **RAF-based Game Loop** - 60 FPS target with requestAnimationFrame

## 🐛 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome | 60+ | ✅ Full |
| Firefox | 55+ | ✅ Full |
| Safari | 11+ | ✅ Full |
| Edge | 79+ | ✅ Full |
| Mobile Chrome | Latest | ✅ Touch Controls |
| Mobile Safari | Latest | ✅ Touch Controls |

### Requirements
- HTML5 Canvas support
- ES6+ JavaScript support
- Web Audio API (optional - graceful degradation)
- LocalStorage API (optional - for saves)

## 📚 API Documentation

### Configuration (CONFIG)
All game constants are centralized in `js/config.js`:
```javascript
CONFIG.PLAYER.MAX_LIVES       // Default: 3
CONFIG.PHYSICS.GRAVITY        // Default: 0.8
CONFIG.PLAYER.JUMP_STRENGTH   // Default: -15
CONFIG.AUDIO.SFX_VOLUME       // Default: 0.5
// ... and many more
```

### Storage Manager
```javascript
const storage = new StorageManager();
storage.saveHighScore(score);     // Save high score
storage.getHighScore();           // Get high score
storage.saveGame(gameState);      // Save game progress
storage.loadGame();               // Load saved game
```

### Touch Controls
```javascript
const touchControls = new TouchControls(canvas);
touchControls.getInput();         // Get current input state
touchControls.render(ctx);        // Render touch buttons
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run linter (`npm run lint:fix`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines
- Follow ESLint rules defined in `.eslintrc.json`
- Add JSDoc comments for new functions/classes
- Test on multiple browsers before submitting
- Keep commits atomic and well-described
- Update README if adding new features

## 📝 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Marito Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🙏 Acknowledgments

- Inspired by the classic Super Mario Bros. by Nintendo
- Built as an educational project to demonstrate game development with HTML5 Canvas
- Thanks to all contributors and players!

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/pure0fheart1/Marito/issues)
- **Discussions**: [GitHub Discussions](https://github.com/pure0fheart1/Marito/discussions)

## 🎮 Have Fun Playing!

Enjoy this fully-functional Mario-like platformer! Jump, collect power-ups, defeat enemies, and save the day! 🍄✨

---

Made with ❤️ using HTML5 Canvas and Vanilla JavaScript
