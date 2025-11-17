/**
 * Enhanced Power-ups and Collectibles System
 * Adds 15 new power-up types with unique abilities, visual effects, and mechanics
 */

// Enhanced Power-up Configuration
const ENHANCED_POWERUP_CONFIG = {
    ICE_FLOWER: {
        duration: 15000, // 15 seconds
        freezeDuration: 3000, // 3 seconds freeze
        projectileSpeed: 6,
        maxProjectiles: 2,
        color: '#00BFFF',
        points: 1500
    },
    HAMMER_SUIT: {
        duration: 20000,
        hammerCount: 6,
        hammerSpeed: 5,
        hammerGravity: 0.6,
        color: '#8B4513',
        points: 2000
    },
    TANOOKI_SUIT: {
        duration: 25000,
        flyDuration: 5000,
        glideFactor: 0.3,
        stoneDuration: 3000,
        color: '#D2691E',
        points: 2500
    },
    FROG_SUIT: {
        duration: 20000,
        swimSpeed: 4,
        jumpBoost: 1.3,
        waterFriction: 0.95,
        color: '#32CD32',
        points: 1500
    },
    PROPELLER_MUSHROOM: {
        uses: 3,
        boostStrength: -20,
        boostDuration: 1000,
        color: '#FF1493',
        points: 1800
    },
    MINI_MUSHROOM: {
        duration: 20000,
        sizeScale: 0.5,
        jumpBoost: 1.5,
        speedBoost: 1.2,
        color: '#4169E1',
        points: 1200
    },
    MEGA_MUSHROOM: {
        duration: 10000,
        sizeScale: 2.5,
        invincible: true,
        destroyBlocks: true,
        color: '#FF4500',
        points: 3000
    },
    BOOMERANG_FLOWER: {
        duration: 15000,
        maxBoomerangs: 1,
        returnSpeed: 7,
        range: 300,
        color: '#00CED1',
        points: 1500
    },
    CLOUD_FLOWER: {
        duration: 15000,
        maxClouds: 3,
        cloudLifetime: 8000,
        color: '#F0F8FF',
        points: 1600
    },
    RAINBOW_STAR: {
        duration: 15000,
        speedBoost: 1.5,
        jumpBoost: 1.3,
        invincible: true,
        color: 'rainbow',
        points: 2500
    },
    SHIELD: {
        hits: 1,
        regenerateTime: 5000,
        color: '#87CEEB',
        points: 1000
    },
    SPEED_BOOTS: {
        duration: 20000,
        speedMultiplier: 1.8,
        jumpMultiplier: 1.4,
        color: '#FFD700',
        points: 1500
    },
    WING_CAP: {
        duration: 20000,
        glideFactor: 0.2,
        glideSpeed: 2,
        color: '#DC143C',
        points: 1700
    },
    HEART_CONTAINER: {
        permanent: true,
        healthIncrease: 1,
        color: '#FF69B4',
        points: 2000
    },
    MYSTERY_BOX: {
        color: '#9370DB',
        points: 500
    }
};

// Enhanced PowerUp Class
class EnhancedPowerUp extends PowerUp {
    constructor(x, y, type) {
        super(x, y, type);
        this.enhancedType = type;
        this.config = ENHANCED_POWERUP_CONFIG[type.toUpperCase().replace(/-/g, '_')];
        this.glowPhase = 0;
    }

    initializeByType() {
        const config = ENHANCED_POWERUP_CONFIG[this.enhancedType.toUpperCase().replace(/-/g, '_')];
        if (config) {
            this.color = config.color;
            this.points = config.points;

            // Set movement for certain power-ups
            if (['ice-flower', 'hammer-suit', 'tanooki-suit', 'frog-suit',
                 'mega-mushroom', 'mini-mushroom', 'propeller-mushroom'].includes(this.enhancedType)) {
                this.velocityX = 2;
            }
        }
    }

    update(tiles) {
        super.update(tiles);
        this.glowPhase += 0.1;
    }

