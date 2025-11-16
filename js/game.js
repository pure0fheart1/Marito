// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = 'menu'; // menu, playing, paused, gameover, levelcomplete
        this.currentLevel = 1;
        this.maxLevel = 6;
        
        // Game objects
        this.player = null;
        this.level = null;
        this.camera = { x: 0, y: 0 };
        this.particleSystem = new ParticleSystem();
        this.soundManager = new SoundManager();
        
        // Input handling
        this.input = {
            left: false,
            right: false,
            up: false,
            down: false,
            jump: false,
            fire: false,
            running: false,
            pause: false
        };
        
        // Game timing
        this.gameTime = 0;
        this.levelTime = 400; // seconds
        this.deltaTime = 0;
        this.lastTime = 0;
        
        // UI elements
        this.uiElements = {
            score: document.getElementById('score'),
            coins: document.getElementById('coins'),
            lives: document.getElementById('lives'),
            time: document.getElementById('time'),
            world: document.getElementById('world'),
            mainMenu: document.getElementById('mainMenu'),
            gameOver: document.getElementById('gameOver'),
            levelComplete: document.getElementById('levelComplete'),
            finalScore: document.getElementById('finalScore'),
            levelScore: document.getElementById('levelScore')
        };
        
        // Game data
        this.highScores = this.loadHighScores();
        this.gameData = this.loadGameData();
        
        this.initializeInput();
        this.showMainMenu();
    }
    
    // Level definitions
    getLevelData(levelNum) {
        const levels = {
            1: {
                width: 3200,
                height: 576,
                theme: 'overworld',
                spawnX: 64,
                spawnY: 400,
                timeLimit: 400,
                enemies: [
                    { x: 400, y: 480, type: 'goomba' },
                    { x: 700, y: 464, type: 'koopa' },
                    { x: 1100, y: 480, type: 'goomba' },
                    { x: 1600, y: 480, type: 'goomba' },
                    { x: 2000, y: 464, type: 'koopa' }
                ],
                powerUps: [
                    { x: 450, y: 268, type: 'mushroom' },
                    { x: 1000, y: 168, type: 'fireflower' },
                    { x: 1800, y: 300, type: 'coin' }
                ]
            },
            2: {
                width: 3600,
                height: 576,
                theme: 'overworld',
                spawnX: 64,
                spawnY: 400,
                timeLimit: 400,
                enemies: [
                    { x: 300, y: 480, type: 'goomba' },
                    { x: 350, y: 480, type: 'goomba' },
                    { x: 800, y: 464, type: 'koopa' },
                    { x: 1200, y: 480, type: 'goomba' },
                    { x: 1800, y: 464, type: 'koopa' },
                    { x: 2400, y: 480, type: 'goomba' }
                ],
                powerUps: [
                    { x: 600, y: 268, type: 'mushroom' },
                    { x: 1400, y: 168, type: 'fireflower' },
                    { x: 2200, y: 200, type: 'star' }
                ]
            },
            3: {
                width: 3200,
                height: 576,
                theme: 'underground',
                spawnX: 64,
                spawnY: 400,
                timeLimit: 400,
                enemies: [
                    { x: 500, y: 464, type: 'koopa' },
                    { x: 900, y: 480, type: 'goomba' },
                    { x: 1300, y: 464, type: 'koopa' },
                    { x: 1700, y: 480, type: 'goomba' }
                ],
                powerUps: [
                    { x: 700, y: 268, type: 'fireflower' },
                    { x: 1500, y: 168, type: '1up' }
                ]
            },
            4: {
                width: 4000,
                height: 576,
                theme: 'overworld',
                spawnX: 64,
                spawnY: 400,
                timeLimit: 500,
                enemies: [
                    { x: 400, y: 480, type: 'goomba' },
                    { x: 450, y: 480, type: 'goomba' },
                    { x: 800, y: 464, type: 'koopa' },
                    { x: 1200, y: 480, type: 'goomba' },
                    { x: 1600, y: 464, type: 'koopa' },
                    { x: 2000, y: 480, type: 'goomba' },
                    { x: 2400, y: 464, type: 'koopa' }
                ],
                powerUps: [
                    { x: 600, y: 268, type: 'mushroom' },
                    { x: 1400, y: 168, type: 'fireflower' },
                    { x: 2200, y: 200, type: 'star' },
                    { x: 2800, y: 300, type: '1up' }
                ]
            },
            5: {
                width: 3200,
                height: 576,
                theme: 'castle',
                spawnX: 64,
                spawnY: 400,
                timeLimit: 400,
                enemies: [
                    { x: 600, y: 464, type: 'koopa' },
                    { x: 1000, y: 480, type: 'goomba' },
                    { x: 1400, y: 464, type: 'koopa' },
                    { x: 1800, y: 480, type: 'goomba' }
                ],
                powerUps: [
                    { x: 800, y: 268, type: 'fireflower' },
                    { x: 1600, y: 168, type: 'star' }
                ]
            },
            6: {
                width: 3600,
                height: 576,
                theme: 'castle',
                spawnX: 64,
                spawnY: 400,
                timeLimit: 500,
                enemies: [
                    { x: 500, y: 480, type: 'goomba' },
                    { x: 800, y: 464, type: 'koopa' },
                    { x: 1200, y: 480, type: 'goomba' },
                    { x: 1600, y: 464, type: 'koopa' },
                    { x: 2800, y: 400, type: 'bowser' } // Boss fight
                ],
                powerUps: [
                    { x: 1000, y: 268, type: 'fireflower' },
                    { x: 2000, y: 168, type: 'star' }
                ]
            }
        };
        
        return levels[levelNum] || levels[1];
    }
    
    initializeInput() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.handleKeyUp(e);
        });
        
        // Resume audio context on first user interaction
        document.addEventListener('click', () => {
            this.soundManager.resumeAudioContext();
        }, { once: true });
    }
    
    handleKeyDown(e) {
        switch (e.code) {
            case 'ArrowLeft':
                this.input.left = true;
                break;
            case 'ArrowRight':
                this.input.right = true;
                break;
            case 'ArrowUp':
                this.input.up = true;
                break;
            case 'ArrowDown':
                this.input.down = true;
                break;
            case 'Space':
                this.input.jump = true;
                e.preventDefault();
                break;
            case 'KeyX':
                this.input.fire = true;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.input.running = true;
                break;
            case 'KeyP':
                this.input.pause = true;
                break;
        }
    }
    
    handleKeyUp(e) {
        switch (e.code) {
            case 'ArrowLeft':
                this.input.left = false;
                break;
            case 'ArrowRight':
                this.input.right = false;
                break;
            case 'ArrowUp':
                this.input.up = false;
                break;
            case 'ArrowDown':
                this.input.down = false;
                break;
            case 'Space':
                this.input.jump = false;
                break;
            case 'KeyX':
                this.input.fire = false;
                break;
            case 'ShiftLeft':
            case 'ShiftRight':
                this.input.running = false;
                break;
            case 'KeyP':
                this.input.pause = false;
                break;
        }
    }
    
    startGame() {
        this.currentLevel = 1;
        this.loadLevel(this.currentLevel);
        this.state = 'playing';
        this.hideAllMenus();
        this.soundManager.playBackgroundMusic(this.level.theme);
    }
    
    loadLevel(levelNum) {
        const levelData = this.getLevelData(levelNum);
        this.level = new Level(levelData);
        this.player = new Player(levelData.spawnX, levelData.spawnY);
        this.levelTime = levelData.timeLimit;
        this.camera.x = 0;
        this.camera.y = 0;
        this.particleSystem.clear();
        
        // Update UI
        this.uiElements.world.textContent = `${Math.ceil(levelNum / 2)}-${((levelNum - 1) % 2) + 1}`;
    }
    
    update(currentTime) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Handle pause
        if (this.input.pause && this.state === 'playing') {
            this.pauseGame();
            this.input.pause = false;
        }
        
        if (this.state !== 'playing') return;
        
        // Update game timer
        this.gameTime += this.deltaTime / 1000;
        this.levelTime -= this.deltaTime / 1000;
        
        if (this.levelTime <= 0) {
            this.levelTime = 0;
            this.gameOver();
            return;
        }
        
        // Update game objects
        this.player.update(this.input, this.level.getSolidTiles());
        this.level.update(this.player);
        this.particleSystem.update();
        
        // Check collisions
        this.checkCollisions();
        
        // Update camera
        this.updateCamera();
        
        // Update UI
        this.updateUI();
        
        // Check game conditions
        this.checkGameConditions();
    }
    
    checkCollisions() {
        // Player vs enemies
        this.level.getEnemies().forEach(enemy => {
            const collision = enemy.checkPlayerCollision(this.player);
            if (collision) {
                if (collision === 'damage') {
                    if (this.player.takeDamage()) {
                        this.gameOver();
                    } else {
                        this.soundManager.playSound('enemyHit');
                    }
                } else if (collision === 'destroyed') {
                    this.soundManager.playSound('enemyDeath');
                    this.particleSystem.createEnemyDeathEffect(
                        enemy.x + enemy.width/2, 
                        enemy.y + enemy.height/2, 
                        enemy.type
                    );
                }
            }
        });
        
        // Player vs power-ups
        this.level.getPowerUps().forEach(powerUp => {
            if (powerUp.checkPlayerCollision(this.player)) {
                this.soundManager.playSound(powerUp.type === 'coin' ? 'coin' : 'powerup');
                this.particleSystem.createPowerUpEffect(
                    powerUp.x + powerUp.width/2,
                    powerUp.y + powerUp.height/2,
                    powerUp.type
                );
            }
        });
        
        // Fireballs vs enemies
        this.player.fireBalls.forEach(fireball => {
            this.level.getEnemies().forEach(enemy => {
                if (Utils.checkCollision(fireball.getBounds(), enemy.getBounds())) {
                    const points = enemy.onHitByFireball(fireball);
                    if (points > 0) {
                        this.player.addScore(points);
                        this.soundManager.playSound('enemyHit');
                        this.particleSystem.createFireballHit(
                            enemy.x + enemy.width/2,
                            enemy.y + enemy.height/2
                        );
                    }
                    fireball.destroyed = true;
                }
            });
        });
    }
    
    updateCamera() {
        const targetX = this.player.x - this.canvas.width / 2;
        this.camera.x = Utils.clamp(targetX, 0, this.level.width - this.canvas.width);
        
        // Smooth camera follow
        const smoothing = 0.1;
        this.camera.x = Utils.lerp(this.camera.x, targetX, smoothing);
        this.camera.x = Utils.clamp(this.camera.x, 0, this.level.width - this.canvas.width);
    }
    
    updateUI() {
        this.uiElements.score.textContent = Utils.formatScore(this.player.score);
        this.uiElements.coins.textContent = this.player.coins.toString().padStart(2, '0');
        this.uiElements.lives.textContent = this.player.lives;
        this.uiElements.time.textContent = Math.ceil(this.levelTime);
    }
    
    checkGameConditions() {
        // Check if player fell off the world
        if (this.player.y > this.level.height + 100) {
            this.player.die();
            if (this.player.lives <= 0) {
                this.gameOver();
            } else {
                this.respawnPlayer();
            }
        }
        
        // Check level completion
        if (this.level.isComplete(this.player)) {
            this.levelComplete();
        }
    }
    
    respawnPlayer() {
        const levelData = this.getLevelData(this.currentLevel);
        this.player.reset(levelData.spawnX, levelData.spawnY);
    }
    
    levelComplete() {
        this.state = 'levelcomplete';
        this.soundManager.playSound('levelComplete');
        this.soundManager.stopMusic();
        
        // Bonus points for remaining time
        const timeBonus = Math.floor(this.levelTime) * 50;
        this.player.addScore(timeBonus);
        
        this.uiElements.levelScore.textContent = Utils.formatScore(this.player.score);
        this.uiElements.levelComplete.style.display = 'block';
    }
    
    nextLevel() {
        this.currentLevel++;
        if (this.currentLevel > this.maxLevel) {
            this.gameComplete();
        } else {
            this.loadLevel(this.currentLevel);
            this.state = 'playing';
            this.uiElements.levelComplete.style.display = 'none';
            this.soundManager.playBackgroundMusic(this.level.theme);
        }
    }
    
    gameComplete() {
        // Game completed! Show final score and return to menu
        this.saveHighScore(this.player.score);
        this.showMainMenu();
    }
    
    gameOver() {
        this.state = 'gameover';
        this.soundManager.playSound('gameover');
        this.soundManager.stopMusic();
        
        this.uiElements.finalScore.textContent = Utils.formatScore(this.player.score);
        this.uiElements.gameOver.style.display = 'block';
        
        this.saveHighScore(this.player.score);
    }
    
    restart() {
        this.hideAllMenus();
        this.startGame();
    }
    
    pauseGame() {
        if (this.state === 'playing') {
            this.state = 'paused';
        } else if (this.state === 'paused') {
            this.state = 'playing';
        }
    }
    
    showMainMenu() {
        this.state = 'menu';
        this.hideAllMenus();
        this.uiElements.mainMenu.style.display = 'block';
        this.soundManager.stopMusic();
    }
    
    hideAllMenus() {
        this.uiElements.mainMenu.style.display = 'none';
        this.uiElements.gameOver.style.display = 'none';
        this.uiElements.levelComplete.style.display = 'none';
    }
    
    showLevelSelect() {
        alert('Level Select - Coming Soon!');
    }
    
    showHighScores() {
        const scores = this.highScores.slice(0, 10);
        let message = 'High Scores:\n\n';
        scores.forEach((score, index) => {
            message += `${index + 1}. ${Utils.formatScore(score)}\n`;
        });
        alert(message);
    }
    
    saveHighScore(score) {
        this.highScores.push(score);
        this.highScores.sort((a, b) => b - a);
        this.highScores = this.highScores.slice(0, 10);
        localStorage.setItem('marioHighScores', JSON.stringify(this.highScores));
    }
    
    loadHighScores() {
        const saved = localStorage.getItem('marioHighScores');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveGameData() {
        const data = {
            currentLevel: this.currentLevel,
            playerState: this.player ? this.player.getState() : null
        };
        localStorage.setItem('marioGameData', JSON.stringify(data));
    }
    
    loadGameData() {
        const saved = localStorage.getItem('marioGameData');
        return saved ? JSON.parse(saved) : null;
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (this.state === 'menu') {
            this.renderMenu();
            return;
        }
        
        if (!this.level || !this.player) return;
        
        // Render game world
        this.level.render(this.ctx, this.camera);
        this.player.render(this.ctx, this.camera);
        this.particleSystem.render(this.ctx, this.camera);
        
        // Render pause overlay
        if (this.state === 'paused') {
            this.renderPauseOverlay();
        }
    }
    
    renderMenu() {
        // Simple animated background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Animated clouds
        const time = Date.now() * 0.001;
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 5; i++) {
            const x = (i * 200 + time * 20) % (this.canvas.width + 100) - 50;
            const y = 50 + Math.sin(time + i) * 20;
            this.renderCloud(x, y);
        }
    }
    
    renderCloud(x, y) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        this.ctx.arc(x + 30, y - 15, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderPauseOverlay() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        Utils.drawCenteredText(
            this.ctx,
            'PAUSED',
            this.canvas.width / 2,
            this.canvas.height / 2,
            48,
            '#FFFFFF',
            '#000000'
        );
        
        Utils.drawCenteredText(
            this.ctx,
            'Press P to Resume',
            this.canvas.width / 2,
            this.canvas.height / 2 + 60,
            24,
            '#FFFFFF',
            '#000000'
        );
    }
    
    // Main game loop
    run() {
        const gameLoop = (currentTime) => {
            this.update(currentTime);
            this.render();
            requestAnimationFrame(gameLoop);
        };
        
        requestAnimationFrame(gameLoop);
    }
}