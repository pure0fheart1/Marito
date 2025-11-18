/**
 * Advanced Visual Effects and Graphics Enhancement System
 * Provides lighting, post-processing, particles, filters, weather, water effects, and more
 */

// Quality Levels
const QUALITY_PRESETS = {
    LOW: {
        lighting: false,
        shadows: false,
        bloom: false,
        particles: 50,
        postProcessing: false,
        weather: false,
        water: false,
        motionBlur: false,
        screenFilters: false
    },
    MEDIUM: {
        lighting: true,
        shadows: false,
        bloom: true,
        particles: 150,
        postProcessing: true,
        weather: true,
        water: false,
        motionBlur: false,
        screenFilters: true
    },
    HIGH: {
        lighting: true,
        shadows: true,
        bloom: true,
        particles: 300,
        postProcessing: true,
        weather: true,
        water: true,
        motionBlur: true,
        screenFilters: true
    },
    ULTRA: {
        lighting: true,
        shadows: true,
        bloom: true,
        particles: 500,
        postProcessing: true,
        weather: true,
        water: true,
        motionBlur: true,
        screenFilters: true,
        experimental: true
    }
};

/**
 * Lighting System
 */
class LightingSystem {
    constructor() {
        this.lights = [];
        this.ambientColor = { r: 100, g: 100, b: 120 };
        this.ambientIntensity = 0.3;
    }

    addLight(x, y, radius, color, intensity = 1.0) {
        this.lights.push({ x, y, radius, color, intensity, active: true });
    }

    removeLight(index) {
        if (index >= 0 && index < this.lights.length) {
            this.lights.splice(index, 1);
        }
    }

    update() {
        // Update dynamic lights (flickering, pulsing, etc.)
        this.lights.forEach(light => {
            if (light.flicker) {
                light.intensity = 0.8 + Math.random() * 0.4;
            }
            if (light.pulse) {
                const time = Date.now() / 1000;
                light.intensity = 0.7 + Math.sin(time * 3) * 0.3;
            }
        });
    }

    render(ctx, camera, quality) {
        if (!quality.lighting) {
            return;
        }

        // Apply ambient lighting
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(${this.ambientColor.r}, ${this.ambientColor.g}, ${this.ambientColor.b}, ${1 - this.ambientIntensity})`;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Apply dynamic lights
        ctx.globalCompositeOperation = 'lighter';
        this.lights.forEach(light => {
            if (!light.active) {
                return;
            }

            const screenPos = {
                x: light.x - camera.x,
                y: light.y - camera.y
            };

            const gradient = ctx.createRadialGradient(
                screenPos.x, screenPos.y, 0,
                screenPos.x, screenPos.y, light.radius
            );

            const alpha = light.intensity * 0.5;
            gradient.addColorStop(0, `${light.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(0.5, `${light.color}${Math.floor(alpha * 0.5 * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${light.color}00`);

            ctx.fillStyle = gradient;
            ctx.fillRect(
                screenPos.x - light.radius,
                screenPos.y - light.radius,
                light.radius * 2,
                light.radius * 2
            );
        });

        ctx.globalCompositeOperation = 'source-over';
    }

    clear() {
        this.lights = [];
    }
}

/**
 * Post-Processing Effects System
 */
class PostProcessingSystem {
    constructor() {
        this.bloomIntensity = 0.5;
        this.scanlineIntensity = 0.3;
        this.crtCurvature = 0.2;
        this.chromaticAberration = 2;
        this.vignetteIntensity = 0.3;
    }

    applyBloom(ctx, intensity = this.bloomIntensity) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;

