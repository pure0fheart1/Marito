/**
 * Storage Manager for Marito Game
 * Handles localStorage operations for save games, high scores, and settings
 */

class StorageManager {
    constructor() {
        this.isAvailable = this.checkStorageAvailability();
    }

    /**
     * Check if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    checkStorageAvailability() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.warn('localStorage is not available:', e);
            return false;
        }
    }

    /**
     * Save high score to localStorage
     * @param {number} score - The score to save
     * @returns {boolean} True if save was successful
     */
    saveHighScore(score) {
        if (!this.isAvailable) return false;

        try {
            const currentHighScore = this.getHighScore();
            if (score > currentHighScore) {
                localStorage.setItem(CONFIG.STORAGE.HIGH_SCORE, JSON.stringify(score));
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error saving high score:', e);
            return false;
        }
    }

    /**
     * Get high score from localStorage
     * @returns {number} The high score, or 0 if none exists
     */
    getHighScore() {
        if (!this.isAvailable) return 0;

        try {
            const score = localStorage.getItem(CONFIG.STORAGE.HIGH_SCORE);
            return score ? JSON.parse(score) : 0;
        } catch (e) {
            console.error('Error loading high score:', e);
            return 0;
        }
    }

    /**
     * Save game state to localStorage
     * @param {Object} gameState - The game state to save
     * @returns {boolean} True if save was successful
     */
    saveGame(gameState) {
        if (!this.isAvailable) return false;

        try {
            const saveData = {
                level: gameState.currentLevel,
                score: gameState.score,
                lives: gameState.lives,
                coins: gameState.coins,
                playerState: gameState.playerState,
                timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.STORAGE.SAVE_GAME, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Error saving game:', e);
            return false;
        }
    }

    /**
     * Load game state from localStorage
     * @returns {Object|null} The saved game state, or null if none exists
     */
    loadGame() {
        if (!this.isAvailable) return null;

        try {
            const saveData = localStorage.getItem(CONFIG.STORAGE.SAVE_GAME);
            if (saveData) {
                const parsed = JSON.parse(saveData);
                // Check if save is not older than 30 days
                const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
                if (Date.now() - parsed.timestamp < thirtyDaysMs) {
                    return parsed;
                }
            }
            return null;
        } catch (e) {
            console.error('Error loading game:', e);
            return null;
        }
    }

    /**
     * Delete saved game
     * @returns {boolean} True if deletion was successful
     */
    deleteSave() {
        if (!this.isAvailable) return false;

        try {
            localStorage.removeItem(CONFIG.STORAGE.SAVE_GAME);
            return true;
        } catch (e) {
            console.error('Error deleting save:', e);
            return false;
        }
    }

    /**
     * Save completed levels
     * @param {number} level - The level number that was completed
     * @returns {boolean} True if save was successful
     */
    saveCompletedLevel(level) {
        if (!this.isAvailable) return false;

        try {
            const completed = this.getCompletedLevels();
            if (!completed.includes(level)) {
                completed.push(level);
                completed.sort((a, b) => a - b);
                localStorage.setItem(CONFIG.STORAGE.COMPLETED_LEVELS, JSON.stringify(completed));
            }
            return true;
        } catch (e) {
            console.error('Error saving completed level:', e);
            return false;
        }
    }

    /**
     * Get list of completed levels
     * @returns {Array<number>} Array of completed level numbers
     */
    getCompletedLevels() {
        if (!this.isAvailable) return [];

        try {
            const levels = localStorage.getItem(CONFIG.STORAGE.COMPLETED_LEVELS);
            return levels ? JSON.parse(levels) : [];
        } catch (e) {
            console.error('Error loading completed levels:', e);
            return [];
        }
    }

    /**
     * Save game settings
     * @param {Object} settings - The settings to save
     * @returns {boolean} True if save was successful
     */
    saveSettings(settings) {
        if (!this.isAvailable) return false;

        try {
            localStorage.setItem(CONFIG.STORAGE.SETTINGS, JSON.stringify(settings));
            return true;
        } catch (e) {
            console.error('Error saving settings:', e);
            return false;
        }
    }

    /**
     * Load game settings
     * @returns {Object} The saved settings, or default settings if none exist
     */
    loadSettings() {
        if (!this.isAvailable) {
            return this.getDefaultSettings();
        }

        try {
            const settings = localStorage.getItem(CONFIG.STORAGE.SETTINGS);
            return settings ? JSON.parse(settings) : this.getDefaultSettings();
        } catch (e) {
            console.error('Error loading settings:', e);
            return this.getDefaultSettings();
        }
    }

    /**
     * Get default settings
     * @returns {Object} Default settings object
     */
    getDefaultSettings() {
        return {
            musicVolume: CONFIG.AUDIO.MUSIC_VOLUME,
            sfxVolume: CONFIG.AUDIO.SFX_VOLUME,
            muted: false,
            showFPS: false,
            difficulty: 'normal'
        };
    }

    /**
     * Clear all game data from localStorage
     * @returns {boolean} True if clear was successful
     */
    clearAllData() {
        if (!this.isAvailable) return false;

        try {
            localStorage.removeItem(CONFIG.STORAGE.HIGH_SCORE);
            localStorage.removeItem(CONFIG.STORAGE.SAVE_GAME);
            localStorage.removeItem(CONFIG.STORAGE.COMPLETED_LEVELS);
            localStorage.removeItem(CONFIG.STORAGE.SETTINGS);
            return true;
        } catch (e) {
            console.error('Error clearing data:', e);
            return false;
        }
    }

    /**
     * Get all stored data for export
     * @returns {Object} All stored game data
     */
    exportData() {
        if (!this.isAvailable) return null;

        return {
            highScore: this.getHighScore(),
            completedLevels: this.getCompletedLevels(),
            settings: this.loadSettings(),
            savedGame: this.loadGame()
        };
    }

    /**
     * Import data from backup
     * @param {Object} data - The data to import
     * @returns {boolean} True if import was successful
     */
    importData(data) {
        if (!this.isAvailable || !data) return false;

        try {
            if (data.highScore !== undefined) {
                localStorage.setItem(CONFIG.STORAGE.HIGH_SCORE, JSON.stringify(data.highScore));
            }
            if (data.completedLevels) {
                localStorage.setItem(CONFIG.STORAGE.COMPLETED_LEVELS, JSON.stringify(data.completedLevels));
            }
            if (data.settings) {
                localStorage.setItem(CONFIG.STORAGE.SETTINGS, JSON.stringify(data.settings));
            }
            if (data.savedGame) {
                localStorage.setItem(CONFIG.STORAGE.SAVE_GAME, JSON.stringify(data.savedGame));
            }
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }
}
