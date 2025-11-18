/**
 * Spatial Grid for Optimized Collision Detection
 * Implements spatial partitioning to reduce collision checks from O(n²) to O(n)
 */

class SpatialGrid {
    /**
     * Create a spatial grid
     * @param {number} worldWidth - Width of the game world
     * @param {number} worldHeight - Height of the game world
     * @param {number} cellSize - Size of each grid cell (default: 128)
     */
    constructor(worldWidth, worldHeight, cellSize = 128) {
        this.worldWidth = worldWidth;
        this.worldHeight = worldHeight;
        this.cellSize = cellSize;

        // Calculate grid dimensions
        this.cols = Math.ceil(worldWidth / cellSize);
        this.rows = Math.ceil(worldHeight / cellSize);

        // Initialize grid cells
        this.grid = new Array(this.cols * this.rows);
        this.clear();
    }

    /**
     * Clear all cells in the grid
     */
    clear() {
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = [];
        }
    }

    /**
     * Get cell index from world coordinates
     * @param {number} x - World X coordinate
     * @param {number} y - World Y coordinate
     * @returns {number} Cell index
     */
    getCellIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        // Clamp to grid bounds
        const clampedCol = Utils.clamp(col, 0, this.cols - 1);
        const clampedRow = Utils.clamp(row, 0, this.rows - 1);

        return clampedRow * this.cols + clampedCol;
    }

    /**
     * Get all cell indices that an object overlaps
     * @param {Object} obj - Object with x, y, width, height
     * @returns {Array<number>} Array of cell indices
     */
    getCellIndices(obj) {
        const indices = new Set();

        const minCol = Math.floor(obj.x / this.cellSize);
        const maxCol = Math.floor((obj.x + obj.width) / this.cellSize);
        const minRow = Math.floor(obj.y / this.cellSize);
        const maxRow = Math.floor((obj.y + obj.height) / this.cellSize);

        for (let row = minRow; row <= maxRow; row++) {
            for (let col = minCol; col <= maxCol; col++) {
                if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                    indices.add(row * this.cols + col);
                }
            }
        }

        return Array.from(indices);
    }

    /**
     * Insert an object into the grid
     * @param {Object} obj - Object with x, y, width, height
     */
    insert(obj) {
        const indices = this.getCellIndices(obj);

        for (const index of indices) {
            this.grid[index].push(obj);
        }

        // Store indices on object for removal
        obj._gridIndices = indices;
    }

    /**
     * Remove an object from the grid
     * @param {Object} obj - Object to remove
     */
    remove(obj) {
        if (!obj._gridIndices) {
            return;
        }

        for (const index of obj._gridIndices) {
            const cell = this.grid[index];
            const objIndex = cell.indexOf(obj);
            if (objIndex !== -1) {
                cell.splice(objIndex, 1);
            }
        }

        delete obj._gridIndices;
    }

    /**
     * Get all objects near a given object
     * @param {Object} obj - Query object with x, y, width, height
     * @returns {Array} Array of nearby objects
     */
    getNearby(obj) {
        const indices = this.getCellIndices(obj);
        const nearby = new Set();

        for (const index of indices) {
            const cell = this.grid[index];
            for (const other of cell) {
                if (other !== obj) {
                    nearby.add(other);
                }
            }
        }

        return Array.from(nearby);
    }

    /**
     * Get all objects in cells visible to the camera
     * @param {Object} camera - Camera object with x, y, width, height
     * @returns {Array} Array of visible objects
     */
    getVisibleObjects(camera) {
        const visible = new Set();
        const indices = this.getCellIndices(camera);

        for (const index of indices) {
            const cell = this.grid[index];
            for (const obj of cell) {
                visible.add(obj);
            }
        }

        return Array.from(visible);
    }

    /**
     * Query objects in a rectangular area
     * @param {number} x - Area X coordinate
     * @param {number} y - Area Y coordinate
     * @param {number} width - Area width
     * @param {number} height - Area height
     * @returns {Array} Array of objects in area
     */
    queryArea(x, y, width, height) {
        return this.getNearby({ x, y, width, height });
    }

    /**
     * Get debug info about the grid
     * @returns {Object} Debug information
     */
    getDebugInfo() {
        let totalObjects = 0;
        let nonEmptyCells = 0;
        let maxObjectsInCell = 0;

        for (let i = 0; i < this.grid.length; i++) {
            const cellCount = this.grid[i].length;
            if (cellCount > 0) {
                nonEmptyCells++;
                totalObjects += cellCount;
                maxObjectsInCell = Math.max(maxObjectsInCell, cellCount);
            }
        }

        return {
            totalCells: this.grid.length,
            nonEmptyCells: nonEmptyCells,
            totalObjects: totalObjects,
            maxObjectsInCell: maxObjectsInCell,
            avgObjectsPerCell: totalObjects / nonEmptyCells || 0
        };
    }

    /**
     * Render grid for debugging
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} camera - Camera for coordinate conversion
     */
    renderDebug(ctx, camera) {
        ctx.save();
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;

        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const x = col * this.cellSize - camera.x;
                const y = row * this.cellSize - camera.y;

                ctx.strokeRect(x, y, this.cellSize, this.cellSize);

                // Draw object count
                const index = row * this.cols + col;
                const count = this.grid[index].length;

                if (count > 0) {
                    ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                    ctx.fillRect(x, y, this.cellSize, this.cellSize);

                    ctx.fillStyle = '#FFFFFF';
                    ctx.font = '12px Arial';
                    ctx.fillText(count.toString(), x + 5, y + 15);
                }
            }
        }

        ctx.restore();
    }
}

/**
 * Collision Manager with Spatial Optimization
 * Handles collision detection using spatial grid
 */
class CollisionManager {
    constructor(worldWidth, worldHeight) {
        this.spatialGrid = new SpatialGrid(worldWidth, worldHeight, 128);
        this.collisionPairs = [];
    }

    /**
     * Update spatial grid with all objects
     * @param {Array} objects - All collidable objects
     */
    update(objects) {
        this.spatialGrid.clear();

        for (const obj of objects) {
            if (obj && obj.x !== undefined) {
                this.spatialGrid.insert(obj);
            }
        }
    }

    /**
     * Check collisions for a single object
     * @param {Object} obj - Object to check
     * @param {Array} [targetObjects] - Specific objects to check against (optional)
     * @returns {Array} Array of colliding objects
     */
    checkCollisions(obj, targetObjects = null) {
        const collisions = [];
        const candidates = targetObjects || this.spatialGrid.getNearby(obj);

        for (const other of candidates) {
            if (other !== obj && Utils.checkCollision(obj, other)) {
                collisions.push(other);
            }
        }

        return collisions;
    }

    /**
     * Get all visible objects for rendering
     * @param {Object} camera - Camera object
     * @returns {Array} Visible objects
     */
    getVisibleObjects(camera) {
        return this.spatialGrid.getVisibleObjects(camera);
    }

    /**
     * Get debug information
     * @returns {Object} Debug info
     */
    getDebugInfo() {
        return this.spatialGrid.getDebugInfo();
    }

    /**
     * Render debug visualization
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     * @param {Object} camera - Camera object
     */
    renderDebug(ctx, camera) {
        this.spatialGrid.renderDebug(ctx, camera);
    }
}