    render(ctx, camera) {
        if (this.collected) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        if (screenX < -this.width || screenX > ctx.canvas.width) return;

        ctx.save();
        ctx.translate(screenX, screenY);

        // Add glow effect
        this.renderGlow(ctx);

        // Render specific power-up
        switch (this.enhancedType) {
            case 'ice-flower':
                this.renderIceFlower(ctx);
                break;
            case 'hammer-suit':
                this.renderHammerSuit(ctx);
                break;
            case 'tanooki-suit':
                this.renderTanookiSuit(ctx);
                break;
            case 'frog-suit':
                this.renderFrogSuit(ctx);
                break;
            case 'propeller-mushroom':
                this.renderPropellerMushroom(ctx);
                break;
            case 'mini-mushroom':
                this.renderMiniMushroom(ctx);
                break;
            case 'mega-mushroom':
                this.renderMegaMushroom(ctx);
                break;
            case 'boomerang-flower':
                this.renderBoomerangFlower(ctx);
                break;
            case 'cloud-flower':
                this.renderCloudFlower(ctx);
                break;
            case 'rainbow-star':
                this.renderRainbowStar(ctx);
                break;
            case 'shield':
                this.renderShield(ctx);
                break;
            case 'speed-boots':
                this.renderSpeedBoots(ctx);
                break;
            case 'wing-cap':
                this.renderWingCap(ctx);
                break;
            case 'heart-container':
                this.renderHeartContainer(ctx);
                break;
            case 'mystery-box':
                this.renderMysteryBox(ctx);
                break;
        }

        ctx.restore();
    }

    renderGlow(ctx) {
        const glowIntensity = Math.sin(this.glowPhase) * 0.3 + 0.7;
        ctx.globalAlpha = glowIntensity * 0.3;
        ctx.fillStyle = this.color === 'rainbow' ? '#FFFFFF' : this.color;
        ctx.fillRect(-4, -4, this.width + 8, this.height + 8);
        ctx.globalAlpha = 1;
    }

    renderIceFlower(ctx) {
        // Ice crystal center
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12, 12, 8, 8);

        // Ice petals
        ctx.fillStyle = this.color;
        const petalSize = 6;
        // Top
        ctx.fillRect(13, 4, 6, 8);
        // Bottom
        ctx.fillRect(13, 20, 6, 8);
        // Left
        ctx.fillRect(4, 13, 8, 6);
        // Right
        ctx.fillRect(20, 13, 8, 6);

        // Ice crystals
        ctx.fillStyle = '#E0FFFF';
        ctx.fillRect(8, 8, 3, 3);
        ctx.fillRect(21, 8, 3, 3);
        ctx.fillRect(8, 21, 3, 3);
        ctx.fillRect(21, 21, 3, 3);

