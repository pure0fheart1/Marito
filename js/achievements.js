/**
 * Achievements and Trophy System
 * Tracks player accomplishments and unlockables
 */

class AchievementsManager {
    constructor() {
        this.storage = new StorageManager();

        // Define all achievements
        this.achievements = {
            // Level Completion Achievements
            first_steps: {
                id: 'first_steps',
                name: 'First Steps',
                description: 'Complete Level 1-1',
                icon: '🎯',
                category: 'progression',
                condition: (stats) => stats.levelsCompleted.includes(1),
                points: 10
            },
            world_traveler: {
                id: 'world_traveler',
                name: 'World Traveler',
                description: 'Complete World 1 (Levels 1-4)',
                icon: '🌍',
                category: 'progression',
                condition: (stats) => [1, 2, 3, 4].every(lvl => stats.levelsCompleted.includes(lvl)),
                points: 50
            },
            champion: {
                id: 'champion',
                name: 'Champion',
                description: 'Complete all 10 levels',
                icon: '🏆',
                category: 'progression',
                condition: (stats) => stats.levelsCompleted.length === 10,
                points: 100
            },

            // Coin Collection Achievements
            coin_collector: {
                id: 'coin_collector',
                name: 'Coin Collector',
                description: 'Collect 100 coins in total',
                icon: '🪙',
                category: 'collection',
                condition: (stats) => stats.totalCoinsCollected >= 100,
                points: 20
            },
            treasure_hunter: {
                id: 'treasure_hunter',
                name: 'Treasure Hunter',
                description: 'Collect 500 coins in total',
                icon: '💰',
                category: 'collection',
                condition: (stats) => stats.totalCoinsCollected >= 500,
                points: 50
            },
            coin_master: {
                id: 'coin_master',
                name: 'Coin Master',
                description: 'Collect 1000 coins in total',
                icon: '👑',
                category: 'collection',
                condition: (stats) => stats.totalCoinsCollected >= 1000,
                points: 100
            },

            // Enemy Defeat Achievements
            goomba_stomper: {
                id: 'goomba_stomper',
                name: 'Goomba Stomper',
                description: 'Defeat 50 Goombas',
                icon: '👟',
                category: 'combat',
                condition: (stats) => (stats.enemiesDefeated.goomba || 0) >= 50,
                points: 25
            },
            koopa_crusher: {
                id: 'koopa_crusher',
                name: 'Koopa Crusher',
                description: 'Defeat 30 Koopa Troopas',
                icon: '🐢',
                category: 'combat',
                condition: (stats) => (stats.enemiesDefeated.koopa || 0) >= 30,
                points: 30
            },
            exterminator: {
                id: 'exterminator',
                name: 'Exterminator',
                description: 'Defeat 200 enemies total',
                icon: '⚔️',
                category: 'combat',
                condition: (stats) => this.getTotalEnemiesDefeated(stats) >= 200,
                points: 75
            },

            // Speed Run Achievements
            speed_demon: {
                id: 'speed_demon',
                name: 'Speed Demon',
                description: 'Complete any level with over 300 seconds remaining',
                icon: '⚡',
                category: 'skill',
                condition: (stats) => stats.bestLevelTime && Object.values(stats.bestLevelTime).some(time => time > 300),
                points: 40
            },
            time_master: {
                id: 'time_master',
                name: 'Time Master',
                description: 'Complete all levels with time bonuses',
                icon: '⏱️',
                category: 'skill',
                condition: (stats) => stats.levelsWithTimeBonus === 10,
                points: 80
            },

            // Power-up Achievements
            power_up_collector: {
                id: 'power_up_collector',
                name: 'Power-Up Collector',
                description: 'Collect all types of power-ups',
                icon: '🍄',
                category: 'collection',
                condition: (stats) => {
                    const types = stats.powerUpsCollected || {};
                    return types.mushroom && types.fireFlower && types.star && types.oneUp;
                },
                points: 30
            },
            invincible: {
                id: 'invincible',
                name: 'Invincible',
                description: 'Use 10 Star power-ups',
                icon: '⭐',
                category: 'collection',
                condition: (stats) => (stats.powerUpsCollected?.star || 0) >= 10,
                points: 35
            },

            // Skill-based Achievements
            untouchable: {
                id: 'untouchable',
                name: 'Untouchable',
                description: 'Complete any level without taking damage',
                icon: '🛡️',
                category: 'skill',
                condition: (stats) => stats.noDamageLevels > 0,
                points: 50
            },
            perfect_run: {
                id: 'perfect_run',
                name: 'Perfect Run',
                description: 'Complete a level collecting all coins without taking damage',
                icon: '💎',
                category: 'skill',
                condition: (stats) => stats.perfectLevels > 0,
                points: 75
            },
            combo_master: {
                id: 'combo_master',
                name: 'Combo Master',
                description: 'Achieve a 10x enemy combo',
                icon: '🔥',
                category: 'skill',
                condition: (stats) => stats.maxCombo >= 10,
                points: 60
            },

            // High Score Achievements
            score_chaser: {
                id: 'score_chaser',
                name: 'Score Chaser',
                description: 'Reach 50,000 points',
                icon: '📈',
                category: 'score',
                condition: (stats) => stats.highScore >= 50000,
                points: 40
            },
            high_roller: {
                id: 'high_roller',
                name: 'High Roller',
                description: 'Reach 100,000 points',
                icon: '💯',
                category: 'score',
                condition: (stats) => stats.highScore >= 100000,
                points: 60
            },
            legend: {
                id: 'legend',
                name: 'Legend',
                description: 'Reach 200,000 points',
                icon: '🌟',
                category: 'score',
                condition: (stats) => stats.highScore >= 200000,
                points: 100
            },

            // Special Achievements
            survivor: {
                id: 'survivor',
                name: 'Survivor',
                description: 'Earn 10 extra lives',
                icon: '❤️',
                category: 'special',
                condition: (stats) => stats.extraLivesEarned >= 10,
                points: 45
            },
            explorer: {
                id: 'explorer',
                name: 'Explorer',
                description: 'Discover 5 secret areas',
                icon: '🗺️',
                category: 'special',
                condition: (stats) => stats.secretsFound >= 5,
                points: 50
            },
            dedicated: {
                id: 'dedicated',
                name: 'Dedicated',
                description: 'Play for 1 hour total',
                icon: '🕐',
                category: 'special',
                condition: (stats) => stats.totalPlayTime >= 3600,
                points: 30
            },
            hardcore: {
                id: 'hardcore',
                name: 'Hardcore Hero',
                description: 'Complete the game on Expert difficulty',
                icon: '💀',
                category: 'special',
                condition: (stats) => stats.completedOnExpert === true,
                points: 150
            }
        };

        // Load unlocked achievements and stats
        this.unlockedAchievements = this.loadUnlockedAchievements();
        this.stats = this.loadStats();

        // Track new achievements this session
        this.newlyUnlocked = [];
    }

