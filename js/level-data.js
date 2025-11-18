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
    },

    // World 4-1: Haunted House (Very Hard)
    11: {
        name: 'Ghost Manor',
        theme: 'HAUNTED',
        width: 8800,
        height: 576,
        timeLimit: 320,
        difficulty: 11,
        background: '#1a0033',
        music: 'haunted',
        hazards: ['boos', 'disappearing_platforms'],

        platforms: [
            { x: 0, y: 512, width: 8800, height: 64, type: 'haunted_ground' },

            // Entrance hallway
            { x: 0, y: 0, width: 8800, height: 32, type: 'ceiling' },
            { x: 400, y: 416, width: 192, height: 32, type: 'ghost_platform' },
            { x: 700, y: 352, width: 128, height: 32, type: 'ghost_platform' },

            // Disappearing platforms
            { x: 1000, y: 384, width: 96, height: 32, type: 'disappearing', interval: 2 },
            { x: 1200, y: 320, width: 96, height: 32, type: 'disappearing', interval: 2 },
            { x: 1400, y: 384, width: 96, height: 32, type: 'disappearing', interval: 2 },

            // Ghost house rooms
            { x: 1800, y: 256, width: 400, height: 32, type: 'ceiling' },
            { x: 1800, y: 448, width: 400, height: 64, type: 'floor' },
            { x: 1900, y: 384, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Boo corridor (they chase when not looking)
            { x: 2400, y: 416, width: 600, height: 32, type: 'ghost_platform' },

            // Portraits room (decorative)
            { x: 3200, y: 352, width: 256, height: 32, type: 'ghost_platform' },
            { x: 3300, y: 288, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Library section
            { x: 3800, y: 480, width: 64, height: 32, type: 'bookshelf' },
            { x: 3900, y: 448, width: 64, height: 64, type: 'bookshelf' },
            { x: 4000, y: 416, width: 64, height: 96, type: 'bookshelf' },
            { x: 4100, y: 448, width: 64, height: 64, type: 'bookshelf' },
            { x: 4200, y: 480, width: 64, height: 32, type: 'bookshelf' },

            // Chandelier room
            { x: 4600, y: 256, width: 128, height: 32, type: 'chandelier', swinging: true },
            { x: 4900, y: 256, width: 128, height: 32, type: 'chandelier', swinging: true },

            // Secret passage
            { x: 5400, y: 384, width: 64, height: 32, type: 'hidden_platform' },
            { x: 5600, y: 320, width: 64, height: 32, type: 'hidden_platform' },
            { x: 5800, y: 384, width: 64, height: 32, type: 'hidden_platform' },

            // Attic section
            { x: 6200, y: 288, width: 256, height: 32, type: 'ghost_platform' },
            { x: 6300, y: 224, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 6332, y: 224, width: 32, height: 32, type: 'question', item: '1up' },

            // Final hallway
            { x: 6800, y: 416, width: 800, height: 32, type: 'ghost_platform' },
            { x: 7200, y: 352, width: 96, height: 32, type: 'disappearing', interval: 1.5 },

            // Exit
            { x: 8600, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'boo', x: 800, y: 384, chases: true },
            { type: 'boo', x: 1300, y: 320 },
            { type: 'buzzy', x: 1900, y: 150 },
            { type: 'boo', x: 2500, y: 384 },
            { type: 'boo', x: 2700, y: 384 },
            { type: 'buzzy', x: 3300, y: 100 },
            { type: 'boo', x: 3900, y: 350 },
            { type: 'koopa', x: 4700, y: 224 },
            { type: 'boo', x: 5500, y: 352 },
            { type: 'buzzy', x: 6000, y: 150 },
            { type: 'boo', x: 6400, y: 256 },
            { type: 'boo', x: 7000, y: 384 },
            { type: 'buzzy', x: 7500, y: 200 }
        ],

        powerups: [
            { type: 'mushroom', x: 1900, y: 384 },
            { type: 'fireflower', x: 3300, y: 288 },
            { type: 'star', x: 5000, y: 224 },
            { type: 'coin', x: 6300, y: 224 },
            { type: '1up', x: 6332, y: 224 }
        ]
    },

    // World 4-2: Spooky Cemetery (Very Hard)
    12: {
        name: 'Graveyard Shift',
        theme: 'HAUNTED',
        width: 7600,
        height: 576,
        timeLimit: 300,
        difficulty: 12,
        background: '#1a0033',
        music: 'haunted',
        hazards: ['ghosts', 'rising_platforms'],

        platforms: [
            { x: 0, y: 512, width: 7600, height: 64, type: 'haunted_ground' },

            // Cemetery entrance
            { x: 400, y: 448, width: 128, height: 64, type: 'tombstone' },
            { x: 600, y: 448, width: 96, height: 64, type: 'tombstone' },
            { x: 800, y: 448, width: 128, height: 64, type: 'tombstone' },

            // Rising graves
            { x: 1200, y: 416, width: 96, height: 32, type: 'rising_platform' },
            { x: 1400, y: 352, width: 96, height: 32, type: 'rising_platform' },
            { x: 1600, y: 288, width: 96, height: 32, type: 'rising_platform' },

            // Crypt entrance
            { x: 2000, y: 384, width: 192, height: 128, type: 'crypt' },
            { x: 2050, y: 320, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Underground catacombs
            { x: 2400, y: 256, width: 800, height: 32, type: 'ceiling' },
            { x: 2400, y: 448, width: 800, height: 64, type: 'floor' },
            { x: 2600, y: 384, width: 64, height: 32, type: 'platform' },
            { x: 2800, y: 352, width: 64, height: 32, type: 'platform' },
            { x: 3000, y: 384, width: 64, height: 32, type: 'platform' },

            // Coffin platforms
            { x: 3400, y: 416, width: 128, height: 32, type: 'coffin' },
            { x: 3600, y: 352, width: 96, height: 32, type: 'coffin' },
            { x: 3800, y: 416, width: 128, height: 32, type: 'coffin' },

            // Haunted tree area
            { x: 4200, y: 352, width: 192, height: 32, type: 'ghost_platform' },
            { x: 4500, y: 288, width: 128, height: 32, type: 'ghost_platform' },

            // Fog section (reduced visibility)
            { x: 5000, y: 384, width: 96, height: 32, type: 'fog_platform' },
            { x: 5200, y: 320, width: 96, height: 32, type: 'fog_platform' },
            { x: 5400, y: 384, width: 96, height: 32, type: 'fog_platform' },

            // Final tombstones
            { x: 5800, y: 416, width: 32, height: 32, type: 'question', item: 'star' },
            { x: 6000, y: 448, width: 128, height: 64, type: 'tombstone' },
            { x: 6200, y: 448, width: 96, height: 64, type: 'tombstone' },

            // Exit gate
            { x: 6800, y: 384, width: 192, height: 128, type: 'gate' },
            { x: 7400, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'boo', x: 700, y: 416 },
            { type: 'dry_bones', x: 1000, y: 480 },
            { type: 'boo', x: 1500, y: 352 },
            { type: 'dry_bones', x: 2100, y: 352 },
            { type: 'buzzy', x: 2700, y: 150 },
            { type: 'boo', x: 2900, y: 352 },
            { type: 'dry_bones', x: 3500, y: 384 },
            { type: 'boo', x: 3900, y: 384 },
            { type: 'buzzy', x: 4400, y: 100 },
            { type: 'dry_bones', x: 4700, y: 256 },
            { type: 'boo', x: 5300, y: 352 },
            { type: 'dry_bones', x: 6100, y: 416 },
            { type: 'boo', x: 6500, y: 352 }
        ],

        powerups: [
            { type: 'mushroom', x: 800, y: 416 },
            { type: 'fireflower', x: 2050, y: 320 },
            { type: 'coin', x: 3600, y: 320 },
            { type: '1up', x: 4500, y: 256 },
            { type: 'star', x: 5800, y: 416 }
        ]
    },

    // World 4-3: Phantom Palace (Extremely Hard)
    13: {
        name: 'Phantom Palace',
        theme: 'HAUNTED',
        width: 8400,
        height: 576,
        timeLimit: 280,
        difficulty: 13,
        background: '#1a0033',
        music: 'haunted',
        hazards: ['boos', 'disappearing_platforms', 'ghosts'],

        platforms: [
            { x: 0, y: 512, width: 8400, height: 64, type: 'haunted_ground' },
            { x: 0, y: 0, width: 8400, height: 32, type: 'ceiling' },

            // Grand entrance
            { x: 400, y: 416, width: 256, height: 32, type: 'ghost_platform' },
            { x: 500, y: 352, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Ballroom with chandeliers
            { x: 900, y: 288, width: 128, height: 32, type: 'chandelier', swinging: true },
            { x: 1100, y: 224, width: 128, height: 32, type: 'chandelier', swinging: true },
            { x: 1300, y: 288, width: 128, height: 32, type: 'chandelier', swinging: true },

            // Spiral staircase
            { x: 1700, y: 480, width: 96, height: 32, type: 'stairs' },
            { x: 1796, y: 448, width: 96, height: 64, type: 'stairs' },
            { x: 1892, y: 416, width: 96, height: 96, type: 'stairs' },
            { x: 1988, y: 384, width: 96, height: 128, type: 'stairs' },
            { x: 2084, y: 352, width: 96, height: 160, type: 'stairs' },

            // Upper corridors
            { x: 2300, y: 320, width: 400, height: 32, type: 'ghost_platform' },
            { x: 2400, y: 256, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Disappearing maze
            { x: 2900, y: 384, width: 96, height: 32, type: 'disappearing', interval: 1.5 },
            { x: 3100, y: 320, width: 96, height: 32, type: 'disappearing', interval: 1.5 },
            { x: 3300, y: 256, width: 96, height: 32, type: 'disappearing', interval: 1.5 },
            { x: 3500, y: 320, width: 96, height: 32, type: 'disappearing', interval: 1.5 },
            { x: 3700, y: 384, width: 96, height: 32, type: 'disappearing', interval: 1.5 },

            // Portrait gallery
            { x: 4000, y: 416, width: 600, height: 32, type: 'ghost_platform' },
            { x: 4200, y: 352, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 4300, y: 352, width: 32, height: 32, type: 'question', item: '1up' },

            // Throne room
            { x: 4800, y: 320, width: 400, height: 32, type: 'ghost_platform' },
            { x: 5000, y: 256, width: 128, height: 32, type: 'throne' },

            // Tower climb
            { x: 5400, y: 416, width: 96, height: 32, type: 'platform' },
            { x: 5600, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 5800, y: 288, width: 96, height: 32, type: 'platform' },
            { x: 6000, y: 224, width: 96, height: 32, type: 'platform' },

            // Final challenge
            { x: 6400, y: 384, width: 800, height: 32, type: 'ghost_platform' },
            { x: 6800, y: 320, width: 96, height: 32, type: 'disappearing', interval: 1 },
            { x: 7000, y: 320, width: 96, height: 32, type: 'disappearing', interval: 1 },

            { x: 8200, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'boo', x: 600, y: 384 },
            { type: 'boo', x: 1000, y: 256 },
            { type: 'buzzy', x: 1200, y: 100 },
            { type: 'boo', x: 1800, y: 448 },
            { type: 'dry_bones', x: 2500, y: 288 },
            { type: 'boo', x: 3000, y: 352 },
            { type: 'boo', x: 3400, y: 224 },
            { type: 'buzzy', x: 3800, y: 150 },
            { type: 'boo', x: 4300, y: 384 },
            { type: 'dry_bones', x: 5100, y: 224 },
            { type: 'boo', x: 5500, y: 384 },
            { type: 'boo', x: 5900, y: 256 },
            { type: 'buzzy', x: 6600, y: 150 },
            { type: 'boo', x: 7200, y: 288 },
            { type: 'dry_bones', x: 7600, y: 480 }
        ],

        powerups: [
            { type: 'mushroom', x: 500, y: 352 },
            { type: 'fireflower', x: 2400, y: 256 },
            { type: 'star', x: 3500, y: 288 },
            { type: 'coin', x: 4200, y: 352 },
            { type: '1up', x: 4300, y: 352 }
        ]
    },

    // World 5-1: Asteroid Field (Extremely Hard) - Space World Start
    14: {
        name: 'Asteroid Field',
        theme: 'SPACE',
        width: 9200,
        height: 576,
        timeLimit: 340,
        difficulty: 14,
        background: '#000011',
        music: 'space',
        lowGravity: true,
        hazards: ['meteors', 'black_holes'],
        boss: true,

        platforms: [
            // Space station floor
            { x: 0, y: 512, width: 800, height: 64, type: 'metal' },

            // Asteroid platforms (floating)
            { x: 900, y: 416, width: 128, height: 32, type: 'asteroid' },
            { x: 1150, y: 352, width: 96, height: 32, type: 'asteroid' },
            { x: 1400, y: 288, width: 128, height: 32, type: 'asteroid' },

            // Space station modules
            { x: 1700, y: 384, width: 192, height: 128, type: 'space_module' },
            { x: 1800, y: 320, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Floating platforms with low gravity
            { x: 2100, y: 320, width: 96, height: 16, type: 'space_platform' },
            { x: 2300, y: 256, width: 96, height: 16, type: 'space_platform' },
            { x: 2500, y: 192, width: 96, height: 16, type: 'space_platform' },

            // Meteor shower zone
            { x: 2900, y: 352, width: 128, height: 32, type: 'asteroid', moving: true },
            { x: 3200, y: 288, width: 96, height: 32, type: 'asteroid', moving: true },

            // Anti-gravity chamber
            { x: 3600, y: 256, width: 400, height: 32, type: 'antigrav_floor' },
            { x: 3600, y: 448, width: 400, height: 32, type: 'antigrav_ceiling' },
            { x: 3700, y: 352, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Satellite platforms
            { x: 4200, y: 320, width: 128, height: 32, type: 'satellite', orbiting: true },
            { x: 4500, y: 384, width: 128, height: 32, type: 'satellite', orbiting: true },

            // Crystal asteroid cluster
            { x: 5000, y: 256, width: 192, height: 32, type: 'crystal_asteroid' },
            { x: 5100, y: 192, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 5132, y: 192, width: 32, height: 32, type: 'question', item: '1up' },

            // Black hole hazard area
            { x: 5500, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 5700, y: 288, width: 96, height: 32, type: 'platform' },
            { x: 5900, y: 352, width: 96, height: 32, type: 'platform' },

            // Space station landing
            { x: 6400, y: 416, width: 1200, height: 96, type: 'metal' },
            { x: 6600, y: 352, width: 32, height: 32, type: 'question', item: 'star' },

            // Boss arena
            { x: 7800, y: 416, width: 1400, height: 96, type: 'arena' },
            { x: 8000, y: 320, width: 128, height: 32, type: 'platform' },
            { x: 8800, y: 320, width: 128, height: 32, type: 'platform' },

            { x: 9000, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'alien', x: 1000, y: 384 },
            { type: 'space_koopa', x: 1300, y: 256 },
            { type: 'alien', x: 1850, y: 352 },
            { type: 'buzzy', x: 2200, y: 100 },
            { type: 'alien', x: 2600, y: 160 },
            { type: 'space_koopa', x: 3000, y: 320 },
            { type: 'buzzy', x: 3750, y: 150 },
            { type: 'alien', x: 4300, y: 288 },
            { type: 'space_koopa', x: 4600, y: 352 },
            { type: 'alien', x: 5150, y: 224 },
            { type: 'buzzy', x: 5600, y: 100 },
            { type: 'alien', x: 6000, y: 320 },
            { type: 'space_koopa', x: 6700, y: 384 },
            // Mid-boss
            { type: 'alien_commander', x: 8400, y: 384, miniboss: true, hp: 8 }
        ],

        powerups: [
            { type: 'mushroom', x: 1800, y: 320 },
            { type: 'fireflower', x: 3700, y: 352 },
            { type: 'coin', x: 5100, y: 192 },
            { type: '1up', x: 5132, y: 192 },
            { type: 'star', x: 6600, y: 352 }
        ]
    },

    // World 5-2: Moon Base (Insane)
    15: {
        name: 'Lunar Colony',
        theme: 'SPACE',
        width: 8000,
        height: 576,
        timeLimit: 300,
        difficulty: 15,
        background: '#000011',
        music: 'space',
        lowGravity: true,
        hazards: ['lasers', 'low_gravity'],

        platforms: [
            // Moon surface
            { x: 0, y: 512, width: 8000, height: 64, type: 'moon_rock' },

            // Base entrance
            { x: 400, y: 416, width: 256, height: 96, type: 'base_module' },
            { x: 500, y: 352, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Crater jumps
            { x: 800, y: 480, width: 128, height: 32, type: 'moon_rock' },
            { x: 1100, y: 448, width: 96, height: 64, type: 'moon_rock' },
            { x: 1350, y: 480, width: 128, height: 32, type: 'moon_rock' },

            // Low gravity bounce pads
            { x: 1700, y: 416, width: 64, height: 16, type: 'bounce_pad' },
            { x: 2000, y: 352, width: 64, height: 16, type: 'bounce_pad' },
            { x: 2300, y: 288, width: 64, height: 16, type: 'bounce_pad' },

            // Airlock chamber
            { x: 2700, y: 256, width: 400, height: 32, type: 'ceiling' },
            { x: 2700, y: 448, width: 400, height: 64, type: 'floor' },
            { x: 2900, y: 384, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Laser grid section
            { x: 3300, y: 416, width: 96, height: 32, type: 'platform' },
            { x: 3500, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 3700, y: 288, width: 96, height: 32, type: 'platform' },
            { x: 3900, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 4100, y: 416, width: 96, height: 32, type: 'platform' },

            // Observatory dome
            { x: 4500, y: 384, width: 256, height: 128, type: 'observatory' },
            { x: 4600, y: 320, width: 32, height: 32, type: 'question', item: 'star' },

            // Rover track
            { x: 5000, y: 480, width: 800, height: 32, type: 'moon_rock' },

            // Jump platforms
            { x: 6000, y: 384, width: 96, height: 16, type: 'space_platform' },
            { x: 6200, y: 320, width: 96, height: 16, type: 'space_platform' },
            { x: 6400, y: 256, width: 96, height: 16, type: 'space_platform' },

            // Research facility
            { x: 6800, y: 416, width: 400, height: 96, type: 'base_module' },
            { x: 6900, y: 352, width: 32, height: 32, type: 'question', item: '1up' },

            // Final ascent
            { x: 7400, y: 352, width: 128, height: 32, type: 'platform' },
            { x: 7600, y: 288, width: 96, height: 32, type: 'platform' },

            { x: 7800, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'alien', x: 600, y: 384 },
            { type: 'space_koopa', x: 900, y: 448 },
            { type: 'alien', x: 1200, y: 416 },
            { type: 'buzzy', x: 1800, y: 200 },
            { type: 'alien', x: 2100, y: 320 },
            { type: 'space_koopa', x: 2950, y: 352 },
            { type: 'buzzy', x: 3400, y: 100 },
            { type: 'alien', x: 3800, y: 256 },
            { type: 'space_koopa', x: 4200, y: 384 },
            { type: 'alien', x: 4650, y: 352 },
            { type: 'buzzy', x: 5400, y: 200 },
            { type: 'alien', x: 6100, y: 352 },
            { type: 'space_koopa', x: 6500, y: 224 },
            { type: 'alien', x: 6950, y: 384 },
            { type: 'buzzy', x: 7500, y: 100 }
        ],

        powerups: [
            { type: 'mushroom', x: 500, y: 352 },
            { type: 'fireflower', x: 2900, y: 384 },
            { type: 'coin', x: 4600, y: 320 },
            { type: 'star', x: 4650, y: 320 },
            { type: '1up', x: 6900, y: 352 }
        ]
    },

    // World 5-3: Cosmic Fortress Boss (Insane)
    16: {
        name: 'Starship Dreadnought',
        theme: 'SPACE',
        width: 6400,
        height: 576,
        timeLimit: 260,
        difficulty: 16,
        background: '#000011',
        music: 'boss',
        lowGravity: true,
        boss: true,

        platforms: [
            // Docking bay
            { x: 0, y: 512, width: 600, height: 64, type: 'metal' },

            // Entry corridor
            { x: 700, y: 416, width: 300, height: 32, type: 'metal_platform' },
            { x: 800, y: 352, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Anti-gravity zones
            { x: 1100, y: 320, width: 96, height: 16, type: 'antigrav_platform' },
            { x: 1300, y: 256, width: 96, height: 16, type: 'antigrav_platform' },
            { x: 1500, y: 192, width: 96, height: 16, type: 'antigrav_platform' },

            // Engine room
            { x: 1800, y: 384, width: 400, height: 128, type: 'engine_room' },
            { x: 1900, y: 320, width: 32, height: 32, type: 'question', item: 'fireflower' },
            { x: 2000, y: 288, width: 32, height: 32, type: 'firebar' },

            // Maintenance shaft
            { x: 2400, y: 256, width: 400, height: 32, type: 'ceiling' },
            { x: 2400, y: 448, width: 400, height: 64, type: 'floor' },
            { x: 2600, y: 352, width: 64, height: 32, type: 'platform' },

            // Reactor core (hazard)
            { x: 3000, y: 320, width: 256, height: 192, type: 'reactor', hazard: true },
            { x: 3100, y: 352, width: 96, height: 32, type: 'safe_platform' },

            // Command bridge approach
            { x: 3500, y: 416, width: 600, height: 96, type: 'metal' },
            { x: 3700, y: 352, width: 32, height: 32, type: 'question', item: 'star' },

            // Boss arena - spacious for movement
            { x: 4300, y: 416, width: 2100, height: 96, type: 'arena' },
            { x: 4500, y: 320, width: 128, height: 32, type: 'platform' },
            { x: 4800, y: 256, width: 96, height: 32, type: 'platform' },
            { x: 5100, y: 320, width: 128, height: 32, type: 'platform' },
            { x: 5400, y: 256, width: 96, height: 32, type: 'platform' },
            { x: 5700, y: 320, width: 128, height: 32, type: 'platform' },

            { x: 6200, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'alien', x: 800, y: 384 },
            { type: 'space_koopa', x: 1200, y: 288 },
            { type: 'buzzy', x: 1400, y: 100 },
            { type: 'alien', x: 1950, y: 352 },
            { type: 'space_koopa', x: 2650, y: 320 },
            { type: 'buzzy', x: 3150, y: 100 },
            { type: 'alien', x: 3800, y: 384 },
            // Boss
            { type: 'robot_boss', x: 5200, y: 384, boss: true, hp: 20, lasers: true, missiles: true }
        ],

        powerups: [
            { type: 'mushroom', x: 800, y: 352 },
            { type: 'fireflower', x: 1900, y: 320 },
            { type: 'star', x: 3700, y: 352 },
            { type: '1up', x: 4600, y: 288 }
        ]
    },

    // World 6-1: Rainbow Road (Insane)
    17: {
        name: 'Rainbow Paradise',
        theme: 'RAINBOW',
        width: 10400,
        height: 576,
        timeLimit: 360,
        difficulty: 17,
        background: '#ffb3ff',
        music: 'rainbow',
        colorfulEffects: true,

        platforms: [
            // Rainbow ground
            { x: 0, y: 512, width: 10400, height: 64, type: 'rainbow_ground' },

            // Color-changing platforms
            { x: 400, y: 416, width: 128, height: 32, type: 'red_platform' },
            { x: 600, y: 352, width: 128, height: 32, type: 'orange_platform' },
            { x: 800, y: 288, width: 128, height: 32, type: 'yellow_platform' },
            { x: 1000, y: 352, width: 128, height: 32, type: 'green_platform' },
            { x: 1200, y: 416, width: 128, height: 32, type: 'blue_platform' },

            // Rainbow bridge
            { x: 1500, y: 384, width: 400, height: 32, type: 'rainbow_bridge' },
            { x: 1700, y: 320, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Cloud platforms
            { x: 2100, y: 320, width: 128, height: 32, type: 'pink_cloud' },
            { x: 2350, y: 256, width: 96, height: 32, type: 'cyan_cloud' },
            { x: 2600, y: 192, width: 128, height: 32, type: 'purple_cloud' },

            // Star shower area
            { x: 2900, y: 352, width: 192, height: 32, type: 'star_platform' },
            { x: 3000, y: 288, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Prism pathway
            { x: 3400, y: 416, width: 96, height: 32, type: 'prism', refracts: true },
            { x: 3600, y: 352, width: 96, height: 32, type: 'prism', refracts: true },
            { x: 3800, y: 288, width: 96, height: 32, type: 'prism', refracts: true },
            { x: 4000, y: 224, width: 96, height: 32, type: 'prism', refracts: true },

            // Sparkle zone
            { x: 4400, y: 320, width: 256, height: 32, type: 'sparkle_platform' },
            { x: 4500, y: 256, width: 32, height: 32, type: 'question', item: 'coin' },
            { x: 4532, y: 256, width: 32, height: 32, type: 'question', item: '1up' },

            // Gradient platforms
            { x: 5000, y: 384, width: 128, height: 32, type: 'gradient_platform', moving: true },
            { x: 5300, y: 320, width: 128, height: 32, type: 'gradient_platform', moving: true },
            { x: 5600, y: 384, width: 128, height: 32, type: 'gradient_platform', moving: true },

            // Crystal pathway
            { x: 6000, y: 352, width: 192, height: 32, type: 'crystal_platform' },
            { x: 6300, y: 288, width: 128, height: 32, type: 'crystal_platform' },
            { x: 6550, y: 352, width: 192, height: 32, type: 'crystal_platform' },

            // Rainbow fountain
            { x: 7000, y: 416, width: 256, height: 96, type: 'fountain' },
            { x: 7100, y: 352, width: 32, height: 32, type: 'question', item: 'star' },

            // Colorful stairs
            { x: 7500, y: 480, width: 64, height: 32, type: 'red_platform' },
            { x: 7564, y: 448, width: 64, height: 64, type: 'orange_platform' },
            { x: 7628, y: 416, width: 64, height: 96, type: 'yellow_platform' },
            { x: 7692, y: 384, width: 64, height: 128, type: 'green_platform' },
            { x: 7756, y: 352, width: 64, height: 160, type: 'blue_platform' },

            // Sky garden
            { x: 8200, y: 288, width: 400, height: 32, type: 'garden_platform' },
            { x: 8400, y: 224, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Final rainbow
            { x: 8800, y: 384, width: 600, height: 32, type: 'rainbow_bridge' },
            { x: 9200, y: 320, width: 128, height: 32, type: 'purple_cloud' },

            // Finish
            { x: 10200, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'koopa', x: 700, y: 256 },
            { type: 'buzzy', x: 1100, y: 100 },
            { type: 'goomba', x: 1750, y: 352 },
            { type: 'koopa', x: 2250, y: 288 },
            { type: 'buzzy', x: 2700, y: 50 },
            { type: 'goomba', x: 3050, y: 320 },
            { type: 'koopa', x: 3700, y: 256 },
            { type: 'buzzy', x: 4100, y: 100 },
            { type: 'goomba', x: 4550, y: 288 },
            { type: 'koopa', x: 5400, y: 288 },
            { type: 'buzzy', x: 6150, y: 100 },
            { type: 'goomba', x: 6450, y: 256 },
            { type: 'koopa', x: 7150, y: 384 },
            { type: 'buzzy', x: 8450, y: 100 },
            { type: 'goomba', x: 9000, y: 352 }
        ],

        powerups: [
            { type: 'mushroom', x: 1700, y: 320 },
            { type: 'fireflower', x: 3000, y: 288 },
            { type: 'coin', x: 4500, y: 256 },
            { type: '1up', x: 4532, y: 256 },
            { type: 'star', x: 7100, y: 352 },
            { type: 'fireflower', x: 8400, y: 224 }
        ]
    },

    // World 6-2: Prismatic Peaks (Extreme)
    18: {
        name: 'Crystal Mountains',
        theme: 'RAINBOW',
        width: 9600,
        height: 576,
        timeLimit: 320,
        difficulty: 18,
        background: '#ffb3ff',
        music: 'rainbow',
        colorfulEffects: true,

        platforms: [
            // Base
            { x: 0, y: 512, width: 9600, height: 64, type: 'rainbow_ground' },

            // Mountain climb start
            { x: 400, y: 448, width: 128, height: 64, type: 'crystal_platform' },
            { x: 600, y: 384, width: 96, height: 128, type: 'crystal_platform' },
            { x: 800, y: 320, width: 128, height: 192, type: 'crystal_platform' },

            // Bouncing crystals
            { x: 1100, y: 384, width: 64, height: 16, type: 'bounce_crystal' },
            { x: 1300, y: 288, width: 64, height: 16, type: 'bounce_crystal' },
            { x: 1500, y: 192, width: 64, height: 16, type: 'bounce_crystal' },

            // Color puzzle area
            { x: 1800, y: 352, width: 96, height: 32, type: 'red_platform' },
            { x: 2000, y: 352, width: 96, height: 32, type: 'blue_platform' },
            { x: 2200, y: 352, width: 96, height: 32, type: 'yellow_platform' },
            { x: 2100, y: 288, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Prism cavern
            { x: 2600, y: 256, width: 600, height: 32, type: 'ceiling' },
            { x: 2600, y: 448, width: 600, height: 64, type: 'floor' },
            { x: 2800, y: 384, width: 96, height: 32, type: 'prism' },
            { x: 3000, y: 352, width: 32, height: 32, type: 'question', item: 'fireflower' },

            // Rainbow waterfalls
            { x: 3400, y: 416, width: 128, height: 32, type: 'platform' },
            { x: 3400, y: 256, width: 32, height: 160, type: 'rainbow_waterfall' },
            { x: 3700, y: 352, width: 128, height: 32, type: 'platform' },

            // Peak platforms
            { x: 4100, y: 288, width: 128, height: 32, type: 'ice_crystal' },
            { x: 4350, y: 224, width: 96, height: 32, type: 'ice_crystal' },
            { x: 4600, y: 160, width: 128, height: 32, type: 'ice_crystal' },

            // Summit
            { x: 4900, y: 256, width: 256, height: 32, type: 'summit_platform' },
            { x: 5000, y: 192, width: 32, height: 32, type: 'question', item: 'star' },

            // Descent - sliding crystals
            { x: 5300, y: 320, width: 128, height: 32, type: 'slide_platform', angle: -15 },
            { x: 5500, y: 384, width: 128, height: 32, type: 'slide_platform', angle: -15 },
            { x: 5700, y: 448, width: 128, height: 32, type: 'slide_platform', angle: -15 },

            // Rainbow canyon
            { x: 6000, y: 384, width: 96, height: 32, type: 'rainbow_bridge' },
            { x: 6200, y: 320, width: 96, height: 32, type: 'rainbow_bridge' },
            { x: 6400, y: 256, width: 96, height: 32, type: 'rainbow_bridge' },
            { x: 6600, y: 320, width: 96, height: 32, type: 'rainbow_bridge' },
            { x: 6800, y: 384, width: 96, height: 32, type: 'rainbow_bridge' },

            // Gem garden
            { x: 7200, y: 416, width: 400, height: 96, type: 'gem_platform' },
            { x: 7300, y: 352, width: 32, height: 32, type: 'question', item: '1up' },

            // Final ascent
            { x: 7800, y: 352, width: 128, height: 32, type: 'crystal_platform' },
            { x: 8000, y: 288, width: 96, height: 32, type: 'crystal_platform' },
            { x: 8200, y: 224, width: 128, height: 32, type: 'crystal_platform' },

            { x: 9400, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'koopa', x: 500, y: 416 },
            { type: 'buzzy', x: 900, y: 100 },
            { type: 'goomba', x: 1200, y: 352 },
            { type: 'koopa', x: 1900, y: 320 },
            { type: 'buzzy', x: 2150, y: 100 },
            { type: 'goomba', x: 2850, y: 352 },
            { type: 'koopa', x: 3500, y: 320 },
            { type: 'buzzy', x: 4200, y: 100 },
            { type: 'goomba', x: 4700, y: 128 },
            { type: 'koopa', x: 5050, y: 224 },
            { type: 'buzzy', x: 6300, y: 100 },
            { type: 'goomba', x: 6900, y: 256 },
            { type: 'koopa', x: 7350, y: 384 },
            { type: 'buzzy', x: 8100, y: 100 },
            { type: 'goomba', x: 8500, y: 192 }
        ],

        powerups: [
            { type: 'mushroom', x: 2100, y: 288 },
            { type: 'fireflower', x: 3000, y: 352 },
            { type: 'star', x: 5000, y: 192 },
            { type: 'coin', x: 7300, y: 352 },
            { type: '1up', x: 7330, y: 352 }
        ]
    },

    // World 6-3: Chromatic Chaos (Extreme)
    19: {
        name: 'Spectrum Sanctuary',
        theme: 'RAINBOW',
        width: 8800,
        height: 576,
        timeLimit: 300,
        difficulty: 19,
        background: '#ffb3ff',
        music: 'rainbow',
        colorfulEffects: true,
        hazards: ['color_switches', 'moving_platforms'],

        platforms: [
            { x: 0, y: 512, width: 8800, height: 64, type: 'rainbow_ground' },

            // Color switch puzzle entrance
            { x: 400, y: 416, width: 192, height: 32, type: 'switch_platform', color: 'red' },
            { x: 700, y: 352, width: 128, height: 32, type: 'switch_platform', color: 'blue' },
            { x: 950, y: 416, width: 192, height: 32, type: 'switch_platform', color: 'red' },

            // Moving rainbow platforms
            { x: 1300, y: 352, width: 96, height: 16, type: 'moving_rainbow', speed: 2 },
            { x: 1600, y: 288, width: 96, height: 16, type: 'moving_rainbow', speed: 2 },
            { x: 1900, y: 352, width: 96, height: 16, type: 'moving_rainbow', speed: 2 },

            // Kaleidoscope chamber
            { x: 2300, y: 256, width: 600, height: 32, type: 'ceiling' },
            { x: 2300, y: 448, width: 600, height: 64, type: 'floor' },
            { x: 2400, y: 384, width: 96, height: 32, type: 'red_platform' },
            { x: 2600, y: 352, width: 96, height: 32, type: 'blue_platform' },
            { x: 2800, y: 384, width: 96, height: 32, type: 'yellow_platform' },
            { x: 2550, y: 320, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Chromatic maze
            { x: 3100, y: 416, width: 128, height: 32, type: 'green_platform' },
            { x: 3300, y: 352, width: 96, height: 32, type: 'purple_platform' },
            { x: 3500, y: 288, width: 128, height: 32, type: 'orange_platform' },
            { x: 3700, y: 352, width: 96, height: 32, type: 'cyan_platform' },
            { x: 3900, y: 416, width: 128, height: 32, type: 'pink_platform' },

            // Power-up area
            { x: 4200, y: 352, width: 256, height: 32, type: 'sparkle_platform' },
            { x: 4300, y: 288, width: 32, height: 32, type: 'question', item: 'fireflower' },
            { x: 4332, y: 288, width: 32, height: 32, type: 'question', item: 'star' },

            // Disappearing color platforms
            { x: 4700, y: 384, width: 96, height: 32, type: 'disappearing', interval: 1.5, color: 'red' },
            { x: 4900, y: 320, width: 96, height: 32, type: 'disappearing', interval: 1.5, color: 'blue' },
            { x: 5100, y: 256, width: 96, height: 32, type: 'disappearing', interval: 1.5, color: 'yellow' },
            { x: 5300, y: 320, width: 96, height: 32, type: 'disappearing', interval: 1.5, color: 'green' },
            { x: 5500, y: 384, width: 96, height: 32, type: 'disappearing', interval: 1.5, color: 'purple' },

            // Prism tower
            { x: 5900, y: 480, width: 64, height: 32, type: 'prism' },
            { x: 5932, y: 448, width: 96, height: 64, type: 'prism' },
            { x: 5964, y: 416, width: 128, height: 96, type: 'prism' },
            { x: 5996, y: 384, width: 160, height: 128, type: 'prism' },
            { x: 6028, y: 352, width: 128, height: 160, type: 'prism' },
            { x: 6060, y: 320, width: 96, height: 192, type: 'prism' },

            // Rainbow road
            { x: 6400, y: 352, width: 800, height: 32, type: 'rainbow_bridge' },
            { x: 6700, y: 288, width: 32, height: 32, type: 'question', item: '1up' },

            // Final color gauntlet
            { x: 7400, y: 416, width: 96, height: 32, type: 'red_platform' },
            { x: 7550, y: 352, width: 96, height: 32, type: 'orange_platform' },
            { x: 7700, y: 288, width: 96, height: 32, type: 'yellow_platform' },
            { x: 7850, y: 224, width: 96, height: 32, type: 'green_platform' },

            // Victory platform
            { x: 8200, y: 320, width: 256, height: 32, type: 'victory_platform' },

            { x: 8600, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'koopa', x: 550, y: 384 },
            { type: 'buzzy', x: 800, y: 100 },
            { type: 'goomba', x: 1400, y: 320 },
            { type: 'koopa', x: 1700, y: 256 },
            { type: 'buzzy', x: 2450, y: 150 },
            { type: 'goomba', x: 2700, y: 320 },
            { type: 'koopa', x: 3200, y: 384 },
            { type: 'buzzy', x: 3600, y: 100 },
            { type: 'goomba', x: 4000, y: 384 },
            { type: 'koopa', x: 4350, y: 320 },
            { type: 'buzzy', x: 5000, y: 100 },
            { type: 'goomba', x: 5400, y: 352 },
            { type: 'koopa', x: 6100, y: 288 },
            { type: 'buzzy', x: 6750, y: 100 },
            { type: 'goomba', x: 7550, y: 320 }
        ],

        powerups: [
            { type: 'mushroom', x: 2550, y: 320 },
            { type: 'fireflower', x: 4300, y: 288 },
            { type: 'star', x: 4332, y: 288 },
            { type: 'coin', x: 6700, y: 288 },
            { type: '1up', x: 6732, y: 288 }
        ]
    },

    // World 6-4: FINAL BOSS - Ultimate Castle (INSANE)
    20: {
        name: 'Bowser\'s Ultimate Fortress',
        theme: 'FINAL_CASTLE',
        width: 7200,
        height: 576,
        timeLimit: 400,
        difficulty: 20,
        background: '#0d0d0d',
        music: 'final_boss',
        boss: true,
        finalBoss: true,
        hazards: ['lava', 'firebars', 'thwomps', 'falling_platforms'],

        platforms: [
            // Starting area
            { x: 0, y: 512, width: 600, height: 64, type: 'dark_stone' },

            // Entrance gauntlet
            { x: 700, y: 416, width: 96, height: 32, type: 'crumbling' },
            { x: 900, y: 352, width: 96, height: 32, type: 'crumbling' },
            { x: 1100, y: 416, width: 96, height: 32, type: 'crumbling' },

            // Lava pits
            { x: 1300, y: 512, width: 400, height: 64, type: 'lava' },

            // Narrow platforms over lava
            { x: 1400, y: 384, width: 64, height: 16, type: 'falling_platform' },
            { x: 1550, y: 320, width: 64, height: 16, type: 'falling_platform' },
            { x: 1700, y: 384, width: 64, height: 16, type: 'falling_platform' },

            // Firebar corridor
            { x: 1900, y: 416, width: 400, height: 96, type: 'dark_stone' },
            { x: 2000, y: 352, width: 32, height: 32, type: 'firebar' },
            { x: 2100, y: 352, width: 32, height: 32, type: 'firebar' },
            { x: 2200, y: 352, width: 32, height: 32, type: 'firebar' },
            { x: 2050, y: 320, width: 32, height: 32, type: 'question', item: 'mushroom' },

            // Thwomp chamber
            { x: 2400, y: 256, width: 600, height: 32, type: 'ceiling' },
            { x: 2400, y: 448, width: 600, height: 64, type: 'floor' },
            { x: 2500, y: 128, width: 64, height: 64, type: 'thwomp' },
            { x: 2700, y: 96, width: 64, height: 64, type: 'thwomp' },
            { x: 2900, y: 128, width: 64, height: 64, type: 'thwomp' },

            // Safe room with power-ups
            { x: 3100, y: 384, width: 400, height: 128, type: 'safe_room' },
            { x: 3200, y: 320, width: 32, height: 32, type: 'question', item: 'fireflower' },
            { x: 3300, y: 320, width: 32, height: 32, type: 'question', item: 'star' },
            { x: 3400, y: 320, width: 32, height: 32, type: 'question', item: '1up' },

            // Rising lava section
            { x: 3600, y: 416, width: 96, height: 32, type: 'platform' },
            { x: 3800, y: 352, width: 96, height: 32, type: 'platform' },
            { x: 4000, y: 288, width: 96, height: 32, type: 'platform' },
            { x: 4200, y: 224, width: 96, height: 32, type: 'platform' },
            { x: 4400, y: 288, width: 96, height: 32, type: 'platform' },
            { x: 4600, y: 352, width: 96, height: 32, type: 'platform' },

            // Bridge to boss arena
            { x: 4900, y: 416, width: 400, height: 16, type: 'bridge' },

            // FINAL BOSS ARENA - Multi-phase battle
            { x: 5400, y: 416, width: 1800, height: 96, type: 'boss_arena' },

            // Boss platforms for phase 2
            { x: 5600, y: 320, width: 128, height: 32, type: 'platform' },
            { x: 5900, y: 256, width: 96, height: 32, type: 'platform' },
            { x: 6200, y: 320, width: 128, height: 32, type: 'platform' },
            { x: 6500, y: 256, width: 96, height: 32, type: 'platform' },
            { x: 6800, y: 320, width: 128, height: 32, type: 'platform' },

            // Victory bridge
            { x: 5800, y: 192, width: 32, height: 32, type: 'axe' },

            { x: 7000, y: 192, width: 32, height: 320, type: 'flag' }
        ],

        enemies: [
            { type: 'dry_bones', x: 400, y: 480 },
            { type: 'buzzy', x: 800, y: 100 },
            { type: 'dry_bones', x: 1450, y: 352 },
            { type: 'buzzy', x: 1600, y: 150 },
            { type: 'dry_bones', x: 2100, y: 384 },
            { type: 'buzzy', x: 2600, y: 200 },
            { type: 'dry_bones', x: 2800, y: 416 },
            { type: 'buzzy', x: 3700, y: 150 },
            { type: 'dry_bones', x: 4100, y: 256 },
            { type: 'buzzy', x: 4500, y: 100 },

            // FINAL BOSS - Three phases
            {
                type: 'mega_bowser',
                x: 6200,
                y: 384,
                boss: true,
                finalBoss: true,
                hp: 30,
                phases: [
                    { hp: 30, attacks: ['fireball', 'ground_pound'] },
                    { hp: 20, attacks: ['fireball', 'ground_pound', 'fire_breath'] },
                    { hp: 10, attacks: ['fireball', 'ground_pound', 'fire_breath', 'lightning', 'meteor_shower'] }
                ],
                invincible: false
            }
        ],

        powerups: [
            { type: 'mushroom', x: 2050, y: 320 },
            { type: 'fireflower', x: 3200, y: 320 },
            { type: 'star', x: 3300, y: 320 },
            { type: '1up', x: 3400, y: 320 },
            { type: 'fireflower', x: 5700, y: 288 },
            { type: 'star', x: 6300, y: 288 }
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
    10: { enemySpeed: 2.0, enemyCount: 2.0, platformDifficulty: 2.0, timeMultiplier: 0.65 },
    11: { enemySpeed: 2.1, enemyCount: 2.1, platformDifficulty: 2.1, timeMultiplier: 0.65 },
    12: { enemySpeed: 2.2, enemyCount: 2.2, platformDifficulty: 2.2, timeMultiplier: 0.60 },
    13: { enemySpeed: 2.3, enemyCount: 2.3, platformDifficulty: 2.3, timeMultiplier: 0.60 },
    14: { enemySpeed: 2.4, enemyCount: 2.4, platformDifficulty: 2.4, timeMultiplier: 0.55 },
    15: { enemySpeed: 2.5, enemyCount: 2.5, platformDifficulty: 2.5, timeMultiplier: 0.55 },
    16: { enemySpeed: 2.6, enemyCount: 2.6, platformDifficulty: 2.6, timeMultiplier: 0.50 },
    17: { enemySpeed: 2.7, enemyCount: 2.7, platformDifficulty: 2.7, timeMultiplier: 0.50 },
    18: { enemySpeed: 2.8, enemyCount: 2.8, platformDifficulty: 2.8, timeMultiplier: 0.45 },
    19: { enemySpeed: 2.9, enemyCount: 2.9, platformDifficulty: 2.9, timeMultiplier: 0.45 },
    20: { enemySpeed: 3.0, enemyCount: 3.0, platformDifficulty: 3.0, timeMultiplier: 0.40 }
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
    },
    HAUNTED: {
        backgroundColor: '#1a0033',
        groundColor: '#2d1b3d',
        platformColor: '#483d5c',
        skyColor: '#0d0020'
    },
    SPACE: {
        backgroundColor: '#000011',
        groundColor: '#1a1a2e',
        platformColor: '#16213e',
        skyColor: '#0a0a15'
    },
    RAINBOW: {
        backgroundColor: '#ffb3ff',
        groundColor: '#ff99cc',
        platformColor: '#cc99ff',
        skyColor: '#e6ccff'
    },
    FINAL_CASTLE: {
        backgroundColor: '#0d0d0d',
        groundColor: '#1a1a1a',
        platformColor: '#333333',
        skyColor: '#050505'
    }
};

// Export level data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVEL_DATA, DIFFICULTY_SCALING, LEVEL_THEMES };
}
