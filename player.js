// Player class for the Mario game

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.velocityX = 0;
        this.velocityY = 0;
        this.direction = 1; // 1 for right, -1 for left
        
        // Physics properties
        this.onGround = false;
        this.isMoving = false;
        this.coyoteTimer = 0;
        this.jumpBuffer = 0;
        
        // Player states
        this.state = 'small'; // small, big, fire
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.transforming = false;
        this.transformTimer = 0;
        
        // Animation properties
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 8; // frames per animation frame
        this.currentAnimation = 'idle';
        
        // Game properties
        this.lives = 3;
        this.score = 0;
        this.coins = 0;
        this.fireBalls = [];
        this.maxFireBalls = 2;
        
        // Physics engine
        this.physics = new PlayerPhysics();
        
        // Initialize animations
        this.initAnimations();
    }
    
    initAnimations() {
        this.animations = {
            idle: [0],
            walk: [0, 1, 2, 1],
            jump: [3],
            fall: [4],
            crouch: [5],
            transform: [0, 6, 0, 6, 0],
            fire: [7]
        };
    }
    
    update(input, tiles) {
        // Update transformation
        if (this.transforming) {
            this.transformTimer--;
            if (this.transformTimer <= 0) {
                this.transforming = false;
            }
        }
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTimer--;
            if (this.invulnerabilityTimer <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Handle input
        this.handleInput(input);
        
        // Update physics
        const physicsResult = this.physics.update(this, input, tiles);
        
        // Update animation
        this.updateAnimation();
        
        // Update fireballs
        this.updateFireBalls(tiles);
        
        return physicsResult;
    }
    
    handleInput(input) {
        // Handle crouching (only for big Mario)
        if (input.down && this.state !== 'small' && this.onGround) {
            this.currentAnimation = 'crouch';
            this.height = 24; // Reduce height when crouching
        } else {
            if (this.state === 'small') {
                this.height = 32;
            } else {
                this.height = 48; // Big Mario is taller
            }
        }
        
        // Handle fireball shooting
        if (input.fire && this.state === 'fire' && this.fireBalls.length < this.maxFireBalls) {
            this.shootFireball();
        }
    }
    
    updateAnimation() {
        // Determine current animation based on state
        if (this.transforming) {
            this.currentAnimation = 'transform';
        } else if (!this.onGround) {
            this.currentAnimation = this.velocityY < 0 ? 'jump' : 'fall';
        } else if (this.isMoving) {
            this.currentAnimation = 'walk';
        } else {
            this.currentAnimation = 'idle';
        }
        
        // Update animation frame
        this.animationTimer++;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            const frames = this.animations[this.currentAnimation];
            this.animationFrame = (this.animationFrame + 1) % frames.length;
        }
    }
    
    updateFireBalls(tiles) {
        for (let i = this.fireBalls.length - 1; i >= 0; i--) {
            const fireball = this.fireBalls[i];
            fireball.update(tiles);
            
            // Remove fireballs that are off-screen or hit something
            if (fireball.x < -50 || fireball.x > 2000 || fireball.destroyed) {
                this.fireBalls.splice(i, 1);
            }
        }
    }
    
    shootFireball() {
        const fireball = new FireBall(
            this.x + (this.direction > 0 ? this.width : 0),
            this.y + this.height / 2,
            this.direction
        );
        this.fireBalls.push(fireball);
    }
    
    // Power-up system
    powerUp() {
        if (this.state === 'small') {
            this.transform('big');
            this.score += 1000;
        } else if (this.state === 'big') {
            this.transform('fire');
            this.score += 1000;
        } else {
            // Already fire, just give points
            this.score += 1000;
        }
    }
    
    transform(newState) {
        if (this.state === newState) return;
        
        const oldHeight = this.height;
        this.state = newState;
        this.transforming = true;
        this.transformTimer = 60; // 1 second at 60 FPS
        this.invulnerable = true;
        this.invulnerabilityTimer = 120; // 2 seconds
        
        // Adjust size based on new state
        if (newState === 'small') {
            this.height = 32;
        } else {
            this.height = 48;
        }
        
        // Adjust position if growing
        if (this.height > oldHeight) {
            this.y -= (this.height - oldHeight);
        }
    }
    
    takeDamage() {
        if (this.invulnerable) return false;
        
        if (this.state === 'small') {
            this.die();
            return true;
        } else {
            // Power down
            this.transform('small');
            return false; // Didn't die
        }
    }
    
    die() {
        this.lives--;
        // Death animation and respawn logic will be handled by the game
    }
    
    collectCoin() {
        this.coins++;
        this.score += 200;
        
        // Extra life every 100 coins
        if (this.coins % 100 === 0) {
            this.lives++;
        }
    }
    
    addScore(points) {
        this.score += points;
    }
    
    // Render the player
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Don't render if off-screen
        if (screenX < -this.width || screenX > ctx.canvas.width) return;
        
        // Flash during invulnerability
        if (this.invulnerable && Math.floor(this.invulnerabilityTimer / 5) % 2) {
            return; // Skip rendering this frame for flashing effect
        }
        
        // Get current sprite frame
        const frames = this.animations[this.currentAnimation];
        const currentFrame = frames[this.animationFrame];
        
        // Draw player (simple colored rectangles for now)
        ctx.save();
        
        // Flip horizontally if facing left
        if (this.direction < 0) {
            ctx.scale(-1, 1);
            ctx.translate(-screenX - this.width, screenY);
        } else {
            ctx.translate(screenX, screenY);
        }
        
        // Choose color based on state
        let color = '#FF0000'; // Red for small Mario
        if (this.state === 'big') color = '#FF6600'; // Orange for big Mario
        if (this.state === 'fire') color = '#FFFF00'; // Yellow for fire Mario
        
        // Draw main body
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw simple facial features
        ctx.fillStyle = '#000000';
        ctx.fillRect(8, 8, 4, 4); // Eye
        ctx.fillRect(20, 8, 4, 4); // Eye
        ctx.fillRect(12, 16, 8, 2); // Mustache
        
        // Draw hat
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(4, 0, 24, 8);
        
        // Draw overalls straps (for big Mario)
        if (this.state !== 'small') {
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(8, 16, 4, 16);
            ctx.fillRect(20, 16, 4, 16);
        }
        
        ctx.restore();
        
        // Render fireballs
        this.fireBalls.forEach(fireball => fireball.render(ctx, camera));
    }
    
    // Get player bounds for collision detection
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    // Reset player to starting position
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.transforming = false;
        this.transformTimer = 0;
        this.fireBalls = [];
    }
    
    // Save player state
    getState() {
        return {
            x: this.x,
            y: this.y,
            state: this.state,
            score: this.score,
            coins: this.coins,
            lives: this.lives
        };
    }
    
    // Load player state
    setState(state) {
        this.x = state.x;
        this.y = state.y;
        this.state = state.state;
        this.score = state.score;
        this.coins = state.coins;
        this.lives = state.lives;
    }
}

