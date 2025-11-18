/**
 * Marito Game Configuration
 * Centralized configuration for all game constants and settings
 */

const CONFIG = {
    // Canvas Settings
    CANVAS: {
        WIDTH: 1024,
        HEIGHT: 576,
        BACKGROUND_COLOR: '#5C94FC'
    },

    // Physics Constants
    PHYSICS: {
        GRAVITY: 0.8,
        MAX_FALL_SPEED: 15,
        FRICTION: 0.85,
        GROUND_FRICTION: 0.8,
        AIR_FRICTION: 0.95,
        COYOTE_TIME: 100, // milliseconds
        JUMP_BUFFER: 150  // milliseconds
    },

    // Player Settings
    PLAYER: {
        // Movement
        WALK_SPEED: 3,
        RUN_SPEED: 5,
        JUMP_STRENGTH: -15,
        SMALL_JUMP_STRENGTH: -12,
        ACCELERATION: 0.5,
        MAX_SPEED: 6,

        // Dimensions
        SMALL_WIDTH: 32,
        SMALL_HEIGHT: 32,
        BIG_WIDTH: 32,
        BIG_HEIGHT: 64,

        // Game Mechanics
        MAX_LIVES: 3,
        INVULNERABILITY_DURATION: 2000, // milliseconds
        TRANSFORMATION_DURATION: 1000,  // milliseconds
        STAR_DURATION: 10000,           // milliseconds

        // States
        STATES: {
            SMALL: 0,
            BIG: 1,
            FIRE: 2
        },

        // Fireball
        MAX_FIREBALLS: 2,
        FIREBALL_SPEED: 8,
        FIREBALL_GRAVITY: 0.4
    },

    // Enemy Settings
    ENEMIES: {
        GOOMBA: {
            WIDTH: 32,
            HEIGHT: 32,
            SPEED: 1,
            HP: 1,
            POINTS: 100,
            PATROL_DISTANCE: 200,
            VIEW_DISTANCE: 300
        },
        KOOPA: {
            WIDTH: 32,
            HEIGHT: 48,
            SPEED: 1.5,
            HP: 2,
            POINTS: 200,
            SHELL_SPEED: 8,
            PATROL_DISTANCE: 250,
            VIEW_DISTANCE: 350,
            REVIVE_TIME: 5000 // milliseconds
        },
        PIRANHA: {
            WIDTH: 32,
            HEIGHT: 48,
            SPEED: 2,
            HP: 1,
            POINTS: 200,
            EMERGE_INTERVAL: 3000, // milliseconds
            SAFE_DISTANCE: 64
        },
        BUZZY: {
            WIDTH: 32,
            HEIGHT: 32,
            SPEED: 2,
            HP: 3,
            POINTS: 300,
            FLY_HEIGHT: 100,
            SWOOP_SPEED: 4,
            VIEW_DISTANCE: 400
        }
    },

    // Power-up Settings
    POWERUPS: {
        MUSHROOM: {
            WIDTH: 32,
            HEIGHT: 32,
            SPEED: 2,
            POINTS: 1000,
            EMERGE_SPEED: -2
        },
        FIRE_FLOWER: {
            WIDTH: 32,
            HEIGHT: 32,
            POINTS: 1000,
            EMERGE_SPEED: -1
        },
        COIN: {
            WIDTH: 24,
            HEIGHT: 24,
            POINTS: 100,
            EXTRA_LIFE_COUNT: 100
        },
        STAR: {
            WIDTH: 32,
            HEIGHT: 32,
            SPEED: 3,
            POINTS: 1000,
            BOUNCE_STRENGTH: -8
        },
        ONE_UP: {
            WIDTH: 32,
            HEIGHT: 32,
            SPEED: 2,
            EMERGE_SPEED: -2
        }
    },

    // Level Settings
    LEVEL: {
        TILE_SIZE: 32,
        TIME_LIMIT: 400, // seconds
        TIME_WARNING: 100, // seconds (when to show warning)

        THEMES: {
            OVERWORLD: {
                background: '#5C94FC',
                groundColor: '#8B4513',
                blockColor: '#DAA520'
            },
            UNDERGROUND: {
                background: '#000000',
                groundColor: '#654321',
                blockColor: '#B8860B'
            },
            CASTLE: {
                background: '#2C2C2C',
                groundColor: '#696969',
                blockColor: '#A9A9A9'
            }
        }
    },

    // Camera Settings
    CAMERA: {
        DEAD_ZONE_X: 200,
        DEAD_ZONE_Y: 150,
        SMOOTH_SPEED: 0.1,
        LOOK_AHEAD: 100
    },

    // Particle Settings
    PARTICLES: {
        LIFETIME: 1000,      // milliseconds
        COUNT: 8,            // particles per explosion
        SPEED: 3,
        GRAVITY: 0.3,
        FRICTION: 0.98
    },

    // Audio Settings
    AUDIO: {
        MASTER_VOLUME: 1.0,
        MUSIC_VOLUME: 0.3,
        SFX_VOLUME: 0.5,

        FREQUENCIES: {
            JUMP: 523.25,        // C5
            COIN: 1046.50,       // C6
            POWERUP: 659.25,     // E5
            HIT: 207.65,         // G#3
            BREAK_BLOCK: 466.16, // A#4
            FIREBALL: 392.00,    // G4
            ONE_UP: 783.99,      // G5
            GAME_OVER: 130.81,   // C3
            LEVEL_COMPLETE: 880.00, // A5
            STAR: 1318.51        // E6
        }
    },

    // UI Settings
    UI: {
        HUD_HEIGHT: 50,
        FONT_FAMILY: 'Arial, sans-serif',
        FONT_SIZE: 20,
        FONT_COLOR: '#FFFFFF',

        COLORS: {
            PRIMARY: '#FFFFFF',
            SECONDARY: '#FFD700',
            WARNING: '#FF0000',
            SUCCESS: '#00FF00'
        }
    },

    // Game State
    GAME: {
        FPS: 60,
        FRAME_TIME: 1000 / 60,

        STATES: {
            MENU: 'menu',
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'gameover',
            LEVEL_COMPLETE: 'levelcomplete'
        },

        TOTAL_LEVELS: 20,
        STARTING_LEVEL: 1
    },

    // Storage Keys
    STORAGE: {
        HIGH_SCORE: 'marito_high_score',
        COMPLETED_LEVELS: 'marito_completed_levels',
        SETTINGS: 'marito_settings',
        SAVE_GAME: 'marito_save_game'
    },

    // Input Keys
    INPUT: {
        LEFT: ['ArrowLeft', 'KeyA'],
        RIGHT: ['ArrowRight', 'KeyD'],
        JUMP: ['Space', 'KeyW', 'ArrowUp'],
        RUN: ['ShiftLeft', 'ShiftRight', 'KeyX'],
        FIRE: ['KeyZ', 'ControlLeft', 'ControlRight'],
        PAUSE: ['Escape', 'KeyP'],
        MUTE: ['KeyM']
    },

    // Debug Settings
    DEBUG: {
        ENABLED: false,
        SHOW_COLLISION_BOXES: false,
        SHOW_FPS: false,
        SHOW_COORDINATES: false,
        GOD_MODE: false
    }
};

// Freeze the configuration to prevent accidental modifications
if (typeof Object.freeze === 'function') {
    Object.freeze(CONFIG.CANVAS);
    Object.freeze(CONFIG.PHYSICS);
    Object.freeze(CONFIG.PLAYER);
    Object.freeze(CONFIG.PLAYER.STATES);
    Object.freeze(CONFIG.ENEMIES);
    Object.freeze(CONFIG.POWERUPS);
    Object.freeze(CONFIG.LEVEL);
    Object.freeze(CONFIG.LEVEL.THEMES);
    Object.freeze(CONFIG.CAMERA);
    Object.freeze(CONFIG.PARTICLES);
    Object.freeze(CONFIG.AUDIO);
    Object.freeze(CONFIG.AUDIO.FREQUENCIES);
    Object.freeze(CONFIG.UI);
    Object.freeze(CONFIG.UI.COLORS);
    Object.freeze(CONFIG.GAME);
    Object.freeze(CONFIG.GAME.STATES);
    Object.freeze(CONFIG.STORAGE);
    Object.freeze(CONFIG.INPUT);
    Object.freeze(CONFIG.DEBUG);
    Object.freeze(CONFIG);
}