    /**
     * Load unlocked achievements from storage
     * @returns {Array<string>} Array of unlocked achievement IDs
     */
    loadUnlockedAchievements() {
        if (!this.storage.isAvailable) {
            return [];
        }

        try {
            const unlocked = localStorage.getItem('marito_achievements');
            return unlocked ? JSON.parse(unlocked) : [];
        } catch (error) {
            errorHandler.logError('Achievements', error);
            return [];
        }
    }

    /**
     * Save unlocked achievements to storage
     * @returns {boolean} Success status
     */
    saveUnlockedAchievements() {
        if (!this.storage.isAvailable) {
            return false;
        }

        try {
            localStorage.setItem('marito_achievements', JSON.stringify(this.unlockedAchievements));
            return true;
        } catch (error) {
            errorHandler.logError('Achievements', error);
            return false;
        }
    }

    /**
     * Load statistics from storage
     * @returns {Object} Statistics object
     */
    loadStats() {
        if (!this.storage.isAvailable) {
            return this.getDefaultStats();
        }

        try {
            const stats = localStorage.getItem('marito_stats');
            return stats ? JSON.parse(stats) : this.getDefaultStats();
        } catch (error) {
            errorHandler.logError('Achievements', error);
            return this.getDefaultStats();
        }
    }

    /**
     * Get default statistics object
     * @returns {Object} Default stats
     */
    getDefaultStats() {
        return {
            levelsCompleted: [],
            totalCoinsCollected: 0,
            enemiesDefeated: {
                goomba: 0,
                koopa: 0,
                piranha: 0,
                buzzy: 0
            },
            powerUpsCollected: {
                mushroom: 0,
                fireFlower: 0,
                star: 0,
                oneUp: 0
            },
            bestLevelTime: {},
            levelsWithTimeBonus: 0,
            noDamageLevels: 0,
            perfectLevels: 0,
            maxCombo: 0,
            highScore: 0,
            extraLivesEarned: 0,
            secretsFound: 0,
            totalPlayTime: 0,
            completedOnExpert: false,
            deaths: 0,
            jumps: 0,
            fireballsShot: 0
        };
    }

