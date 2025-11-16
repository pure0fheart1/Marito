/**
 * Screen Transitions and Visual Effects System
 * Handles smooth transitions between game states and visual polish
 */

class TransitionManager {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;

        this.currentTransition = null;
        this.isTransitioning = false;
        this.transitionCallback = null;

        // Transition settings
        this.fadeSpeed = 0.05;
        this.slideSpeed = 20;
        this.wipeSpeed = 25;

        // Effects state
        this.flashEffect = {
            active: false,
            color: 'white',
            alpha: 0,
            duration: 0,
            elapsed: 0
        };

        this.shakeEffect = {
            active: false,
            intensity: 0,
            duration: 0,
            elapsed: 0,
            offsetX: 0,
            offsetY: 0
        };

        this.zoomEffect = {
            active: false,
            targetScale: 1,
            currentScale: 1,
            speed: 0.05
        };
    }

    /**
     * Start a fade transition
     * @param {string} type - 'in' or 'out'
     * @param {Function} callback - Function to call when transition completes
     * @param {string} color - Fade color
     */
    fade(type, callback = null, color = 'black') {
        this.currentTransition = {
            type: 'fade',
            direction: type,
            alpha: type === 'out' ? 0 : 1,
            color: color
        };
        this.isTransitioning = true;
        this.transitionCallback = callback;
    }

    /**
     * Start a slide transition
     * @param {string} direction - 'left', 'right', 'up', 'down'
     * @param {Function} callback - Function to call when transition completes
     * @param {string} color - Slide color
     */
    slide(direction, callback = null, color = 'black') {
        const positions = {
            left: { x: -this.canvas.width, y: 0 },
            right: { x: this.canvas.width, y: 0 },
            up: { x: 0, y: -this.canvas.height },
            down: { x: 0, y: this.canvas.height }
        };

        this.currentTransition = {
            type: 'slide',
            direction: direction,
            x: positions[direction].x,
            y: positions[direction].y,
            targetX: 0,
            targetY: 0,
            color: color
        };
        this.isTransitioning = true;
        this.transitionCallback = callback;
    }

    /**
     * Start a wipe transition
     * @param {string} direction - 'horizontal' or 'vertical'
     * @param {Function} callback - Function to call when transition completes
     * @param {string} color - Wipe color
     */
    wipe(direction, callback = null, color = 'black') {
        this.currentTransition = {
            type: 'wipe',
            direction: direction,
            progress: 0,
            color: color
        };
        this.isTransitioning = true;
        this.transitionCallback = callback;
    }

    /**
     * Start a circle transition (iris effect)
     * @param {string} type - 'in' or 'out'
     * @param {Function} callback - Function to call when transition completes
     * @param {string} color - Circle color
     */
    circle(type, callback = null, color = 'black') {
        const maxRadius = Math.sqrt(
            Math.pow(this.canvas.width, 2) + Math.pow(this.canvas.height, 2)
        );

        this.currentTransition = {
            type: 'circle',
            direction: type,
            radius: type === 'out' ? 0 : maxRadius,
            targetRadius: type === 'out' ? maxRadius : 0,
            maxRadius: maxRadius,
            color: color,
            centerX: this.canvas.width / 2,
            centerY: this.canvas.height / 2
        };
        this.isTransitioning = true;
        this.transitionCallback = callback;
    }

    /**
     * Start a pixelate transition
     * @param {string} type - 'in' or 'out'
     * @param {Function} callback - Function to call when transition completes
     */
    pixelate(type, callback = null) {
        this.currentTransition = {
            type: 'pixelate',
            direction: type,
            blockSize: type === 'out' ? 1 : 32,
            targetSize: type === 'out' ? 32 : 1
        };
        this.isTransitioning = true;
        this.transitionCallback = callback;
    }

    /**
     * Trigger screen flash effect
     * @param {string} color - Flash color
     * @param {number} duration - Duration in milliseconds
     * @param {number} intensity - Flash intensity (0-1)
     */
    flash(color = 'white', duration = 200, intensity = 0.8) {
        this.flashEffect = {
            active: true,
            color: color,
            alpha: intensity,
            duration: duration,
            elapsed: 0
        };
    }

    /**
     * Trigger screen shake effect
     * @param {number} intensity - Shake intensity in pixels
     * @param {number} duration - Duration in milliseconds
     */
    shake(intensity = 10, duration = 300) {
        this.shakeEffect = {
            active: true,
            intensity: intensity,
            duration: duration,
            elapsed: 0,
            offsetX: 0,
            offsetY: 0
        };
    }

    /**
     * Trigger zoom effect
     * @param {number} targetScale - Target scale (1 = normal)
     * @param {number} speed - Zoom speed
     */
    zoom(targetScale = 1.2, speed = 0.05) {
        this.zoomEffect = {
            active: true,
            targetScale: targetScale,
            currentScale: 1,
            speed: speed
        };
    }

    /**
     * Update transitions and effects
     * @param {number} deltaTime - Time since last frame in ms
     */
    update(deltaTime) {
        // Update main transition
        if (this.isTransitioning && this.currentTransition) {
            this.updateTransition(deltaTime);
        }

        // Update flash effect
        if (this.flashEffect.active) {
            this.updateFlash(deltaTime);
        }

        // Update shake effect
        if (this.shakeEffect.active) {
            this.updateShake(deltaTime);
        }

        // Update zoom effect
        if (this.zoomEffect.active) {
            this.updateZoom(deltaTime);
        }
    }

    /**
     * Update current transition
     * @param {number} deltaTime - Time since last frame
     */
    updateTransition(deltaTime) {
        const transition = this.currentTransition;

        switch (transition.type) {
            case 'fade':
                if (transition.direction === 'out') {
                    transition.alpha += this.fadeSpeed;
                    if (transition.alpha >= 1) {
                        this.completeTransition();
                    }
                } else {
                    transition.alpha -= this.fadeSpeed;
                    if (transition.alpha <= 0) {
                        this.completeTransition();
                    }
                }
                break;

            case 'slide':
                const targetX = 0;
                const targetY = 0;
                const distX = targetX - transition.x;
                const distY = targetY - transition.y;
                const distance = Math.sqrt(distX * distX + distY * distY);

                if (distance < 1) {
                    this.completeTransition();
                } else {
                    transition.x += distX * 0.2;
                    transition.y += distY * 0.2;
                }
                break;

            case 'wipe':
                transition.progress += this.wipeSpeed;
                if (transition.progress >= (transition.direction === 'horizontal' ?
                    this.canvas.width : this.canvas.height)) {
                    this.completeTransition();
                }
                break;

            case 'circle':
                const diff = transition.targetRadius - transition.radius;
                transition.radius += diff * 0.15;

                if (Math.abs(diff) < 1) {
                    this.completeTransition();
                }
                break;

            case 'pixelate':
                const blockDiff = transition.targetSize - transition.blockSize;
                transition.blockSize += blockDiff * 0.15;

                if (Math.abs(blockDiff) < 0.5) {
                    this.completeTransition();
                }
                break;
        }
    }

    /**
     * Update flash effect
     * @param {number} deltaTime - Time since last frame
     */
    updateFlash(deltaTime) {
        this.flashEffect.elapsed += deltaTime;

        if (this.flashEffect.elapsed >= this.flashEffect.duration) {
            this.flashEffect.active = false;
            this.flashEffect.alpha = 0;
        } else {
            const progress = this.flashEffect.elapsed / this.flashEffect.duration;
            this.flashEffect.alpha = (1 - progress) * 0.8;
        }
    }

    /**
     * Update shake effect
     * @param {number} deltaTime - Time since last frame
     */
    updateShake(deltaTime) {
        this.shakeEffect.elapsed += deltaTime;

        if (this.shakeEffect.elapsed >= this.shakeEffect.duration) {
            this.shakeEffect.active = false;
            this.shakeEffect.offsetX = 0;
            this.shakeEffect.offsetY = 0;
        } else {
            const progress = 1 - (this.shakeEffect.elapsed / this.shakeEffect.duration);
            const currentIntensity = this.shakeEffect.intensity * progress;

            this.shakeEffect.offsetX = (Math.random() - 0.5) * currentIntensity * 2;
            this.shakeEffect.offsetY = (Math.random() - 0.5) * currentIntensity * 2;
        }
    }

    /**
     * Update zoom effect
     * @param {number} deltaTime - Time since last frame
     */
    updateZoom(deltaTime) {
        const diff = this.zoomEffect.targetScale - this.zoomEffect.currentScale;

        if (Math.abs(diff) < 0.01) {
            this.zoomEffect.active = false;
            this.zoomEffect.currentScale = this.zoomEffect.targetScale;
        } else {
            this.zoomEffect.currentScale += diff * this.zoomEffect.speed;
        }
    }

    /**
     * Complete current transition
     */
    completeTransition() {
        this.isTransitioning = false;

        if (this.transitionCallback) {
            this.transitionCallback();
            this.transitionCallback = null;
        }

        this.currentTransition = null;
    }

    /**
     * Render transitions and effects
     */
    render() {
        const ctx = this.ctx;

        // Apply shake offset
        if (this.shakeEffect.active) {
            ctx.save();
            ctx.translate(this.shakeEffect.offsetX, this.shakeEffect.offsetY);
        }

        // Apply zoom effect
        if (this.zoomEffect.active && this.zoomEffect.currentScale !== 1) {
            ctx.save();
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            ctx.translate(centerX, centerY);
            ctx.scale(this.zoomEffect.currentScale, this.zoomEffect.currentScale);
            ctx.translate(-centerX, -centerY);
        }
    }

    /**
     * Render post-effects (call after game render)
     */
    renderPost() {
        const ctx = this.ctx;

        // Restore zoom transform
        if (this.zoomEffect.active && this.zoomEffect.currentScale !== 1) {
            ctx.restore();
        }

        // Restore shake transform
        if (this.shakeEffect.active) {
            ctx.restore();
        }

        // Render flash effect
        if (this.flashEffect.active && this.flashEffect.alpha > 0) {
            ctx.save();
            ctx.fillStyle = this.flashEffect.color;
            ctx.globalAlpha = this.flashEffect.alpha;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            ctx.restore();
        }

        // Render main transition
        if (this.isTransitioning && this.currentTransition) {
            this.renderTransition();
        }
    }

    /**
     * Render current transition effect
     */
    renderTransition() {
        const ctx = this.ctx;
        const transition = this.currentTransition;

        ctx.save();

        switch (transition.type) {
            case 'fade':
                ctx.fillStyle = transition.color;
                ctx.globalAlpha = transition.alpha;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                break;

            case 'slide':
                ctx.fillStyle = transition.color;
                ctx.fillRect(
                    transition.x,
                    transition.y,
                    this.canvas.width,
                    this.canvas.height
                );
                break;

            case 'wipe':
                ctx.fillStyle = transition.color;
                if (transition.direction === 'horizontal') {
                    ctx.fillRect(0, 0, transition.progress, this.canvas.height);
                } else {
                    ctx.fillRect(0, 0, this.canvas.width, transition.progress);
                }
                break;

            case 'circle':
                // Create clipping circle
                ctx.globalCompositeOperation = 'destination-out';
                ctx.beginPath();
                ctx.arc(
                    transition.centerX,
                    transition.centerY,
                    transition.radius,
                    0,
                    Math.PI * 2
                );
                ctx.closePath();
                ctx.fill();

                // Draw background
                ctx.globalCompositeOperation = 'destination-over';
                ctx.fillStyle = transition.color;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                break;

            case 'pixelate':
                // This would require capturing the canvas and redrawing pixelated
                // Simplified version: just fade effect
                const progress = 1 - (transition.blockSize / 32);
                ctx.fillStyle = 'black';
                ctx.globalAlpha = 1 - progress;
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                break;
        }

        ctx.restore();
    }

    /**
     * Skip current transition
     */
    skip() {
        if (this.isTransitioning) {
            this.completeTransition();
        }
    }

    /**
     * Check if currently transitioning
     * @returns {boolean} True if transitioning
     */
    isActive() {
        return this.isTransitioning;
    }

    /**
     * Reset all effects
     */
    reset() {
        this.currentTransition = null;
        this.isTransitioning = false;
        this.transitionCallback = null;
        this.flashEffect.active = false;
        this.shakeEffect.active = false;
        this.zoomEffect.active = false;
    }

    /**
     * Predefined transition sequences
     */

    /**
     * Level start transition
     * @param {Function} callback - Function to call when complete
     */
    levelStart(callback) {
        this.fade('in', callback, 'black');
    }

    /**
     * Level complete transition
     * @param {Function} callback - Function to call when complete
     */
    levelComplete(callback) {
        this.flash('white', 300, 0.9);
        setTimeout(() => {
            this.fade('out', callback, 'white');
        }, 300);
    }

    /**
     * Death transition
     * @param {Function} callback - Function to call when complete
     */
    death(callback) {
        this.shake(15, 200);
        this.flash('red', 200, 0.6);
        setTimeout(() => {
            this.fade('out', callback, 'black');
        }, 500);
    }

    /**
     * Victory transition
     * @param {Function} callback - Function to call when complete
     */
    victory(callback) {
        this.flash('gold', 400, 0.7);
        setTimeout(() => {
            this.circle('out', callback, 'black');
        }, 400);
    }

    /**
     * Menu transition
     * @param {Function} callback - Function to call when complete
     */
    menu(callback) {
        this.fade('out', () => {
            if (callback) {
                callback();
            }
            this.fade('in');
        }, 'black');
    }

    /**
     * Hurt effect (no transition, just visual feedback)
     */
    hurt() {
        this.shake(8, 150);
        this.flash('red', 150, 0.4);
    }

    /**
     * Power-up effect
     */
    powerUp() {
        this.flash('yellow', 200, 0.5);
        this.zoom(1.1, 0.1);
        setTimeout(() => {
            this.zoom(1, 0.05);
        }, 200);
    }

    /**
     * Coin collect effect
     */
    coin() {
        this.flash('gold', 100, 0.3);
    }

    /**
     * Enemy defeat effect
     */
    enemyDefeat() {
        this.shake(5, 100);
    }
}

// Global instance
let transitionManager;
