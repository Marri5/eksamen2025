/**
 * Fox Voting System - Main JavaScript
 * Utility functions and shared functionality
 */

// Global application state
window.FoxVoting = {
    config: {
        alertTimeout: 5000,
        autoRefreshInterval: 30000,
        maxRetries: 3
    },
    state: {
        isLoading: false,
        lastUpdate: null,
        retryCount: 0
    }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦊 Fox Voting System initialized');
    
    // Initialize common functionality
    initializeAlerts();
    initializeLoadingSpinner();
    initializeNavigation();
    initializeAccessibility();
    
    // Mark page as loaded
    document.body.classList.add('page-loaded');
});

/**
 * Show alert message to user
 * @param {string} type - Alert type (success, danger, warning, info)
 * @param {string} message - Message to display
 * @param {number} timeout - Auto-dismiss timeout in milliseconds
 */
function showAlert(type, message, timeout = null) {
    const alertContainer = document.getElementById('alert-container');
    if (!alertContainer) return;
    
    // Create alert element
    const alertId = 'alert-' + Date.now();
    const alertElement = document.createElement('div');
    alertElement.id = alertId;
    alertElement.className = `alert alert-${type} alert-dismissible fade show`;
    alertElement.setAttribute('role', 'alert');
    
    alertElement.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Lukk"></button>
    `;
    
    // Add to container
    alertContainer.appendChild(alertElement);
    
    // Auto-dismiss if timeout specified
    const dismissTimeout = timeout || FoxVoting.config.alertTimeout;
    if (dismissTimeout > 0) {
        setTimeout(() => {
            dismissAlert(alertId);
        }, dismissTimeout);
    }
    
    // Log alert
    console.log(`Alert (${type}): ${message}`);
    
    // Scroll to alert if not visible
    alertElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Dismiss specific alert
 * @param {string} alertId - ID of alert to dismiss
 */
function dismissAlert(alertId) {
    const alertElement = document.getElementById(alertId);
    if (alertElement) {
        // Use Bootstrap's dismiss method if available
        const bsAlert = bootstrap?.Alert?.getInstance(alertElement);
        if (bsAlert) {
            bsAlert.close();
        } else {
            alertElement.remove();
        }
    }
}

/**
 * Clear all alerts
 */
function clearAlerts() {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        alertContainer.innerHTML = '';
    }
}

/**
 * Show loading spinner
 */
function showLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.remove('d-none');
        FoxVoting.state.isLoading = true;
        
        // Disable scrolling
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
        spinner.classList.add('d-none');
        FoxVoting.state.isLoading = false;
        
        // Re-enable scrolling
        document.body.style.overflow = '';
    }
}

/**
 * Make API request with error handling
 * @param {string} url - Request URL
 * @param {object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options
    };
    
    try {
        console.log(`API Request: ${defaultOptions.method || 'GET'} ${url}`);
        
        const response = await fetch(url, defaultOptions);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Reset retry count on success
        FoxVoting.state.retryCount = 0;
        
        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        
        // Increment retry count
        FoxVoting.state.retryCount++;
        
        throw error;
    }
}

/**
 * Retry failed operation
 * @param {function} operation - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Delay between retries in milliseconds
 */
async function retryOperation(operation, maxRetries = FoxVoting.config.maxRetries, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            console.log(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt === maxRetries) {
                throw error;
            }
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
    }
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} - Formatted date
 */
function formatDate(date, options = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    
    const formatOptions = { ...defaultOptions, ...options };
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString('no-NO', formatOptions);
}

/**
 * Format number with locale
 * @param {number} number - Number to format
 * @returns {string} - Formatted number
 */
function formatNumber(number) {
    return new Intl.NumberFormat('no-NO').format(number);
}

/**
 * Debounce function calls
 * @param {function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Initialize alert functionality
 */
function initializeAlerts() {
    // Auto-dismiss alerts after timeout
    document.addEventListener('shown.bs.alert', function(event) {
        const alert = event.target;
        if (!alert.hasAttribute('data-no-auto-dismiss')) {
            setTimeout(() => {
                const bsAlert = bootstrap.Alert.getInstance(alert);
                if (bsAlert) {
                    bsAlert.close();
                }
            }, FoxVoting.config.alertTimeout);
        }
    });
}

/**
 * Initialize loading spinner
 */
function initializeLoadingSpinner() {
    // Hide loading spinner when page loads
    window.addEventListener('load', function() {
        hideLoading();
    });
    
    // Show loading spinner for long-running operations
    let loadingTimeout;
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
        // Show spinner after 500ms for long requests
        loadingTimeout = setTimeout(() => {
            showLoading();
        }, 500);
        
        return originalFetch.apply(this, args)
            .finally(() => {
                clearTimeout(loadingTimeout);
                hideLoading();
            });
    };
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
    // Highlight current page in navigation
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
    
    // Handle navigation clicks
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

/**
 * Initialize accessibility features
 */
function initializeAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        // Make cards focusable
        if (!card.hasAttribute('tabindex')) {
            card.setAttribute('tabindex', '0');
        }
        
        // Add keyboard event handler
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                const button = card.querySelector('button, a');
                if (button) {
                    e.preventDefault();
                    button.click();
                }
            }
        });
    });
    
    // Add skip link for screen readers
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only sr-only-focusable';
    skipLink.textContent = 'Hopp til hovedinnhold';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        z-index: 1000;
        color: white;
        background: #000;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
    `;
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Show skip link on focus
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
}

/**
 * Handle network errors gracefully
 */
function handleNetworkError(error) {
    console.error('Network error:', error);
    
    if (!navigator.onLine) {
        showAlert('warning', 
            '<i class="fas fa-wifi me-2"></i>Du ser ut til å være offline. Sjekk internettforbindelsen din.',
            0
        );
    } else {
        showAlert('danger', 
            '<i class="fas fa-exclamation-triangle me-2"></i>Nettverksfeil. Prøv igjen om litt.',
            0
        );
    }
}

/**
 * Monitor network status
 */
function initializeNetworkMonitoring() {
    window.addEventListener('online', function() {
        showAlert('success', 
            '<i class="fas fa-wifi me-2"></i>Tilkoblet til internett igjen!',
            3000
        );
        
        // Refresh page data
        if (typeof refreshPageData === 'function') {
            refreshPageData();
        }
    });
    
    window.addEventListener('offline', function() {
        showAlert('warning', 
            '<i class="fas fa-wifi me-2"></i>Mistet internettforbindelse. Noen funksjoner kan være begrenset.',
            0
        );
    });
}

/**
 * Initialize error tracking
 */
function initializeErrorTracking() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        
        // Don't show alerts for minor errors
        if (e.error && e.error.name !== 'TypeError') {
            showAlert('danger', 
                '<i class="fas fa-bug me-2"></i>Det oppstod en feil. Prøv å oppdatere siden.',
                5000
            );
        }
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled promise rejection:', e.reason);
        
        // Handle network-related promise rejections
        if (e.reason && e.reason.name === 'TypeError' && e.reason.message.includes('fetch')) {
            handleNetworkError(e.reason);
        }
    });
}

/**
 * Performance monitoring
 */
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    console.log('Page Performance:', {
                        loadTime: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
                        domReady: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
                        totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
                    });
                }
            }, 0);
        });
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeNetworkMonitoring();
    initializeErrorTracking();
    logPerformance();
});

// Export functions for global use
window.FoxVoting.utils = {
    showAlert,
    dismissAlert,
    clearAlerts,
    showLoading,
    hideLoading,
    apiRequest,
    retryOperation,
    formatDate,
    formatNumber,
    debounce,
    throttle,
    handleNetworkError
}; 