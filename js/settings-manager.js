/**
 * Settings Manager
 * Handles game settings including audio, controls, graphics, and gameplay options
 */

class SettingsManager {
    constructor() {
        this.storage = new StorageManager();

        // Default settings
        this.defaults = {
            audio: {
                masterVolume: CONFIG.AUDIO.MASTER_VOLUME,
                musicVolume: CONFIG.AUDIO.MUSIC_VOLUME,
                sfxVolume: CONFIG.AUDIO.SFX_VOLUME,
                muted: false
            },
            graphics: {
                showFPS: CONFIG.DEBUG.SHOW_FPS,
                particleQuality: 'high', // low, medium, high
                screenShake: true,
                smoothCamera: true
            },
            gameplay: {
                difficulty: 'normal', // easy, normal, hard, expert
                lives: CONFIG.PLAYER.MAX_LIVES,
                timeLimit: true,
                autoSave: true
            },
            controls: {
                leftKeys: CONFIG.INPUT.LEFT,
                rightKeys: CONFIG.INPUT.RIGHT,
                jumpKeys: CONFIG.INPUT.JUMP,
                runKeys: CONFIG.INPUT.RUN,
                fireKeys: CONFIG.INPUT.FIRE,
                pauseKeys: CONFIG.INPUT.PAUSE,
                muteKeys: CONFIG.INPUT.MUTE
            },
            accessibility: {
                colorBlindMode: false,
                highContrast: false,
                reducedMotion: false,
                screenReader: false
            }
        };

        // Load saved settings or use defaults
        this.settings = this.loadSettings();

        // Apply settings
        this.apply();
    }

    /**
     * Load settings from storage
     * @returns {Object} Settings object
     */
    loadSettings() {
        const saved = this.storage.loadSettings();
        return this.mergeSettings(this.defaults, saved);
    }

    /**
     * Merge default and saved settings
     * @param {Object} defaults - Default settings
     * @param {Object} saved - Saved settings
     * @returns {Object} Merged settings
     */
    mergeSettings(defaults, saved) {
        const merged = JSON.parse(JSON.stringify(defaults));

        if (!saved) {
            return merged;
        }

        // Deep merge
        for (const category in saved) {
            if (merged[category]) {
                merged[category] = { ...merged[category], ...saved[category] };
            }
        }

        return merged;
    }

    /**
     * Save current settings
     * @returns {boolean} Success status
     */
    saveSettings() {
        return this.storage.saveSettings(this.settings);
    }

    /**
     * Get a setting value
     * @param {string} category - Setting category
     * @param {string} key - Setting key
     * @returns {*} Setting value
     */
    get(category, key) {
        if (this.settings[category]) {
            return this.settings[category][key];
        }
        return null;
    }

    /**
     * Set a setting value
     * @param {string} category - Setting category
     * @param {string} key - Setting key
     * @param {*} value - New value
     */
    set(category, key, value) {
        if (this.settings[category]) {
            this.settings[category][key] = value;
            this.saveSettings();
            this.apply();
        }
    }

    /**
     * Apply all settings to the game
     */
    apply() {
        this.applyAudioSettings();
        this.applyGraphicsSettings();
        this.applyGameplaySettings();
    }

    /**
     * Apply audio settings
     */
    applyAudioSettings() {
        // This would integrate with the SoundManager
        // For now, we just store the values
        if (window.soundManager) {
            soundManager.setMasterVolume(this.settings.audio.masterVolume);
            soundManager.setMusicVolume(this.settings.audio.musicVolume);
            soundManager.setSFXVolume(this.settings.audio.sfxVolume);
            soundManager.setMuted(this.settings.audio.muted);
        }
    }

    /**
     * Apply graphics settings
     */
    applyGraphicsSettings() {
        // Apply FPS display
        if (window.performanceMonitor) {
            performanceMonitor.enabled = this.settings.graphics.showFPS;
        }

        // Apply particle quality
        if (window.particleSystem) {
            const quality = this.settings.graphics.particleQuality;
            switch (quality) {
                case 'low':
                    particleSystem.poolSize = 50;
                    break;
                case 'medium':
                    particleSystem.poolSize = 100;
                    break;
                case 'high':
                    particleSystem.poolSize = 200;
                    break;
            }
        }
    }

    /**
     * Apply gameplay settings
     */
    applyGameplaySettings() {
        // Apply difficulty multipliers
        const difficulty = this.settings.gameplay.difficulty;
        const multipliers = this.getDifficultyMultipliers(difficulty);

        // These would be applied when spawning enemies/adjusting gameplay
        this.difficultyMultipliers = multipliers;
    }

