// Events page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeEventAnimations();
    initializeHallGalleries();
});

// Initialize scroll animations for events page
function initializeEventAnimations() {
    const hallCards = document.querySelectorAll('.hall-card');
    const serviceCards = document.querySelectorAll('.service-card');
    const packageCards = document.querySelectorAll('.package-card');
    const steps = document.querySelectorAll('.step');
    
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
    
    [...hallCards, ...serviceCards, ...packageCards, ...steps].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Hall gallery functionality
function initializeHallGalleries() {
    // Sample hall gallery images
    window.hallGalleries = {
        'grand-ballroom': [
            'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
            'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
            'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg'
        ],
        'conference-hall': [
            'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg',
            'https://images.pexels.com/photos/416320/pexels-photo-416320.jpeg',
            'https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg'
        ],
        'celebration-hall': [
            'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
            'https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg',
            'https://images.pexels.com/photos/1395967/pexels-photo-1395967.jpeg'
        ]
    };
}

function openHallGallery(hallType) {
    const images = window.hallGalleries[hallType] || window.hallGalleries['grand-ballroom'];
    createHallGalleryModal(images, hallType);
}

function createHallGalleryModal(images, hallType) {
    // Remove existing modal if present
    const existingModal = document.getElementById('hallGalleryModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'hallGalleryModal';
    modal.innerHTML = `
        <div class="hall-gallery-overlay">
            <div class="hall-gallery-content">
                <button class="hall-gallery-close">&times;</button>
                <div class="hall-gallery-header">
                    <h3>${formatHallType(hallType)} Gallery</h3>
                </div>
                <div class="hall-gallery-slider">
                    <div class="hall-gallery-slides">
                        ${images.map((img, index) => `
                            <div class="hall-gallery-slide ${index === 0 ? 'active' : ''}">
                                <img src="${img}" alt="${formatHallType(hallType)} Image ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                    <button class="hall-gallery-nav hall-gallery-prev"><</button>
                    <button class="hall-gallery-nav hall-gallery-next">></button>
                </div>
                <div class="hall-gallery-thumbnails">
                    ${images.map((img, index) => `
                        <img src="${img}" alt="Thumbnail ${index + 1}" 
                             class="hall-gallery-thumbnail ${index === 0 ? 'active' : ''}"
                             data-index="${index}">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // Add gallery modal styles
    const modalStyles = document.createElement('style');
    modalStyles.innerHTML = `
        #hallGalleryModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        #hallGalleryModal.active {
            opacity: 1;
            visibility: visible;
        }
        .hall-gallery-content {
            background: white;
            border-radius: 12px;
            max-width: 90%;
            max-height: 90%;
            overflow: hidden;
            position: relative;
        }
        .hall-gallery-close {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            z-index: 10001;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hall-gallery-header {
            background: var(--primary-navy);
            color: white;
            padding: 1.5rem 2rem;
            text-align: center;
        }
        .hall-gallery-header h3 {
            margin: 0;
            font-size: 1.5rem;
        }
        .hall-gallery-slider {
            position: relative;
            height: 400px;
            overflow: hidden;
        }
        .hall-gallery-slides {
            height: 100%;
            position: relative;
        }
        .hall-gallery-slide {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        }
        .hall-gallery-slide.active {
            opacity: 1;
        }
        .hall-gallery-slide img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .hall-gallery-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            padding: 1rem;
            z-index: 10;
            transition: background 0.3s ease;
        }
        .hall-gallery-nav:hover {
            background: rgba(0, 0, 0, 0.9);
        }
        .hall-gallery-prev {
            left: 20px;
        }
        .hall-gallery-next {
            right: 20px;
        }
        .hall-gallery-thumbnails {
            display: flex;
            gap: 1rem;
            padding: 1.5rem 2rem;
            background: #f8f6f0;
            overflow-x: auto;
        }
        .hall-gallery-thumbnail {
            width: 80px;
            height: 60px;
            object-fit: cover;
            border-radius: 6px;
            cursor: pointer;
            opacity: 0.6;
            transition: opacity 0.3s ease;
            flex-shrink: 0;
        }
        .hall-gallery-thumbnail.active,
        .hall-gallery-thumbnail:hover {
            opacity: 1;
        }
        @media (max-width: 768px) {
            .hall-gallery-content {
                max-width: 95%;
                max-height: 95%;
            }
            .hall-gallery-slider {
                height: 300px;
            }
            .hall-gallery-nav {
                font-size: 1.5rem;
                padding: 0.5rem;
            }
            .hall-gallery-thumbnails {
                padding: 1rem;
                gap: 0.5rem;
            }
            .hall-gallery-thumbnail {
                width: 60px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);
    
    // Initialize gallery functionality
    initializeHallGalleryModal(modal, images);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function initializeHallGalleryModal(modal, images) {
    let currentSlide = 0;
    const slides = modal.querySelectorAll('.hall-gallery-slide');
    const thumbnails = modal.querySelectorAll('.hall-gallery-thumbnail');
    const prevBtn = modal.querySelector('.hall-gallery-prev');
    const nextBtn = modal.querySelector('.hall-gallery-next');
    const closeBtn = modal.querySelector('.hall-gallery-close');
    
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (thumbnails[index]) {
            thumbnails[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % images.length;
        showSlide(next);
    }
    
    function prevSlide() {
        const prev = (currentSlide - 1 + images.length) % images.length;
        showSlide(prev);
    }
    
    // Navigation event listeners
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // Thumbnail event listeners
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => showSlide(index));
    });
    
    // Close modal event listeners
    if (closeBtn) {
        closeBtn.addEventListener('click', closeHallGalleryModal);
    }
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('hall-gallery-overlay')) {
            closeHallGalleryModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            switch (e.key) {
                case 'ArrowLeft':
                    prevSlide();
                    break;
                case 'ArrowRight':
                    nextSlide();
                    break;
                case 'Escape':
                    closeHallGalleryModal();
                    break;
            }
        }
    });
}