    /**
     * Save statistics to storage
     * @returns {boolean} Success status
     */
    saveStats() {
        if (!this.storage.isAvailable) {
            return false;
        }

        try {
            localStorage.setItem('marito_stats', JSON.stringify(this.stats));
            return true;
        } catch (error) {
            errorHandler.logError('Achievements', error);
            return false;
        }
    }

    /**
     * Get total enemies defeated across all types
     * @param {Object} stats - Statistics object
     * @returns {number} Total enemies defeated
     */
    getTotalEnemiesDefeated(stats) {
        const enemies = stats.enemiesDefeated || {};
        return (enemies.goomba || 0) + (enemies.koopa || 0) +
               (enemies.piranha || 0) + (enemies.buzzy || 0);
    }

    /**
     * Update statistics
     * @param {string} category - Statistic category
     * @param {string} key - Statistic key
     * @param {*} value - New value or increment amount
     * @param {boolean} increment - Whether to increment (true) or set (false)
     */
    updateStat(category, key, value, increment = false) {
        if (category) {
            if (increment) {
                if (typeof this.stats[category][key] === 'number') {
                    this.stats[category][key] += value;
                }
            } else {
                this.stats[category][key] = value;
            }
        } else {
            if (increment && typeof this.stats[key] === 'number') {
                this.stats[key] += value;
            } else {
                this.stats[key] = value;
            }
        }

        this.saveStats();
        this.checkAchievements();
    }

    /**
     * Record level completion
     * @param {number} levelNumber - Level number
     * @param {number} timeRemaining - Time remaining in seconds
     * @param {boolean} noDamage - Whether player took no damage
     * @param {boolean} allCoins - Whether all coins were collected
     */
    recordLevelComplete(levelNumber, timeRemaining, noDamage = false, allCoins = false) {
        // Add to completed levels
        if (!this.stats.levelsCompleted.includes(levelNumber)) {
            this.stats.levelsCompleted.push(levelNumber);
            this.stats.levelsCompleted.sort((a, b) => a - b);
        }

        // Update best time
        if (!this.stats.bestLevelTime[levelNumber] || timeRemaining > this.stats.bestLevelTime[levelNumber]) {
            this.stats.bestLevelTime[levelNumber] = timeRemaining;
        }

        // Track time bonus levels
        if (timeRemaining > 200) {
            this.stats.levelsWithTimeBonus++;
        }

        // Track no damage runs
        if (noDamage) {
            this.stats.noDamageLevels++;
        }

        // Track perfect runs (no damage + all coins)
        if (noDamage && allCoins) {
            this.stats.perfectLevels++;
        }

        this.saveStats();
        this.checkAchievements();
    }

    /**
     * Record enemy defeat
     * @param {string} enemyType - Type of enemy (goomba, koopa, etc.)
     */
    recordEnemyDefeat(enemyType) {
        const type = enemyType.toLowerCase();
        if (this.stats.enemiesDefeated[type] !== undefined) {
            this.stats.enemiesDefeated[type]++;
            this.saveStats();
            this.checkAchievements();
        }
    }

    /**
     * Record power-up collection
     * @param {string} powerUpType - Type of power-up
     */
    recordPowerUpCollected(powerUpType) {
        const type = powerUpType.toLowerCase();
        if (this.stats.powerUpsCollected[type] !== undefined) {
            this.stats.powerUpsCollected[type]++;
            this.saveStats();
            this.checkAchievements();
        }
    }

    /**
     * Record coin collection
     * @param {number} amount - Number of coins collected
     */
    recordCoinsCollected(amount = 1) {
        this.stats.totalCoinsCollected += amount;
        this.saveStats();
        this.checkAchievements();
    }

    /**
     * Update high score
     * @param {number} score - New score
     */
    updateHighScore(score) {
        if (score > this.stats.highScore) {
            this.stats.highScore = score;
            this.saveStats();
            this.checkAchievements();
        }
    }

