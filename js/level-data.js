/**
 * Level Configuration Data
 * Defines all levels with increasing difficulty, themes, and layouts
 */

const LEVEL_DATA = {
    // World 1: Grassland (Easy - Tutorial)
    1: {
        name: 'Green Hills Zone',
        theme: 'OVERWORLD',
        width: 6400,
        height: 576,
        timeLimit: 400,
        difficulty: 1,
        background: '#5C94FC',
        music: 'overworld',

        // Platform layout
        platforms: [
            // Ground
            { x: 0, y: 512, width: 6400, height: 64, type: 'ground' },

            // Starting area - tutorial
            { x: 400, y: 448, width: 128, height: 32, type: 'brick' },
            { x: 600, y: 384, width: 96, height: 32, type: 'brick' },

            // Question blocks with power-ups
            { x: 800, y: 320, width: 32, height: 32, type: 'question', item: 'mushroom' },
            { x: 1200, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },

            // Stairs
            { x: 1600, y: 480, width: 32, height: 32, type: 'brick' },
            { x: 1632, y: 448, width: 32, height: 64, type: 'brick' },
            { x: 1664, y: 416, width: 32, height: 96, type: 'brick' },

            // Pipe
            { x: 2000, y: 448, width: 64, height: 64, type: 'pipe' },

            // Floating platforms
            { x: 2400, y: 352, width: 128, height: 32, type: 'platform' },
            { x: 2600, y: 288, width: 96, height: 32, type: 'platform' },

            // More coins
            { x: 3000, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 3032, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 3064, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },

            // Pit with platforms
            { x: 3500, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 3700, y: 352, width: 96, height: 32, type: 'platform' },

            // Castle entrance
            { x: 5800, y: 448, width: 256, height: 64, type: 'castle' },

            // Flag
            { x: 6200, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        // Enemy placements
        enemies: [
            { type: 'goomba', x: 1000, y: 480 },
            { type: 'goomba', x: 1400, y: 480 },
            { type: 'koopa', x: 2200, y: 480 },
            { type: 'goomba', x: 2800, y: 480 },
            { type: 'goomba', x: 3200, y: 480 },
            { type: 'piranha', x: 2000, y: 448, pipeHeight: 64 }
        ],

        // Power-up locations
        powerups: [
            { type: 'mushroom', x: 800, y: 320 },
            { type: 'coin', x: 1200, y: 320 },
            { type: 'coin', x: 3000, y: 320 },
            { type: 'coin', x: 3032, y: 320 },
            { type: 'coin', x: 3064, y: 320 }
        ]
    },

    // World 1-2: Underground (Medium)
    2: {
        name: 'Underground Cavern',
        theme: 'UNDERGROUND',
        width: 5120,
        height: 576,
        timeLimit: 350,
        difficulty: 2,
        background: '#000000',
        music: 'underground',

        platforms: [
            { x: 0, y: 512, width: 5120, height: 64, type: 'ground' },

            // Ceiling
            { x: 0, y: 0, width: 5120, height: 32, type: 'ceiling' },

            // Tight corridors
            { x: 400, y: 352, width: 192, height: 32, type: 'brick' },
            { x: 800, y: 288, width: 128, height: 32, type: 'brick' },

            // Coin blocks
            { x: 1000, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 1032, y: 288, width: 32, height: 32, type: 'question', item: 'fireflower' },
            { x: 1064, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },

            // Multiple pipes
            { x: 1400, y: 448, width: 64, height: 64, type: 'pipe' },
            { x: 1600, y: 384, width: 64, height: 128, type: 'pipe' },
            { x: 1800, y: 448, width: 64, height: 64, type: 'pipe' },

            // Narrow platforms over pit
            { x: 2200, y: 384, width: 64, height: 32, type: 'platform' },
            { x: 2350, y: 320, width: 64, height: 32, type: 'platform' },
            { x: 2500, y: 384, width: 64, height: 32, type: 'platform' },

            // Brick maze
            { x: 3000, y: 256, width: 192, height: 32, type: 'brick' },
            { x: 3000, y: 416, width: 192, height: 32, type: 'brick' },

            // Exit pipe
            { x: 4800, y: 384, width: 96, height: 128, type: 'pipe', exit: true }
        ],

        enemies: [
            { type: 'goomba', x: 600, y: 480 },
            { type: 'goomba', x: 800, y: 480 },
            { type: 'buzzy', x: 1200, y: 200 },
            { type: 'piranha', x: 1400, y: 448 },
            { type: 'piranha', x: 1600, y: 384 },
            { type: 'koopa', x: 2000, y: 480 },
            { type: 'buzzy', x: 2800, y: 200 },
            { type: 'goomba', x: 3400, y: 480 },
            { type: 'goomba', x: 3600, y: 480 }
        ],

        powerups: [
            { type: 'coin', x: 1000, y: 320 },
            { type: 'fireflower', x: 1032, y: 288 },
            { type: 'coin', x: 1064, y: 320 },
            { type: 'star', x: 2400, y: 320 }
        ]
    },

    // World 1-3: Sky (Medium-Hard)
    3: {
        name: 'Cloud Garden',
        theme: 'SKY',
        width: 7200,
        height: 576,
        timeLimit: 350,
        difficulty: 3,
        background: '#87CEEB',
        music: 'athletic',

        platforms: [
            // Ground (limited)
            { x: 0, y: 512, width: 400, height: 64, type: 'ground' },

            // Clouds platforms
            { x: 500, y: 416, width: 128, height: 32, type: 'cloud' },
            { x: 700, y: 352, width: 96, height: 32, type: 'cloud' },
            { x: 900, y: 288, width: 128, height: 32, type: 'cloud' },
            { x: 1100, y: 352, width: 96, height: 32, type: 'cloud' },
            { x: 1300, y: 416, width: 128, height: 32, type: 'cloud' },

            // Moving platforms section
            { x: 1600, y: 384, width: 96, height: 16, type: 'platform', moving: true },
            { x: 1900, y: 320, width: 96, height: 16, type: 'platform', moving: true },
            { x: 2200, y: 384, width: 96, height: 16, type: 'platform', moving: true },

            // Coin bonus area
            { x: 2600, y: 256, width: 192, height: 32, type: 'cloud' },
            { x: 2700, y: 224, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 2732, y: 224, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 2764, y: 224, width: 32, height: 32, type: 'question', item: '1up' },

            // High platforms
            { x: 3200, y: 192, width: 128, height: 32, type: 'cloud' },
            { x: 3400, y: 256, width: 96, height: 32, type: 'cloud' },

            // Descending clouds
            { x: 3800, y: 320, width: 96, height: 32, type: 'cloud' },
            { x: 4000, y: 384, width: 128, height: 32, type: 'cloud' },
            { x: 4200, y: 448, width: 96, height: 32, type: 'cloud' },

            // Final ground section
            { x: 4500, y: 512, width: 2700, height: 64, type: 'ground' },

            // End platform
            { x: 7000, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'koopa', x: 700, y: 320 },
            { type: 'buzzy', x: 1100, y: 100 },
            { type: 'buzzy', x: 1500, y: 150 },
            { type: 'koopa', x: 2000, y: 288 },
            { type: 'buzzy', x: 2800, y: 100 },
            { type: 'buzzy', x: 3300, y: 50 },
            { type: 'goomba', x: 4600, y: 480 },
            { type: 'goomba', x: 4800, y: 480 },
            { type: 'koopa', x: 5200, y: 480 },
            { type: 'buzzy', x: 5600, y: 200 }
        ],

        powerups: [
            { type: 'coin', x: 2700, y: 224 },
            { type: 'coin', x: 2732, y: 224 },
            { type: '1up', x: 2764, y: 224 },
            { type: 'fireflower', x: 3200, y: 160 }
        ]
    },

    // World 1-4: Castle Boss (Hard)
    4: {
        name: 'Castle Showdown',
        theme: 'CASTLE',
        width: 4800,
        height: 576,
        timeLimit: 300,
        difficulty: 4,
        background: '#2C2C2C',
        music: 'castle',
        boss: true,

        platforms: [
            { x: 0, y: 512, width: 4800, height: 64, type: 'ground' },

            // Lava pits (danger zones)
            { x: 800, y: 512, width: 192, height: 64, type: 'lava' },
            { x: 1400, y: 512, width: 256, height: 64, type: 'lava' },
            { x: 2200, y: 512, width: 192, height: 64, type: 'lava' },

            // Narrow platforms
            { x: 900, y: 416, width: 64, height: 32, type: 'brick' },
            { x: 1500, y: 384, width: 96, height: 32, type: 'brick' },
            { x: 2300, y: 416, width: 64, height: 32, type: 'brick' },

            // Fire bars (rotating obstacles)
            { x: 1200, y: 352, width: 32, height: 32, type: 'firebar' },
            { x: 1800, y: 288, width: 32, height: 32, type: 'firebar' },

            // Boss arena
            { x: 3200, y: 512, width: 1600, height: 64, type: 'ground' },
            { x: 3200, y: 352, width: 128, height: 32, type: 'brick' },
            { x: 4672, y: 352, width: 128, height: 32, type: 'brick' },

            // Axe to defeat boss
            { x: 4700, y: 256, width: 32, height: 32, type: 'axe' }
        ],

        enemies: [
            { type: 'buzzy', x: 400, y: 200 },
            { type: 'buzzy', x: 600, y: 150 },
            { type: 'koopa', x: 1000, y: 384 },
            { type: 'buzzy', x: 1600, y: 200 },
            { type: 'koopa', x: 2400, y: 384 },
            { type: 'buzzy', x: 2800, y: 150 },
            // Boss appears at x: 3800
            { type: 'bowser', x: 3800, y: 480, boss: true, hp: 10 }
        ],

        powerups: [
            { type: 'fireflower', x: 1000, y: 352 },
            { type: 'star', x: 2400, y: 352 }
        ]
    },

    // World 2-1: Desert (Medium-Hard)
    5: {
        name: 'Sandy Dunes',
        theme: 'DESERT',
        width: 8000,
        height: 576,
        timeLimit: 380,
        difficulty: 5,
        background: '#FFD89A',
        music: 'desert',

        platforms: [
            { x: 0, y: 512, width: 8000, height: 64, type: 'sand' },

            // Sand dunes (slopes)
            { x: 400, y: 480, width: 128, height: 32, type: 'sand' },
            { x: 528, y: 448, width: 96, height: 64, type: 'sand' },
            { x: 624, y: 480, width: 128, height: 32, type: 'sand' },

            // Pyramid structures
            { x: 1200, y: 480, width: 64, height: 32, type: 'brick' },
            { x: 1232, y: 448, width: 96, height: 64, type: 'brick' },
            { x: 1296, y: 416, width: 64, height: 96, type: 'brick' },

            // Quicksand sections (slow movement)
            { x: 1800, y: 512, width: 256, height: 64, type: 'quicksand' },
            { x: 2600, y: 512, width: 192, height: 64, type: 'quicksand' },

            // Oasis platforms
            { x: 3200, y: 416, width: 192, height: 32, type: 'platform' },
            { x: 3200, y: 320, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // More pyramids
            { x: 4000, y: 480, width: 64, height: 32, type: 'brick' },
            { x: 4032, y: 448, width: 128, height: 64, type: 'brick' },
            { x: 4096, y: 416, width: 96, height: 96, type: 'brick' },
            { x: 4128, y: 384, width: 64, height: 128, type: 'brick' },

            // Floating platforms
            { x: 5000, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 5200, y: 288, width: 128, height: 32, type: 'platform' },
            { x: 5400, y: 352, width: 96, height: 32, type: 'platform' },

            // Coin paradise
            { x: 6000, y: 256, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 6032, y: 256, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 6064, y: 256, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 6096, y: 256, width: 32, height: 32, type: 'question', item: 'star' },

            // Final stretch
            { x: 7800, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'goomba', x: 800, y: 480 },
            { type: 'goomba', x: 1000, y: 480 },
            { type: 'koopa', x: 1500, y: 480 },
            { type: 'buzzy', x: 2000, y: 200 },
            { type: 'koopa', x: 2400, y: 480 },
            { type: 'buzzy', x: 3000, y: 150 },
            { type: 'goomba', x: 3600, y: 480 },
            { type: 'goomba', x: 3800, y: 480 },
            { type: 'koopa', x: 4500, y: 480 },
            { type: 'buzzy', x: 5100, y: 200 },
            { type: 'buzzy', x: 5300, y: 150 },
            { type: 'koopa', x: 6400, y: 480 },
            { type: 'goomba', x: 6800, y: 480 },
            { type: 'buzzy', x: 7200, y: 200 }
        ],

        powerups: [
            { type: 'mushroom', x: 3200, y: 320 },
            { type: 'fireflower', x: 5200, y: 256 },
            { type: 'coin', x: 6000, y: 256 },
            { type: 'coin', x: 6032, y: 256 },
            { type: 'coin', x: 6064, y: 256 },
            { type: 'star', x: 6096, y: 256 }
        ]
    },

    // World 2-2: Ice World (Hard)
    6: {
        name: 'Frozen Tundra',
        theme: 'ICE',
        width: 7400,
        height: 576,
        timeLimit: 320,
        difficulty: 6,
        background: '#B0E0E6',
        music: 'ice',
        icePhysics: true,

        platforms: [
            { x: 0, y: 512, width: 7400, height: 64, type: 'ice' },

            // Slippery platforms
            { x: 400, y: 416, width: 192, height: 32, type: 'ice' },
            { x: 700, y: 352, width: 128, height: 32, type: 'ice' },

            // Ice blocks
            { x: 1000, y: 480, width: 32, height: 32, type: 'iceblock' },
            { x: 1032, y: 448, width: 32, height: 64, type: 'iceblock' },
            { x: 1064, y: 416, width: 32, height: 96, type: 'iceblock' },

            // Frozen water (slippery ground)
            { x: 1400, y: 512, width: 400, height: 64, type: 'ice' },

            // Narrow ice platforms
            { x: 1900, y: 384, width: 64, height: 32, type: 'ice' },
            { x: 2100, y: 320, width: 64, height: 32, type: 'ice' },
            { x: 2300, y: 384, width: 64, height: 32, type: 'ice' },

            // Ice cave
            { x: 2800, y: 256, width: 400, height: 32, type: 'ice' },
            { x: 2800, y: 448, width: 400, height: 32, type: 'ice' },

            // Coin run
            { x: 3400, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 3464, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 3528, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 3592, y: 320, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // More slippery sections
            { x: 4000, y: 416, width: 256, height: 32, type: 'ice' },
            { x: 4400, y: 352, width: 192, height: 32, type: 'ice' },
            { x: 4700, y: 416, width: 256, height: 32, type: 'ice' },

            // Icicle obstacles (falling)
            { x: 5200, y: 128, width: 32, height: 32, type: 'icicle' },
            { x: 5300, y: 96, width: 32, height: 32, type: 'icicle' },
            { x: 5400, y: 128, width: 32, height: 32, type: 'icicle' },

            // Final ice bridge
            { x: 6000, y: 384, width: 800, height: 32, type: 'ice' },

            { x: 7200, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'goomba', x: 600, y: 480 },
            { type: 'koopa', x: 1000, y: 480 },
            { type: 'buzzy', x: 1500, y: 200 },
            { type: 'koopa', x: 2000, y: 352 },
            { type: 'buzzy', x: 2500, y: 150 },
            { type: 'goomba', x: 3000, y: 416 },
            { type: 'goomba', x: 3200, y: 416 },
            { type: 'koopa', x: 4100, y: 384 },
            { type: 'buzzy', x: 4500, y: 200 },
            { type: 'koopa', x: 5000, y: 480 },
            { type: 'buzzy', x: 5800, y: 150 },
            { type: 'goomba', x: 6400, y: 352 },
            { type: 'goomba', x: 6600, y: 352 }
        ],

        powerups: [
            { type: 'mushroom', x: 700, y: 320 },
            { type: 'coin', x: 3400, y: 320 },
            { type: 'coin', x: 3464, y: 320 },
            { type: 'coin', x: 3528, y: 320 },
            { type: 'fireflower', x: 3592, y: 320 },
            { type: '1up', x: 5000, y: 320 }
        ]
    },

    // World 2-3: Volcano (Very Hard)
    7: {
        name: 'Volcanic Fury',
        theme: 'VOLCANO',
        width: 6800,
        height: 576,
        timeLimit: 280,
        difficulty: 7,
        background: '#8B0000',
        music: 'volcano',
        hazards: ['lava', 'fireballs'],

        platforms: [
            { x: 0, y: 512, width: 6800, height: 64, type: 'lava_rock' },

            // Rising lava sections
            { x: 400, y: 416, width: 128, height: 32, type: 'platform' },
            { x: 600, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 800, y: 288, width: 128, height: 32, type: 'platform' },

            // Lava pools
            { x: 1000, y: 512, width: 256, height: 64, type: 'lava' },
            { x: 1800, y: 512, width: 192, height: 64, type: 'lava' },

            // Narrow bridges
            { x: 1300, y: 416, width: 96, height: 16, type: 'bridge' },
            { x: 2050, y: 384, width: 64, height: 16, type: 'bridge' },

            // Falling platforms
            { x: 2400, y: 352, width: 96, height: 32, type: 'falling_platform' },
            { x: 2600, y: 352, width: 96, height: 32, type: 'falling_platform' },

            // Fireball launchers
            { x: 3000, y: 480, width: 32, height: 32, type: 'fireball_launcher' },
            { x: 3400, y: 384, width: 32, height: 32, type: 'fireball_launcher' },

            // Safe zone with power-ups
            { x: 3800, y: 416, width: 256, height: 32, type: 'platform' },
            { x: 3900, y: 352, width: 32, height: 32, type: 'question', item: 'star' },

            // More lava
            { x: 4200, y: 512, width: 320, height: 64, type: 'lava' },

            // Crumbling platforms
            { x: 4300, y: 384, width: 64, height: 32, type: 'crumbling' },
            { x: 4450, y: 320, width: 64, height: 32, type: 'crumbling' },

            // Final gauntlet
            { x: 5000, y: 416, width: 1200, height: 32, type: 'lava_rock' },
            { x: 5200, y: 352, width: 32, height: 32, type: 'firebar' },
            { x: 5600, y: 352, width: 32, height: 32, type: 'firebar' },

            { x: 6600, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'buzzy', x: 700, y: 100 },
            { type: 'koopa', x: 1350, y: 384 },
            { type: 'buzzy', x: 1600, y: 150 },
            { type: 'buzzy', x: 2100, y: 200 },
            { type: 'koopa', x: 2500, y: 320 },
            { type: 'buzzy', x: 3200, y: 100 },
            { type: 'goomba', x: 3900, y: 384 },
            { type: 'buzzy', x: 4400, y: 200 },
            { type: 'koopa', x: 5300, y: 384 },
            { type: 'buzzy', x: 5700, y: 150 },
            { type: 'buzzy', x: 6000, y: 100 }
        ],

        powerups: [
            { type: 'fireflower', x: 800, y: 256 },
            { type: 'star', x: 3900, y: 352 },
            { type: '1up', x: 5500, y: 320 }
        ]
    },

    // World 2-4: Sky Castle Boss (Very Hard)
    8: {
        name: 'Sky Fortress',
        theme: 'SKY_CASTLE',
        width: 5600,
        height: 576,
        timeLimit: 260,
        difficulty: 8,
        background: '#4682B4',
        music: 'boss',
        boss: true,

        platforms: [
            // Limited ground
            { x: 0, y: 512, width: 400, height: 64, type: 'ground' },

            // Cloud platforms leading up
            { x: 500, y: 448, width: 128, height: 32, type: 'cloud' },
            { x: 700, y: 384, width: 96, height: 32, type: 'cloud' },
            { x: 900, y: 320, width: 128, height: 32, type: 'cloud' },

            // Castle entrance
            { x: 1200, y: 256, width: 3200, height: 256, type: 'castle_platform' },

            // Moving platforms inside
            { x: 1600, y: 384, width: 96, height: 16, type: 'moving_platform' },
            { x: 2000, y: 384, width: 96, height: 16, type: 'moving_platform' },

            // Thwomp obstacles
            { x: 2400, y: 128, width: 64, height: 64, type: 'thwomp' },
            { x: 2800, y: 96, width: 64, height: 64, type: 'thwomp' },

            // Boss arena
            { x: 3600, y: 416, width: 1600, height: 96, type: 'arena' },
            { x: 3800, y: 320, width: 96, height: 32, type: 'brick' },
            { x: 5000, y: 320, width: 96, height: 32, type: 'brick' },

            // Boss platform
            { x: 4400, y: 256, width: 128, height: 32, type: 'boss_platform' }
        ],

        enemies: [
            { type: 'buzzy', x: 600, y: 200 },
            { type: 'koopa', x: 1000, y: 288 },
            { type: 'buzzy', x: 1700, y: 150 },
            { type: 'buzzy', x: 2100, y: 200 },
            { type: 'koopa', x: 2600, y: 384 },
            { type: 'buzzy', x: 3000, y: 100 },
            // Mini-boss and final boss
            { type: 'koopa', x: 3800, y: 384, miniboss: true, hp: 5 },
            { type: 'bowser', x: 4400, y: 384, boss: true, hp: 15, flies: true }
        ],

        powerups: [
            { type: 'mushroom', x: 900, y: 288 },
            { type: 'fireflower', x: 1600, y: 352 },
            { type: 'star', x: 3800, y: 288 }
        ]
    },

    // World 3-1: Jungle (Extreme)
    9: {
        name: 'Jungle Ruins',
        theme: 'JUNGLE',
        width: 9600,
        height: 576,
        timeLimit: 350,
        difficulty: 9,
        background: '#228B22',
        music: 'jungle',
        hazards: ['vines', 'spikes'],

        platforms: [
            { x: 0, y: 512, width: 9600, height: 64, type: 'jungle_ground' },

            // Vine platforms
            { x: 400, y: 384, width: 96, height: 32, type: 'vine_platform' },
            { x: 600, y: 320, width: 128, height: 32, type: 'vine_platform' },

            // Ancient ruins
            { x: 1000, y: 448, width: 256, height: 64, type: 'ruins' },
            { x: 1100, y: 384, width: 32, height: 64, type: 'pillar' },
            { x: 1200, y: 320, width: 32, height: 128, type: 'pillar' },

            // Spike traps
            { x: 1600, y: 512, width: 128, height: 32, type: 'spikes' },
            { x: 2000, y: 512, width: 96, height: 32, type: 'spikes' },

            // Swinging vines (grab and swing)
            { x: 2400, y: 256, width: 16, height: 256, type: 'vine' },
            { x: 2700, y: 256, width: 16, height: 256, type: 'vine' },

            // Hidden passages
            { x: 3200, y: 384, width: 192, height: 32, type: 'hidden_platform' },

            // Waterfall area
            { x: 4000, y: 416, width: 256, height: 32, type: 'platform' },
            { x: 4000, y: 256, width: 32, height: 160, type: 'waterfall' },

            // Treetop platforms
            { x: 4800, y: 256, width: 128, height: 32, type: 'tree_platform' },
            { x: 5000, y: 192, width: 96, height: 32, type: 'tree_platform' },
            { x: 5200, y: 256, width: 128, height: 32, type: 'tree_platform' },

            // More ruins with puzzles
            { x: 6000, y: 448, width: 400, height: 64, type: 'ruins' },
            { x: 6100, y: 320, width: 32, height: 32, type: 'question', item: 'fireflower' },
            { x: 6200, y: 320, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 6300, y: 320, width: 32, height: 32, type: 'question', item: '1up' },

            // Collapsing bridge
            { x: 7000, y: 384, width: 320, height: 16, type: 'collapsing_bridge' },

            // Final vine climb
            { x: 7800, y: 256, width: 16, height: 256, type: 'vine' },
            { x: 8200, y: 192, width: 128, height: 32, type: 'tree_platform' },

            { x: 9400, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'goomba', x: 500, y: 480 },
            { type: 'piranha', x: 800, y: 480 },
            { type: 'koopa', x: 1100, y: 416 },
            { type: 'buzzy', x: 1500, y: 200 },
            { type: 'piranha', x: 2200, y: 480 },
            { type: 'koopa', x: 2800, y: 480 },
            { type: 'buzzy', x: 3300, y: 150 },
            { type: 'goomba', x: 3800, y: 480 },
            { type: 'piranha', x: 4400, y: 384 },
            { type: 'buzzy', x: 4900, y: 100 },
            { type: 'koopa', x: 5300, y: 224 },
            { type: 'buzzy', x: 5800, y: 200 },
            { type: 'goomba', x: 6200, y: 416 },
            { type: 'goomba', x: 6400, y: 416 },
            { type: 'koopa', x: 7200, y: 352 },
            { type: 'buzzy', x: 7600, y: 150 },
            { type: 'piranha', x: 8000, y: 480 },
            { type: 'buzzy', x: 8600, y: 100 }
        ],

        powerups: [
            { type: 'mushroom', x: 600, y: 288 },
            { type: 'star', x: 2400, y: 200 },
            { type: 'fireflower', x: 6100, y: 320 },
            { type: 'coin', x: 6200, y: 320 },
            { type: '1up', x: 6300, y: 320 }
        ]
    },

    // World 3-2: Underwater (Extreme)
    10: {
        name: 'Deep Sea Adventure',
        theme: 'UNDERWATER',
        width: 7200,
        height: 576,
        timeLimit: 300,
        difficulty: 10,
        background: '#000080',
        music: 'underwater',
        waterPhysics: true,

        platforms: [
            // Ocean floor
            { x: 0, y: 512, width: 7200, height: 64, type: 'coral' },

            // Coral reefs
            { x: 400, y: 448, width: 128, height: 64, type: 'coral_reef' },
            { x: 700, y: 384, width: 96, height: 128, type: 'coral_reef' },

            // Underwater caves
            { x: 1200, y: 256, width: 400, height: 32, type: 'cave_ceiling' },
            { x: 1200, y: 448, width: 400, height: 32, type: 'cave_floor' },

            // Bubbles (air pockets)
            { x: 1400, y: 320, width: 32, height: 32, type: 'air_bubble' },

            // Shipwreck
            { x: 2000, y: 384, width: 256, height: 128, type: 'shipwreck' },
            { x: 2100, y: 320, width: 32, height: 32, type: 'treasure', item: 'coin' },
            { x: 2132, y: 320, width: 32, height: 32, type: 'treasure', item: 'star' },

            // Strong currents (push player)
            { x: 2800, y: 256, width: 32, height: 256, type: 'current_right' },
            { x: 3200, y: 256, width: 32, height: 256, type: 'current_left' },

            // Whirlpool
            { x: 3800, y: 384, width: 128, height: 128, type: 'whirlpool' },

            // Kelp forest (obstacles)
            { x: 4400, y: 352, width: 16, height: 160, type: 'kelp' },
            { x: 4500, y: 288, width: 16, height: 224, type: 'kelp' },
            { x: 4600, y: 320, width: 16, height: 192, type: 'kelp' },

            // More coral
            { x: 5200, y: 416, width: 192, height: 96, type: 'coral_reef' },

            // Underwater pipes
            { x: 5800, y: 384, width: 64, height: 128, type: 'pipe' },

            // Exit to surface
            { x: 6800, y: 256, width: 96, height: 256, type: 'exit_pipe', exit: true },

            { x: 7000, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'cheep_cheep', x: 600, y: 300 },
            { type: 'cheep_cheep', x: 900, y: 250 },
            { type: 'blooper', x: 1300, y: 200 },
            { type: 'cheep_cheep', x: 1700, y: 350 },
            { type: 'blooper', x: 2200, y: 250 },
            { type: 'cheep_cheep', x: 2600, y: 300 },
            { type: 'blooper', x: 3000, y: 200 },
            { type: 'cheep_cheep', x: 3500, y: 350 },
            { type: 'blooper', x: 4000, y: 250 },
            { type: 'cheep_cheep', x: 4700, y: 300 },
            { type: 'blooper', x: 5300, y: 200 },
            { type: 'cheep_cheep', x: 5900, y: 350 },
            { type: 'blooper', x: 6400, y: 250 }
        ],

        powerups: [
            { type: 'mushroom', x: 1400, y: 320 },
            { type: 'coin', x: 2100, y: 320 },
            { type: 'star', x: 2132, y: 320 },
            { type: 'fireflower', x: 5200, y: 384 }
        ]
    }
};

// Difficulty scaling configuration
const DIFFICULTY_SCALING = {
    1: { enemySpeed: 1.0, enemyCount: 1.0, platformDifficulty: 1.0, timeMultiplier: 1.0 },
    2: { enemySpeed: 1.1, enemyCount: 1.2, platformDifficulty: 1.1, timeMultiplier: 0.95 },
    3: { enemySpeed: 1.2, enemyCount: 1.3, platformDifficulty: 1.2, timeMultiplier: 0.90 },
    4: { enemySpeed: 1.3, enemyCount: 1.4, platformDifficulty: 1.3, timeMultiplier: 0.85 },
    5: { enemySpeed: 1.4, enemyCount: 1.5, platformDifficulty: 1.4, timeMultiplier: 0.85 },
    6: { enemySpeed: 1.5, enemyCount: 1.6, platformDifficulty: 1.5, timeMultiplier: 0.80 },
    7: { enemySpeed: 1.6, enemyCount: 1.7, platformDifficulty: 1.6, timeMultiplier: 0.75 },
    8: { enemySpeed: 1.7, enemyCount: 1.8, platformDifficulty: 1.7, timeMultiplier: 0.70 },
    9: { enemySpeed: 1.8, enemyCount: 1.9, platformDifficulty: 1.8, timeMultiplier: 0.70 },
    10: { enemySpeed: 2.0, enemyCount: 2.0, platformDifficulty: 2.0, timeMultiplier: 0.65 }
};

// Level themes configuration
const LEVEL_THEMES = {
    OVERWORLD: {
        backgroundColor: '#5C94FC',
        groundColor: '#8B4513',
        platformColor: '#DAA520',
        skyColor: '#87CEEB'
    },
    UNDERGROUND: {
        backgroundColor: '#000000',
        groundColor: '#654321',
        platformColor: '#B8860B',
        skyColor: '#1a1a1a'
    },
    CASTLE: {
        backgroundColor: '#2C2C2C',
        groundColor: '#696969',
        platformColor: '#A9A9A9',
        skyColor: '#4a4a4a'
    },
    SKY: {
        backgroundColor: '#87CEEB',
        groundColor: '#FFFFFF',
        platformColor: '#E0E0E0',
        skyColor: '#b0d4f1'
    },
    DESERT: {
        backgroundColor: '#FFD89A',
        groundColor: '#DEB887',
        platformColor: '#D2691E',
        skyColor: '#ffebcd'
    },
    ICE: {
        backgroundColor: '#B0E0E6',
        groundColor: '#E0FFFF',
        platformColor: '#AFEEEE',
        skyColor: '#d4f1f9'
    },
    VOLCANO: {
        backgroundColor: '#8B0000',
        groundColor: '#A52A2A',
        platformColor: '#DC143C',
        skyColor: '#660000'
    },
    SKY_CASTLE: {
        backgroundColor: '#4682B4',
        groundColor: '#B0C4DE',
        platformColor: '#778899',
        skyColor: '#6a9bc3'
    },
    JUNGLE: {
        backgroundColor: '#228B22',
        groundColor: '#556B2F',
        platformColor: '#6B8E23',
        skyColor: '#3cb371'
    },
    UNDERWATER: {
        backgroundColor: '#000080',
        groundColor: '#4682B4',
        platformColor: '#5F9EA0',
        skyColor: '#191970'
    }
};

// Export level data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVEL_DATA, DIFFICULTY_SCALING, LEVEL_THEMES };
}
