// Rooms page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRoomFilters();
    initializeRoomSorting();
    initializeRoomGallery();
    animateRoomsOnScroll();
});

// Room filtering functionality
function initializeRoomFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const roomCards = document.querySelectorAll('.room-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter rooms
            filterRooms(filter, roomCards);
        });
    });
}

function filterRooms(filter, roomCards) {
    const roomsGrid = document.getElementById('roomsGrid');
    roomsGrid.classList.add('loading');
    
    setTimeout(() => {
        roomCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                card.classList.remove('hidden');
                card.classList.add('filter-animate');
            } else {
                card.classList.add('hidden');
                card.classList.remove('filter-animate');
            }
        });
        
        roomsGrid.classList.remove('loading');
    }, 300);
}

// Room sorting functionality
function initializeRoomSorting() {
    const sortSelect = document.getElementById('sortRooms');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortRooms(sortBy);
        });
    }
}

function sortRooms(sortBy) {
    const roomsGrid = document.getElementById('roomsGrid');
    const roomCards = Array.from(roomsGrid.querySelectorAll('.room-card:not(.hidden)'));
    
    roomCards.sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
            case 'price-high':
                return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
            case 'capacity':
                return parseInt(b.getAttribute('data-capacity')) - parseInt(a.getAttribute('data-capacity'));
            case 'availability':
                const aAvailable = a.querySelector('.room-status').classList.contains('available');
                const bAvailable = b.querySelector('.room-status').classList.contains('available');
                return bAvailable - aAvailable;
            default:
                return 0;
        }
    });
    
    // Re-append sorted cards
    roomCards.forEach(card => {
        roomsGrid.appendChild(card);
    });
    
    // Add animation
    roomCards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('filter-animate');
        }, index * 100);
    });
}

function formatRoomType(roomType) {
    return roomType.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

// Animate rooms on scroll
function animateRoomsOnScroll() {
    const roomCards = document.querySelectorAll('.room-card');
    const featureCards = document.querySelectorAll('.feature-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    [...roomCards, ...featureCards].forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Room booking functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('book-btn') && !e.target.disabled) {
        const roomCard = e.target.closest('.room-card');
        const roomName = roomCard.querySelector('h3').textContent;
        const roomPrice = roomCard.querySelector('.room-price').textContent.split('₹')[1].split('/')[0];
        
        // Get quick booking data if available
        const quickBookingData = sessionStorage.getItem('quickBookingData');
        let checkin = '';
        let checkout = '';
        
        if (quickBookingData) {
            const data = JSON.parse(quickBookingData);
            checkin = data.checkin;
            checkout = data.checkout;
        }
        
        // Store room selection
        sessionStorage.setItem('selectedRoomBooking', JSON.stringify({
            name: roomName,
            price: roomPrice,
            checkin: checkin,
            checkout: checkout
        }));
        
        HotelApp.showNotification(`${roomName} selected for booking!`, 'success');
    }
});

// Search functionality (if search input exists)
function initializeRoomSearch() {
    const searchInput = document.getElementById('roomSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const roomCards = document.querySelectorAll('.room-card');
            
            roomCards.forEach(card => {
                const roomName = card.querySelector('h3').textContent.toLowerCase();
                const roomDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (roomName.includes(searchTerm) || roomDescription.includes(searchTerm)) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    }
}

// Initialize search if search input exists
document.addEventListener('DOMContentLoaded', initializeRoomSearch);

// Export functions for external use
window.RoomsPage = {
    filterRooms,
    sortRooms,
    openRoomGallery,
    closeGalleryModal
};