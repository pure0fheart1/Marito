/**
 * Touch Controls for Mobile Devices
 * Provides virtual gamepad for playing Marito on touch-enabled devices
 */

class TouchControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.enabled = false;
        this.touches = new Map();
        this.buttons = {
            left: { x: 60, y: 0, width: 80, height: 80, pressed: false },
            right: { x: 160, y: 0, width: 80, height: 80, pressed: false },
            jump: { x: 0, y: 0, width: 80, height: 80, pressed: false },
            fire: { x: 0, y: 0, width: 80, height: 80, pressed: false }
        };

        this.detectTouchDevice();
        if (this.enabled) {
            this.setupControls();
            this.attachListeners();
        }
    }

    /**
     * Detect if device supports touch
     */
    detectTouchDevice() {
        this.enabled = (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

    /**
     * Setup button positions based on canvas size
     */
    setupControls() {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const padding = 20;
        const buttonSize = 80;

        // Left D-pad
        this.buttons.left.x = padding;
        this.buttons.left.y = canvasHeight - buttonSize - padding;

        this.buttons.right.x = padding + buttonSize + 20;
        this.buttons.right.y = canvasHeight - buttonSize - padding;

        // Right action buttons
        this.buttons.jump.x = canvasWidth - buttonSize - padding - buttonSize - 20;
        this.buttons.jump.y = canvasHeight - buttonSize - padding;

        this.buttons.fire.x = canvasWidth - buttonSize - padding;
        this.buttons.fire.y = canvasHeight - buttonSize - padding;
    }

    /**
     * Attach touch event listeners
     */
    attachListeners() {
        this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this), { passive: false });
    }

    /**
     * Handle touch start event
     * @param {TouchEvent} event - Touch event
     */
    handleTouchStart(event) {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);

            this.checkButtonPress(touch.identifier, x, y);
        }
    }

    /**
     * Handle touch move event
     * @param {TouchEvent} event - Touch event
     */
    handleTouchMove(event) {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            const rect = this.canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            const y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);

            this.updateButtonPress(touch.identifier, x, y);
        }
    }

    /**
     * Handle touch end event
     * @param {TouchEvent} event - Touch event
     */
    handleTouchEnd(event) {
        event.preventDefault();

        for (let i = 0; i < event.changedTouches.length; i++) {
            const touch = event.changedTouches[i];
            this.releaseButton(touch.identifier);
        }
    }

    /**
     * Check which button was pressed
     * @param {number} touchId - Touch identifier
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    checkButtonPress(touchId, x, y) {
        for (const [buttonName, button] of Object.entries(this.buttons)) {
            if (this.isPointInButton(x, y, button)) {
                button.pressed = true;
                this.touches.set(touchId, buttonName);
                return;
            }
        }
    }

    /**
     * Update button press for moving touch
     * @param {number} touchId - Touch identifier
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    updateButtonPress(touchId, x, y) {
        const currentButton = this.touches.get(touchId);
        if (!currentButton) {
            return;
        }

        const button = this.buttons[currentButton];
        if (!this.isPointInButton(x, y, button)) {
            button.pressed = false;
            this.touches.delete(touchId);
        }
    }

    /**
     * Release button when touch ends
     * @param {number} touchId - Touch identifier
     */
    releaseButton(touchId) {
        const buttonName = this.touches.get(touchId);
        if (buttonName) {
            this.buttons[buttonName].pressed = false;
            this.touches.delete(touchId);
        }
    }

    /**
     * Check if point is inside button
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {Object} button - Button object
     * @returns {boolean} True if point is in button
     */
    isPointInButton(x, y, button) {
        return x >= button.x &&
               x <= button.x + button.width &&
               y >= button.y &&
               y <= button.y + button.height;
    }

    /**
     * Get current input state
     * @returns {Object} Input state object
     */
    getInput() {
        return {
            left: this.buttons.left.pressed,
            right: this.buttons.right.pressed,
            jump: this.buttons.jump.pressed,
            fire: this.buttons.fire.pressed,
            running: false // Can be enhanced with double-tap or separate button
        };
    }

    /**
     * Render touch controls on canvas
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        if (!this.enabled) {
            return;
        }

        ctx.save();
        ctx.globalAlpha = 0.5;

        // Left D-pad
        this.renderButton(ctx, this.buttons.left, '◄', this.buttons.left.pressed);
        this.renderButton(ctx, this.buttons.right, '►', this.buttons.right.pressed);

        // Right action buttons
        this.renderButton(ctx, this.buttons.jump, 'A', this.buttons.jump.pressed);
        this.renderButton(ctx, this.buttons.fire, 'B', this.buttons.fire.pressed);

        ctx.restore();
    }

    /**
     * Render individual button
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} button - Button object
     * @param {string} label - Button label
     * @param {boolean} pressed - Is button pressed
     */
    renderButton(ctx, button, label, pressed) {
        // Button background
        ctx.fillStyle = pressed ? 'rgba(255, 215, 0, 0.8)' : 'rgba(100, 100, 100, 0.6)';
        ctx.beginPath();
        ctx.arc(
            button.x + button.width / 2,
            button.y + button.height / 2,
            button.width / 2,
            0,
            Math.PI * 2
        );
        ctx.fill();

        // Button border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Button label
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
            label,
            button.x + button.width / 2,
            button.y + button.height / 2
        );
    }

    /**
     * Enable or disable touch controls
     * @param {boolean} enabled - Enable state
     */
    setEnabled(enabled) {
        this.enabled = enabled && this.detectTouchDevice();
    }

    /**
     * Check if touch controls are active
     * @returns {boolean} True if enabled
     */
    isEnabled() {
        return this.enabled;
    }
}