    /**
     * Get difficulty multipliers
     * @param {string} difficulty - Difficulty level
     * @returns {Object} Multipliers
     */
    getDifficultyMultipliers(difficulty) {
        const multipliers = {
            easy: {
                enemySpeed: 0.7,
                enemyDamage: 0.5,
                playerHealth: 1.5,
                itemSpawnRate: 1.5
            },
            normal: {
                enemySpeed: 1.0,
                enemyDamage: 1.0,
                playerHealth: 1.0,
                itemSpawnRate: 1.0
            },
            hard: {
                enemySpeed: 1.3,
                enemyDamage: 1.5,
                playerHealth: 0.75,
                itemSpawnRate: 0.7
            },
            expert: {
                enemySpeed: 1.6,
                enemyDamage: 2.0,
                playerHealth: 0.5,
                itemSpawnRate: 0.5
            }
        };

        return multipliers[difficulty] || multipliers.normal;
    }

    /**
     * Toggle a boolean setting
     * @param {string} category - Setting category
     * @param {string} key - Setting key
     * @returns {boolean} New value
     */
    toggle(category, key) {
        if (this.settings[category] && typeof this.settings[category][key] === 'boolean') {
            this.settings[category][key] = !this.settings[category][key];
            this.saveSettings();
            this.apply();
            return this.settings[category][key];
        }
        return false;
    }

    /**
     * Reset settings to defaults
     * @param {string} [category] - Category to reset (all if not specified)
     */
    reset(category = null) {
        if (category && this.defaults[category]) {
            this.settings[category] = JSON.parse(JSON.stringify(this.defaults[category]));
        } else {
            this.settings = JSON.parse(JSON.stringify(this.defaults));
        }

        this.saveSettings();
        this.apply();
    }

    /**
     * Export settings as JSON
     * @returns {string} JSON string
     */
    export() {
        return JSON.stringify(this.settings, null, 2);
    }

    /**
     * Import settings from JSON
     * @param {string} json - JSON string
     * @returns {boolean} Success status
     */
    import(json) {
        try {
            const imported = JSON.parse(json);
            this.settings = this.mergeSettings(this.defaults, imported);
            this.saveSettings();
            this.apply();
            return true;
        } catch (error) {
            errorHandler.logError('Settings', error);
            return false;
        }
    }

