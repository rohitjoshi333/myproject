document.addEventListener('DOMContentLoaded', () => {
    initGalleryFilters();
    initLightbox();
    initAnimations();
    initLazyLoading();
    initImageZoom();
    initSearchBar();
    handleURLHash();
});

// === Gallery Filtering ===
function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            galleryItems.forEach(item => {
                const category = item.dataset.category;
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.classList.add('show');
                } else {
                    item.style.display = 'none';
                    item.classList.remove('show');
                }
            });

            updateLightboxItems();
        });
    });
}

// === Lightbox ===
let lightboxIndex = 0;
let lightboxItems = [];

function initLightbox() {
    const items = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');

    items.forEach((item, index) => {
        item.addEventListener('click', () => {
            const imageSrc = item.querySelector('img').src;
            const title = item.querySelector('h3')?.textContent || '';
            img.src = imageSrc;
            caption.textContent = title;
            lightboxIndex = index;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-prev').addEventListener('click', showPrevImage);
    document.querySelector('.lightbox-next').addEventListener('click', showNextImage);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    });

    updateLightboxItems();
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function showPrevImage() {
    lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
    updateLightboxView();
}

function showNextImage() {
    lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
    updateLightboxView();
}

function updateLightboxItems() {
    lightboxItems = Array.from(document.querySelectorAll('.gallery-item')).filter(
        item => item.style.display !== 'none'
    ).map(item => ({
        src: item.querySelector('img').src,
        title: item.querySelector('h3')?.textContent || ''
    }));
}

function updateLightboxView() {
    const lightbox = document.getElementById('lightbox');
    const img = lightbox.querySelector('.lightbox-image');
    const caption = lightbox.querySelector('.lightbox-caption');
    const current = lightboxItems[lightboxIndex];
    if (current) {
        img.src = current.src;
        caption.textContent = current.title;
    }
}

// === Animations on Scroll ===
function initAnimations() {
    const items = document.querySelectorAll('.gallery-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    items.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
        observer.observe(item);
    });
}

// === Lazy Loading ===
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                obs.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => observer.observe(img));
}

// === Zoom on Hover ===
function initImageZoom() {
    const items = document.querySelectorAll('.gallery-item img');
    items.forEach(img => {
        img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.1)');
        img.addEventListener('mouseleave', () => img.style.transform = 'scale(1)');
    });
}

// === Search Filter ===
function initSearchBar() {
    const searchInput = document.createElement('input');
    searchInput.className = 'gallery-search';
    searchInput.placeholder = 'Search gallery...';
    
    const filters = document.querySelector('.gallery-filters');
    if (filters) filters.parentNode.insertBefore(searchInput, filters);

    searchInput.addEventListener('input', () => {
        const term = searchInput.value.toLowerCase();
        const items = document.querySelectorAll('.gallery-item');

        items.forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const visible = title.includes(term);
            item.style.display = visible ? 'block' : 'none';
        });

        updateLightboxItems();
    });
}

// === Handle #hash Navigation ===
function handleURLHash() {
    if (location.hash === '#nearby') {
        const btn = document.querySelector('[data-section="nearby"]');
        if (btn) btn.click();
    }
}
