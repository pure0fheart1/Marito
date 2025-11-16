// Main entry point for the Mario game
let game;
let settingsManager;
let achievementsManager;
let achievementsUI;
let transitionManager;
let debugMode;

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Get canvas and context
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');

        // Initialize settings manager
        settingsManager = new SettingsManager();

        // Initialize achievements system
        achievementsManager = new AchievementsManager();
        achievementsUI = new AchievementsUI(achievementsManager);

        // Initialize transition manager
        transitionManager = new TransitionManager(canvas, ctx);

        // Initialize game
        game = new Game();

        // Initialize debug mode (after game)
        debugMode = new DebugMode(canvas, ctx, game);

        game.run();
        console.log('🍄 Super Mario Platform Game Loaded Successfully!');
    } catch (error) {
        console.error('Failed to initialize game:', error);
        showErrorMessage('Game failed to load. Please refresh the page.');
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (game) {
        // Optionally handle canvas resizing here
        // For now, we'll keep the fixed size
    }
});

// Handle page visibility change (pause when tab is not active)
document.addEventListener('visibilitychange', () => {
    if (game && game.state === 'playing') {
        if (document.visibilityState === 'hidden') {
            game.pauseGame();
        }
    }
});

// Prevent context menu on right click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// F12 to toggle debug mode
document.addEventListener('keydown', (e) => {
    if (e.key === 'F12') {
        e.preventDefault();
        if (debugMode) {
            debugMode.toggle();
        }
    }
});

// Show error message to user
function showErrorMessage(message) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff0000;
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        font-size: 18px;
        z-index: 1000;
        text-align: center;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
} 