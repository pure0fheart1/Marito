/**
 * Performance Monitor
 * Tracks FPS, frame time, memory usage, and other performance metrics
 */

class PerformanceMonitor {
    constructor() {
        this.enabled = CONFIG.DEBUG.SHOW_FPS || false;

        // FPS tracking
        this.fps = 60;
        this.frameCount = 0;
        this.lastFrameTime = performance.now();
        this.fpsUpdateInterval = 500; // Update FPS every 500ms
        this.lastFpsUpdate = performance.now();

        // Frame time tracking
        this.frameTime = 0;
        this.minFrameTime = Infinity;
        this.maxFrameTime = 0;
        this.avgFrameTime = 0;

        // Frame time history for graph
        this.frameTimeHistory = [];
        this.maxHistoryLength = 60;

        // Memory tracking (if available)
        this.memorySupported = performance.memory !== undefined;

        // Performance metrics
        this.metrics = {
            drawCalls: 0,
            collisionChecks: 0,
            activeParticles: 0,
            activeEnemies: 0,
            culledObjects: 0
        };

        // Performance warnings
        this.warnings = [];
        this.lowFpsThreshold = 30;
        this.highFrameTimeThreshold = 33; // ~30 FPS
    }

    /**
     * Start frame timing
     */
    startFrame() {
        this.frameStartTime = performance.now();
    }

    /**
     * End frame timing and update metrics
     */
    endFrame() {
        const currentTime = performance.now();
        this.frameTime = currentTime - this.frameStartTime;

        // Update min/max frame times
        this.minFrameTime = Math.min(this.minFrameTime, this.frameTime);
        this.maxFrameTime = Math.max(this.maxFrameTime, this.frameTime);

        // Add to history
        this.frameTimeHistory.push(this.frameTime);
        if (this.frameTimeHistory.length > this.maxHistoryLength) {
            this.frameTimeHistory.shift();
        }

        // Calculate average
        const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
        this.avgFrameTime = sum / this.frameTimeHistory.length;

        // Update FPS
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate >= this.fpsUpdateInterval) {
            this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;

            // Check for performance warnings
            this.checkPerformanceWarnings();
        }

