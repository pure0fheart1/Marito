// Performance monitoring system
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = 0;
        this.frameTime = 0;
        this.maxFrameTime = 0;
        this.minFrameTime = Infinity;
        this.enabled = false;
        this.displayElement = null;
        
        // Performance history for averaging
        this.frameTimes = [];
        this.maxHistory = 60; // Keep last 60 frame times
        
        // Memory tracking
        this.memoryInfo = {
            used: 0,
            total: 0,
            limit: 0
        };
        
        this.createDisplay();
    }
    
    createDisplay() {
        this.displayElement = document.createElement('div');
        this.displayElement.id = 'performance-monitor';
        this.displayElement.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 10px;
            border-radius: 5px;
            z-index: 1000;
            display: none;
            min-width: 200px;
        `;
        document.body.appendChild(this.displayElement);
    }
    
    enable() {
        this.enabled = true;
        this.displayElement.style.display = 'block';
    }
    
    disable() {
        this.enabled = false;
        this.displayElement.style.display = 'none';
    }
    
    toggle() {
        this.enabled ? this.disable() : this.enable();
    }
    
    update(currentTime) {
        if (!this.enabled) return;
        
        this.frameCount++;
        
        // Calculate frame time
        if (this.lastTime > 0) {
            this.frameTime = currentTime - this.lastTime;
            this.frameTimes.push(this.frameTime);
            
            // Keep only recent frame times
            if (this.frameTimes.length > this.maxHistory) {
                this.frameTimes.shift();
            }
            
            // Update min/max
            this.maxFrameTime = Math.max(this.maxFrameTime, this.frameTime);
            this.minFrameTime = Math.min(this.minFrameTime, this.frameTime);
        }
        
        this.lastTime = currentTime;
        
        // Calculate FPS every second
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1000 / this.getAverageFrameTime());
            this.updateMemoryInfo();
            this.updateDisplay();
        }
    }
    
    getAverageFrameTime() {
        if (this.frameTimes.length === 0) return 16.67; // Default to 60 FPS
        
        const sum = this.frameTimes.reduce((a, b) => a + b, 0);
        return sum / this.frameTimes.length;
    }
    
    updateMemoryInfo() {
        if (performance.memory) {
            this.memoryInfo = {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            };
        }
    }
    
    updateDisplay() {
        const avgFrameTime = this.getAverageFrameTime();
        const isDropping = this.fps < 55; // Consider dropping if below 55 FPS
        
        this.displayElement.innerHTML = `
            <div style="color: ${isDropping ? '#ff4444' : '#00ff00'}">
                FPS: ${this.fps}
            </div>
            <div>Frame Time: ${avgFrameTime.toFixed(2)}ms</div>
            <div>Max: ${this.maxFrameTime.toFixed(2)}ms</div>
            <div>Min: ${this.minFrameTime.toFixed(2)}ms</div>
            <div>Memory: ${this.memoryInfo.used}MB / ${this.memoryInfo.total}MB</div>
            <div>Limit: ${this.memoryInfo.limit}MB</div>
            <div style="margin-top: 5px; font-size: 10px;">
                Press F1 to toggle
            </div>
        `;
    }
    
    // Get performance stats for logging
    getStats() {
        return {
            fps: this.fps,
            averageFrameTime: this.getAverageFrameTime(),
            maxFrameTime: this.maxFrameTime,
            minFrameTime: this.minFrameTime,
            memory: this.memoryInfo,
            frameCount: this.frameCount
        };
    }
    
    // Reset performance counters
    reset() {
        this.frameCount = 0;
        this.lastTime = 0;
        this.maxFrameTime = 0;
        this.minFrameTime = Infinity;
        this.frameTimes = [];
    }
    
    // Log performance warning if needed
    checkPerformance() {
        if (!this.enabled) return;
        
        const avgFrameTime = this.getAverageFrameTime();
        
        if (avgFrameTime > 33.33) { // Below 30 FPS
            console.warn('Performance Warning: Frame time exceeding 33ms (below 30 FPS)');
        }
        
        if (this.memoryInfo.used > this.memoryInfo.limit * 0.8) {
            console.warn('Memory Warning: Using over 80% of heap limit');
        }
    }
}

// Global instance
const performanceMonitor = new PerformanceMonitor();

// Toggle with F1 key
document.addEventListener('keydown', (e) => {
    if (e.key === 'F1') {
        e.preventDefault();
        performanceMonitor.toggle();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
} else {
    window.PerformanceMonitor = PerformanceMonitor;
    window.performanceMonitor = performanceMonitor;
}