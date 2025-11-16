/**
 * Enhanced Debug Mode with Visualizations
 * Provides comprehensive debugging tools and visual overlays
 */

class DebugMode {
    constructor(canvas, ctx, game) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.game = game;

        this.enabled = false;
        this.layers = {
            collisionBoxes: true,
            velocityVectors: true,
            spatialGrid: false,
            cameraInfo: true,
            entityInfo: true,
            performanceMetrics: true,
            inputState: true,
            levelBounds: true,
            particleCount: true,
            console: false
        };

        // Console
        this.console = {
            visible: false,
            history: [],
            currentCommand: '',
            maxHistory: 50
        };

        // Metrics tracking
        this.metrics = {
            frameCount: 0,
            updateTime: 0,
            renderTime: 0,
            entityCount: 0,
            collisionChecks: 0
        };

        // Color scheme
        this.colors = {
            player: 'rgba(0, 255, 0, 0.5)',
            enemy: 'rgba(255, 0, 0, 0.5)',
            powerup: 'rgba(255, 255, 0, 0.5)',
            platform: 'rgba(0, 0, 255, 0.3)',
            velocity: 'rgba(255, 165, 0, 0.8)',
            grid: 'rgba(150, 150, 150, 0.2)',
            camera: 'rgba(255, 255, 255, 0.3)',
            text: 'rgba(255, 255, 255, 0.9)'
        };

