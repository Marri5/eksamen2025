// Main JavaScript file for Image Voting System

// Initialize tooltips
document.addEventListener('DOMContentLoaded', function() {
    // Bootstrap tooltip initialization
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });

    // Auto-update statistics if on statistics page
    if (window.location.pathname === '/statistics') {
        // Refresh statistics every 30 seconds
        setInterval(() => {
            fetch('/statistics')
                .then(() => {
                    // Optionally refresh the page or update specific elements
                    console.log('Statistics checked for updates');
                })
                .catch(err => console.error('Failed to check statistics:', err));
        }, 30000);
    }

    // Handle network errors gracefully
    window.addEventListener('online', () => {
        showNotification('Internettforbindelse gjenopprettet', 'success');
    });

    window.addEventListener('offline', () => {
        showNotification('Mistet internettforbindelse', 'warning');
    });
});

// Utility function to show notifications
function showNotification(message, type = 'info') {
    const toastContainer = document.createElement('div');
    toastContainer.className = 'position-fixed bottom-0 end-0 p-3';
    toastContainer.style.zIndex = '11';
    toastContainer.innerHTML = `
        <div class="toast" role="alert">
            <div class="toast-header">
                <i class="bi bi-info-circle text-${type} me-2"></i>
                <strong class="me-auto">Melding</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    const toast = new bootstrap.Toast(toastContainer.querySelector('.toast'));
    toast.show();
    
    // Remove container after toast is hidden
    toastContainer.querySelector('.toast').addEventListener('hidden.bs.toast', () => {
        toastContainer.remove();
    });
} 