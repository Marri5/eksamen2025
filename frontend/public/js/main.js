// Main JavaScript for fox voting system
document.addEventListener('DOMContentLoaded', function() {
    // Get all vote buttons
    const voteButtons = document.querySelectorAll('.vote-btn');
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Check vote status on page load
    checkVoteStatus();
    
    async function checkVoteStatus() {
        try {
            const response = await fetch('/api/vote-status', {
                method: 'GET',
                credentials: 'include' // Include cookies
            });
            
            const data = await response.json();
            
            if (data.success && data.hasVoted) {
                // User has already voted - disable voting
                disableVoting(data.message, data.voteTimestamp);
            }
        } catch (error) {
            console.error('Error checking vote status:', error);
            // Continue normally if can't check status
        }
    }
    
    function disableVoting(message, voteTimestamp) {
        voteButtons.forEach(button => {
            button.disabled = true;
            button.textContent = 'Du har allerede stemt';
            button.classList.remove('btn-primary');
            button.classList.add('btn-secondary');
        });
        
        // Show info message
        const container = document.querySelector('.voting-container') || document.querySelector('.container');
        if (container) {
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-info alert-dismissible fade show mt-3';
            alertDiv.innerHTML = `
                <strong>Du har allerede stemt!</strong> ${message}
                ${voteTimestamp ? `<br><small>Stemme avgitt: ${new Date(voteTimestamp).toLocaleString('no-NO')}</small>` : ''}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            container.insertBefore(alertDiv, container.firstChild);
        }
    }
    
    // Handle vote button clicks
    voteButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            // Disable all vote buttons to prevent double voting
            voteButtons.forEach(btn => btn.disabled = true);
            
            // Get image URL from button data
            const imageUrl = this.getAttribute('data-image-url');
            const imageIndex = this.getAttribute('data-image-index');
            
            // Show loading overlay
            if (loadingOverlay) {
                loadingOverlay.classList.remove('d-none');
            }
            
            try {
                // Send vote to server
                const response = await fetch('/vote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include cookies
                    body: JSON.stringify({ imageUrl })
                });
                
                const data = await response.json();
                
                // Hide loading overlay
                if (loadingOverlay) {
                    loadingOverlay.classList.add('d-none');
                }
                
                if (data.success) {
                    // Show success modal
                    const successModal = new bootstrap.Modal(document.getElementById('voteSuccessModal'));
                    
                    // Update success message
                    const messageElement = document.getElementById('voteMessage');
                    if (messageElement) {
                        messageElement.textContent = data.message || 'Din stemme er registrert!';
                    }
                    
                    // Permanently disable voting after successful vote
                    disableVoting('Takk for din stemme!');
                    
                    successModal.show();
                } else {
                    // Handle already voted case
                    if (data.alreadyVoted) {
                        disableVoting(data.message);
                        showError(data.message);
                    } else {
                        // Show other error
                        showError(data.message || 'Kunne ikke registrere stemmen');
                        // Re-enable vote buttons for other errors
                        setTimeout(() => {
                            voteButtons.forEach(btn => btn.disabled = false);
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Voting error:', error);
                
                // Hide loading overlay
                if (loadingOverlay) {
                    loadingOverlay.classList.add('d-none');
                }
                
                // Show error modal
                showError('Nettverksfeil - kunne ikke kontakte serveren');
                
                // Re-enable vote buttons after network errors
                setTimeout(() => {
                    voteButtons.forEach(btn => btn.disabled = false);
                }, 2000);
            }
        });
    });
    
    // Function to show error modal
    function showError(message) {
        const errorModal = new bootstrap.Modal(document.getElementById('voteErrorModal'));
        const errorMessageElement = document.getElementById('errorMessage');
        
        if (errorMessageElement) {
            errorMessageElement.textContent = message;
        }
        
        errorModal.show();
    }
    
    // Add hover effects to vote buttons
    voteButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('shadow-lg');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('shadow-lg');
        });
    });
    
    // Handle image loading errors
    const foxImages = document.querySelectorAll('.fox-image');
    foxImages.forEach(img => {
        img.addEventListener('error', function() {
            this.src = '/images/placeholder-fox.jpg'; // Fallback image
            this.alt = 'Bilde kunne ikke lastes';
        });
    });
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Handle network status
    window.addEventListener('online', function() {
        console.log('Back online');
        // Could show a notification that connection is restored
    });
    
    window.addEventListener('offline', function() {
        console.log('Lost connection');
        showError('Mistet internettforbindelse. Sjekk nettverket ditt.');
    });
}); 