        // Stem
        ctx.fillStyle = '#4682B4';
        ctx.fillRect(14, 24, 4, 8);
    }

    renderHammerSuit(ctx) {
        // Hammer head
        ctx.fillStyle = this.color;
        ctx.fillRect(8, 8, 16, 12);

        // Hammer handle
        ctx.fillStyle = '#DEB887';
        ctx.fillRect(14, 16, 4, 14);

        // Metal shine
        ctx.fillStyle = '#D2B48C';
        ctx.fillRect(10, 10, 4, 4);

        // Suit emblem
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(2, 2, 4, 4);
    }

    renderTanookiSuit(ctx) {
        // Tail
        ctx.fillStyle = this.color;
        ctx.fillRect(20, 18, 10, 6);
        ctx.fillRect(26, 22, 4, 4);

        // Body
        ctx.fillStyle = '#CD853F';
        ctx.fillRect(8, 10, 16, 16);

        // Ears
        ctx.fillStyle = this.color;
        ctx.fillRect(8, 4, 4, 6);
        ctx.fillRect(20, 4, 4, 6);

        // Leaf emblem
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(13, 14, 6, 8);
        ctx.fillRect(11, 16, 2, 4);
        ctx.fillRect(19, 16, 2, 4);
    }

    renderFrogSuit(ctx) {
        // Frog body
        ctx.fillStyle = this.color;
        ctx.fillRect(8, 12, 16, 14);

        // Eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 8, 6, 6);
        ctx.fillRect(16, 8, 6, 6);

        // Pupils
        ctx.fillStyle = '#000000';
        ctx.fillRect(12, 10, 2, 2);
        ctx.fillRect(18, 10, 2, 2);

        // Feet
        ctx.fillStyle = '#228B22';
        ctx.fillRect(6, 24, 6, 4);
        ctx.fillRect(20, 24, 6, 4);

        // Belly
        ctx.fillStyle = '#98FB98';
        ctx.fillRect(11, 16, 10, 8);
    }

    renderPropellerMushroom(ctx) {
        // Mushroom cap
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, 20);

        // Propeller blades (animated)
        const rotation = this.animationFrame * Math.PI / 4;
        ctx.save();
        ctx.translate(16, 10);
        ctx.rotate(rotation);

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(-12, -2, 24, 4);
        ctx.fillRect(-2, -12, 4, 24);

        ctx.restore();

        // Mushroom stem
        ctx.fillStyle = '#FFFFE0';
        ctx.fillRect(12, 20, 8, 12);

        // Center hub
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(13, 7, 6, 6);
    }

    renderMiniMushroom(ctx) {
        // Small mushroom cap
        const size = 24;
        const offset = 4;

        ctx.fillStyle = this.color;
        ctx.fillRect(offset, offset, size, 14);

        // Mushroom stem
        ctx.fillStyle = '#FFFFE0';
        ctx.fillRect(offset + 8, offset + 14, 8, 10);

        // White spots
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(offset + 4, offset + 3, 4, 4);
        ctx.fillRect(offset + 16, offset + 3, 4, 4);
        ctx.fillRect(offset + 10, offset + 7, 4, 4);

        // Sparkles around it
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(2, 10, 2, 2);
        ctx.fillRect(28, 10, 2, 2);
        ctx.fillRect(10, 2, 2, 2);
    }

    renderMegaMushroom(ctx) {
        // Large glowing mushroom
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, 20);

        // Stem
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(12, 20, 8, 12);

        // Lightning bolts pattern
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(6, 6, 3, 8);
        ctx.fillRect(9, 10, 3, 4);
        ctx.fillRect(20, 6, 3, 8);
        ctx.fillRect(17, 10, 3, 4);

        // Glow effect
        const pulse = Math.sin(this.glowPhase * 2) * 0.5 + 0.5;
        ctx.globalAlpha = pulse * 0.5;
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(-2, -2, this.width + 4, this.height + 4);
        ctx.globalAlpha = 1;
    }

    renderBoomerangFlower(ctx) {
        // Flower center
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12, 12, 8, 8);

        // Boomerang-shaped petals
        ctx.fillStyle = this.color;

        // Top boomerang
        ctx.fillRect(10, 4, 12, 4);
        ctx.fillRect(18, 8, 4, 4);

        // Bottom boomerang
        ctx.fillRect(10, 24, 12, 4);
        ctx.fillRect(10, 20, 4, 4);

        // Left boomerang
        ctx.fillRect(4, 10, 4, 12);
        ctx.fillRect(8, 18, 4, 4);

        // Right boomerang
        ctx.fillRect(24, 10, 4, 12);
        ctx.fillRect(20, 10, 4, 4);

        // Stem
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(14, 26, 4, 6);
    }

    renderCloudFlower(ctx) {
        // Cloud-like flower petals
        ctx.fillStyle = this.color;

        // Cloud shape
        ctx.fillRect(8, 12, 16, 10);
        ctx.fillRect(10, 10, 12, 4);
        ctx.fillRect(12, 8, 8, 4);
        ctx.fillRect(6, 16, 4, 4);
        ctx.fillRect(22, 16, 4, 4);

        // Inner white
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(11, 14, 10, 6);

        // Center
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(14, 15, 4, 4);

        // Stem
        ctx.fillStyle = '#98FB98';
        ctx.fillRect(14, 22, 4, 10);
    }

    renderRainbowStar(ctx) {
        const time = this.glowPhase;

        ctx.save();
        ctx.translate(this.width / 2, this.height / 2);
        ctx.rotate(time * 0.5);

        // Rainbow colors
        const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];

        // Multi-layered star
        for (let layer = 0; layer < 3; layer++) {
            ctx.save();
            ctx.rotate((time * 0.3 * layer) + (layer * Math.PI / 6));

            // Star shape
            ctx.fillStyle = colors[(Math.floor(time * 2) + layer) % colors.length];
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const angle = (i * 4 * Math.PI) / 5;
                const radius = 14 - (layer * 2);
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();

            ctx.restore();
        }

        // Center sparkle
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(-2, -2, 4, 4);

        ctx.restore();
    }

    renderShield(ctx) {
        // Shield shape
        ctx.fillStyle = this.color;

        // Shield outline
        ctx.fillRect(6, 8, 20, 18);
        ctx.fillRect(8, 6, 16, 2);
        ctx.fillRect(8, 26, 16, 2);

        // Inner shield
        ctx.fillStyle = '#B0E0E6';
        ctx.fillRect(9, 10, 14, 14);

        // Cross emblem
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(15, 12, 2, 10);
        ctx.fillRect(12, 16, 8, 2);

        // Shine effect
        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = Math.sin(this.glowPhase) * 0.3 + 0.5;
        ctx.fillRect(10, 11, 4, 4);
        ctx.globalAlpha = 1;
    }

    renderSpeedBoots(ctx) {
        // Boot body
        ctx.fillStyle = this.color;
        ctx.fillRect(8, 14, 16, 12);

        // Boot top
        ctx.fillStyle = '#FFA500';
        ctx.fillRect(6, 12, 18, 4);

        // Boot sole
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(6, 26, 20, 4);

        // Speed lines
        ctx.fillStyle = '#FF0000';
        const offset = Math.floor(this.glowPhase * 2) % 4;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(26 + (i * 2) - offset, 18 + (i * 2), 4, 2);
        }

        // Wing detail
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(22, 16, 6, 2);
        ctx.fillRect(24, 14, 4, 2);
        ctx.fillRect(26, 12, 2, 2);
    }

    renderWingCap(ctx) {
        // Cap body
        ctx.fillStyle = this.color;
        ctx.fillRect(4, 8, 24, 12);

        // Cap bill
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(2, 16, 12, 4);

        // Wing (left)
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(0, 10, 6, 2);
        ctx.fillRect(0, 12, 8, 2);
        ctx.fillRect(2, 14, 6, 2);
        ctx.fillRect(4, 16, 4, 2);

        // Wing (right)
        ctx.fillRect(26, 10, 6, 2);
        ctx.fillRect(24, 12, 8, 2);
        ctx.fillRect(24, 14, 6, 2);
        ctx.fillRect(24, 16, 4, 2);

        // Wing emblem on cap
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(14, 12, 4, 4);
    }

    renderHeartContainer(ctx) {
        // Heart shape
        ctx.fillStyle = this.color;

        // Top circles
        ctx.fillRect(8, 10, 8, 8);
        ctx.fillRect(16, 10, 8, 8);

        // Bottom triangle
        ctx.fillRect(8, 14, 16, 4);
        ctx.fillRect(10, 18, 12, 4);
        ctx.fillRect(12, 22, 8, 4);
        ctx.fillRect(14, 26, 4, 2);

        // Shine
        ctx.fillStyle = '#FFB6C1';
        ctx.fillRect(10, 12, 4, 4);

        // Pulse effect
        ctx.globalAlpha = Math.sin(this.glowPhase * 2) * 0.3 + 0.5;
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(14, 16, 4, 4);
        ctx.globalAlpha = 1;
    }

    renderMysteryBox(ctx) {
        // Box body with animated question mark
        const colors = ['#9370DB', '#BA55D3', '#DA70D6', '#EE82EE', '#FF00FF'];
        const colorIndex = Math.floor(this.glowPhase * 2) % colors.length;

        ctx.fillStyle = colors[colorIndex];
        ctx.fillRect(4, 4, 24, 24);

        // Box outline
        ctx.fillStyle = '#4B0082';
        ctx.fillRect(2, 2, 28, 2);
        ctx.fillRect(2, 28, 28, 2);
        ctx.fillRect(2, 4, 2, 24);
        ctx.fillRect(28, 4, 2, 24);

        // Question mark
        ctx.fillStyle = '#FFFFFF';
        // Top of ?
        ctx.fillRect(12, 8, 8, 2);
        ctx.fillRect(18, 10, 2, 4);
        ctx.fillRect(14, 14, 4, 2);
        ctx.fillRect(14, 16, 2, 2);
        // Dot
        ctx.fillRect(14, 20, 4, 4);

        // Sparkles
        const sparkle = Math.floor(this.glowPhase) % 4;
        ctx.fillStyle = '#FFD700';
        if (sparkle === 0) ctx.fillRect(6, 6, 2, 2);
        if (sparkle === 1) ctx.fillRect(24, 6, 2, 2);
        if (sparkle === 2) ctx.fillRect(24, 24, 2, 2);
        if (sparkle === 3) ctx.fillRect(6, 24, 2, 2);
    }
}

