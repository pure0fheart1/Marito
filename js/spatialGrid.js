// Spatial grid for optimized collision detection
class SpatialGrid {
    constructor(width, height, cellSize = 64) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = [];
        this.clear();
    }
    
    clear() {
        this.grid = new Array(this.rows * this.cols);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = [];
        }
    }
    
    // Get grid index from world coordinates
    getIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        
        if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
            return -1;
        }
        
        return row * this.cols + col;
    }
    
    // Add object to grid
    addObject(object, type = 'default') {
        const minX = Math.floor(object.x / this.cellSize);
        const maxX = Math.floor((object.x + object.width) / this.cellSize);
        const minY = Math.floor(object.y / this.cellSize);
        const maxY = Math.floor((object.y + object.height) / this.cellSize);
        
        for (let row = minY; row <= maxY; row++) {
            for (let col = minX; col <= maxX; col++) {
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    const index = row * this.cols + col;
                    this.grid[index].push({ object, type });
                }
            }
        }
    }
    
    // Get nearby objects for collision checking
    getNearbyObjects(object, targetType = null) {
        const nearby = [];
        const minX = Math.floor(object.x / this.cellSize);
        const maxX = Math.floor((object.x + object.width) / this.cellSize);
        const minY = Math.floor(object.y / this.cellSize);
        const maxY = Math.floor((object.y + object.height) / this.cellSize);
        
        const seen = new Set();
        
        for (let row = minY; row <= maxY; row++) {
            for (let col = minX; col <= maxX; col++) {
                if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) {
                    const index = row * this.cols + col;
                    const cell = this.grid[index];
                    
                    for (const entry of cell) {
                        if (!seen.has(entry.object) && 
                            entry.object !== object &&
                            (targetType === null || entry.type === targetType)) {
                            nearby.push(entry.object);
                            seen.add(entry.object);
                        }
                    }
                }
            }
        }
        
        return nearby;
    }
    
    // Optimized collision detection
    checkCollisions(objects, callback) {
        this.clear();
        
        // Add all objects to grid
        for (const obj of objects) {
            this.addObject(obj, obj.type || 'default');
        }
        
        // Check collisions for each object
        for (const obj of objects) {
            const nearby = this.getNearbyObjects(obj);
            for (const other of nearby) {
                if (Utils.checkCollision(obj, other)) {
                    callback(obj, other);
                }
            }
        }
    }
    
    // Debug visualization
    renderGrid(ctx, camera) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.cellSize - camera.x;
                const y = row * this.cellSize - camera.y;
                
                if (x + this.cellSize >= 0 && x <= ctx.canvas.width &&
                    y + this.cellSize >= 0 && y <= ctx.canvas.height) {
                    ctx.strokeRect(x, y, this.cellSize, this.cellSize);
                    
                    // Show object count in cell
                    const index = row * this.cols + col;
                    const count = this.grid[index].length;
                    if (count > 0) {
                        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
                        ctx.font = '12px Arial';
                        ctx.fillText(count.toString(), x + 5, y + 15);
                    }
                }
            }
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpatialGrid;
} else {
    window.SpatialGrid = SpatialGrid;
}