        // Key bindings
        this.setupKeyBindings();
    }

    /**
     * Setup keyboard shortcuts for debug mode
     */
    setupKeyBindings() {
        document.addEventListener('keydown', (e) => {
            if (!this.enabled) {
                return;
            }

            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    this.layers.collisionBoxes = !this.layers.collisionBoxes;
                    break;
                case 'F2':
                    e.preventDefault();
                    this.layers.velocityVectors = !this.layers.velocityVectors;
                    break;
                case 'F3':
                    e.preventDefault();
                    this.layers.spatialGrid = !this.layers.spatialGrid;
                    break;
                case 'F4':
                    e.preventDefault();
                    this.layers.entityInfo = !this.layers.entityInfo;
                    break;
                case 'F5':
                    e.preventDefault();
                    this.layers.console = !this.layers.console;
                    break;
                case 'F6':
                    e.preventDefault();
                    this.layers.performanceMetrics = !this.layers.performanceMetrics;
                    break;
            }
        });
    }

    /**
     * Toggle debug mode on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        console.log(`Debug Mode: ${this.enabled ? 'ENABLED' : 'DISABLED'}`);
    }

    /**
     * Toggle specific debug layer
     * @param {string} layer - Layer name
     */
    toggleLayer(layer) {
        if (this.layers.hasOwnProperty(layer)) {
            this.layers[layer] = !this.layers[layer];
        }
    }

    /**
     * Update debug metrics
     * @param {Object} gameState - Current game state
     */
    update(gameState) {
        if (!this.enabled) {
            return;
        }

        this.metrics.frameCount++;
        this.metrics.entityCount = this.countEntities(gameState);
    }

    /**
     * Count all entities in game
     * @param {Object} gameState - Current game state
     * @returns {number} Total entity count
     */
    countEntities(gameState) {
        let count = 1; // Player

        if (gameState.level) {
            count += (gameState.level.enemies?.length || 0);
            count += (gameState.level.powerups?.length || 0);
            count += (gameState.level.platforms?.length || 0);
        }

        return count;
    }

    /**
     * Render all debug visualizations
     * @param {Object} gameState - Current game state
     */
    render(gameState) {
        if (!this.enabled) {
            return;
        }

        const ctx = this.ctx;

        // Draw spatial grid
        if (this.layers.spatialGrid && gameState.spatialGrid) {
            this.renderSpatialGrid(gameState.spatialGrid);
        }

        // Draw level bounds
        if (this.layers.levelBounds && gameState.level) {
            this.renderLevelBounds(gameState.level);
        }

        // Draw camera bounds
        if (this.layers.cameraInfo && gameState.camera) {
            this.renderCameraBounds(gameState.camera);
        }

        // Draw collision boxes
        if (this.layers.collisionBoxes) {
            this.renderCollisionBoxes(gameState);
        }

        // Draw velocity vectors
        if (this.layers.velocityVectors) {
            this.renderVelocityVectors(gameState);
        }

        // Draw entity info
        if (this.layers.entityInfo) {
            this.renderEntityInfo(gameState);
        }

        // Draw performance metrics
        if (this.layers.performanceMetrics) {
            this.renderPerformanceMetrics(gameState);
        }

        // Draw input state
        if (this.layers.inputState) {
            this.renderInputState(gameState);
        }

        // Draw particle count
        if (this.layers.particleCount && gameState.particleSystem) {
            this.renderParticleCount(gameState.particleSystem);
        }

        // Draw console
        if (this.layers.console) {
            this.renderConsole();
        }

        // Draw help overlay
        this.renderHelpOverlay();
    }

    /**
     * Render spatial grid visualization
     * @param {Object} grid - Spatial grid object
     */
    renderSpatialGrid(grid) {
        const ctx = this.ctx;
        const camera = this.game.camera;

        ctx.save();
        ctx.strokeStyle = this.colors.grid;
        ctx.lineWidth = 1;

        // Draw vertical lines
        for (let x = 0; x < grid.cols; x++) {
            const worldX = x * grid.cellSize;
            const screenX = worldX - (camera?.x || 0);
            ctx.beginPath();
            ctx.moveTo(screenX, 0);
            ctx.lineTo(screenX, this.canvas.height);
            ctx.stroke();
        }

        // Draw horizontal lines
        for (let y = 0; y < grid.rows; y++) {
            const worldY = y * grid.cellSize;
            ctx.beginPath();
            ctx.moveTo(0, worldY);
            ctx.lineTo(this.canvas.width, worldY);
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * Render level boundaries
     * @param {Object} level - Level object
     */
    renderLevelBounds(level) {
        const ctx = this.ctx;
        const camera = this.game.camera;

        ctx.save();
        ctx.strokeStyle = 'rgba(255, 0, 255, 0.5)';
        ctx.lineWidth = 3;
        ctx.setLineDash([10, 5]);

        // Right boundary
        const boundaryX = level.width - (camera?.x || 0);
        ctx.beginPath();
        ctx.moveTo(boundaryX, 0);
        ctx.lineTo(boundaryX, this.canvas.height);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Render camera bounds
     * @param {Object} camera - Camera object
     */
    renderCameraBounds(camera) {
        const ctx = this.ctx;

        ctx.save();
        ctx.strokeStyle = this.colors.camera;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(0, 0, camera.width, camera.height);
        ctx.restore();
    }

    /**
     * Render collision boxes for all entities
     * @param {Object} gameState - Current game state
     */
    renderCollisionBoxes(gameState) {
        const ctx = this.ctx;
        const camera = this.game.camera;
        const offsetX = camera?.x || 0;

        // Player
        if (gameState.player) {
            ctx.save();
            ctx.strokeStyle = this.colors.player;
            ctx.lineWidth = 2;
            ctx.strokeRect(
                gameState.player.x - offsetX,
                gameState.player.y,
                gameState.player.width,
                gameState.player.height
            );
            ctx.restore();
        }

        // Enemies
        if (gameState.level?.enemies) {
            gameState.level.enemies.forEach(enemy => {
                if (!enemy.active) {
                    return;
                }
                ctx.save();
                ctx.strokeStyle = this.colors.enemy;
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    enemy.x - offsetX,
                    enemy.y,
                    enemy.width,
                    enemy.height
                );
                ctx.restore();
            });
        }

        // Power-ups
        if (gameState.level?.powerups) {
            gameState.level.powerups.forEach(powerup => {
                if (!powerup.active) {
                    return;
                }
                ctx.save();
                ctx.strokeStyle = this.colors.powerup;
                ctx.lineWidth = 2;
                ctx.strokeRect(
                    powerup.x - offsetX,
                    powerup.y,
                    powerup.width,
                    powerup.height
                );
                ctx.restore();
            });
        }

        // Platforms
        if (gameState.level?.platforms) {
            gameState.level.platforms.forEach(platform => {
                ctx.save();
                ctx.fillStyle = this.colors.platform;
                ctx.fillRect(
                    platform.x - offsetX,
                    platform.y,
                    platform.width,
                    platform.height
                );
                ctx.restore();
            });
        }
    }

    /**
     * Render velocity vectors
     * @param {Object} gameState - Current game state
     */
    renderVelocityVectors(gameState) {
        const ctx = this.ctx;
        const camera = this.game.camera;
        const offsetX = camera?.x || 0;

        // Player velocity
        if (gameState.player) {
            const player = gameState.player;
            const centerX = player.x - offsetX + player.width / 2;
            const centerY = player.y + player.height / 2;
            const velScale = 3;

            ctx.save();
            ctx.strokeStyle = this.colors.velocity;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(
                centerX + player.velocityX * velScale,
                centerY + player.velocityY * velScale
            );
            ctx.stroke();

            // Arrow head
            ctx.fillStyle = this.colors.velocity;
            ctx.beginPath();
            ctx.arc(
                centerX + player.velocityX * velScale,
                centerY + player.velocityY * velScale,
                4, 0, Math.PI * 2
            );
            ctx.fill();
            ctx.restore();
        }
    }

    /**
     * Render entity information overlays
     * @param {Object} gameState - Current game state
     */
    renderEntityInfo(gameState) {
        const ctx = this.ctx;
        const camera = this.game.camera;
        const offsetX = camera?.x || 0;

        ctx.save();
        ctx.fillStyle = this.colors.text;
        ctx.font = '10px monospace';

        // Player info
        if (gameState.player) {
            const p = gameState.player;
            const infoX = p.x - offsetX;
            const infoY = p.y - 10;
            ctx.fillText(
                `P: (${Math.round(p.x)}, ${Math.round(p.y)}) V:(${Math.round(p.velocityX)}, ${Math.round(p.velocityY)})`,
                infoX, infoY
            );
        }

        // Enemy info
        if (gameState.level?.enemies) {
            gameState.level.enemies.forEach((enemy, i) => {
                if (!enemy.active) {
                    return;
                }
                const infoX = enemy.x - offsetX;
                const infoY = enemy.y - 10;
                ctx.fillText(
                    `E${i}: ${enemy.type} HP:${enemy.health || 1}`,
                    infoX, infoY
                );
            });
        }

        ctx.restore();
    }

    /**
     * Render performance metrics
     * @param {Object} gameState - Current game state
     */
    renderPerformanceMetrics(gameState) {
        const ctx = this.ctx;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, this.canvas.height - 150, 250, 140);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('Performance Metrics', 20, this.canvas.height - 130);

        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';
        let y = this.canvas.height - 110;

        const metrics = [
            `FPS: ${Math.round(1000 / (this.metrics.updateTime || 16))}`,
            `Update: ${this.metrics.updateTime.toFixed(2)}ms`,
            `Render: ${this.metrics.renderTime.toFixed(2)}ms`,
            `Entities: ${this.metrics.entityCount}`,
            `Particles: ${gameState.particleSystem?.particles.filter(p => p.active).length || 0}`,
            `Memory: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(1) || 'N/A'}MB`
        ];

        metrics.forEach(text => {
            ctx.fillText(text, 20, y);
            y += 20;
        });

        ctx.restore();
    }

    /**
     * Render input state
     * @param {Object} gameState - Current game state
     */
    renderInputState(gameState) {
        const ctx = this.ctx;
        const input = gameState.input || {};

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.canvas.width - 210, 10, 200, 120);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('Input State', this.canvas.width - 200, 30);

        ctx.font = '12px monospace';
        let y = 50;

        const keys = ['left', 'right', 'jump', 'run', 'fire', 'pause'];
        keys.forEach(key => {
            const active = input[key] || false;
            ctx.fillStyle = active ? '#4CAF50' : '#666';
            ctx.fillText(`${key.toUpperCase()}: ${active ? 'ON' : 'OFF'}`, this.canvas.width - 200, y);
            y += 18;
        });

        ctx.restore();
    }

    /**
     * Render particle count
     * @param {Object} particleSystem - Particle system object
     */
    renderParticleCount(particleSystem) {
        const ctx = this.ctx;
        const activeParticles = particleSystem.particles.filter(p => p.active).length;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(this.canvas.width - 210, 140, 200, 40);

        ctx.fillStyle = '#FFD700';
        ctx.font = '12px monospace';
        ctx.fillText(`Particles: ${activeParticles}/${particleSystem.particles.length}`,
            this.canvas.width - 200, 165);

        ctx.restore();
    }

    /**
     * Render debug console
     */
    renderConsole() {
        const ctx = this.ctx;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
        ctx.fillRect(0, this.canvas.height - 200, this.canvas.width, 200);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 14px monospace';
        ctx.fillText('Debug Console (F5 to toggle)', 10, this.canvas.height - 180);

        ctx.fillStyle = 'white';
        ctx.font = '12px monospace';

        // Show last 8 console entries
        const startIndex = Math.max(0, this.console.history.length - 8);
        const entries = this.console.history.slice(startIndex);

        let y = this.canvas.height - 160;
        entries.forEach(entry => {
            ctx.fillText(`> ${entry}`, 10, y);
            y += 18;
        });

        ctx.restore();
    }

    /**
     * Render help overlay
     */
    renderHelpOverlay() {
        const ctx = this.ctx;

        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(10, 10, 220, 140);

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('Debug Shortcuts', 20, 30);

        ctx.fillStyle = 'white';
        ctx.font = '11px monospace';

        const shortcuts = [
            'F1: Collision Boxes',
            'F2: Velocity Vectors',
            'F3: Spatial Grid',
            'F4: Entity Info',
            'F5: Console',
            'F6: Performance',
            'F12: Toggle Debug'
        ];

        let y = 50;
        shortcuts.forEach(text => {
            ctx.fillText(text, 20, y);
            y += 16;
        });

        ctx.restore();
    }

    /**
     * Log message to debug console
     * @param {string} message - Message to log
     */
    log(message) {
        this.console.history.push(message);
        if (this.console.history.length > this.console.maxHistory) {
            this.console.history.shift();
        }
    }

    /**
     * Execute debug command
     * @param {string} command - Command to execute
     */
    executeCommand(command) {
        this.log(command);

        const parts = command.split(' ');
        const cmd = parts[0].toLowerCase();

        switch (cmd) {
            case 'help':
                this.log('Available commands: help, clear, toggle <layer>, reset');
                break;
            case 'clear':
                this.console.history = [];
                break;
            case 'toggle':
                if (parts[1] && this.layers.hasOwnProperty(parts[1])) {
                    this.toggleLayer(parts[1]);
                    this.log(`Toggled ${parts[1]}`);
                } else {
                    this.log('Invalid layer name');
                }
                break;
            case 'reset':
                Object.keys(this.layers).forEach(key => {
                    this.layers[key] = false;
                });
                this.log('All layers disabled');
                break;
            default:
                this.log(`Unknown command: ${cmd}`);
        }
    }

    /**
     * Set update time metric
     * @param {number} time - Update time in ms
     */
    setUpdateTime(time) {
        this.metrics.updateTime = time;
    }

    /**
     * Set render time metric
     * @param {number} time - Render time in ms
     */
    setRenderTime(time) {
        this.metrics.renderTime = time;
    }
}

// Global instance
let debugMode;
