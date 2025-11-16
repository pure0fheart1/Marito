/**
 * Game Enhancements Bundle
 * Includes: Parallax Backgrounds, Game State Persistence, Tutorial System, Combo System
 */

// ===== PARALLAX BACKGROUND SYSTEM =====

class ParallaxBackground {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.layers = [];
        this.currentTheme = 'overworld';
    }

    /**
     * Set background theme
     * @param {string} theme - Theme name
     */
    setTheme(theme) {
        this.currentTheme = theme;
        this.layers = this.generateLayers(theme);
    }

    /**
     * Generate parallax layers for theme
     * @param {string} theme - Theme name
     * @returns {Array} Layer objects
     */
    generateLayers(theme) {
        const themes = {
            overworld: [
                { type: 'sky', color: '#5C94FC', speed: 0.1, pattern: 'clouds' },
                { type: 'mountains', color: '#4A7C59', speed: 0.3, pattern: 'peaks' },
                { type: 'hills', color: '#7AB55C', speed: 0.5, pattern: 'rolling' }
            ],
            underground: [
                { type: 'cavern', color: '#1a1a1a', speed: 0.2, pattern: 'rocks' },
                { type: 'stalactites', color: '#2d2d2d', speed: 0.4, pattern: 'hanging' }
            ],
            underwater: [
                { type: 'deep', color: '#000080', speed: 0.1, pattern: 'bubbles' },
                { type: 'coral', color: '#4682B4', speed: 0.3, pattern: 'seaweed' },
                { type: 'reef', color: '#5F9EA0', speed: 0.5, pattern: 'coral' }
            ],
            sky: [
                { type: 'distant', color: '#87CEEB', speed: 0.05, pattern: 'clouds' },
                { type: 'near', color: '#B0E0E6', speed: 0.2, pattern: 'clouds' },
                { type: 'close', color: '#E0F6FF', speed: 0.4, pattern: 'clouds' }
            ],
            desert: [
                { type: 'dunes', color: '#EDC9AF', speed: 0.2, pattern: 'sand' },
                { type: 'pyramids', color: '#D2B48C', speed: 0.4, pattern: 'structures' }
            ],
            castle: [
                { type: 'walls', color: '#4A4A4A', speed: 0.3, pattern: 'bricks' },
                { type: 'towers', color: '#696969', speed: 0.5, pattern: 'towers' }
            ]
        };

        return themes[theme] || themes.overworld;
    }

    /**
     * Update parallax layers
     * @param {number} cameraX - Camera X position
     */
    update(cameraX) {
        this.layers.forEach(layer => {
            layer.offset = (cameraX * layer.speed) % this.canvas.width;
        });
    }

    /**
     * Render parallax layers
     */
    render() {
        this.layers.forEach((layer, index) => {
            this.renderLayer(layer, index);
        });
    }

    /**
     * Render individual layer
     * @param {Object} layer - Layer object
     * @param {number} index - Layer index
     */
    renderLayer(layer, index) {
        const ctx = this.ctx;
        const height = this.canvas.height / (this.layers.length + 1);
        const y = height * index;

        ctx.save();
        ctx.fillStyle = layer.color;
        ctx.fillRect(0, y, this.canvas.width, height);

        // Draw pattern
        this.drawPattern(layer, y, height);

        ctx.restore();
    }

    /**
     * Draw pattern on layer
     * @param {Object} layer - Layer object
     * @param {number} y - Y position
     * @param {number} height - Layer height
     */
    drawPattern(layer, y, height) {
        const ctx = this.ctx;
        const offset = layer.offset || 0;

        if (layer.pattern === 'clouds') {
            for (let x = -offset; x < this.canvas.width + 100; x += 200) {
                this.drawCloud(x, y + height / 2, 50);
            }
        } else if (layer.pattern === 'peaks') {
            ctx.beginPath();
            for (let x = -offset; x < this.canvas.width + 100; x += 100) {
                ctx.lineTo(x, y + height);
                ctx.lineTo(x + 50, y + height / 2);
            }
            ctx.lineTo(this.canvas.width, y + height);
            ctx.fillStyle = '#3A5C49';
            ctx.fill();
        }
    }

    /**
     * Draw cloud shape
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} size - Cloud size
     */
    drawCloud(x, y, size) {
        const ctx = this.ctx;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.6, 0, Math.PI * 2);
        ctx.arc(x + size * 0.5, y, size * 0.8, 0, Math.PI * 2);
        ctx.arc(x + size, y, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ===== GAME STATE PERSISTENCE SYSTEM =====

class GameStatePersistence {
    constructor(storage) {
        this.storage = storage;
        this.autoSaveInterval = 30000; // 30 seconds
        this.autoSaveTimer = null;
        this.checkpoints = [];
    }

    /**
     * Enable auto-save
     */
    enableAutoSave() {
        this.autoSaveTimer = setInterval(() => {
            this.quickSave();
        }, this.autoSaveInterval);
    }

    /**
     * Disable auto-save
     */
    disableAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Quick save current state
     */
    quickSave() {
        if (!game) {
            return false;
        }

        const state = {
            level: game.currentLevel,
            score: game.score,
            lives: game.lives,
            coins: game.coins,
            playerState: game.player ? {
                powerupState: game.player.powerupState,
                x: game.player.x,
                y: game.player.y
            } : null,
            time: game.timeRemaining,
            timestamp: Date.now(),
            checkpoint: this.getCurrentCheckpoint()
        };

        return this.storage.saveGame(state);
    }

    /**
     * Load saved game
     * @returns {Object|null} Saved game state
     */
    loadSave() {
        return this.storage.loadGame();
    }

    /**
     * Create checkpoint
     * @param {number} x - X position
     * @param {number} level - Level number
     */
    createCheckpoint(x, level) {
        const checkpoint = {
            x: x,
            level: level,
            timestamp: Date.now()
        };

        this.checkpoints.push(checkpoint);

        if (this.checkpoints.length > 3) {
            this.checkpoints.shift();
        }

        return checkpoint;
    }

    /**
     * Get current checkpoint
     * @returns {Object|null} Latest checkpoint
     */
    getCurrentCheckpoint() {
        return this.checkpoints[this.checkpoints.length - 1] || null;
    }

    /**
     * Restore from checkpoint
     */
    restoreCheckpoint() {
        const checkpoint = this.getCurrentCheckpoint();
        if (checkpoint && game.player) {
            game.player.x = checkpoint.x;
            game.currentLevel = checkpoint.level;
            return true;
        }
        return false;
    }
}

// ===== TUTORIAL SYSTEM =====

class TutorialSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.active = false;
        this.currentStep = 0;
        this.completed = false;
        this.storage = new StorageManager();

        this.steps = [
            {
                message: 'Welcome to Marito! Use ← → Arrow Keys to move',
                duration: 4000,
                trigger: 'start',
                position: 'center'
            },
            {
                message: 'Press SPACE or ↑ to Jump!',
                duration: 3000,
                trigger: 'move',
                position: 'center'
            },
            {
                message: 'Collect coins for points! 🪙',
                duration: 3000,
                trigger: 'jump',
                position: 'top'
            },
            {
                message: 'Stomp on enemies to defeat them! 👟',
                duration: 3000,
                trigger: 'coin',
                position: 'top'
            },
            {
                message: 'Power-ups make you stronger! 🍄',
                duration: 3000,
                trigger: 'enemy',
                position: 'top'
            },
            {
                message: 'Press P to Pause. Good luck! 🎮',
                duration: 4000,
                trigger: 'powerup',
                position: 'bottom'
            }
        ];

        this.loadProgress();
    }

    /**
     * Load tutorial progress
     */
    loadProgress() {
        if (this.storage.isAvailable) {
            const completed = localStorage.getItem('marito_tutorial_completed');
            this.completed = completed === 'true';
        }
    }

    /**
     * Start tutorial
     */
    start() {
        if (this.completed) {
            return;
        }

        this.active = true;
        this.currentStep = 0;
        this.showStep(0);
    }

    /**
     * Show tutorial step
     * @param {number} index - Step index
     */
    showStep(index) {
        if (index >= this.steps.length) {
            this.complete();
            return;
        }

        const step = this.steps[index];
        this.displayMessage(step.message, step.duration, step.position);
    }

    /**
     * Display tutorial message
     * @param {string} message - Message text
     * @param {number} duration - Display duration
     * @param {string} position - Position on screen
     */
    displayMessage(message, duration, position) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tutorial-tooltip';
        tooltip.textContent = message;
        tooltip.style.position = 'fixed';
        tooltip.style.zIndex = '1000';
        tooltip.style.background = 'rgba(0, 0, 0, 0.9)';
        tooltip.style.color = '#FFD700';
        tooltip.style.padding = '15px 25px';
        tooltip.style.borderRadius = '10px';
        tooltip.style.border = '3px solid #FFD700';
        tooltip.style.fontSize = '18px';
        tooltip.style.fontWeight = 'bold';
        tooltip.style.textAlign = 'center';
        tooltip.style.maxWidth = '400px';
        tooltip.style.animation = 'fadeIn 0.3s ease-in';

        if (position === 'center') {
            tooltip.style.top = '50%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translate(-50%, -50%)';
        } else if (position === 'top') {
            tooltip.style.top = '10%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
        } else if (position === 'bottom') {
            tooltip.style.bottom = '10%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
        }

        document.body.appendChild(tooltip);

        setTimeout(() => {
            tooltip.remove();
        }, duration);
    }

    /**
     * Trigger next tutorial step
     * @param {string} trigger - Trigger type
     */
    trigger(triggerType) {
        if (!this.active || this.completed) {
            return;
        }

        const currentTrigger = this.steps[this.currentStep]?.trigger;

        if (triggerType === currentTrigger) {
            this.currentStep++;
            this.showStep(this.currentStep);
        }
    }

    /**
     * Complete tutorial
     */
    complete() {
        this.active = false;
        this.completed = true;

        if (this.storage.isAvailable) {
            localStorage.setItem('marito_tutorial_completed', 'true');
        }

        this.displayMessage('Tutorial Complete! Have fun! 🎉', 3000, 'center');
    }

    /**
     * Reset tutorial
     */
    reset() {
        this.completed = false;
        this.currentStep = 0;
        this.active = false;

        if (this.storage.isAvailable) {
            localStorage.removeItem('marito_tutorial_completed');
        }
    }
}