// Enhanced Player Power-up State Manager
class PowerUpStateManager {
    constructor(player) {
        this.player = player;
        this.activePowerUps = new Map();
        this.powerUpEffects = new Map();

        // Projectile pools
        this.iceShards = [];
        this.hammers = [];
        this.boomerangs = [];
        this.clouds = [];

        // State tracking
        this.isFlying = false;
        this.isGliding = false;
        this.isStone = false;
        this.isMini = false;
        this.isMega = false;
        this.hasShield = false;
        this.maxHealth = 3;
        this.currentHealth = 3;

        // Usage counters
        this.propellerUses = 0;
        this.cloudPlatforms = 0;
    }

    addPowerUp(type, config) {
        // Special handling for permanent power-ups
        if (type === 'heart-container') {
            this.maxHealth++;
            this.currentHealth = Math.min(this.currentHealth + 1, this.maxHealth);
            return;
        }

        if (type === 'mystery-box') {
            this.activateRandomPowerUp();
            return;
        }

        if (type === 'shield') {
            this.hasShield = true;
            return;
        }

        // Duration-based power-ups
        const existingPowerUp = this.activePowerUps.get(type);
        if (existingPowerUp) {
            // Reset duration if already active
            existingPowerUp.duration = config.duration || 15000;
            existingPowerUp.timeRemaining = existingPowerUp.duration;
        } else {
            this.activePowerUps.set(type, {
                config: config,
                duration: config.duration || 15000,
                timeRemaining: config.duration || 15000,
                uses: config.uses || Infinity
            });
        }

        // Apply immediate effects
        this.applyPowerUpEffects(type, config);
    }

