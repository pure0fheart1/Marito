/**
 * Leaderboard and Social Features System for Marito
 * Handles online leaderboards, player profiles, daily challenges, and social features
 */

class LeaderboardSystem {
    constructor() {
        this.storage = new StorageManager();
        this.playerProfile = this.loadPlayerProfile();
        this.globalLeaderboard = this.loadGlobalLeaderboard();
        this.levelLeaderboards = this.loadLevelLeaderboards();
        this.friendsList = this.loadFriendsList();
        this.dailyChallenge = this.loadDailyChallenge();
        this.achievements = null; // Will be set by achievements manager

        // AI player names for simulated competition
        this.aiPlayerNames = [
            'SuperMario64', 'PrincessPeach', 'LuigiMaster', 'YoshiRider', 'ToadWarrior',
            'BowserSlayer', 'StarCollector', 'CoinHunter', 'GoombaStomper', 'KoopaKrusher',
            'FireballMario', 'JumpKing', 'SpeedRunner99', 'PlatformPro', 'BlockBreaker',
            'PipeExplorer', 'CloudJumper', 'CastleMaster', 'PowerUpAddict', 'LivesLegend',
            'MushroomMania', 'InvincibleStar', 'ShellShooter', 'BrickBuster', 'FlagPole1st',
            'SecretFinder', 'ComboMaster', 'TimeTrialist', 'NoDamageRun', 'PerfectRunner',
            'RetroGamer', 'NostalgiaKid', 'PixelPerfect', '8BitHero', 'ClassicFan',
            'WarpZonePro', 'BonusStage', 'ExtraLives', 'GoldenMario', 'PlatinumPeach'
        ];

        this.initializeLeaderboards();
    }

    /**
     * Initialize leaderboards with AI players if empty
     */
    initializeLeaderboards() {
        if (this.globalLeaderboard.length === 0) {
            this.generateAILeaderboard();
        }
    }

    /**
     * Load player profile from storage
     */
    loadPlayerProfile() {
        try {
            const profile = localStorage.getItem('marito_player_profile');
            if (profile) {
                return JSON.parse(profile);
            }
        } catch (e) {
            console.error('Error loading player profile:', e);
        }

        // Default profile
        return {
            playerId: this.generatePlayerId(),
            playerName: 'Player',
            avatar: '🎮',
            createdAt: Date.now(),
            stats: {
                totalScore: 0,
                totalPlayTime: 0,
                totalJumps: 0,
                totalEnemiesDefeated: 0,
                totalCoinsCollected: 0,
                totalLevelsCompleted: 0,
                totalDeaths: 0,
                perfectRuns: 0,
                bestStreak: 0,
                favoriteLevel: null
            },
            preferences: {
                showRankings: true,
                allowChallenges: true,
                shareScores: true
            }
        };
    }

    /**
     * Save player profile to storage
     */
    savePlayerProfile() {
        try {
            localStorage.setItem('marito_player_profile', JSON.stringify(this.playerProfile));
        } catch (e) {
            console.error('Error saving player profile:', e);
        }
    }

    /**
     * Load global leaderboard
     */
    loadGlobalLeaderboard() {
        try {
            const leaderboard = localStorage.getItem('marito_global_leaderboard');
            if (leaderboard) {
                return JSON.parse(leaderboard);
            }
        } catch (e) {
            console.error('Error loading global leaderboard:', e);
        }
        return [];
    }

    /**
     * Save global leaderboard
     */
    saveGlobalLeaderboard() {
        try {
            localStorage.setItem('marito_global_leaderboard', JSON.stringify(this.globalLeaderboard));
        } catch (e) {
            console.error('Error saving global leaderboard:', e);
        }
    }

    /**
     * Load level-specific leaderboards
     */
    loadLevelLeaderboards() {
        try {
            const leaderboards = localStorage.getItem('marito_level_leaderboards');
            if (leaderboards) {
                return JSON.parse(leaderboards);
            }
        } catch (e) {
            console.error('Error loading level leaderboards:', e);
        }
        return {};
    }

