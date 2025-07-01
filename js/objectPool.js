// Object pooling system for performance optimization
class ObjectPool {
    constructor(createFunction, resetFunction, initialSize = 10) {
        this.createFunction = createFunction;
        this.resetFunction = resetFunction;
        this.pool = [];
        this.active = [];
        
        // Pre-fill pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFunction());
        }
    }
    
    // Get an object from the pool
    acquire(...args) {
        let obj;
        
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFunction();
        }
        
        this.resetFunction(obj, ...args);
        this.active.push(obj);
        return obj;
    }
    
    // Return an object to the pool
    release(obj) {
        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
            this.pool.push(obj);
        }
    }
    
    // Release all active objects
    releaseAll() {
        while (this.active.length > 0) {
            this.pool.push(this.active.pop());
        }
    }
    
    // Get active objects
    getActive() {
        return this.active;
    }
    
    // Pool statistics
    getStats() {
        return {
            pooled: this.pool.length,
            active: this.active.length,
            total: this.pool.length + this.active.length
        };
    }
}

// Specific pools for game objects
class GameObjectPools {
    constructor() {
        // Particle pool
        this.particlePool = new ObjectPool(
            () => ({ x: 0, y: 0, velocityX: 0, velocityY: 0, color: '#fff', life: 0, size: 2, dead: false }),
            (particle, x, y, velocityX, velocityY, color, life, size) => {
                particle.x = x;
                particle.y = y;
                particle.velocityX = velocityX;
                particle.velocityY = velocityY;
                particle.color = color;
                particle.life = life;
                particle.maxLife = life;
                particle.size = size || 2;
                particle.dead = false;
                particle.gravity = 0.1;
            },
            50
        );
        
        // Fireball pool
        this.fireballPool = new ObjectPool(
            () => ({ x: 0, y: 0, width: 8, height: 8, velocityX: 0, velocityY: 0, destroyed: false }),
            (fireball, x, y, direction) => {
                fireball.x = x;
                fireball.y = y;
                fireball.width = 8;
                fireball.height = 8;
                fireball.velocityX = direction * 8;
                fireball.velocityY = -2;
                fireball.direction = direction;
                fireball.bounces = 0;
                fireball.maxBounces = 3;
                fireball.destroyed = false;
            },
            10
        );
        
        // Enemy pool (for dynamic spawning)
        this.enemyPool = new ObjectPool(
            () => ({}), // Empty object, will be initialized by reset
            (enemy, x, y, type) => {
                // Reset enemy properties based on type
                enemy.x = x;
                enemy.y = y;
                enemy.type = type;
                enemy.destroyed = false;
                enemy.velocityX = -1;
                enemy.velocityY = 0;
                enemy.onGround = false;
                // Add other enemy properties as needed
            },
            20
        );
    }
    
    // Convenience methods
    acquireParticle(x, y, velocityX, velocityY, color, life, size) {
        return this.particlePool.acquire(x, y, velocityX, velocityY, color, life, size);
    }
    
    releaseParticle(particle) {
        this.particlePool.release(particle);
    }
    
    acquireFireball(x, y, direction) {
        return this.fireballPool.acquire(x, y, direction);
    }
    
    releaseFireball(fireball) {
        this.fireballPool.release(fireball);
    }
    
    acquireEnemy(x, y, type) {
        return this.enemyPool.acquire(x, y, type);
    }
    
    releaseEnemy(enemy) {
        this.enemyPool.release(enemy);
    }
    
    // Get all stats
    getAllStats() {
        return {
            particles: this.particlePool.getStats(),
            fireballs: this.fireballPool.getStats(),
            enemies: this.enemyPool.getStats()
        };
    }
    
    // Release all objects
    releaseAll() {
        this.particlePool.releaseAll();
        this.fireballPool.releaseAll();
        this.enemyPool.releaseAll();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ObjectPool, GameObjectPools };
} else {
    window.ObjectPool = ObjectPool;
    window.GameObjectPools = GameObjectPools;
}