function closeHallGalleryModal() {
    const modal = document.getElementById('hallGalleryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

function formatHallType(hallType) {
    return hallType.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

function showHallDetails(hallId) {
    const hallDetails = {
        'grand-ballroom': {
            name: 'Grand Ballroom',
            description: 'Our most prestigious venue featuring crystal chandeliers, premium sound system, and elegant décor.',
            features: [
                'Crystal chandeliers and premium lighting',
                'Professional sound and AV system',
                'Spacious dance floor',
                'Bridal suite access',
                'Dedicated catering kitchen',
                'Valet parking service',
                'Professional event coordination'
            ],
            capacity: '200-300 guests',
            area: '3,000 sq ft',
            pricing: {
                halfDay: '₹25,000',
                fullDay: '₹45,000',
                wedding: '₹75,000'
            }
        },
        'conference-hall': {
            name: 'Conference Hall',
            description: 'Modern business facility with latest technology for professional meetings and corporate events.',
            features: [
                'High-definition projector and screen',
                'Professional microphone system',
                'High-speed WiFi connectivity',
                'Climate control system',
                'Whiteboard and flip charts',
                'Tea/coffee service included',
                'Technical support staff'
            ],
            capacity: '50-100 guests',
            area: '1,500 sq ft',
            pricing: {
                halfDay: '₹12,000',
                fullDay: '₹20,000',
                monthly: '₹3,50,000'
            }
        },
        'celebration-hall': {
            name: 'Celebration Hall',
            description: 'Intimate venue perfect for personal celebrations and small gatherings with warm ambiance.',
            features: [
                'Flexible seating arrangements',
                'Decoration support included',
                'Music and entertainment system',
                'Photo booth area',
                'Cake cutting setup',
                'Party games coordination',
                'Return gift arrangements'
            ],
            capacity: '30-80 guests',
            area: '1,000 sq ft',
            pricing: {
                halfDay: '₹8,000',
                fullDay: '₹15,000',
                birthday: '₹12,000'
            }
        }
    };
    
    const hall = hallDetails[hallId];
    if (!hall) return;
    
    let message = `🏛️ ${hall.name} - Detailed Information\n\n`;
    message += `📝 Description:\n${hall.description}\n\n`;
    message += `👥 Capacity: ${hall.capacity}\n`;
    message += `📐 Area: ${hall.area}\n\n`;
    message += `✨ Features & Amenities:\n`;
    hall.features.forEach(feature => {
        message += `• ${feature}\n`;
    });
    message += `\n💰 Pricing:\n`;
    Object.entries(hall.pricing).forEach(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        message += `• ${label}: ${value}\n`;
    });
    message += `\nWould you like to book this hall or need more information?`;
    
    HotelApp.openWhatsAppChat(message);
}

// Export functions for global use
window.EventsPage = {
    openHallGallery,
    closeHallGalleryModal,
    showHallDetails
};