/**
 * Error Handler and Logging System
 * Provides centralized error handling, logging, and graceful degradation
 */

class ErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 50;
        this.debugMode = CONFIG.DEBUG.ENABLED || false;
        this.setupGlobalHandlers();
    }

    /**
     * Setup global error handlers
     */
    setupGlobalHandlers() {
        // Handle uncaught errors
        window.addEventListener('error', (event) => {
            this.logError('Uncaught Error', event.error || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });

            // Prevent default error handling in production
            if (!this.debugMode) {
                event.preventDefault();
            }
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason, {
                promise: event.promise
            });

            // Prevent default handling in production
            if (!this.debugMode) {
                event.preventDefault();
            }
        });
    }

    /**
     * Log an error with context
     * @param {string} category - Error category
     * @param {Error|string} error - Error object or message
     * @param {Object} [context={}] - Additional context
     */
    logError(category, error, context = {}) {
        const errorEntry = {
            timestamp: Date.now(),
            category: category,
            message: error instanceof Error ? error.message : error,
            stack: error instanceof Error ? error.stack : null,
            context: context
        };

        this.errors.push(errorEntry);

        // Limit error log size
        if (this.errors.length > this.maxErrors) {
            this.errors.shift();
        }

        // Console logging based on debug mode
        if (this.debugMode) {
            console.error(`[${category}]`, error, context);
        } else {
            console.warn(`[${category}]`, errorEntry.message);
        }
    }

    /**
     * Log a warning
     * @param {string} category - Warning category
     * @param {string} message - Warning message
     * @param {Object} [context={}] - Additional context
     */
    logWarning(category, message, context = {}) {
        if (this.debugMode) {
            console.warn(`[${category}]`, message, context);
        }
    }

    /**
     * Log an info message
     * @param {string} category - Info category
     * @param {string} message - Info message
     */
    logInfo(category, message) {
        if (this.debugMode) {
            console.log(`[${category}]`, message);
        }
    }

    /**
     * Try to execute a function with error handling
     * @param {Function} fn - Function to execute
     * @param {string} category - Error category
     * @param {*} fallbackValue - Value to return on error
     * @returns {*} Function result or fallback value
     */
    tryExecute(fn, category, fallbackValue = null) {
        try {
            return fn();
        } catch (error) {
            this.logError(category, error);
            return fallbackValue;
        }
    }

    /**
     * Async version of tryExecute
     * @param {Function} fn - Async function to execute
     * @param {string} category - Error category
     * @param {*} fallbackValue - Value to return on error
     * @returns {Promise<*>} Function result or fallback value
     */
    async tryExecuteAsync(fn, category, fallbackValue = null) {
        try {
            return await fn();
        } catch (error) {
            this.logError(category, error);
            return fallbackValue;
        }
    }

    /**
     * Check if a feature is supported
     * @param {Function} testFn - Function to test feature
     * @param {string} featureName - Name of the feature
     * @returns {boolean} True if feature is supported
     */
    checkFeatureSupport(testFn, featureName) {
        try {
            const supported = testFn();
            if (!supported) {
                this.logWarning('Feature Support', `${featureName} is not supported`);
            }
            return supported;
        } catch (error) {
            this.logWarning('Feature Support', `Error checking ${featureName}: ${error.message}`);
            return false;
        }
    }

    /**
     * Get all logged errors
     * @returns {Array} Array of error entries
     */
    getErrors() {
        return [...this.errors];
    }

    /**
     * Clear error log
     */
    clearErrors() {
        this.errors = [];
    }

    /**
     * Get error summary
     * @returns {Object} Summary of errors by category
     */
    getErrorSummary() {
        const summary = {};
        for (const error of this.errors) {
            if (!summary[error.category]) {
                summary[error.category] = 0;
            }
            summary[error.category]++;
        }
        return summary;
    }

    /**
     * Export errors for debugging
     * @returns {string} JSON string of errors
     */
    exportErrors() {
        return JSON.stringify({
            errors: this.errors,
            summary: this.getErrorSummary(),
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        }, null, 2);
    }
}

// Create global error handler instance
const errorHandler = new ErrorHandler();
