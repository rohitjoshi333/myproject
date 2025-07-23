// Gallery page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeGalleryNavigation();
    initializeGalleryFilters();
    initializeLightbox();
    initializeGalleryAnimations();
    initializeAttractionsSlider();
});

let currentLightboxIndex = 0;
let currentGalleryImages = [];
let currentAttractionSlide = 0;

// Initialize gallery section navigation
function initializeGalleryNavigation() {
    const navButtons = document.querySelectorAll('.gallery-nav-btn');
    const gallerySections = document.querySelectorAll('.gallery-section');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            gallerySections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${targetSection}-gallery` || section.id === `${targetSection}-attractions`) {
                    section.classList.add('active');
                }
            });
            
            // Smooth scroll to section
            const targetElement = document.getElementById(`${targetSection}-gallery`) || 
                                 document.getElementById(`${targetSection}-attractions`);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Initialize hotel gallery filters
function initializeGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter, galleryItems);
        });
    });
}

function filterGalleryItems(filter, galleryItems) {
    const galleryGrid = document.getElementById('hotelGalleryGrid');
    galleryGrid.classList.add('loading');
    
    setTimeout(() => {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (filter === 'all' || itemCategory === filter) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.classList.add('filter-animate');
                }, 100);
            } else {
                item.style.display = 'none';
            }
        });
        
        galleryGrid.classList.remove('loading');
        
        // Update lightbox images array
        updateLightboxImages();
    }, 300);
}

// Initialize attractions slider
function initializeAttractionsSlider() {
    const slider = document.querySelector('.attractions-slider');
    const slides = document.querySelectorAll('.attraction-slide');
    const prevBtn = document.querySelector('.attractions-prev');
    const nextBtn = document.querySelector('.attractions-next');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!slider || slides.length === 0) return;
    
    let autoSlideInterval;
    
    function showSlide(index) {
        currentAttractionSlide = index;
        const translateX = -index * 100;
        slider.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, i) => {
            indicator.classList.toggle('active', i === index);
        });
    }
    
    function nextSlide() {
        const nextIndex = (currentAttractionSlide + 1) % slides.length;
        showSlide(nextIndex);
    }
    
    function prevSlide() {
        const prevIndex = (currentAttractionSlide - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }
    
    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });
    
    // Pause on hover
    const sliderContainer = document.querySelector('.attractions-slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Touch/swipe support
    let startX = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
    });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoSlide();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.attractions-section:hover')) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
                stopAutoSlide();
                startAutoSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
                stopAutoSlide();
                startAutoSlide();
            }
        }
    });
    
    // Start auto slide
    startAutoSlide();
}

// Initialize lightbox functionality
function initializeLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxPrev = lightbox.querySelector('.lightbox-prev');
    const lightboxNext = lightbox.querySelector('.lightbox-next');
    
    // Add click event to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            
            openLightbox(img.src, `${title} - ${description}`, index);
        });
    });
    
    // Close lightbox events
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
            closeLightbox();
        }
    });
    
    // Navigation events
    lightboxPrev.addEventListener('click', showPreviousImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPreviousImage();
                    break;
                case 'ArrowRight':
                    showNextImage();
                    break;
            }
        }
    });
    
    // Initialize images array
    updateLightboxImages();
}

function updateLightboxImages() {
    const visibleItems = document.querySelectorAll('.gallery-item[style*="display: block"], .gallery-item:not([style*="display: none"])');
    currentGalleryImages = Array.from(visibleItems).map(item => {
        const img = item.querySelector('img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        return {
            src: img.src,
            caption: `${title} - ${description}`
        };
    });
}

function openLightbox(imageSrc, caption, index) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    currentLightboxIndex = index;
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPreviousImage() {
    if (currentGalleryImages.length === 0) return;
    
    currentLightboxIndex = (currentLightboxIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateLightboxImage();
}

function showNextImage() {
    if (currentGalleryImages.length === 0) return;
    
    currentLightboxIndex = (currentLightboxIndex + 1) % currentGalleryImages.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    
    if (currentGalleryImages[currentLightboxIndex]) {
        lightboxImage.src = currentGalleryImages[currentLightboxIndex].src;
        lightboxCaption.textContent = currentGalleryImages[currentLightboxIndex].caption;
    }
}

// Initialize scroll animations
function initializeGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const attractionSlides = document.querySelectorAll('.attraction-slide');
    
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
    
    [...galleryItems, ...attractionSlides].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Handle URL hash navigation
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash === '#nearby') {
        const nearbyBtn = document.querySelector('[data-section="nearby"]');
        if (nearbyBtn) {
            nearbyBtn.click();
        }
    }
}

// Initialize hash navigation on page load
document.addEventListener('DOMContentLoaded', handleHashNavigation);
window.addEventListener('hashchange', handleHashNavigation);

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Image zoom functionality for gallery items
function initializeImageZoom() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        
        item.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
        });
    });
}

// Search functionality for gallery
function initializeGallerySearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search gallery...';
    searchInput.className = 'gallery-search';
    
    // Add search container
    const hotelGallery = document.getElementById('hotel-gallery');
    const filtersContainer = hotelGallery.querySelector('.gallery-filters');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'gallery-search-container';
    searchContainer.appendChild(searchInput);
    
    hotelGallery.insertBefore(searchContainer, filtersContainer);
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
        
        updateLightboxImages();
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeImageZoom();
    initializeGallerySearch();
});

// Export functions for global use
window.GalleryPage = {
    openLightbox,
    closeLightbox,
    showPreviousImage,
    showNextImage,
    filterGalleryItems
};