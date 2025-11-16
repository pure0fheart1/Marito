// Particle system for visual effects with object pooling
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.color = '#FFFFFF';
        this.life = 0;
        this.maxLife = 0;
        this.size = 2;
        this.gravity = CONFIG.PARTICLES.GRAVITY;
        this.active = false;
    }

    init(x, y, velocityX, velocityY, color, life, size = 2) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = size;
        this.active = true;
    }

    update() {
        if (!this.active) return;

        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityY += this.gravity;
        this.velocityX *= CONFIG.PARTICLES.FRICTION;

        this.life--;
        if (this.life <= 0) {
            this.active = false;
        }
    }

    render(ctx, camera) {
        if (!this.active) return;

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, screenY, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

class ParticleSystem {
    constructor(poolSize = 200) {
        this.particles = [];
        this.poolSize = poolSize;

        // Pre-create particle pool
        for (let i = 0; i < poolSize; i++) {
            this.particles.push(new Particle());
        }
    }

    /**
     * Get an inactive particle from the pool
     * @returns {Particle|null} An inactive particle or null if pool is full
     */
    getParticle() {
        for (let i = 0; i < this.particles.length; i++) {
            if (!this.particles[i].active) {
                return this.particles[i];
            }
        }
        return null;
    }

    addParticle(x, y, velocityX, velocityY, color, life, size) {
        const particle = this.getParticle();
        if (particle) {
            particle.init(x, y, velocityX, velocityY, color, life, size);
        }
    }
    
    createExplosion(x, y, color = '#FFD700', count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = Utils.random(2, 5);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            const life = Utils.randomInt(30, 60);
            const size = Utils.randomInt(2, 4);
            
            this.addParticle(x, y, velocityX, velocityY, color, life, size);
        }
    }
    
    createCoinSparkle(x, y) {
        for (let i = 0; i < 6; i++) {
            const velocityX = Utils.random(-3, 3);
            const velocityY = Utils.random(-5, -2);
            const colors = ['#FFD700', '#FFFF00', '#FFA500'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = Utils.randomInt(20, 40);
            
            this.addParticle(x, y, velocityX, velocityY, color, life, 3);
        }
    }
    
    createPowerUpEffect(x, y, type) {
        let color = '#FF0000';
        switch (type) {
            case 'mushroom':
                color = '#FF0000';
                break;
            case 'fireflower':
                color = '#FF6600';
                break;
            case 'star':
                color = '#FFFF00';
                break;
            case '1up':
                color = '#00FF00';
                break;
        }
        
        this.createExplosion(x, y, color, 12);
    }
    
    createEnemyDeathEffect(x, y, enemyType) {
        let color = '#8B4513';
        switch (enemyType) {
            case 'goomba':
                color = '#8B4513';
                break;
            case 'koopa':
                color = '#00FF00';
                break;
            case 'piranha':
                color = '#FF0000';
                break;
        }
        
        this.createExplosion(x, y, color, 6);
    }
    
    createFireballHit(x, y) {
        const colors = ['#FF0000', '#FF6600', '#FFFF00'];
        
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            const speed = Utils.random(3, 6);
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = Utils.randomInt(15, 30);
            const size = Utils.randomInt(2, 4);
            
            this.addParticle(x, y, velocityX, velocityY, color, life, size);
        }
    }
    
    update() {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].active) {
                this.particles[i].update();
            }
        }
    }

    render(ctx, camera) {
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].active) {
                this.particles[i].render(ctx, camera);
            }
        }
    }

    clear() {
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].reset();
        }
    }

    /**
     * Get the number of active particles
     * @returns {number} Count of active particles
     */
    getActiveCount() {
        let count = 0;
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].active) count++;
        }
        return count;
    }
}