    applyPowerUpEffects(type, config) {
        switch (type) {
            case 'mini-mushroom':
                this.isMini = true;
                this.player.width *= config.sizeScale;
                this.player.height *= config.sizeScale;
                break;
            case 'mega-mushroom':
                this.isMega = true;
                this.player.width *= config.sizeScale;
                this.player.height *= config.sizeScale;
                this.player.invulnerable = true;
                break;
            case 'propeller-mushroom':
                this.propellerUses = config.uses;
                break;
            case 'cloud-flower':
                this.cloudPlatforms = 0;
                break;
        }
    }

    removePowerUp(type) {
        const powerUp = this.activePowerUps.get(type);
        if (!powerUp) return;

        // Remove effects
        switch (type) {
            case 'mini-mushroom':
                this.isMini = false;
                this.player.width = CONFIG.PLAYER.SMALL_WIDTH;
                this.player.height = this.player.state === 'small' ?
                    CONFIG.PLAYER.SMALL_HEIGHT : CONFIG.PLAYER.BIG_HEIGHT;
                break;
            case 'mega-mushroom':
                this.isMega = false;
                this.player.width = CONFIG.PLAYER.SMALL_WIDTH;
                this.player.height = this.player.state === 'small' ?
                    CONFIG.PLAYER.SMALL_HEIGHT : CONFIG.PLAYER.BIG_HEIGHT;
                this.player.invulnerable = false;
                break;
        }

        this.activePowerUps.delete(type);
    }

    update(input, deltaTime) {
        // Update all active power-ups
        for (const [type, powerUp] of this.activePowerUps) {
            powerUp.timeRemaining -= deltaTime;

            if (powerUp.timeRemaining <= 0) {
                this.removePowerUp(type);
            }
        }

        // Update projectiles
        this.updateProjectiles();

        // Handle input for active power-ups
        this.handlePowerUpInput(input);
    }