        this.lastFrameTime = currentTime;
    }

    /**
     * Update a performance metric
     * @param {string} metric - Metric name
     * @param {number} value - Metric value
     */
    updateMetric(metric, value) {
        this.metrics[metric] = value;
    }

    /**
     * Increment a performance metric
     * @param {string} metric - Metric name
     * @param {number} amount - Amount to increment
     */
    incrementMetric(metric, amount = 1) {
        this.metrics[metric] = (this.metrics[metric] || 0) + amount;
    }

    /**
     * Reset metrics for the current frame
     */
    resetMetrics() {
        this.metrics.drawCalls = 0;
        this.metrics.collisionChecks = 0;
    }

    /**
     * Check for performance issues
     */
    checkPerformanceWarnings() {
        this.warnings = [];

        if (this.fps < this.lowFpsThreshold) {
            this.warnings.push({
                type: 'LOW_FPS',
                message: `Low FPS: ${this.fps}`,
                severity: 'warning'
            });
        }

        if (this.avgFrameTime > this.highFrameTimeThreshold) {
            this.warnings.push({
                type: 'HIGH_FRAME_TIME',
                message: `High frame time: ${this.avgFrameTime.toFixed(2)}ms`,
                severity: 'warning'
            });
        }

        if (this.metrics.collisionChecks > 1000) {
            this.warnings.push({
                type: 'HIGH_COLLISION_CHECKS',
                message: `Too many collision checks: ${this.metrics.collisionChecks}`,
                severity: 'info'
            });
        }
    }

    /**
     * Get memory usage (if supported)
     * @returns {Object|null} Memory info or null
     */
    getMemoryUsage() {
        if (!this.memorySupported) {
            return null;
        }

        const memory = performance.memory;
        return {
            usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2), // MB
            totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2), // MB
            jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) // MB
        };
    }

    /**
     * Get all performance data
     * @returns {Object} Performance data
     */
    getData() {
        return {
            fps: this.fps,
            frameTime: this.frameTime.toFixed(2),
            avgFrameTime: this.avgFrameTime.toFixed(2),
            minFrameTime: this.minFrameTime.toFixed(2),
            maxFrameTime: this.maxFrameTime.toFixed(2),
            metrics: { ...this.metrics },
            memory: this.getMemoryUsage(),
            warnings: [...this.warnings]
        };
    }

    /**
     * Render performance overlay
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        if (!this.enabled) {
            return;
        }

        ctx.save();

        // Background
        const padding = 10;
        const lineHeight = 18;
        const width = 250;
        const lines = 8 + (this.memorySupported ? 3 : 0) + this.warnings.length;
        const height = lines * lineHeight + padding * 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(10, 10, width, height);

        // Border
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(10, 10, width, height);

        // Text
        ctx.fillStyle = '#00FF00';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        let y = 20;
        const x = 20;

        // FPS and frame time
        const fpsColor = this.fps >= 50 ? '#00FF00' : this.fps >= 30 ? '#FFFF00' : '#FF0000';
        ctx.fillStyle = fpsColor;
        ctx.fillText(`FPS: ${this.fps}`, x, y);
        y += lineHeight;

        ctx.fillStyle = '#00FF00';
        ctx.fillText(`Frame: ${this.frameTime.toFixed(2)}ms`, x, y);
        y += lineHeight;
        ctx.fillText(`Avg: ${this.avgFrameTime.toFixed(2)}ms`, x, y);
        y += lineHeight;
        ctx.fillText(`Min: ${this.minFrameTime.toFixed(2)}ms`, x, y);
        y += lineHeight;
        ctx.fillText(`Max: ${this.maxFrameTime.toFixed(2)}ms`, x, y);
        y += lineHeight;

        // Metrics
        ctx.fillText(`Draw Calls: ${this.metrics.drawCalls}`, x, y);
        y += lineHeight;
        ctx.fillText(`Collisions: ${this.metrics.collisionChecks}`, x, y);
        y += lineHeight;
        ctx.fillText(`Particles: ${this.metrics.activeParticles}`, x, y);
        y += lineHeight;

        // Memory (if available)
        if (this.memorySupported) {
            const memory = this.getMemoryUsage();
            ctx.fillText(`Heap: ${memory.usedJSHeapSize}MB`, x, y);
            y += lineHeight;
            ctx.fillText(`Total: ${memory.totalJSHeapSize}MB`, x, y);
            y += lineHeight;
            ctx.fillText(`Limit: ${memory.jsHeapSizeLimit}MB`, x, y);
            y += lineHeight;
        }

        // Warnings
        if (this.warnings.length > 0) {
            ctx.fillStyle = '#FFFF00';
            for (const warning of this.warnings) {
                ctx.fillText(`⚠ ${warning.message}`, x, y);
                y += lineHeight;
            }
        }

        // Frame time graph
        this.renderFrameTimeGraph(ctx, 10, height + 20, width, 60);

        ctx.restore();
    }

    /**
     * Render frame time graph
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Graph width
     * @param {number} height - Graph height
     */
    renderFrameTimeGraph(ctx, x, y, width, height) {
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(x, y, width, height);

        // Border
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, width, height);

        // 60 FPS line (16.67ms)
        const fps60Y = y + height - (16.67 / 33) * height;
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x, fps60Y);
        ctx.lineTo(x + width, fps60Y);
        ctx.stroke();

        // 30 FPS line (33ms)
        const fps30Y = y + height - (33 / 33) * height;
        ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x, fps30Y);
        ctx.lineTo(x + width, fps30Y);
        ctx.stroke();

        // Frame time graph
        ctx.strokeStyle = '#00FF00';
        ctx.beginPath();

        const history = this.frameTimeHistory;
        for (let i = 0; i < history.length; i++) {
            const frameTime = history[i];
            const graphX = x + (i / history.length) * width;
            const graphY = y + height - Utils.clamp((frameTime / 33) * height, 0, height);

            if (i === 0) {
                ctx.moveTo(graphX, graphY);
            } else {
                ctx.lineTo(graphX, graphY);
            }
        }

        ctx.stroke();
    }

    /**
     * Reset all statistics
     */
    reset() {
        this.frameTimeHistory = [];
        this.minFrameTime = Infinity;
        this.maxFrameTime = 0;
        this.warnings = [];
    }

    /**
     * Toggle performance monitor visibility
     */
    toggle() {
        this.enabled = !this.enabled;
    }

    /**
     * Export performance data as JSON
     * @returns {string} JSON string
     */
    export() {
        return JSON.stringify({
            timestamp: Date.now(),
            data: this.getData(),
            userAgent: navigator.userAgent
        }, null, 2);
    }
}
