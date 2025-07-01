// Viewport culling system for performance optimization
class ViewportCuller {
    constructor(margin = 100) {
        this.margin = margin; // Extra margin around viewport for smooth transitions
    }
    
    // Check if an object is within the viewport
    isInViewport(object, camera, canvasWidth, canvasHeight) {
        const viewLeft = camera.x - this.margin;
        const viewRight = camera.x + canvasWidth + this.margin;
        const viewTop = camera.y - this.margin;
        const viewBottom = camera.y + canvasHeight + this.margin;
        
        return object.x + object.width >= viewLeft &&
               object.x <= viewRight &&
               object.y + object.height >= viewTop &&
               object.y <= viewBottom;
    }
    
    // Filter array of objects to only include those in viewport
    filterInViewport(objects, camera, canvasWidth, canvasHeight) {
        return objects.filter(obj => 
            this.isInViewport(obj, camera, canvasWidth, canvasHeight)
        );
    }
    
    // Get visible objects from multiple arrays
    getVisibleObjects(objectArrays, camera, canvasWidth, canvasHeight) {
        const visible = {};
        
        for (const [key, objects] of Object.entries(objectArrays)) {
            visible[key] = this.filterInViewport(objects, camera, canvasWidth, canvasHeight);
        }
        
        return visible;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ViewportCuller;
} else {
    window.ViewportCuller = ViewportCuller;
}