    handlePowerUpInput(input) {
        if (input.fire) {
            // Ice Flower
            if (this.activePowerUps.has('ice-flower') && this.iceShards.length < 2) {
                this.shootIceShard();
            }

            // Hammer Suit
            if (this.activePowerUps.has('hammer-suit') && this.hammers.length < 3) {
                this.throwHammer();
            }

            // Boomerang Flower
            if (this.activePowerUps.has('boomerang-flower') && this.boomerangs.length < 1) {
                this.throwBoomerang();
            }
        }

        // Propeller Mushroom
        if (input.jump && !this.player.onGround && this.propellerUses > 0) {
            if (this.activePowerUps.has('propeller-mushroom')) {
                this.activatePropeller();
            }
        }

        // Cloud Flower - create platform
        if (input.down && !this.player.onGround && this.cloudPlatforms < 3) {
            if (this.activePowerUps.has('cloud-flower')) {
                this.createCloudPlatform();
            }
        }

        // Tanooki Suit stone form
        if (input.down && !this.player.onGround) {
            if (this.activePowerUps.has('tanooki-suit')) {
                this.isStone = true;
            }
        } else {
            this.isStone = false;
        }

        // Wing Cap / Tanooki gliding
        if (!this.player.onGround && input.jump) {
            if (this.activePowerUps.has('wing-cap') || this.activePowerUps.has('tanooki-suit')) {
                this.isGliding = true;
            }
        } else {
            this.isGliding = false;
        }
    }

    shootIceShard() {
        const config = ENHANCED_POWERUP_CONFIG.ICE_FLOWER;
        this.iceShards.push({
            x: this.player.x + (this.player.direction > 0 ? this.player.width : 0),
            y: this.player.y + this.player.height / 2,
            velocityX: this.player.direction * config.projectileSpeed,
            velocityY: 0,
            width: 10,
            height: 10,
            active: true
        });
    }

    throwHammer() {
        const config = ENHANCED_POWERUP_CONFIG.HAMMER_SUIT;
        this.hammers.push({
            x: this.player.x + (this.player.direction > 0 ? this.player.width : 0),
            y: this.player.y + this.player.height / 2,
            velocityX: this.player.direction * config.hammerSpeed,
            velocityY: -8,
            width: 16,
            height: 16,
            rotation: 0,
            active: true
        });
    }

    throwBoomerang() {
        const config = ENHANCED_POWERUP_CONFIG.BOOMERANG_FLOWER;
        this.boomerangs.push({
            x: this.player.x + (this.player.direction > 0 ? this.player.width : 0),
            y: this.player.y + this.player.height / 2,
            velocityX: this.player.direction * 8,
            velocityY: 0,
            startX: this.player.x,
            returning: false,
            width: 14,
            height: 14,
            rotation: 0,
            active: true,
            distanceTraveled: 0
        });
    }

    activatePropeller() {
        if (this.propellerUses > 0) {
            this.player.velocityY = ENHANCED_POWERUP_CONFIG.PROPELLER_MUSHROOM.boostStrength;
            this.propellerUses--;
        }
    }

    createCloudPlatform() {
        if (this.cloudPlatforms < 3) {
            this.clouds.push({
                x: this.player.x,
                y: this.player.y + this.player.height,
                width: 64,
                height: 16,
                lifetime: ENHANCED_POWERUP_CONFIG.CLOUD_FLOWER.cloudLifetime,
                active: true
            });
            this.cloudPlatforms++;
        }
    }