// ===== COMBO SYSTEM =====

class ComboSystem {
    constructor() {
        this.comboCount = 0;
        this.comboMultiplier = 1;
        this.comboTimer = null;
        this.comboTimeout = 3000; // 3 seconds to continue combo
        this.maxCombo = 0;
    }

    /**
     * Add to combo
     */
    addCombo() {
        this.comboCount++;

        if (this.comboCount > this.maxCombo) {
            this.maxCombo = this.comboCount;
        }

        // Calculate multiplier
        if (this.comboCount >= 10) {
            this.comboMultiplier = 4;
        } else if (this.comboCount >= 5) {
            this.comboMultiplier = 2;
        } else if (this.comboCount >= 3) {
            this.comboMultiplier = 1.5;
        } else {
            this.comboMultiplier = 1;
        }

        // Reset timer
        this.resetTimer();

        // Show combo notification
        this.showComboNotification();

        return {
            count: this.comboCount,
            multiplier: this.comboMultiplier
        };
    }

    /**
     * Reset combo timer
     */
    resetTimer() {
        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
        }

        this.comboTimer = setTimeout(() => {
            this.breakCombo();
        }, this.comboTimeout);
    }

    /**
     * Break combo
     */
    breakCombo() {
        if (this.comboCount > 0) {
            this.showComboBreak();
        }

        this.comboCount = 0;
        this.comboMultiplier = 1;

        if (this.comboTimer) {
            clearTimeout(this.comboTimer);
            this.comboTimer = null;
        }
    }

    /**
     * Show combo notification
     */
    showComboNotification() {
        const notification = document.createElement('div');
        notification.className = 'combo-notification';
        notification.textContent = `${this.comboCount}x COMBO!`;

        if (this.comboCount >= 10) {
            notification.textContent = `${this.comboCount}x ULTRA COMBO! 🔥`;
            notification.style.color = '#FF4500';
        } else if (this.comboCount >= 5) {
            notification.textContent = `${this.comboCount}x SUPER COMBO! ⭐`;
            notification.style.color = '#FFD700';
        }

        notification.style.position = 'fixed';
        notification.style.top = '15%';
        notification.style.right = '20px';
        notification.style.fontSize = '24px';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '1000';
        notification.style.animation = 'bounce 0.5s ease-in-out';
        notification.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 1500);
    }

    /**
     * Show combo break notification
     */
    showComboBreak() {
        if (this.comboCount < 3) {
            return;
        }

        const notification = document.createElement('div');
        notification.className = 'combo-break';
        notification.textContent = 'Combo Broken!';
        notification.style.position = 'fixed';
        notification.style.top = '15%';
        notification.style.right = '20px';
        notification.style.fontSize = '18px';
        notification.style.fontWeight = 'bold';
        notification.style.color = '#FF6B6B';
        notification.style.zIndex = '1000';
        notification.style.animation = 'fadeIn 0.3s ease-in';
        notification.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';

        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 1500);
    }

    /**
     * Get current combo info
     * @returns {Object} Combo information
     */
    getComboInfo() {
        return {
            count: this.comboCount,
            multiplier: this.comboMultiplier,
            maxCombo: this.maxCombo
        };
    }
}

// Global instances
let parallaxBackground;
let gameStatePersistence;
let tutorialSystem;
let comboSystem;