    /**
     * Record combo
     * @param {number} comboCount - Combo count
     */
    recordCombo(comboCount) {
        if (comboCount > this.stats.maxCombo) {
            this.stats.maxCombo = comboCount;
            this.saveStats();
            this.checkAchievements();
        }
    }

    /**
     * Check all achievements and unlock new ones
     * @returns {Array<Object>} Newly unlocked achievements
     */
    checkAchievements() {
        this.newlyUnlocked = [];

        for (const achievement of Object.values(this.achievements)) {
            // Skip already unlocked
            if (this.unlockedAchievements.includes(achievement.id)) {
                continue;
            }

            // Check condition
            try {
                if (achievement.condition(this.stats)) {
                    this.unlockAchievement(achievement.id);
                }
            } catch (error) {
                errorHandler.logError('Achievements', error);
            }
        }

        return this.newlyUnlocked;
    }

    /**
     * Unlock an achievement
     * @param {string} achievementId - Achievement ID to unlock
     * @returns {boolean} Success status
     */
    unlockAchievement(achievementId) {
        if (this.unlockedAchievements.includes(achievementId)) {
            return false;
        }

        this.unlockedAchievements.push(achievementId);
        this.newlyUnlocked.push(this.achievements[achievementId]);
        this.saveUnlockedAchievements();

        // Trigger unlock notification
        this.showUnlockNotification(this.achievements[achievementId]);

        return true;
    }

    /**
     * Show achievement unlock notification
     * @param {Object} achievement - Achievement object
     */
    showUnlockNotification(achievement) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <div class="achievement-title">Achievement Unlocked!</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-points">+${achievement.points} points</div>
            </div>
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);

        // Remove after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 4000);
    }

    /**
     * Get achievement progress
     * @returns {Object} Progress information
     */
    getProgress() {
        const total = Object.keys(this.achievements).length;
        const unlocked = this.unlockedAchievements.length;
        const totalPoints = Object.values(this.achievements)
            .reduce((sum, ach) => sum + ach.points, 0);
        const earnedPoints = this.unlockedAchievements
            .reduce((sum, id) => sum + (this.achievements[id]?.points || 0), 0);

        return {
            total,
            unlocked,
            percentage: Math.round((unlocked / total) * 100),
            totalPoints,
            earnedPoints,
            pointsPercentage: Math.round((earnedPoints / totalPoints) * 100)
        };
    }

    /**
     * Get achievements by category
     * @param {string} category - Category name
     * @returns {Array<Object>} Achievements in category
     */
    getAchievementsByCategory(category) {
        return Object.values(this.achievements)
            .filter(ach => ach.category === category)
            .map(ach => ({
                ...ach,
                unlocked: this.unlockedAchievements.includes(ach.id)
            }));
    }

    /**
     * Get all achievement categories
     * @returns {Array<string>} Category names
     */
    getCategories() {
        const categories = new Set();
        Object.values(this.achievements).forEach(ach => categories.add(ach.category));
        return Array.from(categories);
    }

    /**
     * Reset all achievements and statistics
     * @returns {boolean} Success status
     */
    resetAll() {
        this.unlockedAchievements = [];
        this.stats = this.getDefaultStats();
        this.newlyUnlocked = [];

        if (!this.storage.isAvailable) {
            return false;
        }

        try {
            localStorage.removeItem('marito_achievements');
            localStorage.removeItem('marito_stats');
            return true;
        } catch (error) {
            errorHandler.logError('Achievements', error);
            return false;
        }
    }

    /**
     * Export achievements and statistics
     * @returns {Object} Export data
     */
    exportData() {
        return {
            achievements: this.unlockedAchievements,
            stats: this.stats,
            timestamp: Date.now()
        };
    }

    /**
     * Import achievements and statistics
     * @param {Object} data - Import data
     * @returns {boolean} Success status
     */
    importData(data) {
        if (!data || !data.achievements || !data.stats) {
            return false;
        }

        try {
            this.unlockedAchievements = data.achievements;
            this.stats = { ...this.getDefaultStats(), ...data.stats };
            this.saveUnlockedAchievements();
            this.saveStats();
            return true;
        } catch (error) {
            errorHandler.logError('Achievements', error);
            return false;
        }
    }
}

// Global instance
let achievementsManager;