        // Simple bloom by brightening bright pixels
        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            if (brightness > 180) {
                const boost = (brightness - 180) / 75 * intensity;
                data[i] = Math.min(255, data[i] * (1 + boost));
                data[i + 1] = Math.min(255, data[i + 1] * (1 + boost));
                data[i + 2] = Math.min(255, data[i + 2] * (1 + boost));
            }
        }

        ctx.putImageData(imageData, 0, 0);
    }

    applyScanlines(ctx, intensity = this.scanlineIntensity) {
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;

        for (let y = 0; y < ctx.canvas.height; y += 2) {
            ctx.fillRect(0, y, ctx.canvas.width, 1);
        }

        ctx.globalCompositeOperation = 'source-over';
    }

    applyCRTEffect(ctx) {
        // Add scanlines
        this.applyScanlines(ctx, 0.15);

        // Add vignette
        this.applyVignette(ctx);

        // Add slight color bleeding
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.putImageData(imageData, 1, 0);
        ctx.globalAlpha = 0.1;
        ctx.drawImage(ctx.canvas, -1, 0);
        ctx.globalAlpha = 1.0;
    }

    applyChromaticAberration(ctx, intensity = this.chromaticAberration) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = ctx.canvas.width;
        tempCanvas.height = ctx.canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Red channel offset
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.5;
        tempCtx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tempCanvas, -intensity, 0);

        // Green channel (normal)
        ctx.globalAlpha = 1.0;
        ctx.drawImage(tempCanvas, 0, 0);

        // Blue channel offset
        ctx.globalAlpha = 0.5;
        ctx.drawImage(tempCanvas, intensity, 0);

        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
    }

    applyVignette(ctx, intensity = this.vignetteIntensity) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const radius = Math.sqrt(centerX * centerX + centerY * centerY);

        const gradient = ctx.createRadialGradient(centerX, centerY, radius * 0.3, centerX, centerY, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${intensity})`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    applyColorGrading(ctx, preset = 'normal') {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;

        switch (preset) {
        case 'warm':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.1);     // More red
                data[i + 2] = data[i + 2] * 0.9;            // Less blue
            }
            break;
        case 'cool':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = data[i] * 0.9;                    // Less red
                data[i + 2] = Math.min(255, data[i + 2] * 1.1); // More blue
            }
            break;
        case 'vibrant':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.2);
                data[i + 1] = Math.min(255, data[i + 1] * 1.2);
                data[i + 2] = Math.min(255, data[i + 2] * 1.2);
            }
            break;
        case 'desaturated':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = avg * 0.5 + data[i] * 0.5;
                data[i + 1] = avg * 0.5 + data[i + 1] * 0.5;
                data[i + 2] = avg * 0.5 + data[i + 2] * 0.5;
            }
            break;
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

/**
 * Advanced Particle System with special effects
 */
class AdvancedParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.life = 0;
        this.maxLife = 0;
        this.size = 2;
        this.color = '#FFFFFF';
        this.type = 'circle'; // circle, square, star, trail, ribbon
        this.gravity = 0.3;
        this.friction = 0.98;
        this.rotation = 0;
        this.rotationSpeed = 0;
        this.fadeOut = true;
        this.trail = [];
        this.active = false;
    }

    init(config) {
        this.x = config.x;
        this.y = config.y;
        this.vx = config.vx || 0;
        this.vy = config.vy || 0;
        this.life = config.life || 60;
        this.maxLife = this.life;
        this.size = config.size || 2;
        this.color = config.color || '#FFFFFF';
        this.type = config.type || 'circle';
        this.gravity = config.gravity !== undefined ? config.gravity : 0.3;
        this.friction = config.friction !== undefined ? config.friction : 0.98;
        this.rotation = config.rotation || 0;
        this.rotationSpeed = config.rotationSpeed || 0;
        this.fadeOut = config.fadeOut !== undefined ? config.fadeOut : true;
        this.trail = [];
        this.active = true;
    }

    update() {
        if (!this.active) {
            return;
        }

        // Store trail positions
        if (this.type === 'trail' && this.trail.length < 10) {
            this.trail.push({ x: this.x, y: this.y });
        }

        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        this.life--;
        if (this.life <= 0) {
            this.active = false;
        }
    }

    render(ctx, camera) {
        if (!this.active) {
            return;
        }

        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        const alpha = this.fadeOut ? (this.life / this.maxLife) : 1;

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(screenX, screenY);
        ctx.rotate(this.rotation);

        switch (this.type) {
        case 'circle':
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.size, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 'square':
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            break;
        case 'star':
            this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2, this.color);
            break;
        case 'trail':
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.beginPath();
            if (this.trail.length > 0) {
                ctx.moveTo(this.trail[0].x - this.x, this.trail[0].y - this.y);
                for (let i = 1; i < this.trail.length; i++) {
                    ctx.lineTo(this.trail[i].x - this.x, this.trail[i].y - this.y);
                }
                ctx.lineTo(0, 0);
                ctx.stroke();
            }
            break;
        case 'ribbon':
            ctx.strokeStyle = this.color;
            ctx.lineWidth = this.size;
            ctx.beginPath();
            ctx.moveTo(-this.size * 2, 0);
            ctx.bezierCurveTo(-this.size, -this.size, this.size, this.size, this.size * 2, 0);
            ctx.stroke();
            break;
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
}

class AdvancedParticleSystem {
    constructor(maxParticles = 500) {
        this.particles = [];
        for (let i = 0; i < maxParticles; i++) {
            this.particles.push(new AdvancedParticle());
        }
    }

    getParticle() {
        return this.particles.find(p => !p.active);
    }

    emit(config) {
        const particle = this.getParticle();
        if (particle) {
            particle.init(config);
        }
    }

    createSpiral(x, y, count = 20, color = '#FFD700') {
        const angleStep = (Math.PI * 2) / count;
        for (let i = 0; i < count; i++) {
            const angle = angleStep * i;
            const speed = 3 + Math.random() * 2;
            this.emit({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color,
                life: 60 + Math.random() * 30,
                size: 3 + Math.random() * 2,
                type: 'star',
                rotationSpeed: 0.1
            });
        }
    }

    createFireworks(x, y, colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']) {
        const burstCount = 30;
        for (let i = 0; i < burstCount; i++) {
            const angle = (Math.PI * 2 * i) / burstCount;
            const speed = 5 + Math.random() * 3;
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.emit({
                x, y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 3,
                color,
                life: 80 + Math.random() * 40,
                size: 4,
                type: 'trail',
                gravity: 0.15
            });
        }
    }

    createRibbon(x, y, count = 10, color = '#FFD700') {
        for (let i = 0; i < count; i++) {
            this.emit({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: -2 - Math.random() * 3,
                color,
                life: 60 + Math.random() * 30,
                size: 3 + Math.random() * 2,
                type: 'ribbon',
                rotationSpeed: (Math.random() - 0.5) * 0.2,
                gravity: 0.1
            });
        }
    }

    update() {
        this.particles.forEach(p => p.update());
    }

    render(ctx, camera) {
        this.particles.forEach(p => p.render(ctx, camera));
    }

    clear() {
        this.particles.forEach(p => p.reset());
    }

    getActiveCount() {
        return this.particles.filter(p => p.active).length;
    }
}

/**
 * Screen Filter Effects
 */
class ScreenFilterSystem {
    constructor() {
        this.activeFilter = 'none';
    }

    applyFilter(ctx, filterName) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;

        switch (filterName) {
        case 'sepia':
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
                data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
                data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
            }
            break;
        case 'noir':
            for (let i = 0; i < data.length; i += 4) {
                const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
                data[i] = data[i + 1] = data[i + 2] = avg;
            }
            // Increase contrast
            for (let i = 0; i < data.length; i += 4) {
                data[i] = ((data[i] - 128) * 1.5) + 128;
                data[i + 1] = ((data[i + 1] - 128) * 1.5) + 128;
                data[i + 2] = ((data[i + 2] - 128) * 1.5) + 128;
            }
            break;
        case 'retro':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.floor(data[i] / 64) * 64;
                data[i + 1] = Math.floor(data[i + 1] / 64) * 64;
                data[i + 2] = Math.floor(data[i + 2] / 64) * 64;
            }
            break;
        case 'neon':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = Math.min(255, data[i] * 1.5);
                data[i + 1] = Math.min(255, data[i + 1] * 1.3);
                data[i + 2] = Math.min(255, data[i + 2] * 1.5);
            }
            break;
        case 'invert':
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            break;
        }

        ctx.putImageData(imageData, 0, 0);
    }

    setFilter(filterName) {
        this.activeFilter = filterName;
    }
}

/**
 * Weather Effects System
 */
class WeatherSystem {
    constructor() {
        this.effects = [];
        this.activeWeather = 'none';
    }

    createLightning(ctx) {
        // Flash the screen white
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw lightning bolt
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 20;

        const startX = Math.random() * ctx.canvas.width;
        const segments = 10;
        let x = startX;
        let y = 0;

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 0; i < segments; i++) {
            x += (Math.random() - 0.5) * 50;
            y += ctx.canvas.height / segments;
            ctx.lineTo(x, y);
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    createAurora(ctx, time) {
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;

        const gradient = ctx.createLinearGradient(0, 0, width, height / 2);
        const hue1 = (time * 20) % 360;
        const hue2 = (time * 20 + 60) % 360;

        gradient.addColorStop(0, `hsla(${hue1}, 80%, 60%, 0.1)`);
        gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 60%, 0.2)`);
        gradient.addColorStop(1, `hsla(${hue1}, 80%, 60%, 0.05)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height / 2);

        // Add wavy effect
        ctx.globalCompositeOperation = 'lighter';
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            const offset = time * 30 + i * 100;
            ctx.moveTo(0, height / 4);
            for (let x = 0; x < width; x += 10) {
                const y = height / 4 + Math.sin((x + offset) / 50) * 20;
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = `hsla(${(hue1 + i * 30) % 360}, 80%, 60%, 0.15)`;
            ctx.lineWidth = 20;
            ctx.stroke();
        }
        ctx.globalCompositeOperation = 'source-over';
    }

    createMeteorShower(particles, camera) {
        if (Math.random() < 0.05) {
            const x = Math.random() * 1024 + camera.x;
            const y = -50 + camera.y;
            particles.emit({
                x, y,
                vx: 5 + Math.random() * 3,
                vy: 8 + Math.random() * 4,
                color: '#FFFFFF',
                life: 40 + Math.random() * 20,
                size: 3,
                type: 'trail',
                gravity: 0
            });
        }
    }

    update(ctx, particles, camera, weatherType) {
        this.activeWeather = weatherType;
        const time = Date.now() / 1000;

        switch (weatherType) {
        case 'lightning':
            if (Math.random() < 0.01) {
                this.createLightning(ctx);
            }
            break;
        case 'aurora':
            this.createAurora(ctx, time);
            break;
        case 'meteors':
            this.createMeteorShower(particles, camera);
            break;
        }
    }
}

/**
 * Water Effects System
 */
class WaterEffectSystem {
    constructor() {
        this.ripples = [];
    }

    createRipple(x, y) {
        this.ripples.push({
            x, y,
            radius: 0,
            maxRadius: 50,
            alpha: 1,
            active: true
        });
    }

    update() {
        this.ripples.forEach(ripple => {
            if (!ripple.active) {
                return;
            }

            ripple.radius += 2;
            ripple.alpha = 1 - (ripple.radius / ripple.maxRadius);

            if (ripple.radius >= ripple.maxRadius) {
                ripple.active = false;
            }
        });

        // Remove inactive ripples
        this.ripples = this.ripples.filter(r => r.active);
    }

    render(ctx, camera, waterY) {
        this.ripples.forEach(ripple => {
            if (!ripple.active) {
                return;
            }

            const screenX = ripple.x - camera.x;
            const screenY = ripple.y - camera.y;

            ctx.globalAlpha = ripple.alpha;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(screenX, screenY, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        });

        // Simple water reflection
        if (waterY !== undefined) {
            const screenWaterY = waterY - camera.y;
            ctx.save();
            ctx.globalAlpha = 0.3;
            ctx.translate(0, screenWaterY * 2);
            ctx.scale(1, -1);
            // Reflection would be drawn here (simplified for this example)
            ctx.restore();
        }
    }
}

/**
 * Advanced Camera Effects
 */
class CameraEffects {
    constructor() {
        this.zoom = 1.0;
        this.targetZoom = 1.0;
        this.rotation = 0;
        this.targetRotation = 0;
        this.tiltShift = { x: 0, y: 0 };
        this.shakeDuration = 0;
        this.shakeIntensity = 0;
        this.shakeStartTime = 0;
    }

    setZoom(zoom, smooth = true) {
        if (smooth) {
            this.targetZoom = zoom;
        } else {
            this.zoom = zoom;
            this.targetZoom = zoom;
        }
    }

    setRotation(rotation, smooth = true) {
        if (smooth) {
            this.targetRotation = rotation;
        } else {
            this.rotation = rotation;
            this.targetRotation = rotation;
        }
    }

    shake(intensity, duration) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeStartTime = Date.now();
    }

    update() {
        // Smooth zoom
        this.zoom += (this.targetZoom - this.zoom) * 0.1;

        // Smooth rotation
        this.rotation += (this.targetRotation - this.rotation) * 0.1;

        // Update shake
        if (this.shakeDuration > 0) {
            const elapsed = Date.now() - this.shakeStartTime;
            if (elapsed > this.shakeDuration) {
                this.shakeDuration = 0;
                this.tiltShift = { x: 0, y: 0 };
            } else {
                const progress = elapsed / this.shakeDuration;
                const intensity = this.shakeIntensity * (1 - progress);
                this.tiltShift.x = (Math.random() - 0.5) * intensity;
                this.tiltShift.y = (Math.random() - 0.5) * intensity;
            }
        }
    }

    apply(ctx) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;

        ctx.translate(centerX + this.tiltShift.x, centerY + this.tiltShift.y);
        ctx.rotate(this.rotation);
        ctx.scale(this.zoom, this.zoom);
        ctx.translate(-centerX, -centerY);
    }

    reset(ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}

/**
 * Sprite Effects System
 */
class SpriteEffects {
    applyOutline(ctx, x, y, width, height, color, thickness = 2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.strokeRect(x - thickness / 2, y - thickness / 2, width + thickness, height + thickness);
    }

    applyDropShadow(ctx, x, y, width, height, color = 'rgba(0,0,0,0.5)', offset = 4) {
        ctx.fillStyle = color;
        ctx.fillRect(x + offset, y + offset, width, height);
    }

    applyGlow(ctx, x, y, width, height, color, intensity = 10) {
        ctx.shadowColor = color;
        ctx.shadowBlur = intensity;
        ctx.fillRect(x, y, width, height);
        ctx.shadowBlur = 0;
    }

    applySquashStretch(ctx, x, y, width, height, squash = 1, stretch = 1) {
        ctx.save();
        ctx.translate(x + width / 2, y + height / 2);
        ctx.scale(squash, stretch);
        ctx.translate(-(x + width / 2), -(y + height / 2));
        // Draw sprite here
        ctx.restore();
    }

    applyHueShift(ctx, degrees) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];

            // Convert RGB to HSL
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const l = (max + min) / 2 / 255;
            let h = 0;
            let s = 0;

            if (max !== min) {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

                if (max === r) {
                    h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                } else if (max === g) {
                    h = ((b - r) / d + 2) / 6;
                } else {
                    h = ((r - g) / d + 4) / 6;
                }
            }

            // Shift hue
            h = (h + degrees / 360) % 1;

            // Convert back to RGB
            const hue2rgb = (p, q, t) => {
                if (t < 0) {
                    t += 1;
                }
                if (t > 1) {
                    t -= 1;
                }
                if (t < 1 / 6) {
                    return p + (q - p) * 6 * t;
                }
                if (t < 1 / 2) {
                    return q;
                }
                if (t < 2 / 3) {
                    return p + (q - p) * (2 / 3 - t) * 6;
                }
                return p;
            };

            let nr, ng, nb;
            if (s === 0) {
                nr = ng = nb = l;
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                nr = hue2rgb(p, q, h + 1 / 3);
                ng = hue2rgb(p, q, h);
                nb = hue2rgb(p, q, h - 1 / 3);
            }

            data[i] = nr * 255;
            data[i + 1] = ng * 255;
            data[i + 2] = nb * 255;
        }

        ctx.putImageData(imageData, 0, 0);
    }
}

/**
 * Cinematic Effects System
 */
class CinematicEffects {
    constructor() {
        this.letterboxHeight = 0;
        this.targetLetterboxHeight = 0;
        this.timeScale = 1.0;
        this.freezeFrame = false;
        this.freezeFrameData = null;
        this.bulletTimeActive = false;
    }

    enableLetterbox(enable = true, height = 80) {
        this.targetLetterboxHeight = enable ? height : 0;
    }

    setTimeScale(scale) {
        this.timeScale = Math.max(0.01, Math.min(2.0, scale));
    }

    enableSlowMotion(duration = 2000, scale = 0.3) {
        this.setTimeScale(scale);
        setTimeout(() => {
            this.setTimeScale(1.0);
        }, duration / scale);
    }

    setFreezeFrame(ctx, enabled = true) {
        if (enabled && !this.freezeFrame) {
            this.freezeFrameData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
            this.freezeFrame = true;
        } else if (!enabled) {
            this.freezeFrame = false;
            this.freezeFrameData = null;
        }
    }

    enableBulletTime(enabled = true) {
        this.bulletTimeActive = enabled;
        if (enabled) {
            this.setTimeScale(0.2);
        } else {
            this.setTimeScale(1.0);
        }
    }

    update() {
        // Smooth letterbox transition
        this.letterboxHeight += (this.targetLetterboxHeight - this.letterboxHeight) * 0.1;
    }

    render(ctx) {
        // Render freeze frame if active
        if (this.freezeFrame && this.freezeFrameData) {
            ctx.putImageData(this.freezeFrameData, 0, 0);
        }

        // Render letterbox bars
        if (this.letterboxHeight > 0) {
            ctx.fillStyle = 'rgba(0, 0, 0, 1)';
            ctx.fillRect(0, 0, ctx.canvas.width, this.letterboxHeight);
            ctx.fillRect(0, ctx.canvas.height - this.letterboxHeight, ctx.canvas.width, this.letterboxHeight);
        }
    }
}

/**
 * Motion Blur Effect
 */
class MotionBlurEffect {
    constructor() {
        this.previousFrames = [];
        this.maxFrames = 3;
        this.intensity = 0.3;
    }

    capture(ctx) {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.previousFrames.push(imageData);

        if (this.previousFrames.length > this.maxFrames) {
            this.previousFrames.shift();
        }
    }

    apply(ctx) {
        if (this.previousFrames.length === 0) {
            return;
        }

        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        this.previousFrames.forEach((frame, index) => {
            const alpha = (this.intensity / this.previousFrames.length) * (index + 1);
            ctx.globalAlpha = alpha;
            ctx.putImageData(frame, 0, 0);
        });

        ctx.globalAlpha = 1.0;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
    }

    clear() {
        this.previousFrames = [];
    }
}

/**
 * Main Visual Effects Manager
 */
class VisualEffectsManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Initialize subsystems
        this.lighting = new LightingSystem();
        this.postProcessing = new PostProcessingSystem();
        this.advancedParticles = new AdvancedParticleSystem(500);
        this.screenFilters = new ScreenFilterSystem();
        this.weather = new WeatherSystem();
        this.water = new WaterEffectSystem();
        this.cameraEffects = new CameraEffects();
        this.spriteEffects = new SpriteEffects();
        this.cinematic = new CinematicEffects();
        this.motionBlur = new MotionBlurEffect();

        // Quality settings
        this.quality = { ...QUALITY_PRESETS.HIGH };

        // Effect toggles
        this.enabled = true;
        this.currentWeather = 'none';
        this.currentFilter = 'none';
    }

    setQuality(preset) {
        if (QUALITY_PRESETS[preset]) {
            this.quality = { ...QUALITY_PRESETS[preset] };
        }
    }

    update(camera) {
        if (!this.enabled) {
            return;
        }

        this.lighting.update();
        this.advancedParticles.update();
        this.water.update();
        this.cameraEffects.update();
        this.cinematic.update();

        return this.cinematic.timeScale;
    }

    render(camera) {
        if (!this.enabled) {
            return;
        }

        // Apply camera effects
        if (this.quality.postProcessing) {
            this.cameraEffects.apply(this.ctx);
        }

        // Render particles
        if (this.quality.particles > 0) {
            this.advancedParticles.render(this.ctx, camera);
        }

        // Reset camera transform
        this.cameraEffects.reset(this.ctx);
    }

    applyPostEffects(camera) {
        if (!this.enabled || !this.quality.postProcessing) {
            return;
        }

        // Apply weather effects
        if (this.quality.weather && this.currentWeather !== 'none') {
            this.weather.update(this.ctx, this.advancedParticles, camera, this.currentWeather);
        }

        // Apply post-processing
        if (this.quality.bloom) {
            this.postProcessing.applyBloom(this.ctx);
        }

        // Apply screen filters
        if (this.quality.screenFilters && this.currentFilter !== 'none') {
            this.screenFilters.applyFilter(this.ctx, this.currentFilter);
        }

        // Apply motion blur
        if (this.quality.motionBlur) {
            this.motionBlur.apply(this.ctx);
            this.motionBlur.capture(this.ctx);
        }

        // Apply cinematic effects
        this.cinematic.render(this.ctx);

        // Apply lighting
        this.lighting.render(this.ctx, camera, this.quality);
    }

    // Event-driven effects
    onLevelStart(x, y) {
        this.cinematic.enableLetterbox(true);
        this.advancedParticles.createSpiral(x, y, 30, '#FFD700');

        setTimeout(() => {
            this.cinematic.enableLetterbox(false);
        }, 2000);
    }

    onPowerUpCollect(x, y, type) {
        this.cameraEffects.shake(5, 200);
        this.advancedParticles.createSpiral(x, y, 20, this.getPowerUpColor(type));
        this.lighting.addLight(x, y, 100, this.getPowerUpColor(type), 1.0);
    }

    onEnemyDefeat(x, y, isBoss = false) {
        if (isBoss) {
            this.cinematic.enableSlowMotion(3000, 0.3);
            this.advancedParticles.createFireworks(x, y);
            this.cameraEffects.shake(15, 500);
        } else {
            this.advancedParticles.createSpiral(x, y, 10, '#8B4513');
            this.cameraEffects.shake(3, 150);
        }
    }

    onBossDefeat(x, y) {
        this.cinematic.enableLetterbox(true);
        this.cinematic.enableSlowMotion(4000, 0.2);

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.advancedParticles.createFireworks(
                    x + (Math.random() - 0.5) * 100,
                    y + (Math.random() - 0.5) * 100
                );
            }, i * 300);
        }

        setTimeout(() => {
            this.cinematic.enableLetterbox(false);
        }, 4000);
    }

    getPowerUpColor(type) {
        const colors = {
            mushroom: '#FF0000',
            fireflower: '#FF6600',
            star: '#FFFF00',
            '1up': '#00FF00'
        };
        return colors[type] || '#FFD700';
    }

    // Quality presets access
    getQualityPresets() {
        return Object.keys(QUALITY_PRESETS);
    }

    getCurrentQuality() {
        return this.quality;
    }

    // Individual effect controls
    setWeather(type) {
        this.currentWeather = type;
    }

    setFilter(type) {
        this.currentFilter = type;
        this.screenFilters.setFilter(type);
    }

    enableEffect(effectName, enabled) {
        switch (effectName) {
        case 'lighting':
            this.quality.lighting = enabled;
            break;
        case 'bloom':
            this.quality.bloom = enabled;
            break;
        case 'weather':
            this.quality.weather = enabled;
            break;
        case 'motionBlur':
            this.quality.motionBlur = enabled;
            break;
        }
    }

    clear() {
        this.lighting.clear();
        this.advancedParticles.clear();
        this.motionBlur.clear();
    }

    getStats() {
        return {
            particles: this.advancedParticles.getActiveCount(),
            lights: this.lighting.lights.length,
            quality: this.findQualityPreset(),
            weather: this.currentWeather,
            filter: this.currentFilter
        };
    }

    findQualityPreset() {
        for (const [name, preset] of Object.entries(QUALITY_PRESETS)) {
            if (JSON.stringify(preset) === JSON.stringify(this.quality)) {
                return name;
            }
        }
        return 'CUSTOM';
    }
}

// Initialize as singleton when ready
let visualEffects = null;

function initVisualEffects(canvas) {
    visualEffects = new VisualEffectsManager(canvas);
    return visualEffects;
}
