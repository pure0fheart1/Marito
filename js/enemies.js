// Enemy system for the Mario game

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.type = type;
        this.width = 32;
        this.height = 32;
        this.velocityX = -1;
        this.velocityY = 0;
        this.direction = -1;
        this.onGround = false;
        this.destroyed = false;
        this.stunned = false;
        this.stunnedTimer = 0;
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 30;
        
        // Physics
        this.physics = new Physics();
        
        // AI properties
        this.patrolDistance = 128;
        this.viewDistance = 200;
        this.attackDistance = 32;
        
        // Initialize based on type
        this.initializeByType();
    }
    
    initializeByType() {
        switch (this.type) {
            case 'goomba':
                this.width = 32;
                this.height = 32;
                this.velocityX = -1;
                this.health = 1;
                this.points = 100;
                this.color = '#8B4513'; // Brown
                break;
            case 'koopa':
                this.width = 32;
                this.height = 48;
                this.velocityX = -1.5;
                this.health = 2;
                this.points = 200;
                this.color = '#00FF00'; // Green
                this.inShell = false;
                this.shellKicked = false;
                break;
            case 'piranha':
                this.width = 32;
                this.height = 48;
                this.velocityX = 0;
                this.health = 2;
                this.points = 1000;
                this.color = '#FF0000'; // Red
                this.emerging = false;
                this.emergingTimer = 0;
                this.hideTimer = 120; // 2 seconds
                break;
            case 'buzzy':
                this.width = 32;
                this.height = 24;
                this.velocityX = -0.5;
                this.health = 3;
                this.points = 300;
                this.color = '#444444'; // Dark gray
                break;
        }
    }
    
    update(player, tiles, enemies) {
        if (this.destroyed) return;
        
        // Update stun
        if (this.stunned) {
            this.stunnedTimer--;
            if (this.stunnedTimer <= 0) {
                this.stunned = false;
            }
        }
        
        // Type-specific updates
        switch (this.type) {
            case 'goomba':
                this.updateGoomba(player, tiles);
                break;
            case 'koopa':
                this.updateKoopa(player, tiles);
                break;
            case 'piranha':
                this.updatePiranha(player, tiles);
                break;
            case 'buzzy':
                this.updateBuzzy(player, tiles);
                break;
        }
        
        // Update animation
        this.updateAnimation();
    }
    
    updateGoomba(player, tiles) {
        if (this.stunned) return;
        
        // Simple left-right patrol
        this.physics.applyGravity(this);
        
        // Check for edges or walls
        const nextX = this.x + this.velocityX;
        let shouldTurn = false;
        
        // Check for walls
        for (let tile of tiles) {
            if (Utils.checkCollision({x: nextX, y: this.y, width: this.width, height: this.height}, tile)) {
                shouldTurn = true;
                break;
            }
        }
        
        // Check for edges (don't fall off platforms)
        const groundCheck = {
            x: nextX + (this.velocityX > 0 ? this.width : -4),
            y: this.y + this.height,
            width: 4,
            height: 4
        };
        
        let onPlatform = false;
        for (let tile of tiles) {
            if (Utils.checkCollision(groundCheck, tile)) {
                onPlatform = true;
                break;
            }
        }
        
        if (!onPlatform && this.onGround) {
            shouldTurn = true;
        }
        
        if (shouldTurn) {
            this.velocityX *= -1;
            this.direction *= -1;
        }
        
        // Apply physics
        this.physics.update(this, null, tiles);
    }
    
    updateKoopa(player, tiles) {
        if (this.inShell) {
            if (this.shellKicked) {
                // Shell moves fast
                this.velocityX = this.direction * 8;
                this.physics.update(this, null, tiles);
                
                // Check for walls to bounce off
                const collisions = this.physics.checkTileCollisions(this, tiles);
                for (let collision of collisions) {
                    if (collision.side === 'left' || collision.side === 'right') {
                        this.direction *= -1;
                        this.velocityX *= -1;
                    }
                }
            } else {
                // Shell is stationary
                this.velocityX = 0;
            }
        } else {
            // Behave like Goomba when not in shell
            this.updateGoomba(player, tiles);
        }
    }
    
    updatePiranha(player, tiles) {
        // Piranha plants emerge and hide periodically
        this.hideTimer--;
        
        if (this.hideTimer <= 0) {
            if (this.emerging) {
                // Hide
                this.y = this.startY + 32; // Go back into pipe
                this.emerging = false;
                this.hideTimer = 120; // Hide for 2 seconds
            } else {
                // Emerge
                this.y = this.startY;
                this.emerging = true;
                this.hideTimer = 180; // Show for 3 seconds
            }
        }
        
        // Don't emerge if player is too close
        const playerDistance = Utils.distance(
            {x: this.x + this.width/2, y: this.y + this.height/2},
            {x: player.x + player.width/2, y: player.y + player.height/2}
        );
        
        if (playerDistance < 64 && !this.emerging) {
            this.hideTimer = Math.max(this.hideTimer, 60); // Stay hidden longer
        }
    }
    
    updateBuzzy(player, tiles) {
        // Buzzy beetles are like Goombas but can't be jumped on
        this.updateGoomba(player, tiles);
    }
    
    updateAnimation() {
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame = (this.animationFrame + 1) % 2;
        }
    }
    
    // Handle being jumped on
    onStompedBy(player) {
        switch (this.type) {
            case 'goomba':
                this.destroyed = true;
                player.addScore(this.points);
                player.velocityY = -8; // Bounce player up
                return true;
                
            case 'koopa':
                if (this.inShell) {
                    if (!this.shellKicked) {
                        // Kick the shell
                        this.shellKicked = true;
                        this.direction = player.x < this.x ? 1 : -1;
                        player.addScore(this.points);
                        player.velocityY = -8;
                        return false; // Don't destroy, just kick
                    } else {
                        // Stop the shell
                        this.shellKicked = false;
                        this.velocityX = 0;
                        player.velocityY = -8;
                        return false;
                    }
                } else {
                    // Enter shell
                    this.inShell = true;
                    this.height = 24;
                    this.y += 24; // Adjust position
                    player.addScore(this.points);
                    player.velocityY = -8;
                    return false;
                }
                
            case 'piranha':
                // Can't stomp piranha plants
                return false;
                
            case 'buzzy':
                // Can't stomp buzzy beetles
                return false;
        }
    }
    
    // Handle being hit by fireball
    onHitByFireball(fireball) {
        this.health--;
        if (this.health <= 0) {
            this.destroyed = true;
            return this.points;
        } else {
            this.stunned = true;
            this.stunnedTimer = 60; // 1 second
            // Knockback
            this.physics.applyKnockback(this, fireball.direction, 3);
            return this.points / 2;
        }
    }
    
    // Check collision with player
    checkPlayerCollision(player) {
        if (this.destroyed) return false;
        
        const collision = Utils.checkCollision(this.getBounds(), player.getBounds());
        if (!collision) return false;
        
        // Check if player is stomping (above and falling)
        if (player.y + player.height <= this.y + 8 && player.velocityY > 0) {
            return this.onStompedBy(player) ? 'destroyed' : 'stomped';
        } else {
            // Side collision - damage player
            return 'damage';
        }
    }
    
    // Check collision with other enemies (for shell interactions)
    checkEnemyCollisions(enemies) {
        if (!this.shellKicked || this.type !== 'koopa') return;
        
        for (let enemy of enemies) {
            if (enemy === this || enemy.destroyed) continue;
            
            if (Utils.checkCollision(this.getBounds(), enemy.getBounds())) {
                enemy.destroyed = true;
                // Chain points
                return enemy.points;
            }
        }
        return 0;
    }
    
    render(ctx, camera) {
        if (this.destroyed) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Don't render if off-screen
        if (screenX < -this.width || screenX > ctx.canvas.width + this.width) return;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Flash if stunned
        if (this.stunned && Math.floor(this.stunnedTimer / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Flip if moving left
        if (this.direction < 0 && this.velocityX !== 0) {
            ctx.scale(-1, 1);
            ctx.translate(-this.width, 0);
        }
        
        // Draw based on type
        switch (this.type) {
            case 'goomba':
                this.renderGoomba(ctx);
                break;
            case 'koopa':
                this.renderKoopa(ctx);
                break;
            case 'piranha':
                this.renderPiranha(ctx);
                break;
            case 'buzzy':
                this.renderBuzzy(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    renderGoomba(ctx) {
        // Body
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 8, this.width, this.height - 8);
        
        // Head
        ctx.fillStyle = '#A0522D';
        ctx.fillRect(4, 0, this.width - 8, 16);
        
        // Eyes
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 4, 4, 4);
        ctx.fillRect(20, 4, 4, 4);
        
        // Feet (animated)
        ctx.fillStyle = this.color;
        if (this.animationFrame === 0) {
            ctx.fillRect(2, this.height - 4, 8, 4);
            ctx.fillRect(22, this.height - 4, 8, 4);
        } else {
            ctx.fillRect(6, this.height - 4, 8, 4);
            ctx.fillRect(18, this.height - 4, 8, 4);
        }
    }
    
    renderKoopa(ctx) {
        if (this.inShell) {
            // Shell
            ctx.fillStyle = this.color;
            ctx.fillRect(0, 8, this.width, 16);
            
            // Shell pattern
            ctx.fillStyle = '#228B22';
            ctx.fillRect(4, 10, this.width - 8, 4);
            ctx.fillRect(4, 18, this.width - 8, 4);
        } else {
            // Body
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(8, 16, 16, 20);
            
            // Shell
            ctx.fillStyle = this.color;
            ctx.fillRect(4, 8, 24, 16);
            
            // Head
            ctx.fillStyle = '#FFFF00';
            ctx.fillRect(10, 0, 12, 16);
            
            // Eyes
            ctx.fillStyle = '#000000';
            ctx.fillRect(12, 4, 2, 2);
            ctx.fillRect(18, 4, 2, 2);
        }
    }
    
    renderPiranha(ctx) {
        // Stem
        ctx.fillStyle = '#228B22';
        ctx.fillRect(14, this.height - 16, 4, 16);
        
        // Head
        ctx.fillStyle = this.color;
        ctx.fillRect(4, 0, 24, 24);
        
        // Mouth
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 8, 16, 8);
        
        // Teeth
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 8, 2, 4);
        ctx.fillRect(14, 8, 2, 4);
        ctx.fillRect(18, 8, 2, 4);
        ctx.fillRect(22, 8, 2, 4);
        
        // Spots
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(8, 2, 4, 4);
        ctx.fillRect(20, 2, 4, 4);
    }
    
    renderBuzzy(ctx) {
        // Shell
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Shell highlight
        ctx.fillStyle = '#666666';
        ctx.fillRect(4, 2, this.width - 8, 4);
        
        // Legs
        ctx.fillStyle = '#222222';
        ctx.fillRect(2, this.height - 2, 4, 2);
        ctx.fillRect(10, this.height - 2, 4, 2);
        ctx.fillRect(18, this.height - 2, 4, 2);
        ctx.fillRect(26, this.height - 2, 4, 2);
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Check if enemy should be despawned (too far from player)
    shouldDespawn(player) {
        const distance = Math.abs(this.x - player.x);
        return distance > 800; // Despawn if more than 800 pixels away
    }
}

// Boss enemy class
class BossEnemy extends Enemy {
    constructor(x, y, type) {
        super(x, y, type);
        this.isBoss = true;
        this.width = 64;
        this.height = 64;
        this.maxHealth = 5;
        this.health = this.maxHealth;
        this.points = 5000;
        this.attackTimer = 0;
        this.attackCooldown = 120; // 2 seconds
        this.phase = 1;
        this.invulnerabilityTimer = 0;
        
        this.initializeBoss();
    }
    
    initializeBoss() {
        switch (this.type) {
            case 'bowser':
                this.color = '#228B22';
                this.width = 80;
                this.height = 80;
                this.maxHealth = 8;
                this.health = this.maxHealth;
                this.points = 10000;
                break;
        }
    }
    
    update(player, tiles, enemies) {
        if (this.destroyed) return;
        
        // Update invulnerability
        if (this.invulnerabilityTimer > 0) {
            this.invulnerabilityTimer--;
        }
        
        // Boss AI
        this.updateBossAI(player, tiles);
        
        // Update attack timer
        this.attackTimer--;
        if (this.attackTimer <= 0) {
            this.performAttack(player);
            this.attackTimer = this.attackCooldown;
        }
        
        // Update animation
        this.updateAnimation();
    }
    
    updateBossAI(player, tiles) {
        // Simple AI: move towards player
        const playerDistance = player.x - this.x;
        
        if (Math.abs(playerDistance) > 32) {
            this.velocityX = playerDistance > 0 ? 2 : -2;
            this.direction = playerDistance > 0 ? 1 : -1;
        } else {
            this.velocityX = 0;
        }
        
        // Apply physics
        this.physics.update(this, null, tiles);
    }
    
    performAttack(player) {
        // Boss attack - could throw fireballs, jump, etc.
        const playerDistance = Utils.distance(
            {x: this.x + this.width/2, y: this.y + this.height/2},
            {x: player.x + player.width/2, y: player.y + player.height/2}
        );
        
        if (playerDistance < 200) {
            // Jump attack
            if (this.onGround) {
                this.velocityY = -12;
            }
        }
    }
    
    onStompedBy(player) {
        if (this.invulnerabilityTimer > 0) return false;
        
        this.health--;
        this.invulnerabilityTimer = 120; // 2 seconds invulnerability
        
        if (this.health <= 0) {
            this.destroyed = true;
            player.addScore(this.points);
        } else {
            player.addScore(this.points / this.maxHealth);
            // Increase difficulty
            this.attackCooldown = Math.max(60, this.attackCooldown - 10);
        }
        
        player.velocityY = -10; // Higher bounce for boss
        return this.health <= 0;
    }
    
    render(ctx, camera) {
        if (this.destroyed) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        ctx.save();
        ctx.translate(screenX, screenY);
        
        // Flash if invulnerable
        if (this.invulnerabilityTimer > 0 && Math.floor(this.invulnerabilityTimer / 5) % 2) {
            ctx.globalAlpha = 0.5;
        }
        
        // Draw boss
        ctx.fillStyle = this.color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw spikes
        ctx.fillStyle = '#666666';
        for (let i = 0; i < this.width; i += 8) {
            ctx.fillRect(i, 0, 4, 8);
        }
        
        // Draw eyes
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(this.width/4, this.height/4, 8, 8);
        ctx.fillRect(3*this.width/4 - 8, this.height/4, 8, 8);
        
        // Health bar
        const barWidth = this.width;
        const barHeight = 4;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, -12, barWidth, barHeight);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(0, -12, (this.health / this.maxHealth) * barWidth, barHeight);
        
        ctx.restore();
    }
} 