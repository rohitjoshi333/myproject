// Main JavaScript - Global functionality

// Global variables
let currentSlide = 0;
let currentTestimonial = 0;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCookieConsent();
    initializeWhatsApp();
    initializeScrollEffects();
    initializeDatePickers();
});

// Navigation functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active navigation highlighting
    highlightActiveNavigation();
}

function highlightActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Cookie consent functionality
function initializeCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    const acceptBtn = document.getElementById('acceptCookies');
    const declineBtn = document.getElementById('declineCookies');

    if (cookieConsent) {
        // Show cookie consent if not already responded
        if (!localStorage.getItem('cookieConsent')) {
            setTimeout(() => {
                cookieConsent.classList.add('show');
            }, 2000);
        }

        // Accept cookies
        if (acceptBtn) {
            acceptBtn.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'accepted');
                cookieConsent.classList.remove('show');
            });
        }

        // Decline cookies
        if (declineBtn) {
            declineBtn.addEventListener('click', function() {
                localStorage.setItem('cookieConsent', 'declined');
                cookieConsent.classList.remove('show');
            });
        }
    }
}

// WhatsApp functionality
function initializeWhatsApp() {
    const whatsappFloat = document.getElementById('whatsappFloat');
    
    if (whatsappFloat) {
        // Show WhatsApp button after page load
        setTimeout(() => {
            whatsappFloat.style.opacity = '1';
        }, 3000);

        // Add click tracking
        whatsappFloat.addEventListener('click', function() {
            // Track WhatsApp click event
            console.log('WhatsApp clicked');
        });
    }
}

// Scroll effects
function initializeScrollEffects() {
    // Smooth scroll for anchor links
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

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.room-card, .gallery-item, .testimonial-content').forEach(el => {
        observer.observe(el);
    });
}

// Date picker initialization
function initializeDatePickers() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');

    if (checkinInput) {
        checkinInput.setAttribute('min', today);
        checkinInput.value = today;
    }

    if (checkoutInput) {
        checkoutInput.setAttribute('min', tomorrowStr);
        checkoutInput.value = tomorrowStr;
    }

    // Update checkout minimum date when checkin changes
    if (checkinInput && checkoutInput) {
        checkinInput.addEventListener('change', function() {
            const checkinDate = new Date(this.value);
            checkinDate.setDate(checkinDate.getDate() + 1);
            const minCheckout = checkinDate.toISOString().split('T')[0];
            checkoutInput.setAttribute('min', minCheckout);
            
            if (checkoutInput.value <= this.value) {
                checkoutInput.value = minCheckout;
            }
        });
    }
}

// Quick booking form handler
function handleQuickBooking(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const bookingData = {
        checkin: formData.get('checkin'),
        checkout: formData.get('checkout'),
        roomType: formData.get('roomType'),
        guests: formData.get('guests')
    };

    // Validate dates
    const checkinDate = new Date(bookingData.checkin);
    const checkoutDate = new Date(bookingData.checkout);
    
    if (checkoutDate <= checkinDate) {
        showNotification('Check-out date must be after check-in date', 'error');
        return;
    }

    // Store booking data and redirect to booking page
    sessionStorage.setItem('quickBookingData', JSON.stringify(bookingData));
    window.location.href = 'booking.html';
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.innerHTML = `
            .notification {
                position: fixed;
                top: 100px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                z-index: 10000;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            }
            .notification.info { background: #3182ce; }
            .notification.success { background: #38a169; }
            .notification.warning { background: #dd6b20; }
            .notification.error { background: #e53e3e; }
            .notification-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 1rem;
            }
            .notification-content button {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// WhatsApp integration functions
function openWhatsAppChat(message = '') {
    const phoneNumber = '919876543210'; // Replace with actual number
    const defaultMessage = message || 'Hello! I\'m interested in Hotel New Chetan services.';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, '_blank');
}

function orderFoodWhatsApp(itemName, price) {
    const message = `Hi! I'd like to order ${itemName} (₹${price}) from Hotel New Chetan restaurant. Please confirm availability and delivery details.`;
    openWhatsAppChat(message);
}

function bookRoomWhatsApp(roomType, checkin, checkout) {
    const message = `Hi! I'd like to book a ${roomType} at Hotel New Chetan from ${formatDate(checkin)} to ${formatDate(checkout)}. Please check availability and provide booking details.`;
    openWhatsAppChat(message);
}

function inquireEventHall(hallName) {
    const message = `Hi! I'm interested in booking ${hallName} at Hotel New Chetan for an event. Please share availability, pricing, and package details.`;
    openWhatsAppChat(message);
}

// Export functions for use in other files
window.HotelApp = {
    showNotification,
    formatCurrency,
    formatDate,
    openWhatsAppChat,
    orderFoodWhatsApp,
    bookRoomWhatsApp,
    inquireEventHall,
    handleQuickBooking
};