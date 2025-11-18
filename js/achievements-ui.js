/**
 * Achievements UI Component
 * Displays achievements menu and progress tracking
 */

class AchievementsUI {
    constructor(achievementsManager) {
        this.manager = achievementsManager;
        this.currentFilter = 'all';
    }

    /**
     * Create achievements menu UI
     * @returns {HTMLElement} Achievements menu element
     */
    createUI() {
        const container = document.createElement('div');
        container.id = 'achievementsMenu';
        container.className = 'achievements-menu';

        const progress = this.manager.getProgress();

        container.innerHTML = `
            <div class="achievements-content">
                <h2>🏆 Achievements</h2>

                <div class="achievements-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress.percentage}%">
                            ${progress.percentage}%
                        </div>
                    </div>
                    <div class="progress-stats">
                        <div class="progress-stat">
                            <div class="label">Unlocked</div>
                            <div class="value">${progress.unlocked}/${progress.total}</div>
                        </div>
                        <div class="progress-stat">
                            <div class="label">Points</div>
                            <div class="value">${progress.earnedPoints}/${progress.totalPoints}</div>
                        </div>
                        <div class="progress-stat">
                            <div class="label">Completion</div>
                            <div class="value">${progress.percentage}%</div>
                        </div>
                    </div>
                </div>

                <div class="achievements-categories">
                    ${this.createCategoryFilters()}
                </div>

                <div class="achievements-grid">
                    ${this.createAchievementCards()}
                </div>

                <div class="achievements-actions">
                    <button class="btn-close" onclick="achievementsUI.closeUI()">Close</button>
                </div>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    /**
     * Create category filter buttons
     * @returns {string} HTML string
     */
    createCategoryFilters() {
        const categories = [
            { id: 'all', name: 'All', icon: '🎯' },
            { id: 'progression', name: 'Progression', icon: '🌍' },
            { id: 'collection', name: 'Collection', icon: '🪙' },
            { id: 'combat', name: 'Combat', icon: '⚔️' },
            { id: 'skill', name: 'Skill', icon: '🎮' },
            { id: 'score', name: 'Score', icon: '📈' },
            { id: 'special', name: 'Special', icon: '⭐' }
        ];

        return categories.map(cat => `
            <button class="category-filter ${cat.id === this.currentFilter ? 'active' : ''}"
                    data-category="${cat.id}">
                ${cat.icon} ${cat.name}
            </button>
        `).join('');
    }

    /**
     * Create achievement cards
     * @returns {string} HTML string
     */
    createAchievementCards() {
        let achievements = Object.values(this.manager.achievements);

        // Filter by category
        if (this.currentFilter !== 'all') {
            achievements = achievements.filter(ach => ach.category === this.currentFilter);
        }

        // Sort: unlocked first, then by points
        achievements.sort((a, b) => {
            const aUnlocked = this.manager.unlockedAchievements.includes(a.id);
            const bUnlocked = this.manager.unlockedAchievements.includes(b.id);

            if (aUnlocked !== bUnlocked) {
                return bUnlocked ? 1 : -1;
            }
            return b.points - a.points;
        });

        return achievements.map(ach => this.createAchievementCard(ach)).join('');
    }

    /**
     * Create a single achievement card
     * @param {Object} achievement - Achievement object
     * @returns {string} HTML string
     */
    createAchievementCard(achievement) {
        const isUnlocked = this.manager.unlockedAchievements.includes(achievement.id);
        const statusClass = isUnlocked ? 'unlocked' : 'locked';

        return `
            <div class="achievement-card ${statusClass}">
                ${isUnlocked ? '<div class="achievement-unlocked-badge">✓ Unlocked</div>' : ''}
                <div class="achievement-card-icon">${achievement.icon}</div>
                <div class="achievement-card-name">${achievement.name}</div>
                <div class="achievement-card-description">${achievement.description}</div>
                <div class="achievement-card-footer">
                    <span class="achievement-category-badge">${achievement.category}</span>
                    <span class="achievement-points-badge">+${achievement.points}</span>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners to UI
     * @param {HTMLElement} container - Achievements container
     */
    attachEventListeners(container) {
        // Category filter buttons
        const filterButtons = container.querySelectorAll('.category-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.currentFilter = button.dataset.category;
                this.refreshUI();
            });
        });
    }

    /**
     * Show achievements UI
     */
    showUI() {
        let menu = document.getElementById('achievementsMenu');

        if (!menu) {
            menu = this.createUI();
            document.body.appendChild(menu);
        } else {
            this.refreshUI();
        }

        menu.style.display = 'flex';
    }

    /**
     * Close achievements UI
     */
    closeUI() {
        const menu = document.getElementById('achievementsMenu');
        if (menu) {
            menu.style.display = 'none';
        }
    }

    /**
     * Refresh the UI with current data
     */
    refreshUI() {
        const menu = document.getElementById('achievementsMenu');
        if (!menu) {
            return;
        }

        // Update progress
        const progress = this.manager.getProgress();
        const progressFill = menu.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress.percentage}%`;
            progressFill.textContent = `${progress.percentage}%`;
        }

        const progressStats = menu.querySelectorAll('.progress-stat .value');
        if (progressStats.length >= 3) {
            progressStats[0].textContent = `${progress.unlocked}/${progress.total}`;
            progressStats[1].textContent = `${progress.earnedPoints}/${progress.totalPoints}`;
            progressStats[2].textContent = `${progress.percentage}%`;
        }

        // Update category filters
        const categoriesContainer = menu.querySelector('.achievements-categories');
        if (categoriesContainer) {
            categoriesContainer.innerHTML = this.createCategoryFilters();

            // Re-attach listeners to new buttons
            const filterButtons = categoriesContainer.querySelectorAll('.category-filter');
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    this.currentFilter = button.dataset.category;
                    this.refreshUI();
                });
            });
        }

        // Update achievement cards
        const grid = menu.querySelector('.achievements-grid');
        if (grid) {
            grid.innerHTML = this.createAchievementCards();
        }
    }

    /**
     * Show mini progress widget on HUD
     * @returns {string} HTML string for HUD widget
     */
    createHUDWidget() {
        const progress = this.manager.getProgress();
        return `
            <div class="achievement-hud-widget" onclick="achievementsUI.showUI()" title="Click to view achievements">
                <span class="widget-icon">🏆</span>
                <span class="widget-text">${progress.unlocked}/${progress.total}</span>
            </div>
        `;
    }

    /**
     * Add HUD widget to game UI
     */
    addHUDWidget() {
        const ui = document.getElementById('ui');
        if (ui && !document.querySelector('.achievement-hud-widget')) {
            const widget = document.createElement('div');
            widget.innerHTML = this.createHUDWidget();
            ui.appendChild(widget.firstElementChild);
        }
    }

    /**
     * Update HUD widget
     */
    updateHUDWidget() {
        const widget = document.querySelector('.achievement-hud-widget');
        if (widget) {
            const progress = this.manager.getProgress();
            const text = widget.querySelector('.widget-text');
            if (text) {
                text.textContent = `${progress.unlocked}/${progress.total}`;
            }
        }
    }
}

// Global instance
let achievementsUI;