    /**
     * Save level leaderboards
     */
    saveLevelLeaderboards() {
        try {
            localStorage.setItem('marito_level_leaderboards', JSON.stringify(this.levelLeaderboards));
        } catch (e) {
            console.error('Error saving level leaderboards:', e);
        }
    }

    /**
     * Load friends list
     */
    loadFriendsList() {
        try {
            const friends = localStorage.getItem('marito_friends');
            if (friends) {
                return JSON.parse(friends);
            }
        } catch (e) {
            console.error('Error loading friends list:', e);
        }
        return [];
    }

    /**
     * Save friends list
     */
    saveFriendsList() {
        try {
            localStorage.setItem('marito_friends', JSON.stringify(this.friendsList));
        } catch (e) {
            console.error('Error saving friends list:', e);
        }
    }

    /**
     * Load daily challenge
     */
    loadDailyChallenge() {
        try {
            const challenge = localStorage.getItem('marito_daily_challenge');
            if (challenge) {
                const parsed = JSON.parse(challenge);
                // Check if challenge is still valid for today
                if (this.isSameDay(parsed.date, Date.now())) {
                    return parsed;
                }
            }
        } catch (e) {
            console.error('Error loading daily challenge:', e);
        }

        // Generate new daily challenge
        return this.generateDailyChallenge();
    }

    /**
     * Generate daily challenge
     */
    generateDailyChallenge() {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

        const challenges = [
            {
                type: 'no_powerups',
                name: 'Purist Run',
                description: 'Complete without collecting any power-ups',
                modifier: { noPowerUps: true },
                reward: { coins: 500, points: 1000 }
            },
            {
                type: 'time_trial',
                name: 'Speed Demon',
                description: 'Complete the level in under 200 seconds',
                modifier: { timeLimit: 200 },
                reward: { coins: 750, points: 1500 }
            },
            {
                type: 'coin_collector',
                name: 'Treasure Hunt',
                description: 'Collect all coins in the level',
                modifier: { mustCollectAllCoins: true },
                reward: { coins: 1000, points: 2000 }
            },
            {
                type: 'no_damage',
                name: 'Flawless Victory',
                description: 'Complete without taking any damage',
                modifier: { noDamage: true },
                reward: { coins: 1000, points: 2500 }
            },
            {
                type: 'enemy_hunter',
                name: 'Exterminator',
                description: 'Defeat all enemies in the level',
                modifier: { mustDefeatAllEnemies: true },
                reward: { coins: 800, points: 1800 }
            },
            {
                type: 'minimum_jumps',
                name: 'Ground Pounder',
                description: 'Complete with fewer than 50 jumps',
                modifier: { maxJumps: 50 },
                reward: { coins: 600, points: 1200 }
            },
            {
                type: 'combo_master',
                name: 'Chain Reaction',
                description: 'Achieve a 10x combo',
                modifier: { requiredCombo: 10 },
                reward: { coins: 700, points: 1400 }
            }
        ];

        const challengeIndex = seed % challenges.length;
        const levelIndex = (seed % 10) + 1;

        const challenge = {
            ...challenges[challengeIndex],
            level: levelIndex,
            date: Date.now(),
            seed: seed,
            leaderboard: [],
            completed: false,
            playerScore: null
        };

        this.saveDailyChallenge(challenge);
        return challenge;
    }

    /**
     * Save daily challenge
     */
    saveDailyChallenge(challenge) {
        try {
            localStorage.setItem('marito_daily_challenge', JSON.stringify(challenge || this.dailyChallenge));
        } catch (e) {
            console.error('Error saving daily challenge:', e);
        }
    }