    /**
     * Create settings UI
     * @returns {HTMLElement} Settings menu element
     */
    createUI() {
        const container = document.createElement('div');
        container.id = 'settingsMenu';
        container.className = 'settings-menu';
        container.innerHTML = `
            <div class="settings-content">
                <h2>⚙️ Settings</h2>

                <div class="settings-tabs">
                    <button class="tab-button active" data-tab="audio">🔊 Audio</button>
                    <button class="tab-button" data-tab="graphics">🎨 Graphics</button>
                    <button class="tab-button" data-tab="gameplay">🎮 Gameplay</button>
                    <button class="tab-button" data-tab="controls">⌨️ Controls</button>
                </div>

                <div class="settings-panel">
                    ${this.createAudioPanel()}
                    ${this.createGraphicsPanel()}
                    ${this.createGameplayPanel()}
                    ${this.createControlsPanel()}
                </div>

                <div class="settings-actions">
                    <button class="btn-reset" onclick="settingsManager.reset()">Reset All</button>
                    <button class="btn-close" onclick="settingsManager.closeUI()">Close</button>
                </div>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    /**
     * Create audio settings panel
     * @returns {string} HTML string
     */
    createAudioPanel() {
        return `
            <div class="tab-content active" data-tab="audio">
                <div class="setting-group">
                    <label>Master Volume</label>
                    <input type="range" min="0" max="100" value="${this.settings.audio.masterVolume * 100}"
                           data-setting="audio.masterVolume" data-type="slider">
                    <span class="value">${Math.round(this.settings.audio.masterVolume * 100)}%</span>
                </div>

                <div class="setting-group">
                    <label>Music Volume</label>
                    <input type="range" min="0" max="100" value="${this.settings.audio.musicVolume * 100}"
                           data-setting="audio.musicVolume" data-type="slider">
                    <span class="value">${Math.round(this.settings.audio.musicVolume * 100)}%</span>
                </div>

                <div class="setting-group">
                    <label>SFX Volume</label>
                    <input type="range" min="0" max="100" value="${this.settings.audio.sfxVolume * 100}"
                           data-setting="audio.sfxVolume" data-type="slider">
                    <span class="value">${Math.round(this.settings.audio.sfxVolume * 100)}%</span>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" ${this.settings.audio.muted ? 'checked' : ''}
                               data-setting="audio.muted" data-type="checkbox">
                        Mute All Audio
                    </label>
                </div>
            </div>
        `;
    }

    /**
     * Create graphics settings panel
     * @returns {string} HTML string
     */
    createGraphicsPanel() {
        return `
            <div class="tab-content" data-tab="graphics">
                <div class="setting-group">
                    <label>
                        <input type="checkbox" ${this.settings.graphics.showFPS ? 'checked' : ''}
                               data-setting="graphics.showFPS" data-type="checkbox">
                        Show FPS Counter
                    </label>
                </div>

                <div class="setting-group">
                    <label>Particle Quality</label>
                    <select data-setting="graphics.particleQuality" data-type="select">
                        <option value="low" ${this.settings.graphics.particleQuality === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${this.settings.graphics.particleQuality === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${this.settings.graphics.particleQuality === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" ${this.settings.graphics.screenShake ? 'checked' : ''}
                               data-setting="graphics.screenShake" data-type="checkbox">
                        Screen Shake
                    </label>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" ${this.settings.graphics.smoothCamera ? 'checked' : ''}
                               data-setting="graphics.smoothCamera" data-type="checkbox">
                        Smooth Camera
                    </label>
                </div>
            </div>
        `;
    }

    /**
     * Create gameplay settings panel
     * @returns {string} HTML string
     */
    createGameplayPanel() {
        return `
            <div class="tab-content" data-tab="gameplay">
                <div class="setting-group">
                    <label>Difficulty</label>
                    <select data-setting="gameplay.difficulty" data-type="select">
                        <option value="easy" ${this.settings.gameplay.difficulty === 'easy' ? 'selected' : ''}>Easy</option>
                        <option value="normal" ${this.settings.gameplay.difficulty === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="hard" ${this.settings.gameplay.difficulty === 'hard' ? 'selected' : ''}>Hard</option>
                        <option value="expert" ${this.settings.gameplay.difficulty === 'expert' ? 'selected' : ''}>Expert</option>
                    </select>
                </div>

                <div class="setting-group">
                    <label>Starting Lives</label>
                    <input type="number" min="1" max="99" value="${this.settings.gameplay.lives}"
                           data-setting="gameplay.lives" data-type="number">
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" ${this.settings.gameplay.timeLimit ? 'checked' : ''}
                               data-setting="gameplay.timeLimit" data-type="checkbox">
                        Time Limit Enabled
                    </label>
                </div>

                <div class="setting-group">
                    <label>
                        <input type="checkbox" ${this.settings.gameplay.autoSave ? 'checked' : ''}
                               data-setting="gameplay.autoSave" data-type="checkbox">
                        Auto-Save Progress
                    </label>
                </div>
            </div>
        `;
    }

    /**
     * Create controls settings panel
     * @returns {string} HTML string
     */
    createControlsPanel() {
        return `
            <div class="tab-content" data-tab="controls">
                <div class="setting-group">
                    <p><strong>Keyboard Controls</strong></p>
                    <p>Left: Arrow Left, A</p>
                    <p>Right: Arrow Right, D</p>
                    <p>Jump: Space, W, Arrow Up</p>
                    <p>Run: Shift, X</p>
                    <p>Fire: Z, Ctrl</p>
                    <p>Pause: Escape, P</p>
                    <p>Mute: M</p>
                </div>
                <div class="setting-group">
                    <button class="btn-secondary">Customize Controls (Coming Soon)</button>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to settings UI
     * @param {HTMLElement} container - Settings container
     */
    attachEventListeners(container) {
        // Tab switching
        const tabButtons = container.querySelectorAll('.tab-button');
        const tabContents = container.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.dataset.tab;

                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                button.classList.add('active');
                container.querySelector(`.tab-content[data-tab="${tab}"]`).classList.add('active');
            });
        });

        // Setting changes
        container.querySelectorAll('[data-setting]').forEach(input => {
            const settingPath = input.dataset.setting.split('.');
            const type = input.dataset.type;

            input.addEventListener('change', () => {
                let value = input.value;

                if (type === 'checkbox') {
                    value = input.checked;
                } else if (type === 'slider') {
                    value = parseFloat(input.value) / 100;
                    // Update display
                    const valueSpan = input.nextElementSibling;
                    if (valueSpan) {
                        valueSpan.textContent = Math.round(value * 100) + '%';
                    }
                } else if (type === 'number') {
                    value = parseInt(input.value);
                }

                this.set(settingPath[0], settingPath[1], value);
            });
        });
    }

    /**
     * Show settings UI
     */
    showUI() {
        let menu = document.getElementById('settingsMenu');

        if (!menu) {
            menu = this.createUI();
            document.body.appendChild(menu);
        }

        menu.style.display = 'flex';
    }

    /**
     * Close settings UI
     */
    closeUI() {
        const menu = document.getElementById('settingsMenu');
        if (menu) {
            menu.style.display = 'none';
        }
    }
}

// Global instance
let settingsManager;
