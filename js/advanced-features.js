/**
 * Advanced Features Bundle
 * Includes: Special Abilities, Environmental Effects, Enhanced Particles, Statistics Dashboard
 */

// ===== SPECIAL ABILITIES SYSTEM =====

class SpecialAbilities {
    constructor(player) {
        this.player = player;

        this.abilities = {
            doubleJump: {
                unlocked: true,
                available: true,
                cooldown: 0,
                maxCooldown: 500
            },
            dash: {
                unlocked: true,
                available: true,
                cooldown: 0,
                maxCooldown: 1000,
                duration: 200,
                active: false
            },
            groundPound: {
                unlocked: true,
                available: true,
                cooldown: 0,
                maxCooldown: 800,
                active: false
            },
            wallJump: {
                unlocked: true,
                available: true
            },
            glide: {
                unlocked: false,
                available: false,
                active: false
            }
        };

        this.setupControls();
    }

    /**
     * Setup keyboard controls for abilities
     */
    setupControls() {
        document.addEventListener('keydown', (e) => {
            if (!this.player) {
                return;
            }

            switch (e.key.toLowerCase()) {
                case 'x':
                case 'shift':
                    this.activateDash();
                    break;
                case 's':
                case 'arrowdown':
                    if (!this.player.isOnGround) {
                        this.activateGroundPound();
                    }
                    break;
            }
        });
    }

    /**
     * Update abilities (cooldowns, etc.)
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        // Update cooldowns
        Object.keys(this.abilities).forEach(key => {
            const ability = this.abilities[key];
            if (ability.cooldown > 0) {
                ability.cooldown -= deltaTime;
                if (ability.cooldown <= 0) {
                    ability.cooldown = 0;
                    ability.available = true;
                }
            }
        });

        // Update active abilities
        if (this.abilities.dash.active) {
            this.updateDash(deltaTime);
        }

        if (this.abilities.groundPound.active) {
            this.updateGroundPound();
        }
    }

    /**
     * Perform double jump
     * @returns {boolean} Success status
     */
    performDoubleJump() {
        const ability = this.abilities.doubleJump;

        if (!ability.unlocked || !ability.available || this.player.jumpCount >= 2) {
            return false;
        }

        this.player.velocityY = this.player.jumpStrength * 0.9;
        this.player.jumpCount = 2;
        ability.available = false;
        ability.cooldown = ability.maxCooldown;

        if (enhancedSoundManager) {
            enhancedSoundManager.play('doubleJump');
        }

        if (transitionManager) {
            transitionManager.flash('cyan', 100, 0.3);
        }

        return true;
    }

    /**
     * Activate dash ability
     * @returns {boolean} Success status
     */
    activateDash() {
        const ability = this.abilities.dash;

        if (!ability.unlocked || !ability.available || ability.active) {
            return false;
        }

        ability.active = true;
        ability.available = false;
        ability.cooldown = ability.maxCooldown;
        ability.startTime = Date.now();

        const direction = this.player.facingRight ? 1 : -1;
        this.player.velocityX = direction * 12;

        if (enhancedSoundManager) {
            enhancedSoundManager.play('dash');
        }

        if (transitionManager) {
            transitionManager.flash('white', 150, 0.4);
        }

        return true;
    }

    /**
     * Update dash ability
     * @param {number} deltaTime - Time delta
     */
    updateDash(deltaTime) {
        const ability = this.abilities.dash;
        const elapsed = Date.now() - (ability.startTime || 0);

        if (elapsed >= ability.duration) {
            ability.active = false;
            this.player.velocityX *= 0.5;
        }
    }

    /**
     * Activate ground pound
     * @returns {boolean} Success status
     */
    activateGroundPound() {
        const ability = this.abilities.groundPound;

        if (!ability.unlocked || !ability.available || ability.active || this.player.isOnGround) {
            return false;
        }

        ability.active = true;
        ability.available = false;
        ability.cooldown = ability.maxCooldown;

        this.player.velocityY = 20; // Fast downward velocity
        this.player.velocityX = 0;

        if (enhancedSoundManager) {
            enhancedSoundManager.play('groundPound');
        }

        return true;
    }

