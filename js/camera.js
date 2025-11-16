/**
 * Camera System with Culling
 * Manages viewport, smooth scrolling, and object culling for performance
 */

class Camera {
    constructor(width, height, worldWidth, worldHeight) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;

        // Camera behavior settings
        this.deadZoneX = CONFIG.CAMERA.DEAD_ZONE_X;
        this.deadZoneY = CONFIG.CAMERA.DEAD_ZONE_Y;
        this.smoothSpeed = CONFIG.CAMERA.SMOOTH_SPEED;
        this.lookAhead = CONFIG.CAMERA.LOOK_AHEAD;

        // Target to follow
        this.target = null;

        // Culling margin (render objects slightly off-screen)
        this.cullingMargin = 64;
    }

    /**
     * Set the target object for the camera to follow
     * @param {Object} target - Object with x, y, width, height properties
     */
    setTarget(target) {
        this.target = target;
    }

    /**
     * Update camera position to follow target with smooth scrolling
     * @param {number} deltaTime - Time since last frame
     */
    update(deltaTime = 1) {
        if (!this.target) {
            return;
        }

        // Calculate target center position
        const targetCenterX = this.target.x + this.target.width / 2;
        const targetCenterY = this.target.y + this.target.height / 2;

        // Calculate desired camera position (centered on target)
        let desiredX = targetCenterX - this.width / 2;
        let desiredY = targetCenterY - this.height / 2;

        // Add look-ahead based on target direction
        if (this.target.direction) {
            desiredX += this.target.direction * this.lookAhead;
        }

        // Apply dead zone - only move camera if target is outside dead zone
        const cameraDeadZoneLeft = this.x + this.width / 2 - this.deadZoneX;
        const cameraDeadZoneRight = this.x + this.width / 2 + this.deadZoneX;
        const cameraDeadZoneTop = this.y + this.height / 2 - this.deadZoneY;
        const cameraDeadZoneBottom = this.y + this.height / 2 + this.deadZoneY;

        if (targetCenterX < cameraDeadZoneLeft) {
            desiredX = targetCenterX - this.width / 2 + this.deadZoneX;
        } else if (targetCenterX > cameraDeadZoneRight) {
            desiredX = targetCenterX - this.width / 2 - this.deadZoneX;
        } else {
            desiredX = this.x;
        }

        if (targetCenterY < cameraDeadZoneTop) {
            desiredY = targetCenterY - this.height / 2 + this.deadZoneY;
        } else if (targetCenterY > cameraDeadZoneBottom) {
            desiredY = targetCenterY - this.height / 2 - this.deadZoneY;
        } else {
            desiredY = this.y;
        }

        // Smooth camera movement
        this.x += (desiredX - this.x) * this.smoothSpeed;
        this.y += (desiredY - this.y) * this.smoothSpeed;

        // Clamp camera to world bounds
        this.x = Utils.clamp(this.x, 0, this.worldWidth - this.width);
        this.y = Utils.clamp(this.y, 0, this.worldHeight - this.height);
    }

    /**
     * Check if an object is visible in the camera viewport
     * @param {Object} obj - Object with x, y, width, height properties
     * @returns {boolean} True if object is visible
     */
    isVisible(obj) {
        return !(obj.x + obj.width < this.x - this.cullingMargin ||
                obj.x > this.x + this.width + this.cullingMargin ||
                obj.y + obj.height < this.y - this.cullingMargin ||
                obj.y > this.y + this.height + this.cullingMargin);
    }

    /**
     * Check if a point is visible in the camera viewport
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if point is visible
     */
    isPointVisible(x, y) {
        return x >= this.x - this.cullingMargin &&
               x <= this.x + this.width + this.cullingMargin &&
               y >= this.y - this.cullingMargin &&
               y <= this.y + this.height + this.cullingMargin;
    }

    /**
     * Convert world coordinates to screen coordinates
     * @param {number} worldX - World X coordinate
     * @param {number} worldY - World Y coordinate
     * @returns {Object} Screen coordinates {x, y}
     */
    worldToScreen(worldX, worldY) {
        return {
            x: worldX - this.x,
            y: worldY - this.y
        };
    }

    /**
     * Convert screen coordinates to world coordinates
     * @param {number} screenX - Screen X coordinate
     * @param {number} screenY - Screen Y coordinate
     * @returns {Object} World coordinates {x, y}
     */
    screenToWorld(screenX, screenY) {
        return {
            x: screenX + this.x,
            y: screenY + this.y
        };
    }

    /**
     * Get the visible bounds of the camera
     * @returns {Object} Bounds object with x, y, width, height
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * Shake the camera for visual feedback
     * @param {number} intensity - Shake intensity
     * @param {number} duration - Shake duration in milliseconds
     */
    shake(intensity = 10, duration = 300) {
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeStartTime = Date.now();
    }

    /**
     * Apply camera shake effect
     * @returns {Object} Offset {x, y} for shake effect
     */
    getShakeOffset() {
        if (!this.shakeStartTime) {
            return { x: 0, y: 0 };
        }

        const elapsed = Date.now() - this.shakeStartTime;
        if (elapsed > this.shakeDuration) {
            this.shakeStartTime = null;
            return { x: 0, y: 0 };
        }

        const progress = elapsed / this.shakeDuration;
        const intensity = this.shakeIntensity * (1 - progress);

        return {
            x: (Math.random() - 0.5) * intensity,
            y: (Math.random() - 0.5) * intensity
        };
    }

    /**
     * Snap camera to target immediately (no smoothing)
     */
    snapToTarget() {
        if (!this.target) {
            return;
        }

        const targetCenterX = this.target.x + this.target.width / 2;
        const targetCenterY = this.target.y + this.target.height / 2;

        this.x = targetCenterX - this.width / 2;
        this.y = targetCenterY - this.height / 2;

        this.x = Utils.clamp(this.x, 0, this.worldWidth - this.width);
        this.y = Utils.clamp(this.y, 0, this.worldHeight - this.height);
    }

    /**
     * Reset camera to origin
     */
    reset() {
        this.x = 0;
        this.y = 0;
        this.shakeStartTime = null;
    }

    /**
     * Set camera position directly
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    setPosition(x, y) {
        this.x = Utils.clamp(x, 0, this.worldWidth - this.width);
        this.y = Utils.clamp(y, 0, this.worldHeight - this.height);
    }
}