// FireBall class for fire Mario's ability
class FireBall {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 8;
        this.height = 8;
        this.velocityX = direction * 8;
        this.velocityY = -2;
        this.direction = direction;
        this.bounces = 0;
        this.maxBounces = 3;
        this.destroyed = false;
        this.physics = new Physics();
    }
    
    update(tiles) {
        // Apply physics
        this.physics.applyGravity(this);
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Check collisions with tiles
        const collisions = this.physics.checkTileCollisions(this, tiles);
        for (let collision of collisions) {
            if (collision.side === 'top' && this.velocityY > 0) {
                this.y = collision.tile.y - this.height;
                this.velocityY = -8; // Bounce
                this.bounces++;
                
                if (this.bounces >= this.maxBounces) {
                    this.destroyed = true;
                }
            } else if (collision.side === 'left' || collision.side === 'right') {
                this.destroyed = true;
            }
        }
        
        // Destroy if fell too far
        if (this.y > 600) {
            this.destroyed = true;
        }
    }
    
    render(ctx, camera) {
        if (this.destroyed) return;
        
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Don't render if off-screen
        if (screenX < -this.width || screenX > ctx.canvas.width) return;
        
        // Draw fireball as a bright circle
        ctx.save();
        ctx.translate(screenX + this.width/2, screenY + this.height/2);
        
        // Create fireball effect
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.width/2);
        gradient.addColorStop(0, '#FFFF00');
        gradient.addColorStop(0.5, '#FF6600');
        gradient.addColorStop(1, '#FF0000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
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