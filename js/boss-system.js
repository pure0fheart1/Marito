/**
 * Advanced Boss Mechanics System
 * Features: Phase-based battles, multiple attack patterns, vulnerability windows,
 * boss intro cinematics, defeat animations, and integration with game systems
 */

// ===== BOSS PROJECTILE CLASS =====

class BossProjectile {
    constructor(x, y, velocityX, velocityY, type, damage = 1) {
        this.x = x;
        this.y = y;
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.type = type;
        this.damage = damage;
        this.width = 16;
        this.height = 16;
        this.active = true;
        this.lifetime = 0;
        this.maxLifetime = 300; // 5 seconds at 60fps

        // Visual properties
        this.color = '#FF4444';
        this.animationFrame = 0;
        this.rotation = 0;
    }

    update() {
        if (!this.active) {
            return;
        }

        this.x += this.velocityX;
        this.y += this.velocityY;
        this.lifetime++;
        this.rotation += 0.1;
        this.animationFrame++;

        // Apply gravity to certain projectile types
        if (this.type === 'fireball' || this.type === 'rock') {
            this.velocityY += 0.2;
        }

        // Deactivate if lifetime exceeded
        if (this.lifetime >= this.maxLifetime) {
            this.active = false;
        }
    }

    render(ctx, camera) {
        if (!this.active) {
            return;
        }

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.save();
        ctx.translate(screenX + this.width / 2, screenY + this.height / 2);
        ctx.rotate(this.rotation);

        switch (this.type) {
            case 'fireball':
                ctx.fillStyle = '#FF4400';
                ctx.shadowBlur = 10;
                ctx.shadowColor = '#FF8800';
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                break;
            case 'laser':
                ctx.strokeStyle = '#00FFFF';
                ctx.lineWidth = 4;
                ctx.shadowBlur = 15;
                ctx.shadowColor = '#00FFFF';
                ctx.beginPath();
                ctx.moveTo(-this.width / 2, 0);
                ctx.lineTo(this.width / 2, 0);
                ctx.stroke();
                break;
            case 'magic':
                ctx.fillStyle = '#FF00FF';
                ctx.shadowBlur = 12;
                ctx.shadowColor = '#FF00FF';
                ctx.beginPath();
                ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 'rock':
                ctx.fillStyle = '#666666';
                ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
                break;
        }

        ctx.restore();
    }

    checkCollision(target) {
        return this.active &amp;&amp;
            this.x &lt; target.x + target.width &amp;&amp;
            this.x + this.width &gt; target.x &amp;&amp;
            this.y &lt; target.y + target.height &amp;&amp;
            this.y + this.height &gt; target.y;
    }
}


// ===== BOSS ENEMY CLASS =====

class BossEnemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.type = type;
        this.width = 64;
        this.height = 64;
        this.velocityX = 0;
        this.velocityY = 0;
        this.defeated = false;
        this.active = false;

        // Health system
        this.maxHealth = 30;
        this.health = this.maxHealth;
        this.invulnerable = false;
        this.invulnerabilityTimer = 0;
        this.vulnerable = false;
        this.vulnerabilityTimer = 0;

        // Phase system
        this.currentPhase = 1;
        this.maxPhases = 3;
        this.phaseThresholds = [0.66, 0.33, 0]; // Health percentages for phases

        // Attack system
        this.attackTimer = 0;
        this.attackCooldown = 120; // 2 seconds
        this.currentAttackPattern = 0;
        this.attackPatterns = [];
        this.projectiles = [];

        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.flashTimer = 0;

        // State machine
        this.state = 'intro'; // intro, idle, attacking, vulnerable, defeated
        this.stateTimer = 0;

        // Movement
        this.moveTimer = 0;
        this.targetX = x;
        this.targetY = y;

        // Intro cinematic
        this.introComplete = false;
        this.introDuration = 120; // 2 seconds

        // Initialize based on type
        this.initializeBossType();
    }

    initializeBossType() {
        switch (this.type) {
            case 'bowser':
                this.name = 'Bowser';
                this.maxHealth = 40;
                this.health = this.maxHealth;
                this.width = 80;
                this.height = 96;
                this.color = '#228B22';
                this.attackCooldown = 100;
                this.attackPatterns = ['fireball_spread', 'ground_pound', 'charge'];
                this.defeatReward = {
                    score: 10000,
                    lives: 1,
                    powerUp: 'fireflower'
                };
                break;

            case 'ghost_king':
                this.name = 'Ghost King';
                this.maxHealth = 25;
                this.health = this.maxHealth;
                this.width = 64;
                this.height = 64;
                this.color = '#F0F0F0';
                this.attackCooldown = 80;
                this.attackPatterns = ['teleport_strike', 'summon_ghosts', 'phase_shift'];
                this.canTeleport = true;
                this.defeatReward = {
                    score: 8000,
                    lives: 1,
                    powerUp: 'star'
                };
                break;

            case 'space_commander':
                this.name = 'Space Commander';
                this.maxHealth = 35;
                this.health = this.maxHealth;
                this.width = 72;
                this.height = 88;
                this.color = '#4169E1';
                this.attackCooldown = 90;
                this.attackPatterns = ['laser_beam', 'laser_grid', 'missile_barrage'];
                this.defeatReward = {
                    score: 12000,
                    lives: 2,
                    powerUp: 'oneup'
                };
                break;

            case 'rainbow_dragon':
                this.name = 'Rainbow Dragon';
                this.maxHealth = 45;
                this.health = this.maxHealth;
                this.width = 96;
                this.height = 80;
                this.color = '#FF69B4';
                this.attackCooldown = 110;
                this.attackPatterns = ['fire_breath', 'ice_breath', 'lightning_strike', 'wind_gust'];
                this.defeatReward = {
                    score: 15000,
                    lives: 2,
                    powerUp: 'star'
                };
                break;

            case 'final_boss':
                this.name = 'Final Boss';
                this.maxHealth = 60;
                this.health = this.maxHealth;
                this.width = 100;
                this.height = 120;
                this.color = '#8B008B';
                this.attackCooldown = 70;
                this.attackPatterns = [
                    'ultimate_barrage',
                    'summon_minions',
                    'teleport_strike',
                    'ground_pound',
                    'laser_beam',
                    'chaos_magic'
                ];
                this.defeatReward = {
                    score: 25000,
                    lives: 3,
                    powerUp: 'star',
                    scoreMultiplier: 2
                };
                break;

            default:
                this.name = 'Boss';
                this.color = '#FF0000';
                this.attackPatterns = ['basic_attack'];
        }
    }

    startIntro() {
        this.state = 'intro';
        this.stateTimer = this.introDuration;
        this.active = true;

        // Trigger boss music
        if (typeof musicSystem !== 'undefined') {
            musicSystem.play('boss');
        }

        // Camera shake effect
        if (typeof transitionManager !== 'undefined') {
            transitionManager.shake(10, 500);
        }

        // Particles effect
        this.createIntroEffects();
    }

    createIntroEffects() {
        if (typeof enhancedParticleSystem === 'undefined') {
            return;
        }

        for (let i = 0; i &lt; 30; i++) {
            const angle = (Math.PI * 2 * i) / 30;
            const speed = 5 + Math.random() * 3;
            const distance = 50;
            enhancedParticleSystem.emit(
                this.x + this.width / 2 + Math.cos(angle) * distance,
                this.y + this.height / 2 + Math.sin(angle) * distance,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'explosion'
            );
        }
    }

    update(player, tiles, enemies) {
        if (this.defeated) {
            return;
        }

        // Update timers
        this.stateTimer--;
        this.animationTimer++;
        this.invulnerabilityTimer--;
        this.vulnerabilityTimer--;

        if (this.invulnerabilityTimer &lt;= 0) {
            this.invulnerable = false;
        }

        if (this.vulnerabilityTimer &lt;= 0) {
            this.vulnerable = false;
        }

        // Flash when hit
        if (this.flashTimer &gt; 0) {
            this.flashTimer--;
        }

        // Update projectiles
        this.projectiles.forEach(proj =&gt; {
            proj.update();
        });
        this.projectiles = this.projectiles.filter(p =&gt; p.active);

        // State machine
        switch (this.state) {
            case 'intro':
                this.updateIntro();
                break;
            case 'idle':
                this.updateIdle(player);
                break;
            case 'attacking':
                this.updateAttacking(player);
                break;
            case 'vulnerable':
                this.updateVulnerable();
                break;
            case 'defeated':
                this.updateDefeated();
                break;
        }

        // Update phase based on health
        this.updatePhase();

        // Apply basic physics
        this.x += this.velocityX;
        this.y += this.velocityY;
        this.velocityX *= 0.9;
        this.velocityY *= 0.9;

        // Animation
        if (this.animationTimer % 10 === 0) {
            this.animationFrame = (this.animationFrame + 1) % 4;
        }
    }

    updateIntro() {
        if (this.stateTimer &lt;= 0) {
            this.state = 'idle';
            this.introComplete = true;
            this.stateTimer = 60;
        }

        // Dramatic entrance movement
        const targetY = this.startY + Math.sin(this.stateTimer * 0.05) * 10;
        this.y = targetY;
    }

    updateIdle(player) {
        this.attackTimer++;

        if (this.attackTimer &gt;= this.attackCooldown) {
            this.state = 'attacking';
            this.stateTimer = 120;
            this.attackTimer = 0;
            this.selectAttackPattern();
        }

        // Gentle hover/movement
        this.moveTimer++;
        if (this.moveTimer % 120 === 0) {
            this.targetX = this.startX + (Math.random() - 0.5) * 200;
        }

        const dx = this.targetX - this.x;
        this.velocityX += dx * 0.01;
    }

    updateAttacking(player) {
        if (this.stateTimer &lt;= 0) {
            this.state = 'vulnerable';
            this.stateTimer = 90; // 1.5 second vulnerability window
            this.vulnerable = true;
            this.vulnerabilityTimer = 90;
        } else {
            this.executeAttackPattern(player);
        }
    }

    updateVulnerable() {
        if (this.stateTimer &lt;= 0) {
            this.state = 'idle';
            this.stateTimer = 60;
            this.vulnerable = false;
        }

        // Flash to indicate vulnerability
        this.flashTimer = 5;
    }

    updateDefeated() {
        // Play defeat animation
        this.velocityY -= 0.5;
        this.y += this.velocityY;

        if (this.stateTimer &lt;= 0) {
            this.defeated = true;
            this.grantRewards();
        }
    }

    updatePhase() {
        const healthPercent = this.health / this.maxHealth;

        let newPhase = 1;
        if (healthPercent &lt;= this.phaseThresholds[1]) {
            newPhase = 3;
        } else if (healthPercent &lt;= this.phaseThresholds[0]) {
            newPhase = 2;
        }

        if (newPhase !== this.currentPhase) {
            this.currentPhase = newPhase;
            this.onPhaseChange();
        }
    }

    onPhaseChange() {
        // Speed up attacks
        this.attackCooldown = Math.max(40, this.attackCooldown - 20);

        // Visual effect
        if (typeof transitionManager !== 'undefined') {
            transitionManager.flash('red', 200, 0.5);
            transitionManager.shake(15, 600);
        }

        // Particle explosion
        if (typeof enhancedParticleSystem !== 'undefined') {
            for (let i = 0; i &lt; 50; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 3 + Math.random() * 5;
                enhancedParticleSystem.emit(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    'explosion'
                );
            }
        }
    }

    selectAttackPattern() {
        // Select random attack pattern, with more complex ones in later phases
        const availablePatterns = this.attackPatterns.slice(0, this.currentPhase + 1);
        const index = Math.floor(Math.random() * availablePatterns.length);
        this.currentAttackPattern = this.attackPatterns.indexOf(availablePatterns[index]);
    }

    executeAttackPattern(player) {
        const pattern = this.attackPatterns[this.currentAttackPattern];

        // Execute once per attack state
        if (this.stateTimer === 119) {
            switch (pattern) {
                case 'fireball_spread':
                    this.attackFireballSpread(player);
                    break;
                case 'ground_pound':
                    this.attackGroundPound(player);
                    break;
                case 'charge':
                    this.attackCharge(player);
                    break;
                case 'teleport_strike':
                    this.attackTeleportStrike(player);
                    break;
                case 'summon_ghosts':
                    this.attackSummonGhosts(player);
                    break;
                case 'phase_shift':
                    this.attackPhaseShift(player);
                    break;
                case 'laser_beam':
                    this.attackLaserBeam(player);
                    break;
                case 'laser_grid':
                    this.attackLaserGrid(player);
                    break;
                case 'missile_barrage':
                    this.attackMissileBarrage(player);
                    break;
                case 'fire_breath':
                    this.attackElementalBreath(player, 'fire');
                    break;
                case 'ice_breath':
                    this.attackElementalBreath(player, 'ice');
                    break;
                case 'lightning_strike':
                    this.attackLightningStrike(player);
                    break;
                case 'wind_gust':
                    this.attackWindGust(player);
                    break;
                case 'ultimate_barrage':
                    this.attackUltimateBarrage(player);
                    break;
                case 'summon_minions':
                    this.attackSummonMinions(player);
                    break;
                case 'chaos_magic':
                    this.attackChaosMagic(player);
                    break;
            }
        }
    }

    // ===== ATTACK IMPLEMENTATIONS =====

    attackFireballSpread(player) {
        const count = 5 + this.currentPhase * 2;
        const spreadAngle = Math.PI / 3;
        const baseAngle = Math.atan2(player.y - this.y, player.x - this.x);

        for (let i = 0; i &lt; count; i++) {
            const angle = baseAngle - spreadAngle / 2 + (spreadAngle * i) / (count - 1);
            const speed = 4 + Math.random() * 2;
            const proj = new BossProjectile(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'fireball',
                2
            );
            this.projectiles.push(proj);
        }

        this.createAttackEffect('explosion');
    }

    attackGroundPound(player) {
        this.velocityY = 15;

        // On landing, create shockwave
        setTimeout(() =&gt; {
            if (typeof enhancedParticleSystem !== 'undefined') {
                for (let i = 0; i &lt; 20; i++) {
                    const angle = Math.PI * i / 10;
                    enhancedParticleSystem.emit(
                        this.x + this.width / 2,
                        this.y + this.height,
                        Math.cos(angle) * 6,
                        -2,
                        'smoke'
                    );
                }
            }
        }, 500);
    }

    attackCharge(player) {
        const dx = player.x - this.x;
        this.velocityX = dx &gt; 0 ? 8 : -8;
        this.createAttackEffect('spark');
    }

    attackTeleportStrike(player) {
        // Teleport near player
        const offset = Math.random() &gt; 0.5 ? 100 : -100;
        this.x = player.x + offset;
        this.y = player.y - 50;

        // Create teleport effect
        this.createAttackEffect('magic');

        // Fire projectiles
        for (let i = 0; i &lt; 4; i++) {
            const angle = (Math.PI * 2 * i) / 4;
            const proj = new BossProjectile(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * 5,
                Math.sin(angle) * 5,
                'magic',
                1
            );
            this.projectiles.push(proj);
        }
    }

    attackSummonGhosts(player) {
        // This would spawn enemy ghosts
        // For now, create projectiles that act like ghosts
        for (let i = 0; i &lt; 3; i++) {
            const proj = new BossProjectile(
                this.x + Math.random() * this.width,
                this.y,
                (Math.random() - 0.5) * 4,
                2,
                'magic',
                1
            );
            this.projectiles.push(proj);
        }
    }

    attackPhaseShift(player) {
        this.invulnerable = true;
        this.invulnerabilityTimer = 60;

        // Rapid fire projectiles while invulnerable
        for (let i = 0; i &lt; 8; i++) {
            setTimeout(() =&gt; {
                const angle = Math.atan2(player.y - this.y, player.x - this.x);
                const proj = new BossProjectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(angle) * 6,
                    Math.sin(angle) * 6,
                    'magic',
                    1
                );
                this.projectiles.push(proj);
            }, i * 100);
        }
    }

    attackLaserBeam(player) {
        const angle = Math.atan2(player.y - this.y, player.x - this.x);

        for (let i = 0; i &lt; 10; i++) {
            const distance = i * 50;
            const proj = new BossProjectile(
                this.x + this.width / 2 + Math.cos(angle) * distance,
                this.y + this.height / 2 + Math.sin(angle) * distance,
                Math.cos(angle) * 10,
                Math.sin(angle) * 10,
                'laser',
                2
            );
            proj.maxLifetime = 30;
            this.projectiles.push(proj);
        }

        this.createAttackEffect('spark');
    }

    attackLaserGrid(player) {
        // Horizontal lasers
        for (let i = 0; i &lt; 3; i++) {
            const y = this.y + i * 40;
            const proj = new BossProjectile(
                this.x,
                y,
                8,
                0,
                'laser',
                2
            );
            this.projectiles.push(proj);
        }

        // Vertical lasers
        for (let i = 0; i &lt; 3; i++) {
            const x = this.x + i * 40;
            const proj = new BossProjectile(
                x,
                this.y,
                0,
                8,
                'laser',
                2
            );
            this.projectiles.push(proj);
        }
    }

    attackMissileBarrage(player) {
        const count = 6 + this.currentPhase * 2;

        for (let i = 0; i &lt; count; i++) {
            setTimeout(() =&gt; {
                const angle = Math.atan2(player.y - this.y, player.x - this.x) +
                    (Math.random() - 0.5) * 0.5;
                const proj = new BossProjectile(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(angle) * 7,
                    Math.sin(angle) * 7,
                    'rock',
                    2
                );
                this.projectiles.push(proj);
            }, i * 150);
        }
    }

    attackElementalBreath(player, element) {
        const count = 15;
        const spreadAngle = Math.PI / 2;
        const baseAngle = Math.atan2(player.y - this.y, player.x - this.x);

        for (let i = 0; i &lt; count; i++) {
            const angle = baseAngle - spreadAngle / 2 + (spreadAngle * i) / (count - 1);
            const speed = 3 + Math.random() * 3;
            const type = element === 'fire' ? 'fireball' : 'magic';
            const proj = new BossProjectile(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                type,
                1
            );
            this.projectiles.push(proj);
        }
    }

    attackLightningStrike(player) {
        // Create lightning at player position
        if (typeof enhancedParticleSystem !== 'undefined') {
            for (let i = 0; i &lt; 20; i++) {
                enhancedParticleSystem.emit(
                    player.x + player.width / 2,
                    0,
                    (Math.random() - 0.5) * 2,
                    10,
                    'star'
                );
            }
        }

        // Create damage zone
        const proj = new BossProjectile(
            player.x,
            player.y,
            0,
            0,
            'magic',
            3
        );
        proj.maxLifetime = 30;
        this.projectiles.push(proj);
    }

    attackWindGust(player) {
        // Push player
        const dx = player.x - this.x;
        const force = dx &gt; 0 ? 10 : -10;

        // Create visual effect
        if (typeof enhancedParticleSystem !== 'undefined') {
            for (let i = 0; i &lt; 30; i++) {
                enhancedParticleSystem.emit(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    force * 0.5,
                    (Math.random() - 0.5) * 5,
                    'smoke'
                );
            }
        }

        // This would affect player physics in actual implementation
    }

    attackUltimateBarrage(player) {
        // Combination attack
        this.attackFireballSpread(player);
        setTimeout(() =&gt; this.attackLaserBeam(player), 300);
        setTimeout(() =&gt; this.attackMissileBarrage(player), 600);
    }

    attackSummonMinions(player) {
        // Would spawn actual enemies in full implementation
        for (let i = 0; i &lt; 4; i++) {
            const angle = (Math.PI * 2 * i) / 4;
            const distance = 100;
            const proj = new BossProjectile(
                this.x + this.width / 2 + Math.cos(angle) * distance,
                this.y + this.height / 2 + Math.sin(angle) * distance,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                'magic',
                1
            );
            this.projectiles.push(proj);
        }
    }

    attackChaosMagic(player) {
        // Random chaos!
        for (let i = 0; i &lt; 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 6;
            const types = ['fireball', 'laser', 'magic', 'rock'];
            const type = types[Math.floor(Math.random() * types.length)];

            const proj = new BossProjectile(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                type,
                1
            );
            this.projectiles.push(proj);
        }
    }

    createAttackEffect(effectType) {
        if (typeof enhancedParticleSystem === 'undefined') {
            return;
        }

        for (let i = 0; i &lt; 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 3;
            enhancedParticleSystem.emit(
                this.x + this.width / 2,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                effectType
            );
        }
    }

    takeDamage(amount, player) {
        if (this.invulnerable || !this.vulnerable || this.defeated) {
            return false;
        }

        this.health -= amount;
        this.flashTimer = 10;
        this.invulnerable = true;
        this.invulnerabilityTimer = 30;

        // Create hit effect
        this.createAttackEffect('explosion');

        if (this.health &lt;= 0) {
            this.defeat();
        }

        return true;
    }

    defeat() {
        this.state = 'defeated';
        this.stateTimer = 120;
        this.defeated = false; // Will be set to true after animation

        // Play victory music
        if (typeof musicSystem !== 'undefined') {
            musicSystem.play('victory');
        }

        // Big explosion effect
        if (typeof transitionManager !== 'undefined') {
            transitionManager.shake(20, 1000);
        }

        if (typeof enhancedParticleSystem !== 'undefined') {
            for (let i = 0; i &lt; 100; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 3 + Math.random() * 8;
                enhancedParticleSystem.emit(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    'explosion'
                );
            }
        }
    }

    grantRewards() {
        const reward = this.defeatReward;

        // This would integrate with the game's scoring system
        if (typeof game !== 'undefined') {
            if (game.score !== undefined) {
                game.score += reward.score;
            }
            if (game.player &amp;&amp; game.player.lives !== undefined) {
                game.player.lives += reward.lives;
            }
        }

        // Achievement
        if (typeof achievementsManager !== 'undefined') {
            achievementsManager.unlock(`boss_defeated_${this.type}`);
        }
    }

    checkProjectileCollisions(player) {
        if (!player || player.invulnerable) {
            return;
        }

        this.projectiles.forEach(proj =&gt; {
            if (proj.checkCollision(player)) {
                proj.active = false;
                // Player takes damage
                if (player.takeDamage) {
                    player.takeDamage(proj.damage);
                }
            }
        });
    }

    render(ctx, camera) {
        if (this.defeated &amp;&amp; this.state !== 'defeated') {
            return;
        }

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        // Flash effect when hit
        if (this.flashTimer &gt; 0 &amp;&amp; this.flashTimer % 4 &lt; 2) {
            ctx.globalAlpha = 0.5;
        }

        // Invulnerability effect
        if (this.invulnerable) {
            ctx.globalAlpha = 0.7;
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FFFFFF';
        }

        // Vulnerability effect
        if (this.vulnerable) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FFFF00';
        }

        // Draw boss body
        ctx.fillStyle = this.color;
        ctx.fillRect(screenX, screenY, this.width, this.height);

        // Draw eyes
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(screenX + this.width * 0.25, screenY + this.height * 0.3, 8, 8);
        ctx.fillRect(screenX + this.width * 0.65, screenY + this.height * 0.3, 8, 8);
        ctx.fillStyle = '#000000';
        ctx.fillRect(screenX + this.width * 0.25 + 2, screenY + this.height * 0.3 + 2, 4, 4);
        ctx.fillRect(screenX + this.width * 0.65 + 2, screenY + this.height * 0.3 + 2, 4, 4);

        // Draw boss name
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, screenX + this.width / 2, screenY - 40);

        // Reset effects
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Render health bar
        this.renderHealthBar(ctx, camera);

        // Render projectiles
        this.projectiles.forEach(proj =&gt; {
            proj.render(ctx, camera);
        });

        // Render phase indicator
        this.renderPhaseIndicator(ctx, camera);
    }

    renderHealthBar(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        const barWidth = this.width;
        const barHeight = 8;
        const barY = screenY - 25;

        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(screenX, barY, barWidth, barHeight);

        // Health
        const healthPercent = Math.max(0, this.health / this.maxHealth);
        let healthColor = '#00FF00';
        if (healthPercent &lt; 0.33) {
            healthColor = '#FF0000';
        } else if (healthPercent &lt; 0.66) {
            healthColor = '#FFFF00';
        }

        ctx.fillStyle = healthColor;
        ctx.fillRect(screenX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, barY, barWidth, barHeight);
    }

    renderPhaseIndicator(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;

        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Phase ${this.currentPhase}/${this.maxPhases}`, screenX + this.width / 2, screenY - 55);
    }
}


// ===== BOSS MANAGER =====

class BossManager {
    constructor() {
        this.bosses = [];
        this.activeBoss = null;
    }

    addBoss(boss) {
        this.bosses.push(boss);
    }

    spawnBoss(x, y, type) {
        const boss = new BossEnemy(x, y, type);
        this.addBoss(boss);
        boss.startIntro();
        this.activeBoss = boss;
        return boss;
    }

    update(player, tiles, enemies) {
        this.bosses.forEach(boss =&gt; {
            if (!boss.defeated) {
                boss.update(player, tiles, enemies);
                boss.checkProjectileCollisions(player);
            }
        });

        // Remove defeated bosses
        this.bosses = this.bosses.filter(boss =&gt; !boss.defeated || boss.state === 'defeated');

        // Clear active boss if defeated
        if (this.activeBoss &amp;&amp; this.activeBoss.defeated) {
            this.activeBoss = null;
        }
    }

    render(ctx, camera) {
        this.bosses.forEach(boss =&gt; {
            boss.render(ctx, camera);
        });
    }

    hasActiveBoss() {
        return this.activeBoss !== null &amp;&amp; !this.activeBoss.defeated;
    }

    getActiveBoss() {
        return this.activeBoss;
    }

    reset() {
        this.bosses = [];
        this.activeBoss = null;
    }
}
