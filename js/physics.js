// Physics engine for the Mario game

class Physics {
    constructor() {
        this.gravity = 0.8;
        this.friction = 0.85;
        this.maxFallSpeed = 15;
        this.jumpStrength = -15;
        this.walkSpeed = 4;
        this.runSpeed = 6;
    }

    // Apply gravity to an object
    applyGravity(obj) {
        if (!obj.onGround) {
            obj.velocityY += this.gravity;
            obj.velocityY = Math.min(obj.velocityY, this.maxFallSpeed);
        }
    }

    // Apply friction to horizontal movement
    applyFriction(obj) {
        if (obj.onGround && !obj.isMoving) {
            obj.velocityX *= this.friction;
            if (Math.abs(obj.velocityX) < 0.1) {
                obj.velocityX = 0;
            }
        }
    }

    // Update object position based on velocity
    updatePosition(obj) {
        obj.x += obj.velocityX;
        obj.y += obj.velocityY;
    }

    // Check collision with tiles/platforms
    checkTileCollisions(obj, tiles) {
        const collisions = [];
        
        for (let tile of tiles) {
            if (Utils.checkCollision(obj, tile)) {
                collisions.push({
                    tile: tile,
                    side: this.getCollisionSide(obj, tile)
                });
            }
        }
        
        return collisions;
    }

    // Resolve collision between object and tile
    resolveCollision(obj, tile, side) {
        switch (side) {
            case 'top':
                obj.y = tile.y - obj.height;
                obj.velocityY = 0;
                obj.onGround = true;
                break;
            case 'bottom':
                obj.y = tile.y + tile.height;
                obj.velocityY = 0;
                break;
            case 'left':
                obj.x = tile.x - obj.width;
                obj.velocityX = 0;
                break;
            case 'right':
                obj.x = tile.x + tile.width;
                obj.velocityX = 0;
                break;
        }
    }

    // Get which side of the collision occurred
    getCollisionSide(obj, tile) {
        const objCenterX = obj.x + obj.width / 2;
        const objCenterY = obj.y + obj.height / 2;
        const tileCenterX = tile.x + tile.width / 2;
        const tileCenterY = tile.y + tile.height / 2;

        const dx = objCenterX - tileCenterX;
        const dy = objCenterY - tileCenterY;

        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (absDx > absDy) {
            return dx > 0 ? 'right' : 'left';
        } else {
            return dy > 0 ? 'bottom' : 'top';
        }
    }

    // Check if object is on a platform
    isOnPlatform(obj, platforms) {
        for (let platform of platforms) {
            if (obj.x < platform.x + platform.width &&
                obj.x + obj.width > platform.x &&
                obj.y + obj.height >= platform.y &&
                obj.y + obj.height <= platform.y + 10 && // Small tolerance
                obj.velocityY >= 0) {
                return platform;
            }
        }
        return null;
    }

    // Apply movement physics
    applyMovement(obj, input) {
        const speed = input.running ? this.runSpeed : this.walkSpeed;
        
        if (input.left) {
            obj.velocityX = -speed;
            obj.direction = -1;
            obj.isMoving = true;
        } else if (input.right) {
            obj.velocityX = speed;
            obj.direction = 1;
            obj.isMoving = true;
        } else {
            obj.isMoving = false;
        }

        if (input.jump && obj.onGround) {
            obj.velocityY = this.jumpStrength;
            obj.onGround = false;
        }
    }

    // Check collision between two objects
    checkObjectCollision(obj1, obj2) {
        return Utils.checkCollision(obj1, obj2);
    }

    // Bounce object off another object
    bounceOff(obj, other, bounceFactor = 0.5) {
        const dx = (obj.x + obj.width / 2) - (other.x + other.width / 2);
        const dy = (obj.y + obj.height / 2) - (other.y + other.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            const normalX = dx / distance;
            const normalY = dy / distance;

            obj.velocityX = normalX * bounceFactor * 5;
            obj.velocityY = normalY * bounceFactor * 5;
        }
    }

    // Apply knockback to object
    applyKnockback(obj, direction, force = 3) {
        obj.velocityX = direction * force;
        obj.velocityY = -force / 2;
        obj.onGround = false;
    }

    // Check if object is falling through platforms (one-way platforms)
    checkOneWayPlatforms(obj, platforms) {
        for (let platform of platforms) {
            if (platform.oneWay &&
                obj.x < platform.x + platform.width &&
                obj.x + obj.width > platform.x &&
                obj.y + obj.height > platform.y &&
                obj.y + obj.height < platform.y + platform.height &&
                obj.velocityY > 0) {
                
                obj.y = platform.y - obj.height;
                obj.velocityY = 0;
                obj.onGround = true;
                return platform;
            }
        }
        return null;
    }

    // Update object with full physics
    update(obj, input, tiles) {
        obj.onGround = false;

        // Apply input-based movement
        if (input) {
            this.applyMovement(obj, input);
        }

        // Apply physics forces
        this.applyGravity(obj);
        this.applyFriction(obj);

        // Store previous position for collision resolution
        const prevX = obj.x;
        const prevY = obj.y;

        // Update position
        this.updatePosition(obj);

        // Check and resolve tile collisions
        const collisions = this.checkTileCollisions(obj, tiles);
        for (let collision of collisions) {
            this.resolveCollision(obj, collision.tile, collision.side);
        }

        // Prevent going off-screen (left side)
        if (obj.x < 0) {
            obj.x = 0;
            obj.velocityX = 0;
        }

        return {
            moved: prevX !== obj.x || prevY !== obj.y,
            collisions: collisions
        };
    }
}

// Specialized physics for different object types
class PlayerPhysics extends Physics {
    constructor() {
        super();
        this.coyoteTime = 0.1; // Seconds after leaving platform where jump is still allowed
        this.jumpBufferTime = 0.1; // Seconds to buffer jump input
    }

    update(player, input, tiles) {
        // Handle coyote time and jump buffering
        if (player.onGround) {
            player.coyoteTimer = this.coyoteTime;
        } else if (player.coyoteTimer > 0) {
            player.coyoteTimer -= 1/60; // Assuming 60 FPS
        }

        if (input.jump) {
            player.jumpBuffer = this.jumpBufferTime;
        } else if (player.jumpBuffer > 0) {
            player.jumpBuffer -= 1/60;
        }

        // Allow jump if on ground, in coyote time, or with jump buffer
        if (player.jumpBuffer > 0 && (player.onGround || player.coyoteTimer > 0)) {
            player.velocityY = this.jumpStrength;
            player.onGround = false;
            player.jumpBuffer = 0;
            player.coyoteTimer = 0;
        }

        return super.update(player, input, tiles);
    }
} 