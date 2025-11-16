// Level system for the Mario game
class Level {
    constructor(levelData) {
        this.width = levelData.width || 3200;
        this.height = levelData.height || 576;
        this.tileSize = 32;
        this.tiles = [];
        this.enemies = [];
        this.powerUps = [];
        this.platforms = [];
        this.spawnX = levelData.spawnX || 64;
        this.spawnY = levelData.spawnY || 400;
        this.endX = levelData.endX || this.width - 100;
        this.theme = levelData.theme || 'overworld';
        this.timeLimit = levelData.timeLimit || 400;
        this.background = this.createBackground();
        
        this.generateLevel(levelData);
    }
    
    generateLevel(data) {
        // Generate tiles based on level data
        if (data.tiles) {
            this.generateTilesFromData(data.tiles);
        } else {
            this.generateBasicLevel();
        }
        
        // Add enemies
        if (data.enemies) {
            data.enemies.forEach(enemyData => {
                this.enemies.push(new Enemy(enemyData.x, enemyData.y, enemyData.type));
            });
        }
        
        // Add power-ups
        if (data.powerUps) {
            data.powerUps.forEach(powerUpData => {
                this.powerUps.push(new PowerUp(powerUpData.x, powerUpData.y, powerUpData.type));
            });
        }
    }
    
    generateTilesFromData(tileData) {
        for (let row = 0; row < tileData.length; row++) {
            for (let col = 0; col < tileData[row].length; col++) {
                const tileType = tileData[row][col];
                if (tileType !== 0) {
                    const x = col * this.tileSize;
                    const y = row * this.tileSize;
                    this.addTile(x, y, tileType);
                }
            }
        }
    }
    
    generateBasicLevel() {
        // Ground
        for (let x = 0; x < this.width; x += this.tileSize) {
            this.addTile(x, this.height - this.tileSize, 'ground');
            this.addTile(x, this.height - this.tileSize * 2, 'dirt');
        }
        
        // Some platforms
        this.addPlatform(300, 400, 4);
        this.addPlatform(600, 350, 3);
        this.addPlatform(900, 300, 5);
        this.addPlatform(1200, 250, 2);
        
        // Pipes
        this.addPipe(800, this.height - this.tileSize * 3, 2);
        this.addPipe(1500, this.height - this.tileSize * 4, 3);
        
        // Question blocks
        this.addQuestionBlock(400, 300, 'coin');
        this.addQuestionBlock(450, 300, 'mushroom');
        this.addQuestionBlock(700, 250, 'coin');
        this.addQuestionBlock(1000, 200, 'fireflower');
        
        // Basic enemies
        this.enemies.push(new Enemy(400, this.height - 64, 'goomba'));
        this.enemies.push(new Enemy(700, this.height - 80, 'koopa'));
        this.enemies.push(new Enemy(1100, this.height - 64, 'goomba'));
        
        // Flagpole at the end
        this.addFlagpole(this.endX, this.height - this.tileSize * 8);
    }
    
    addTile(x, y, type) {
        const tile = {
            x: x,
            y: y,
            width: this.tileSize,
            height: this.tileSize,
            type: type,
            solid: true
        };
        
        switch (type) {
            case 'ground':
                tile.color = '#8B4513';
                break;
            case 'dirt':
                tile.color = '#654321';
                break;
            case 'brick':
                tile.color = '#CD853F';
                tile.breakable = true;
                break;
            case 'question':
                tile.color = '#FFD700';
                tile.question = true;
                tile.used = false;
                break;
            case 'pipe':
                tile.color = '#00FF00';
                break;
            case 'cloud':
                tile.color = '#FFFFFF';
                break;
        }
        
        this.tiles.push(tile);
    }
    
    addPlatform(x, y, length) {
        for (let i = 0; i < length; i++) {
            this.addTile(x + i * this.tileSize, y, 'brick');
        }
    }
    
    addPipe(x, y, height) {
        for (let i = 0; i < height; i++) {
            this.addTile(x, y + i * this.tileSize, 'pipe');
            this.addTile(x + this.tileSize, y + i * this.tileSize, 'pipe');
        }
    }
    
    addQuestionBlock(x, y, contents) {
        this.addTile(x, y, 'question');
        // Find the tile we just added and attach contents
        const tile = this.tiles[this.tiles.length - 1];
        tile.contents = contents;
    }
    
    addFlagpole(x, y) {
        for (let i = 0; i < 8; i++) {
            const tile = {
                x: x,
                y: y + i * this.tileSize,
                width: 8,
                height: this.tileSize,
                type: 'flagpole',
                color: '#654321',
                solid: false
            };
            this.tiles.push(tile);
        }
        
        // Flag
        const flag = {
            x: x + 8,
            y: y,
            width: 24,
            height: 16,
            type: 'flag',
            color: '#FF0000',
            solid: false
        };
        this.tiles.push(flag);
    }
    