    /**
     * Update ground pound
     */
    updateGroundPound() {
        const ability = this.abilities.groundPound;

        if (this.player.isOnGround && ability.active) {
            ability.active = false;

            // Impact effects
            if (transitionManager) {
                transitionManager.shake(15, 300);
            }

            // Damage nearby enemies (if implemented in game)
            if (game && game.level && game.level.enemies) {
                const impactRadius = 100;
                game.level.enemies.forEach(enemy => {
                    const dist = Math.abs(enemy.x - this.player.x);
                    if (dist < impactRadius) {
                        // Damage/kill enemy
                        enemy.takeDamage && enemy.takeDamage(2);
                    }
                });
            }
        }
    }

    /**
     * Unlock ability
     * @param {string} abilityName - Name of ability to unlock
     */
    unlock(abilityName) {
        if (this.abilities[abilityName]) {
            this.abilities[abilityName].unlocked = true;
            this.abilities[abilityName].available = true;
        }
    }
}

// ===== ENVIRONMENTAL EFFECTS SYSTEM =====

class EnvironmentalEffects {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.activeEffects = [];
        this.weatherParticles = [];
    }

    /**
     * Start weather effect
     * @param {string} type - Weather type (rain, snow, wind, fog)
     * @param {number} intensity - Intensity (0-1)
     */
    startWeather(type, intensity = 0.5) {
        this.stopWeather();

        const effect = {
            type: type,
            intensity: intensity,
            particles: []
        };

        // Generate particles
        const particleCount = Math.floor(100 * intensity);
        for (let i = 0; i < particleCount; i++) {
            effect.particles.push(this.createWeatherParticle(type));
        }

        this.activeEffects.push(effect);
    }

    /**
     * Create weather particle
     * @param {string} type - Weather type
     * @returns {Object} Particle object
     */
    createWeatherParticle(type) {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            velocityX: 0,
            velocityY: 0,
            size: 2,
            opacity: 0.5,
            type: type
        };

        if (type === 'rain') {
            particle.velocityY = 5 + Math.random() * 3;
            particle.velocityX = -0.5;
            particle.size = 1;
            particle.length = 10 + Math.random() * 10;
        } else if (type === 'snow') {
            particle.velocityY = 1 + Math.random() * 2;
            particle.velocityX = Math.random() * 0.5 - 0.25;
            particle.size = 2 + Math.random() * 2;
            particle.opacity = 0.7;
        } else if (type === 'fog') {
            particle.velocityX = 0.2 + Math.random() * 0.3;
            particle.velocityY = Math.random() * 0.2 - 0.1;
            particle.size = 40 + Math.random() * 40;
            particle.opacity = 0.1;
        }

        return particle;
    }

    /**
     * Update environmental effects
     */
    update() {
        this.activeEffects.forEach(effect => {
            effect.particles.forEach(particle => {
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;

                // Wrap around screen
                if (particle.y > this.canvas.height) {
                    particle.y = 0;
                    particle.x = Math.random() * this.canvas.width;
                }
                if (particle.x < 0) {
                    particle.x = this.canvas.width;
                }
                if (particle.x > this.canvas.width) {
                    particle.x = 0;
                }
            });
        });
    }

    /**
     * Render environmental effects
     */
    render() {
        this.activeEffects.forEach(effect => {
            effect.particles.forEach(particle => {
                this.renderParticle(particle);
            });
        });
    }

    /**
     * Render individual particle
     * @param {Object} particle - Particle object
     */
    renderParticle(particle) {
        const ctx = this.ctx;
        ctx.save();

        if (particle.type === 'rain') {
            ctx.strokeStyle = `rgba(174, 194, 224, ${particle.opacity})`;
            ctx.lineWidth = particle.size;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x - particle.velocityX * 2, particle.y - particle.length);
            ctx.stroke();
        } else if (particle.type === 'snow') {
            ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (particle.type === 'fog') {
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size
            );
            gradient.addColorStop(0, `rgba(200, 200, 200, ${particle.opacity})`);
            gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(
                particle.x - particle.size,
                particle.y - particle.size,
                particle.size * 2,
                particle.size * 2
            );
        }

        ctx.restore();
    }

    /**
     * Stop all weather effects
     */
    stopWeather() {
        this.activeEffects = [];
    }
}