    /**
     * Check if two dates are the same day
     */
    isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getDate() === d2.getDate();
    }

    /**
     * Generate unique player ID
     */
    generatePlayerId() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate AI leaderboard with realistic scores
     */
    generateAILeaderboard() {
        const entries = [];
        const usedNames = new Set();

        for (let i = 0; i < 100; i++) {
            let name;
            do {
                name = this.aiPlayerNames[Math.floor(Math.random() * this.aiPlayerNames.length)];
            } while (usedNames.has(name) && usedNames.size < this.aiPlayerNames.length);

            usedNames.add(name);

            // Generate realistic score distribution
            const rank = i + 1;
            const baseScore = 100000 - (rank * 800);
            const variance = Math.random() * 500;
            const score = Math.floor(baseScore + variance);

            entries.push({
                playerId: 'ai_' + i,
                playerName: name,
                avatar: this.getRandomAvatar(),
                score: score,
                level: Math.floor(Math.random() * 10) + 1,
                timestamp: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
                isAI: true
            });
        }

        this.globalLeaderboard = entries;
        this.saveGlobalLeaderboard();
    }

    /**
     * Get random avatar
     */
    getRandomAvatar() {
        const avatars = ['🎮', '👾', '🕹️', '🎯', '⭐', '🏆', '👑', '💎', '🔥', '⚡',
                        '🌟', '💫', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎼', '🎹'];
        return avatars[Math.floor(Math.random() * avatars.length)];
    }

    /**
     * Submit score to leaderboard
     */
    submitScore(scoreData) {
        // Anti-cheat: Basic validation
        if (!this.validateScore(scoreData)) {
            console.warn('Score validation failed');
            return false;
        }

        const entry = {
            playerId: this.playerProfile.playerId,
            playerName: this.playerProfile.playerName,
            avatar: this.playerProfile.avatar,
            score: scoreData.score,
            level: scoreData.level,
            time: scoreData.time,
            coins: scoreData.coins,
            enemiesDefeated: scoreData.enemiesDefeated,
            timestamp: Date.now(),
            isAI: false
        };

        // Update global leaderboard
        this.updateGlobalLeaderboard(entry);

        // Update level-specific leaderboard
        this.updateLevelLeaderboard(entry);

        // Update player stats
        this.updatePlayerStats(scoreData);

        return true;
    }

    /**
     * Validate score for anti-cheat
     */
    validateScore(scoreData) {
        // Check for reasonable values
        if (scoreData.score < 0 || scoreData.score > 1000000) {
            return false;
        }

        if (scoreData.coins < 0 || scoreData.coins > 1000) {
            return false;
        }

        if (scoreData.time < 0 || scoreData.time > 1000) {
            return false;
        }

        if (scoreData.level < 1 || scoreData.level > 10) {
            return false;
        }

        // Check for impossible score combinations
        const maxPossibleScore = (scoreData.coins * 200) + (scoreData.enemiesDefeated * 100) + 50000;
        if (scoreData.score > maxPossibleScore * 2) {
            return false;
        }

        return true;
    }

    /**
     * Update global leaderboard
     */
    updateGlobalLeaderboard(entry) {
        // Remove old entries from this player
        this.globalLeaderboard = this.globalLeaderboard.filter(e => e.playerId !== entry.playerId);

        // Add new entry
        this.globalLeaderboard.push(entry);

        // Sort by score
        this.globalLeaderboard.sort((a, b) => b.score - a.score);

        // Keep top 100
        this.globalLeaderboard = this.globalLeaderboard.slice(0, 100);

        this.saveGlobalLeaderboard();
    }

    /**
     * Update level-specific leaderboard
     */
    updateLevelLeaderboard(entry) {
        const levelKey = `level_${entry.level}`;

        if (!this.levelLeaderboards[levelKey]) {
            this.levelLeaderboards[levelKey] = [];
        }

        // Remove old entries from this player for this level
        this.levelLeaderboards[levelKey] = this.levelLeaderboards[levelKey].filter(
            e => e.playerId !== entry.playerId
        );

        // Add new entry
        this.levelLeaderboards[levelKey].push(entry);

        // Sort by score
        this.levelLeaderboards[levelKey].sort((a, b) => b.score - a.score);

        // Keep top 50 per level
        this.levelLeaderboards[levelKey] = this.levelLeaderboards[levelKey].slice(0, 50);

        this.saveLevelLeaderboards();
    }

    /**
     * Update player stats
     */
    updatePlayerStats(scoreData) {
        this.playerProfile.stats.totalScore += scoreData.score;
        this.playerProfile.stats.totalCoinsCollected += scoreData.coins || 0;
        this.playerProfile.stats.totalEnemiesDefeated += scoreData.enemiesDefeated || 0;

        if (scoreData.levelCompleted) {
            this.playerProfile.stats.totalLevelsCompleted++;
        }

        if (scoreData.deaths) {
            this.playerProfile.stats.totalDeaths += scoreData.deaths;
        }

        if (scoreData.isPerfect) {
            this.playerProfile.stats.perfectRuns++;
        }

        this.savePlayerProfile();
    }

    /**
     * Get player rank in global leaderboard
     */
    getPlayerRank() {
        const playerEntry = this.globalLeaderboard.find(e => e.playerId === this.playerProfile.playerId);
        if (playerEntry) {
            return this.globalLeaderboard.indexOf(playerEntry) + 1;
        }
        return null;
    }

    /**
     * Get player rank in level leaderboard
     */
    getPlayerLevelRank(level) {
        const levelKey = `level_${level}`;
        const leaderboard = this.levelLeaderboards[levelKey] || [];
        const playerEntry = leaderboard.find(e => e.playerId === this.playerProfile.playerId);

        if (playerEntry) {
            return leaderboard.indexOf(playerEntry) + 1;
        }
        return null;
    }

    /**
     * Get friends leaderboard
     */
    getFriendsLeaderboard() {
        const friendIds = this.friendsList.map(f => f.playerId);
        friendIds.push(this.playerProfile.playerId); // Include self

        return this.globalLeaderboard
            .filter(e => friendIds.includes(e.playerId))
            .slice(0, 50);
    }

    /**
     * Submit daily challenge score
     */
    submitDailyChallenge(scoreData) {
        if (!this.validateScore(scoreData)) {
            return false;
        }

        const entry = {
            playerId: this.playerProfile.playerId,
            playerName: this.playerProfile.playerName,
            avatar: this.playerProfile.avatar,
            score: scoreData.score,
            timestamp: Date.now()
        };

        // Add to challenge leaderboard
        this.dailyChallenge.leaderboard.push(entry);
        this.dailyChallenge.leaderboard.sort((a, b) => b.score - a.score);
        this.dailyChallenge.leaderboard = this.dailyChallenge.leaderboard.slice(0, 100);

        // Mark as completed
        this.dailyChallenge.completed = true;
        this.dailyChallenge.playerScore = scoreData.score;

        // Award rewards
        this.playerProfile.stats.totalScore += this.dailyChallenge.reward.points;

        this.saveDailyChallenge();
        this.savePlayerProfile();

        return true;
    }

    /**
     * Share score to clipboard
     */
    shareScore(scoreData) {
        const text = `🎮 Marito - Level ${scoreData.level}
Score: ${scoreData.score.toLocaleString()}
Coins: ${scoreData.coins}
Time: ${scoreData.time}s

Can you beat my score? 🏆`;

        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                document.body.appendChild(textArea);
                textArea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textArea);
                return success;
            }
        } catch (e) {
            console.error('Error copying to clipboard:', e);
            return false;
        }
    }

    /**
     * Update player name
     */
    updatePlayerName(newName) {
        if (newName && newName.length > 0 && newName.length <= 20) {
            this.playerProfile.playerName = newName.trim();
            this.savePlayerProfile();
            return true;
        }
        return false;
    }

    /**
     * Update player avatar
     */
    updatePlayerAvatar(avatar) {
        this.playerProfile.avatar = avatar;
        this.savePlayerProfile();
    }

    /**
     * Get time since last play
     */
    getTimeSincePlay() {
        const lastPlay = this.playerProfile.stats.lastPlayTime || Date.now();
        return Date.now() - lastPlay;
    }

    /**
     * Format time difference
     */
    formatTimeDiff(timestamp) {
        const diff = Date.now() - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (days > 0) {
            return `${days}d ago`;
        }
        if (hours > 0) {
            return `${hours}h ago`;
        }
        if (minutes > 0) {
            return `${minutes}m ago`;
        }
        return 'Just now';
    }

    /**
     * Get achievement badges
     */
    getAchievementBadges() {
        if (!this.achievements) {
            return [];
        }

        const unlockedAchievements = this.achievements.getUnlockedAchievements();
        return unlockedAchievements.slice(0, 6); // Show top 6 badges
    }
}