    createBackground() {
        const gradient = {
            type: 'gradient',
            colors: []
        };
        
        switch (this.theme) {
            case 'overworld':
                gradient.colors = ['#5C94FC', '#87CEEB'];
                break;
            case 'underground':
                gradient.colors = ['#000000', '#191970'];
                break;
            case 'castle':
                gradient.colors = ['#2F2F2F', '#000000'];
                break;
            case 'underwater':
                gradient.colors = ['#0000FF', '#4169E1'];
                break;
        }
        
        return gradient;
    }
    
    update(player) {
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(player, this.tiles);
        });
        
        // Update power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.update(this.tiles);
        });
        
        // Remove destroyed enemies
        this.enemies = this.enemies.filter(enemy => !enemy.destroyed);
        
        // Remove collected power-ups
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.collected);
        
        // Check for tile interactions
        this.checkTileInteractions(player);
    }
    
    checkTileInteractions(player) {
        for (let tile of this.tiles) {
            if (!Utils.checkCollision(player.getBounds(), tile)) continue;
            
            switch (tile.type) {
                case 'question':
                    if (!tile.used && player.velocityY < 0 && 
                        player.y > tile.y) { // Hit from below
                        this.activateQuestionBlock(tile, player);
                    }
                    break;
                case 'brick':
                    if (tile.breakable && player.state !== 'small' && 
                        player.velocityY < 0 && player.y > tile.y) {
                        this.breakBrick(tile, player);
                    }
                    break;
                case 'flag':
                    this.touchFlag(player);
                    break;
            }
        }
    }
    
    activateQuestionBlock(tile, player) {
        tile.used = true;
        tile.color = '#8B4513'; // Change to brown used block
        
        if (tile.contents) {
            const powerUp = new PowerUp(tile.x, tile.y - this.tileSize, tile.contents);
            this.powerUps.push(powerUp);
        }
        
        player.addScore(200);
    }
    
    breakBrick(tile, player) {
        // Remove the tile
        const index = this.tiles.indexOf(tile);
        if (index > -1) {
            this.tiles.splice(index, 1);
        }
        
        player.addScore(50);
        
        // Add breaking particles
        // TODO: Add particle system
    }
    
    touchFlag(player) {
        // Level complete!
        player.addScore(5000);
        // This will be handled by the game state
    }
    
    render(ctx, camera) {
        // Render background
        this.renderBackground(ctx);
        
        // Render tiles
        this.tiles.forEach(tile => {
            this.renderTile(ctx, tile, camera);
        });
        
        // Render enemies
        this.enemies.forEach(enemy => {
            enemy.render(ctx, camera);
        });
        
        // Render power-ups
        this.powerUps.forEach(powerUp => {
            powerUp.render(ctx, camera);
        });
    }
    
    renderBackground(ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
        gradient.addColorStop(0, this.background.colors[0]);
        gradient.addColorStop(1, this.background.colors[1]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        // Add clouds for overworld theme
        if (this.theme === 'overworld') {
            this.renderClouds(ctx);
        }
    }
    
    renderClouds(ctx) {
        // Simple cloud rendering
        ctx.fillStyle = '#FFFFFF';
        const cloudPositions = [
            {x: 100, y: 100},
            {x: 400, y: 150},
            {x: 700, y: 120},
            {x: 1000, y: 80},
            {x: 1300, y: 140}
        ];
        
        cloudPositions.forEach(cloud => {
            this.renderCloud(ctx, cloud.x, cloud.y);
        });
    }
    
    renderCloud(ctx, x, y) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
        ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
        ctx.arc(x + 30, y - 15, 20, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderTile(ctx, tile, camera) {
        const screenX = tile.x - camera.x;
        const screenY = tile.y - camera.y;
        
        // Don't render if off-screen
        if (screenX < -tile.width || screenX > ctx.canvas.width + tile.width) return;
        
        ctx.fillStyle = tile.color;
        ctx.fillRect(screenX, screenY, tile.width, tile.height);
        
        // Add tile-specific details
        switch (tile.type) {
            case 'question':
                if (!tile.used) {
                    ctx.fillStyle = '#000000';
                    ctx.font = '16px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('?', screenX + tile.width/2, screenY + tile.height/2 + 6);
                }
                break;
            case 'brick':
                // Brick pattern
                ctx.strokeStyle = '#8B4513';
                ctx.lineWidth = 1;
                ctx.strokeRect(screenX, screenY, tile.width, tile.height);
                ctx.strokeRect(screenX + tile.width/2, screenY, tile.width/2, tile.height/2);
                ctx.strokeRect(screenX, screenY + tile.height/2, tile.width/2, tile.height/2);
                break;
            case 'pipe':
                // Pipe details
                ctx.fillStyle = '#228B22';
                ctx.fillRect(screenX + 4, screenY, tile.width - 8, tile.height);
                ctx.fillStyle = '#32CD32';
                ctx.fillRect(screenX + 8, screenY + 4, tile.width - 16, tile.height - 8);
                break;
        }
    }
    
    getSolidTiles() {
        return this.tiles.filter(tile => tile.solid);
    }
    
    getEnemies() {
        return this.enemies;
    }
    
    getPowerUps() {
        return this.powerUps;
    }
    
    isComplete(player) {
        return player.x >= this.endX;
    }
} 