    updateProjectiles() {
        // Update ice shards
        for (let i = this.iceShards.length - 1; i >= 0; i--) {
            const shard = this.iceShards[i];
            shard.x += shard.velocityX;

            if (Math.abs(shard.x - this.player.x) > 400) {
                this.iceShards.splice(i, 1);
            }
        }

        // Update hammers
        for (let i = this.hammers.length - 1; i >= 0; i--) {
            const hammer = this.hammers[i];
            hammer.x += hammer.velocityX;
            hammer.y += hammer.velocityY;
            hammer.velocityY += ENHANCED_POWERUP_CONFIG.HAMMER_SUIT.hammerGravity;
            hammer.rotation += 0.2;

            if (hammer.y > 600 || Math.abs(hammer.x - this.player.x) > 500) {
                this.hammers.splice(i, 1);
            }
        }

        // Update boomerangs
        for (let i = this.boomerangs.length - 1; i >= 0; i--) {
            const boomerang = this.boomerangs[i];
            boomerang.distanceTraveled += Math.abs(boomerang.velocityX);

            if (!boomerang.returning && boomerang.distanceTraveled >
                ENHANCED_POWERUP_CONFIG.BOOMERANG_FLOWER.range) {
                boomerang.returning = true;
            }

            if (boomerang.returning) {
                const dx = this.player.x - boomerang.x;
                const dy = this.player.y - boomerang.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 32) {
                    this.boomerangs.splice(i, 1);
                    continue;
                }

                boomerang.velocityX = (dx / dist) * ENHANCED_POWERUP_CONFIG.BOOMERANG_FLOWER.returnSpeed;
                boomerang.velocityY = (dy / dist) * ENHANCED_POWERUP_CONFIG.BOOMERANG_FLOWER.returnSpeed;
            }

            boomerang.x += boomerang.velocityX;
            boomerang.y += boomerang.velocityY;
            boomerang.rotation += 0.3;
        }