/**
 * Leaderboard UI Manager
 * Handles the visual display and interaction with leaderboards
 */
class LeaderboardUI {
    constructor(leaderboardSystem) {
        this.system = leaderboardSystem;
        this.currentView = 'global'; // global, level, friends, daily, profile
        this.currentLevel = 1;
        this.isVisible = false;

        this.createUI();
    }

    /**
     * Create leaderboard UI elements
     */
    createUI() {
        // Main container
        const container = document.createElement('div');
        container.id = 'leaderboardUI';
        container.className = 'leaderboard-overlay';
        container.style.display = 'none';

        container.innerHTML = `
            <div class="leaderboard-modal">
                <div class="leaderboard-header">
                    <h2 class="leaderboard-title">🏆 Leaderboards</h2>
                    <button class="leaderboard-close" onclick="leaderboardUI.hideUI()">×</button>
                </div>

                <div class="leaderboard-tabs">
                    <button class="leaderboard-tab active" data-view="global">Global</button>
                    <button class="leaderboard-tab" data-view="level">Level</button>
                    <button class="leaderboard-tab" data-view="friends">Friends</button>
                    <button class="leaderboard-tab" data-view="daily">Daily Challenge</button>
                    <button class="leaderboard-tab" data-view="profile">Profile</button>
                </div>

                <div class="leaderboard-content">
                    <!-- Content will be dynamically generated -->
                </div>
            </div>
        `;

        document.body.appendChild(container);
        this.container = container;

        // Add event listeners
        this.container.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchView(e.target.dataset.view);
            });
        });
    }

    /**
     * Show leaderboard UI
     */
    showUI(view = 'global') {
        this.isVisible = true;
        this.container.style.display = 'flex';
        this.switchView(view);
    }

    /**
     * Hide leaderboard UI
     */
    hideUI() {
        this.isVisible = false;
        this.container.style.display = 'none';
    }

    /**
     * Switch view
     */
    switchView(view) {
        this.currentView = view;

        // Update tab styles
        this.container.querySelectorAll('.leaderboard-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.view === view);
        });

        // Render content
        this.renderContent();
    }

    /**
     * Render content based on current view
     */
    renderContent() {
        const content = this.container.querySelector('.leaderboard-content');

        switch (this.currentView) {
            case 'global':
                content.innerHTML = this.renderGlobalLeaderboard();
                break;
            case 'level':
                content.innerHTML = this.renderLevelLeaderboard();
                break;
            case 'friends':
                content.innerHTML = this.renderFriendsLeaderboard();
                break;
            case 'daily':
                content.innerHTML = this.renderDailyChallenge();
                break;
            case 'profile':
                content.innerHTML = this.renderProfile();
                break;
        }

        // Re-attach event listeners after rendering
        this.attachEventListeners();
    }

    /**
     * Render global leaderboard
     */
    renderGlobalLeaderboard() {
        const leaderboard = this.system.globalLeaderboard.slice(0, 100);
        const playerRank = this.system.getPlayerRank();
        const playerEntry = leaderboard.find(e => e.playerId === this.system.playerProfile.playerId);

        let html = `
            <div class="leaderboard-section">
                <h3>🌍 Global Rankings - Top 100</h3>
                ${playerRank ? `<p class="player-rank-info">Your Rank: #${playerRank}</p>` : ''}
                <div class="leaderboard-table">
                    ${this.renderLeaderboardTable(leaderboard, playerEntry)}
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render level leaderboard
     */
    renderLevelLeaderboard() {
        const levelKey = `level_${this.currentLevel}`;
        const leaderboard = this.system.levelLeaderboards[levelKey] || [];
        const playerRank = this.system.getPlayerLevelRank(this.currentLevel);
        const playerEntry = leaderboard.find(e => e.playerId === this.system.playerProfile.playerId);

        let html = `
            <div class="leaderboard-section">
                <div class="level-selector">
                    <button class="level-nav-btn" onclick="leaderboardUI.changeLevel(-1)">◀</button>
                    <h3>📍 Level ${this.currentLevel} - Top 50</h3>
                    <button class="level-nav-btn" onclick="leaderboardUI.changeLevel(1)">▶</button>
                </div>
                ${playerRank ? `<p class="player-rank-info">Your Rank: #${playerRank}</p>` : ''}
                <div class="leaderboard-table">
                    ${this.renderLeaderboardTable(leaderboard, playerEntry)}
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render friends leaderboard
     */
    renderFriendsLeaderboard() {
        const leaderboard = this.system.getFriendsLeaderboard();
        const playerEntry = leaderboard.find(e => e.playerId === this.system.playerProfile.playerId);

        let html = `
            <div class="leaderboard-section">
                <h3>👥 Friends Leaderboard</h3>
                <p class="info-text">Compare scores with your friends!</p>
                ${leaderboard.length === 0 ? '<p class="empty-message">No friends added yet. Add friends to compete!</p>' : ''}
                <div class="leaderboard-table">
                    ${this.renderLeaderboardTable(leaderboard, playerEntry)}
                </div>
                <button class="action-btn" onclick="leaderboardUI.showAddFriend()">+ Add Friend</button>
            </div>
        `;

        return html;
    }

    /**
     * Render daily challenge
     */
    renderDailyChallenge() {
        const challenge = this.system.dailyChallenge;
        const completed = challenge.completed;
        const leaderboard = challenge.leaderboard.slice(0, 50);

        let html = `
            <div class="leaderboard-section daily-challenge">
                <h3>🎯 Daily Challenge</h3>
                <div class="challenge-card">
                    <div class="challenge-header">
                        <span class="challenge-icon">${this.getChallengeIcon(challenge.type)}</span>
                        <h4>${challenge.name}</h4>
                    </div>
                    <p class="challenge-description">${challenge.description}</p>
                    <div class="challenge-details">
                        <div class="challenge-detail">
                            <strong>Level:</strong> ${challenge.level}
                        </div>
                        <div class="challenge-detail">
                            <strong>Reward:</strong> ${challenge.reward.coins} coins + ${challenge.reward.points} pts
                        </div>
                    </div>
                    ${completed ?
            `<div class="challenge-completed">
                            ✓ Completed! Score: ${challenge.playerScore.toLocaleString()}
                        </div>` :
            `<button class="action-btn challenge-start" onclick="leaderboardUI.startDailyChallenge()">
                            Start Challenge
                        </button>`
        }
                </div>
                <h4>Challenge Leaderboard</h4>
                <div class="leaderboard-table">
                    ${this.renderLeaderboardTable(leaderboard, null, true)}
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render player profile
     */
    renderProfile() {
        const profile = this.system.playerProfile;
        const stats = profile.stats;
        const badges = this.system.getAchievementBadges();

        let html = `
            <div class="leaderboard-section profile-section">
                <div class="profile-header">
                    <div class="profile-avatar-large" onclick="leaderboardUI.showAvatarPicker()">
                        ${profile.avatar}
                    </div>
                    <div class="profile-info">
                        <h3 class="profile-name">
                            ${profile.playerName}
                            <button class="edit-btn" onclick="leaderboardUI.editPlayerName()">✏️</button>
                        </h3>
                        <p class="profile-id">ID: ${profile.playerId.substr(0, 12)}...</p>
                    </div>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">🏆</div>
                        <div class="stat-value">${stats.totalScore.toLocaleString()}</div>
                        <div class="stat-label">Total Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🪙</div>
                        <div class="stat-value">${stats.totalCoinsCollected.toLocaleString()}</div>
                        <div class="stat-label">Coins</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-value">${stats.totalLevelsCompleted}</div>
                        <div class="stat-label">Levels</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⚔️</div>
                        <div class="stat-value">${stats.totalEnemiesDefeated}</div>
                        <div class="stat-label">Enemies</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💫</div>
                        <div class="stat-value">${stats.perfectRuns}</div>
                        <div class="stat-label">Perfect Runs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💀</div>
                        <div class="stat-value">${stats.totalDeaths}</div>
                        <div class="stat-label">Deaths</div>
                    </div>
                </div>

                ${badges.length > 0 ? `
                    <div class="achievement-badges">
                        <h4>Achievement Badges</h4>
                        <div class="badge-showcase">
                            ${badges.map(badge => `
                                <div class="badge-item" title="${badge.description}">
                                    <span class="badge-icon">${badge.icon}</span>
                                    <span class="badge-name">${badge.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="profile-actions">
                    <button class="action-btn" onclick="leaderboardUI.shareProfile()">📤 Share Profile</button>
                    <button class="action-btn" onclick="leaderboardUI.showStats()">📊 Detailed Stats</button>
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render leaderboard table
     */
    renderLeaderboardTable(leaderboard, playerEntry = null, isCompact = false) {
        if (leaderboard.length === 0) {
            return '<p class="empty-message">No entries yet. Be the first to set a score!</p>';
        }

        let html = '<table class="leaderboard-entries">';
        html += '<thead><tr>';
        html += '<th>Rank</th>';
        html += '<th>Player</th>';
        html += '<th>Score</th>';
        if (!isCompact) {
            html += '<th>Level</th>';
            html += '<th>Time</th>';
        }
        html += '</tr></thead>';
        html += '<tbody>';

        leaderboard.forEach((entry, index) => {
            const isPlayer = entry.playerId === this.system.playerProfile.playerId;
            const rank = index + 1;
            const rankClass = rank <= 3 ? `rank-${rank}` : '';
            const playerClass = isPlayer ? 'player-entry' : '';

            html += `<tr class="${rankClass} ${playerClass}">`;
            html += `<td class="rank">${this.getRankDisplay(rank)}</td>`;
            html += `<td class="player-info">
                <span class="player-avatar">${entry.avatar}</span>
                <span class="player-name">${entry.playerName}</span>
                ${isPlayer ? '<span class="you-badge">YOU</span>' : ''}
            </td>`;
            html += `<td class="score">${entry.score.toLocaleString()}</td>`;
            if (!isCompact) {
                html += `<td>${entry.level || '-'}</td>`;
                html += `<td>${entry.time ? entry.time + 's' : '-'}</td>`;
            }
            html += '</tr>';
        });

        html += '</tbody></table>';
        return html;
    }

    /**
     * Get rank display (with medals for top 3)
     */
    getRankDisplay(rank) {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    }

    /**
     * Get challenge icon
     */
    getChallengeIcon(type) {
        const icons = {
            'no_powerups': '🚫',
            'time_trial': '⏱️',
            'coin_collector': '🪙',
            'no_damage': '❤️',
            'enemy_hunter': '⚔️',
            'minimum_jumps': '👟',
            'combo_master': '💥'
        };
        return icons[type] || '🎯';
    }

    /**
     * Change level for level leaderboard
     */
    changeLevel(delta) {
        this.currentLevel += delta;
        if (this.currentLevel < 1) {
            this.currentLevel = 10;
        }
        if (this.currentLevel > 10) {
            this.currentLevel = 1;
        }
        this.renderContent();
    }

    /**
     * Edit player name
     */
    editPlayerName() {
        const newName = prompt('Enter your new player name (max 20 characters):', this.system.playerProfile.playerName);
        if (newName !== null) {
            if (this.system.updatePlayerName(newName)) {
                this.renderContent();
            } else {
                alert('Invalid name. Please use 1-20 characters.');
            }
        }
    }

    /**
     * Show avatar picker
     */
    showAvatarPicker() {
        const avatars = ['🎮', '👾', '🕹️', '🎯', '⭐', '🏆', '👑', '💎', '🔥', '⚡',
                        '🌟', '💫', '🎪', '🎨', '🎭', '🎬', '🎤', '🎧', '🎼', '🎹',
                        '🎲', '🎰', '🃏', '🎴', '🎩', '🎪', '🎡', '🎢', '🎠', '🎟️'];

        const picker = document.createElement('div');
        picker.className = 'avatar-picker-modal';
        picker.innerHTML = `
            <div class="avatar-picker-content">
                <h3>Choose Your Avatar</h3>
                <div class="avatar-grid">
                    ${avatars.map(avatar => `
                        <button class="avatar-option" onclick="leaderboardUI.selectAvatar('${avatar}')">
                            ${avatar}
                        </button>
                    `).join('')}
                </div>
                <button class="action-btn" onclick="this.parentElement.parentElement.remove()">Cancel</button>
            </div>
        `;

        document.body.appendChild(picker);
    }

    /**
     * Select avatar
     */
    selectAvatar(avatar) {
        this.system.updatePlayerAvatar(avatar);
        this.renderContent();
        document.querySelector('.avatar-picker-modal')?.remove();
    }

    /**
     * Share profile
     */
    shareProfile() {
        const profile = this.system.playerProfile;
        const rank = this.system.getPlayerRank();

        const text = `🎮 Marito Player Profile
${profile.avatar} ${profile.playerName}
${rank ? `Rank: #${rank}` : 'Unranked'}
Score: ${profile.stats.totalScore.toLocaleString()}
Coins: ${profile.stats.totalCoinsCollected}
Levels: ${profile.stats.totalLevelsCompleted}

Join me in Marito! 🏆`;

        if (this.system.shareScore({ score: profile.stats.totalScore, level: 1, coins: profile.stats.totalCoinsCollected, time: 0 })) {
            alert('Profile copied to clipboard!');
        } else {
            alert('Could not copy to clipboard');
        }
    }

    /**
     * Show stats
     */
    showStats() {
        // This could open the existing statistics dashboard
        if (typeof statisticsDashboard !== 'undefined') {
            this.hideUI();
            statisticsDashboard.showUI();
        }
    }

    /**
     * Start daily challenge
     */
    startDailyChallenge() {
        const challenge = this.system.dailyChallenge;
        this.hideUI();

        // Start the game with challenge modifiers
        if (typeof game !== 'undefined') {
            game.startLevel(challenge.level, challenge.modifier);
        }
    }

    /**
     * Show add friend dialog
     */
    showAddFriend() {
        alert('Friend system coming soon! Currently displaying local leaderboard.');
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Event listeners are attached via onclick attributes in HTML
        // This method can be used for additional listeners if needed
    }

    /**
     * Show score submission notification
     */
    showScoreSubmitted(scoreData) {
        const rank = this.system.getPlayerRank();
        const notification = document.createElement('div');
        notification.className = 'score-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h3>Score Submitted!</h3>
                <p>Score: ${scoreData.score.toLocaleString()}</p>
                ${rank ? `<p>Global Rank: #${rank}</p>` : ''}
                <button class="action-btn" onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Initialize the leaderboard system
let leaderboardSystem;
let leaderboardUI;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        leaderboardSystem = new LeaderboardSystem();
        leaderboardUI = new LeaderboardUI(leaderboardSystem);
    });
} else {
    leaderboardSystem = new LeaderboardSystem();
    leaderboardUI = new LeaderboardUI(leaderboardSystem);
}
