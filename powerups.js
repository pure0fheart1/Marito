// Power-ups and collectibles for the Mario game
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.collected = false;
        this.physics = new Physics();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.emerged = false;
        this.emergeTimer = 0;
        
        this.initializeByType();
    }
    
    initializeByType() {
        switch (this.type) {
            case 'mushroom':
                this.color = '#FF0000';
                this.velocityX = 2;
                this.points = 1000;
                break;
            case 'fireflower':
                this.color = '#FF6600';
                this.points = 1000;
                break;
            case 'coin':
                this.color = '#FFD700';
                this.width = 24;
                this.height = 24;
                this.points = 200;
                break;
            case 'star':
                this.color = '#FFFF00';
                this.velocityX = 3;
                this.points = 1000;
                break;
            case '1up':
                this.color = '#00FF00';
                this.velocityX = 2;
                this.points = 0;
                break;
        }
    }
    
    update(tiles) {
        if (this.collected) return;
        
        // Emerge from block animation
        if (!this.emerged) {
            this.emergeTimer++;
            this.y -= 0.5;
            if (this.emergeTimer >= 32) {
                this.emerged = true;
            }
            return;
        }
        
        // Apply physics for moving power-ups
        if (this.velocityX !== 0) {
            this.physics.update(this, null, tiles);
        }
        
        // Update animation
        this.animationTimer++;
        if (this.animationTimer >= 15) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }
    
    checkPlayerCollision(player) {
        if (this.collected || !this.emerged) return false;
        
        if (Utils.checkCollision(this.getBounds(), player.getBounds())) {
            this.collected = true;
            
            switch (this.type) {
                case 'mushroom':
                    player.powerUp();
                    break;
                case 'fireflower':
                    player.transform('fire');
                    break;
                case 'coin':
                    player.collectCoin();
                    break;
                case 'star':
                    player.invulnerable = true;
                    player.invulnerabilityTimer = 600; // 10 seconds
                    break;
                case '1up':
                    player.lives++;
                    break;
            }
            
            if (this.points > 0) {
                player.addScore(this.points);
            }
            
            return true;
        }
        return false;
    }
    
    render(ctx, camera) {
        if (this.collected) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        if (screenX < -this.width || screenX > ctx.canvas.width) return;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        switch (this.type) {
            case 'mushroom':
                this.renderMushroom(ctx);
                break;
            case 'fireflower':
                this.renderFireFlower(ctx);
                break;
            case 'coin':
                this.renderCoin(ctx);
                break;
            case 'star':
                this.renderStar(ctx);
                break;
            case '1up':
                this.renderOneUp(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    renderMushroom(ctx) {
        // Mushroom cap
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, 20);
        
        // Mushroom stem
        ctx.fillStyle = '#FFFFE0';
        ctx.fillRect(12, 20, 8, 12);
        
        // Spots
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(8, 4, 6, 6);
        ctx.fillRect(18, 4, 6, 6);
        ctx.fillRect(13, 10, 6, 6);
    }
    
    renderFireFlower(ctx) {
        // Flower center
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(12, 12, 8, 8);
        
        // Petals
        ctx.fillStyle = this.color;
        ctx.fillRect(8, 8, 16, 4);
        ctx.fillRect(8, 20, 16, 4);
        ctx.fillRect(14, 2, 4, 16);
        ctx.fillRect(14, 14, 4, 16);
        
        // Stem
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(14, 24, 4, 8);
    }
    
    renderCoin(ctx) {
        const rotation = this.animationFrame * Math.PI / 2;
        const scaleX = Math.cos(rotation);
        
        ctx.save();
        ctx.translate(this.width/2, this.height/2);
        ctx.scale(Math.abs(scaleX), 1);
        
        // Coin
        ctx.fillStyle = this.color;
        ctx.fillRect(-8, -8, 16, 16);
        
        // Coin detail
        ctx.fillStyle = '#FFB000';
        ctx.fillRect(-6, -6, 12, 12);
        
        ctx.restore();
    }
    
    renderStar(ctx) {
        // Animated star
        const time = this.animationFrame * 0.2;
        
        ctx.save();
        ctx.translate(this.width/2, this.height/2);
        ctx.rotate(time);
        
        // Star shape
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5;
            const x = Math.cos(angle) * 12;
            const y = Math.sin(angle) * 12;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.restore();
    }
    
    renderOneUp(ctx) {
        // 1-UP mushroom (green mushroom)
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, 20);
        
        // Mushroom stem
        ctx.fillStyle = '#FFFFE0';
        ctx.fillRect(12, 20, 8, 12);
        
        // "1UP" text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '8px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('1UP', this.width/2, 12);
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
} 