        // Update cloud platforms
        for (let i = this.clouds.length - 1; i >= 0; i--) {
            const cloud = this.clouds[i];
            cloud.lifetime -= 16; // Approximate deltaTime

            if (cloud.lifetime <= 0) {
                this.clouds.splice(i, 1);
                this.cloudPlatforms--;
            }
        }
    }

    activateRandomPowerUp() {
        const powerUpTypes = [
            'ice-flower', 'hammer-suit', 'tanooki-suit', 'frog-suit',
            'propeller-mushroom', 'boomerang-flower', 'cloud-flower',
            'rainbow-star', 'speed-boots', 'wing-cap'
        ];

        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        const config = ENHANCED_POWERUP_CONFIG[randomType.toUpperCase().replace(/-/g, '_')];

        this.addPowerUp(randomType, config);
    }

    renderProjectiles(ctx, camera) {
        // Render ice shards
        this.iceShards.forEach(shard => {
            const screenX = shard.x - camera.x;
            const screenY = shard.y - camera.y;

            ctx.save();
            ctx.translate(screenX, screenY);

            // Ice shard gradient
            const gradient = ctx.createRadialGradient(5, 5, 0, 5, 5, 8);
            gradient.addColorStop(0, '#FFFFFF');
            gradient.addColorStop(0.5, '#00BFFF');
            gradient.addColorStop(1, '#4169E1');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 10, 10);

            // Ice crystal shape
            ctx.fillStyle = '#E0FFFF';
            ctx.fillRect(3, 0, 4, 10);
            ctx.fillRect(0, 3, 10, 4);

            ctx.restore();
        });

        // Render hammers
        this.hammers.forEach(hammer => {
            const screenX = hammer.x - camera.x;
            const screenY = hammer.y - camera.y;

            ctx.save();
            ctx.translate(screenX + 8, screenY + 8);
            ctx.rotate(hammer.rotation);

            // Hammer head
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(-8, -6, 12, 8);

            // Hammer handle
            ctx.fillStyle = '#DEB887';
            ctx.fillRect(-6, -2, 10, 3);

            ctx.restore();
        });

        // Render boomerangs
        this.boomerangs.forEach(boomerang => {
            const screenX = boomerang.x - camera.x;
            const screenY = boomerang.y - camera.y;

            ctx.save();
            ctx.translate(screenX + 7, screenY + 7);
            ctx.rotate(boomerang.rotation);

            // Boomerang shape
            ctx.fillStyle = '#00CED1';
            ctx.fillRect(-7, -2, 14, 4);
            ctx.fillRect(3, -7, 4, 10);

            // Shine
            ctx.fillStyle = '#AFEEEE';
            ctx.fillRect(-5, -1, 8, 2);

            ctx.restore();
        });

        // Render cloud platforms
        this.clouds.forEach(cloud => {
            const screenX = cloud.x - camera.x;
            const screenY = cloud.y - camera.y;

            const alpha = Math.min(1, cloud.lifetime / 2000);
            ctx.globalAlpha = alpha;

            ctx.fillStyle = '#F0F8FF';
            ctx.fillRect(screenX, screenY, cloud.width, cloud.height);

            // Cloud puffs
            ctx.fillRect(screenX + 8, screenY - 4, 16, 8);
            ctx.fillRect(screenX + 24, screenY - 6, 16, 10);
            ctx.fillRect(screenX + 40, screenY - 4, 16, 8);

            ctx.globalAlpha = 1;
        });
    }

    renderEffects(ctx, camera) {
        const screenX = this.player.x - camera.x;
        const screenY = this.player.y - camera.y;

        // Rainbow Star trail
        if (this.activePowerUps.has('rainbow-star')) {
            const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
            for (let i = 0; i < 5; i++) {
                const alpha = (5 - i) / 5 * 0.5;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = colors[(Date.now() / 100 + i) % colors.length | 0];
                ctx.fillRect(
                    screenX - i * 8,
                    screenY,
                    this.player.width,
                    this.player.height
                );
            }
            ctx.globalAlpha = 1;
        }

        // Shield bubble
        if (this.hasShield) {
            ctx.save();
            ctx.globalAlpha = 0.4;
            ctx.strokeStyle = '#87CEEB';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(
                screenX + this.player.width / 2,
                screenY + this.player.height / 2,
                this.player.width / 2 + 10,
                0,
                Math.PI * 2
            );
            ctx.stroke();
            ctx.globalAlpha = 1;
            ctx.restore();
        }

        // Speed lines for Speed Boots
        if (this.activePowerUps.has('speed-boots') && Math.abs(this.player.velocityX) > 3) {
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            for (let i = 0; i < 3; i++) {
                const offset = (Date.now() / 50 + i * 10) % 30;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.moveTo(screenX - offset, screenY + 10 + i * 10);
                ctx.lineTo(screenX - offset - 20, screenY + 10 + i * 10);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
        }

        // Mega mushroom shockwave
        if (this.isMega) {
            const pulse = Math.sin(Date.now() / 200) * 5;
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#FF4500';
            ctx.fillRect(
                screenX - 10 - pulse,
                screenY - 10 - pulse,
                this.player.width + 20 + pulse * 2,
                this.player.height + 20 + pulse * 2
            );
            ctx.globalAlpha = 1;
        }
    }

    getSpeedMultiplier() {
        let multiplier = 1;

        if (this.activePowerUps.has('speed-boots')) {
            multiplier *= ENHANCED_POWERUP_CONFIG.SPEED_BOOTS.speedMultiplier;
        }
        if (this.activePowerUps.has('rainbow-star')) {
            multiplier *= ENHANCED_POWERUP_CONFIG.RAINBOW_STAR.speedBoost;
        }
        if (this.isMini) {
            multiplier *= ENHANCED_POWERUP_CONFIG.MINI_MUSHROOM.speedBoost;
        }

        return multiplier;
    }

    getJumpMultiplier() {
        let multiplier = 1;

        if (this.activePowerUps.has('speed-boots')) {
            multiplier *= ENHANCED_POWERUP_CONFIG.SPEED_BOOTS.jumpMultiplier;
        }
        if (this.activePowerUps.has('rainbow-star')) {
            multiplier *= ENHANCED_POWERUP_CONFIG.RAINBOW_STAR.jumpBoost;
        }
        if (this.isMini) {
            multiplier *= ENHANCED_POWERUP_CONFIG.MINI_MUSHROOM.jumpBoost;
        }
        if (this.activePowerUps.has('frog-suit')) {
            multiplier *= ENHANCED_POWERUP_CONFIG.FROG_SUIT.jumpBoost;
        }

        return multiplier;
    }

    takeDamage() {
        if (this.hasShield) {
            this.hasShield = false;
            return false; // Damage blocked
        }

        if (this.activePowerUps.has('rainbow-star') || this.isMega) {
            return false; // Invincible
        }

        this.currentHealth--;
        return this.currentHealth <= 0; // Return true if player died
    }
}
