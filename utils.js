// Utility functions for the Mario game

class Utils {
    // Check collision between two rectangles
    static checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    // Check if point is inside rectangle
    static pointInRect(point, rect) {
        return point.x >= rect.x && 
               point.x <= rect.x + rect.width &&
               point.y >= rect.y && 
               point.y <= rect.y + rect.height;
    }

    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }

    // Distance between two points
    static distance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // Random number between min and max
    static random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // Random integer between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Draw rounded rectangle
    static drawRoundedRect(ctx, x, y, width, height, radius, fillColor, strokeColor = null) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        if (fillColor) {
            ctx.fillStyle = fillColor;
            ctx.fill();
        }
        
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.stroke();
        }
    }

    // Draw text with outline
    static drawText(ctx, text, x, y, fontSize, fillColor, strokeColor = null, strokeWidth = 2) {
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.strokeText(text, x, y);
        }
        
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
    }

    // Draw centered text
    static drawCenteredText(ctx, text, x, y, fontSize, fillColor, strokeColor = null) {
        ctx.font = `${fontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (strokeColor) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2;
            ctx.strokeText(text, x, y);
        }
        
        ctx.fillStyle = fillColor;
        ctx.fillText(text, x, y);
    }

    // Create gradient
    static createGradient(ctx, x1, y1, x2, y2, colors) {
        const gradient = ctx.createLinearGradient(x1, y1, x2, y2);
        colors.forEach((color, index) => {
            gradient.addColorStop(index / (colors.length - 1), color);
        });
        return gradient;
    }

    // Format time as MM:SS
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // Format score with leading zeros
    static formatScore(score) {
        return score.toString().padStart(8, '0');
    }

    // Check if two objects are overlapping (with tolerance)
    static isOverlapping(obj1, obj2, tolerance = 0) {
        return Math.abs(obj1.x - obj2.x) < obj1.width + obj2.width - tolerance &&
               Math.abs(obj1.y - obj2.y) < obj1.height + obj2.height - tolerance;
    }

    // Get collision side (useful for platform collision)
    static getCollisionSide(movingRect, staticRect, prevX, prevY) {
        const overlapX = Math.min(movingRect.x + movingRect.width - staticRect.x, 
                                 staticRect.x + staticRect.width - movingRect.x);
        const overlapY = Math.min(movingRect.y + movingRect.height - staticRect.y, 
                                 staticRect.y + staticRect.height - movingRect.y);
        
        if (overlapX < overlapY) {
            return prevX < staticRect.x ? 'left' : 'right';
        } else {
            return prevY < staticRect.y ? 'top' : 'bottom';
        }
    }

    // Easing functions
    static easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    static easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    static easeIn(t) {
        return t * t * t;
    }
} 