// ===== ENHANCED PARTICLE EFFECTS =====

class EnhancedParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500;
        this.particleTypes = {
            spark: { lifetime: 0.5, size: 2, color: '#FFD700', gravity: 0.2 },
            explosion: { lifetime: 0.8, size: 4, color: '#FF6B6B', gravity: 0.1 },
            smoke: { lifetime: 1.5, size: 8, color: '#888888', gravity: -0.05 },
            magic: { lifetime: 1.0, size: 3, color: '#9370DB', gravity: -0.1 },
            coin: { lifetime: 0.6, size: 3, color: '#FFD700', gravity: 0.3 },
            star: { lifetime: 0.7, size: 4, color: '#FFFF00', gravity: 0 },
            water: { lifetime: 1.0, size: 2, color: '#4682B4', gravity: 0.4 },
            fire: { lifetime: 0.6, size: 5, color: '#FF4500', gravity: -0.2 },
            leaf: { lifetime: 2.0, size: 4, color: '#7AB55C', gravity: 0.05 },
            dust: { lifetime: 0.8, size: 2, color: '#D2B48C', gravity: 0 },
            bubble: { lifetime: 1.5, size: 6, color: '#87CEEB', gravity: -0.15 },
            blood: { lifetime: 0.5, size: 3, color: '#8B0000', gravity: 0.5 },
            energy: { lifetime: 0.8, size: 3, color: '#00FF00', gravity: 0 },
            confetti: { lifetime: 1.2, size: 3, color: '#random', gravity: 0.3 },
            portal: { lifetime: 1.0, size: 6, color: '#9400D3', gravity: 0 }
        };
    }

    /**
     * Emit particles
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {string} type - Particle type
     * @param {number} count - Number of particles
     */
    emit(x, y, type, count = 10) {
        const template = this.particleTypes[type] || this.particleTypes.spark;

        for (let i = 0; i < count && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;

            const particle = {
                x: x,
                y: y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                lifetime: template.lifetime,
                maxLifetime: template.lifetime,
                size: template.size + Math.random() * 2,
                color: template.color === '#random' ? this.getRandomColor() : template.color,
                gravity: template.gravity,
                type: type,
                alpha: 1
            };

            this.particles.push(particle);
        }
    }

    /**
     * Get random color
     * @returns {string} Random color
     */
    getRandomColor() {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Update all particles
     * @param {number} deltaTime - Time delta in seconds
     */
    update(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            p.x += p.velocityX;
            p.y += p.velocityY;
            p.velocityY += p.gravity;
            p.lifetime -= deltaTime;
            p.alpha = p.lifetime / p.maxLifetime;

            if (p.lifetime <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Render all particles
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} camera - Camera object (optional)
     */
    render(ctx, camera = null) {
        const offsetX = camera ? camera.x : 0;

        this.particles.forEach(p => {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;

            if (p.type === 'star') {
                this.drawStar(ctx, p.x - offsetX, p.y, p.size);
            } else {
                ctx.beginPath();
                ctx.arc(p.x - offsetX, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        });
    }

    /**
     * Draw star shape
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Star size
     */
    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
            const pointX = x + Math.cos(angle) * size;
            const pointY = y + Math.sin(angle) * size;
            if (i === 0) {
                ctx.moveTo(pointX, pointY);
            } else {
                ctx.lineTo(pointX, pointY);
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
}

// ===== STATISTICS DASHBOARD =====

class StatisticsDashboard {
    constructor() {
        this.stats = achievementsManager ? achievementsManager.stats : null;
        this.graphData = {
            scoreHistory: [],
            deathHistory: [],
            levelProgress: []
        };
    }

    /**
     * Create dashboard UI
     * @returns {HTMLElement} Dashboard element
     */
    createUI() {
        const container = document.createElement('div');
        container.id = 'statisticsDashboard';
        container.className = 'stats-dashboard';
        container.innerHTML = `
            <div class="stats-content">
                <h2>📊 Statistics Dashboard</h2>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-label">Total Play Time</div>
                        <div class="stat-value">${this.formatTime(this.stats?.totalPlayTime || 0)}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Levels Completed</div>
                        <div class="stat-value">${this.stats?.levelsCompleted.length || 0}/10</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Total Coins</div>
                        <div class="stat-value">${this.stats?.totalCoinsCollected || 0} 🪙</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Enemies Defeated</div>
                        <div class="stat-value">${this.getTotalEnemies()}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">High Score</div>
                        <div class="stat-value">${this.stats?.highScore || 0}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Max Combo</div>
                        <div class="stat-value">${this.stats?.maxCombo || 0}x</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Deaths</div>
                        <div class="stat-value">${this.stats?.deaths || 0} 💀</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">Perfect Levels</div>
                        <div class="stat-value">${this.stats?.perfectLevels || 0} 💎</div>
                    </div>
                </div>

                <div class="stats-breakdown">
                    <h3>Enemies Defeated by Type</h3>
                    <div class="breakdown-grid">
                        ${this.renderEnemyBreakdown()}
                    </div>
                </div>

                <div class="stats-breakdown">
                    <h3>Power-Ups Collected</h3>
                    <div class="breakdown-grid">
                        ${this.renderPowerUpBreakdown()}
                    </div>
                </div>

                <div class="stats-actions">
                    <button class="btn-close" onclick="statisticsDashboard.closeUI()">Close</button>
                </div>
            </div>
        `;

        return container;
    }

    /**
     * Get total enemies defeated
     * @returns {number} Total count
     */
    getTotalEnemies() {
        if (!this.stats?.enemiesDefeated) {
            return 0;
        }
        return Object.values(this.stats.enemiesDefeated).reduce((sum, val) => sum + val, 0);
    }

    /**
     * Format time display
     * @param {number} seconds - Time in seconds
     * @returns {string} Formatted time
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hours}h ${minutes}m ${secs}s`;
    }

    /**
     * Render enemy breakdown
     * @returns {string} HTML string
     */
    renderEnemyBreakdown() {
        if (!this.stats?.enemiesDefeated) {
            return '<p>No data available</p>';
        }

        return Object.entries(this.stats.enemiesDefeated).map(([type, count]) => `
            <div class="breakdown-item">
                <span class="breakdown-label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span class="breakdown-value">${count}</span>
            </div>
        `).join('');
    }

    /**
     * Render power-up breakdown
     * @returns {string} HTML string
     */
    renderPowerUpBreakdown() {
        if (!this.stats?.powerUpsCollected) {
            return '<p>No data available</p>';
        }

        return Object.entries(this.stats.powerUpsCollected).map(([type, count]) => `
            <div class="breakdown-item">
                <span class="breakdown-label">${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                <span class="breakdown-value">${count}</span>
            </div>
        `).join('');
    }

    /**
     * Show dashboard UI
     */
    showUI() {
        let dashboard = document.getElementById('statisticsDashboard');

        if (!dashboard) {
            dashboard = this.createUI();
            document.body.appendChild(dashboard);
        }

        dashboard.style.display = 'flex';
    }

    /**
     * Close dashboard UI
     */
    closeUI() {
        const dashboard = document.getElementById('statisticsDashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
        }
    }
}

// Global instances
let specialAbilities;
let environmentalEffects;
let enhancedParticleSystem;
let statisticsDashboard;
