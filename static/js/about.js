// About page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAboutAnimations();
    initializeCounterAnimation();
    initializeTeamInteractions();
});

// Initialize scroll animations for about page
function initializeAboutAnimations() {
    const mvCards = document.querySelectorAll('.mv-card');
    const featureCards = document.querySelectorAll('.feature-card');
    const teamMembers = document.querySelectorAll('.team-member');
    const awardCards = document.querySelectorAll('.award-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    [...mvCards, ...featureCards, ...teamMembers, ...awardCards].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize counter animation for statistics
function initializeCounterAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                
                // Extract number from text (handle cases like "4.8" or "10,000+")
                const numericValue = parseFloat(finalValue.replace(/[^\d.]/g, ''));
                const hasPlus = finalValue.includes('+');
                const isDecimal = finalValue.includes('.');
                
                animateCounter(target, 0, numericValue, 2000, hasPlus, isDecimal);
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        counterObserver.observe(stat);
    });
}

function animateCounter(element, start, end, duration, hasPlus = false, isDecimal = false) {
    const startTime = performance.now();
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;
        
        let displayValue;
        if (isDecimal) {
            displayValue = current.toFixed(1);
        } else if (end >= 1000) {
            displayValue = Math.floor(current).toLocaleString();
        } else {
            displayValue = Math.floor(current).toString();
        }
        
        if (hasPlus && progress === 1) {
            displayValue += '+';
        }
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }
    
    requestAnimationFrame(updateCounter);
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeParallaxEffect();
    initializeAwardRotation();
});

// Export functions for global use
window.AboutPage = {
    showTeamMemberModal,
    closeTeamMemberModal,
    contactTeamMember
};