// Room Details page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRoomDetails();
    initializeDatePickers();
    initializeBookingForm();
    initializeGallery();
    loadSimilarRooms();
});

// Room data
const roomData = {
};

let currentRoom = null;
let currentImageIndex = 0;
let selectedDates = {
    checkin: '',
    checkout: '',
    guests: 1
};

function initializeRoomDetails() {
    // Get room type from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room') || 'deluxe';
    
    currentRoom = roomData[roomType];
    if (!currentRoom) {
        currentRoom = roomData['deluxe'];
    }
    
    // Load room data
    loadRoomData();
}

function loadRoomData() {
    // Update page title
    document.title = `${currentRoom.name} - Hotel New Chetan`;
    
    // Update room information
    document.getElementById('roomNameBreadcrumb').textContent = currentRoom.name;
    document.getElementById('roomCategory').textContent = currentRoom.category;
    document.getElementById('roomName').textContent = currentRoom.name;
    document.getElementById('roomDescription').textContent = currentRoom.description;
    document.getElementById('roomPrice').textContent = `₹${currentRoom.price.toLocaleString()}`;
    
    // Update availability status
    const statusElement = document.getElementById('availabilityStatus');
    const statusIndicator = statusElement.querySelector('.status-indicator');
    const statusText = statusElement.querySelector('span:last-child');
    
    if (currentRoom.available) {
        statusIndicator.className = 'status-indicator available';
        statusText.textContent = 'Available';
    } else {
        statusIndicator.className = 'status-indicator unavailable';
        statusText.textContent = 'Currently Booked';
    }
    
    // Update guest capacity
    const guestSelect = document.getElementById('guestCount');
    guestSelect.innerHTML = '';
    for (let i = 1; i <= currentRoom.capacity; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${i} Guest${i > 1 ? 's' : ''}`;
        guestSelect.appendChild(option);
    }
    
    // Load amenities
    loadAmenities();
    
    // Load images
    loadImages();
}

function loadAmenities() {
    const amenitiesGrid = document.getElementById('amenitiesGrid');
    amenitiesGrid.innerHTML = '';
    
    currentRoom.amenities.forEach(amenity => {
        const amenityElement = document.createElement('div');
        amenityElement.className = 'amenity-item';
        amenityElement.innerHTML = `
            <span class="amenity-icon">${amenity.icon}</span>
            <span class="amenity-text">${amenity.text}</span>
        `;
        amenitiesGrid.appendChild(amenityElement);
    });
}

function loadImages() {
    const mainImage = document.getElementById('mainRoomImage');
    const thumbnailsContainer = document.getElementById('thumbnailsContainer');
    const totalImagesSpan = document.getElementById('totalImages');
    
    // Set main image
    mainImage.src = currentRoom.images[0];
    mainImage.alt = currentRoom.name;
    
    // Update image counter
    totalImagesSpan.textContent = currentRoom.images.length;
    
    // Create thumbnails
    thumbnailsContainer.innerHTML = '';
    currentRoom.images.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${image}" alt="${currentRoom.name} ${index + 1}">`;
        thumbnail.addEventListener('click', () => showImage(index));
        thumbnailsContainer.appendChild(thumbnail);
    });
}

function initializeGallery() {
    const prevBtn = document.getElementById('prevImage');
    const nextBtn = document.getElementById('nextImage');
    
    prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentRoom.images.length) % currentRoom.images.length;
        showImage(currentImageIndex);
    });
    
    nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentRoom.images.length;
        showImage(currentImageIndex);
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

function showImage(index) {
    currentImageIndex = index;
    const mainImage = document.getElementById('mainRoomImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const currentImageSpan = document.getElementById('currentImageIndex');
    
    // Update main image
    mainImage.src = currentRoom.images[index];
    
    // Update thumbnails
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
    
    // Update counter
    currentImageSpan.textContent = index + 1;
}

function initializeDatePickers() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const checkinInput = document.getElementById('checkinDate');
    const checkoutInput = document.getElementById('checkoutDate');
    
    checkinInput.setAttribute('min', today);
    checkinInput.value = today;
    checkoutInput.setAttribute('min', tomorrowStr);
    checkoutInput.value = tomorrowStr;
    
    // Update checkout minimum when checkin changes
    checkinInput.addEventListener('change', function() {
        const checkinDate = new Date(this.value);
        checkinDate.setDate(checkinDate.getDate() + 1);
        const minCheckout = checkinDate.toISOString().split('T')[0];
        checkoutInput.setAttribute('min', minCheckout);
        
        if (checkoutInput.value <= this.value) {
            checkoutInput.value = minCheckout;
        }
        
        updatePriceBreakdown();
    });
    
    checkoutInput.addEventListener('change', updatePriceBreakdown);
    document.getElementById('guestCount').addEventListener('change', updatePriceBreakdown);
    
    // Initial price calculation
    updatePriceBreakdown();
}

function updatePriceBreakdown() {
    const checkinDate = new Date(document.getElementById('checkinDate').value);
    const checkoutDate = new Date(document.getElementById('checkoutDate').value);
    const guests = parseInt(document.getElementById('guestCount').value);
    
    if (checkinDate && checkoutDate && checkoutDate > checkinDate) {
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
        const roomRate = currentRoom.price;
        const subtotal = roomRate * nights;
        const taxes = Math.round(subtotal * 0.18); // 18% GST
        const total = subtotal + taxes;
        
        // Update breakdown
        document.getElementById('nightCount').textContent = nights;
        document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
        document.getElementById('taxes').textContent = `₹${taxes.toLocaleString()}`;
        document.getElementById('totalPrice').textContent = `₹${total.toLocaleString()}`;
        
        // Show breakdown
        document.getElementById('priceBreakdown').style.display = 'block';
        
        // Store selected dates
        selectedDates = {
            checkin: document.getElementById('checkinDate').value,
            checkout: document.getElementById('checkoutDate').value,
            guests: guests,
            nights: nights,
            subtotal: subtotal,
            taxes: taxes,
            total: total
        };
    } else {
        document.getElementById('priceBreakdown').style.display = 'none';
    }
}

function initializeBookingForm() {
    const bookNowBtn = document.getElementById('bookNowBtn');
    const whatsappInquiry = document.getElementById('whatsappInquiry');
    const bookingModal = document.getElementById('bookingModal');
    const modalClose = document.getElementById('modalClose');
    const bookingForm = document.getElementById('bookingDetailsForm');
    
    // Book now button
    bookNowBtn.addEventListener('click', function() {
        if (!currentRoom.available) {
            HotelApp.showNotification('This room is currently not available', 'error');
            return;
        }
        
        if (!selectedDates.checkin || !selectedDates.checkout) {
            HotelApp.showNotification('Please select check-in and check-out dates', 'error');
            return;
        }
        
        // Update booking summary in modal
        document.getElementById('summaryRoomName').textContent = currentRoom.name;
        document.getElementById('summaryCheckin').textContent = HotelApp.formatDate(selectedDates.checkin);
        document.getElementById('summaryCheckout').textContent = HotelApp.formatDate(selectedDates.checkout);
        document.getElementById('summaryGuests').textContent = selectedDates.guests;
        document.getElementById('summaryTotal').textContent = `₹${selectedDates.total.toLocaleString()}`;
        
        // Show modal
        bookingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    
    // WhatsApp inquiry
    whatsappInquiry.addEventListener('click', function() {
        const message = `Hi! I'm interested in the ${currentRoom.name} at Hotel New Chetan.

Room Details:
- Room: ${currentRoom.name}
- Price: ₹${currentRoom.price.toLocaleString()}/night
- Capacity: ${currentRoom.capacity} guests

${selectedDates.checkin ? `Check-in: ${HotelApp.formatDate(selectedDates.checkin)}` : ''}
${selectedDates.checkout ? `Check-out: ${HotelApp.formatDate(selectedDates.checkout)}` : ''}
${selectedDates.total ? `Total Amount: ₹${selectedDates.total.toLocaleString()}` : ''}

Please provide availability and booking details.`;
        
        HotelApp.openWhatsAppChat(message);
    });
    
    // Close modal
    modalClose.addEventListener('click', closeBookingModal);
    bookingModal.addEventListener('click', function(e) {
        if (e.target === bookingModal) {
            closeBookingModal();
        }
    });
    
    // Booking form submission
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const bookingDetails = {
            name: formData.get('guestName'),
            email: formData.get('guestEmail'),
            phone: formData.get('guestPhone'),
            address: formData.get('guestAddress'),
            specialRequests: formData.get('specialRequests')
        };
        
        // Validate required fields
        if (!bookingDetails.name || !bookingDetails.email || !bookingDetails.phone) {
            HotelApp.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Create WhatsApp message
        const message = `🏨 ROOM BOOKING REQUEST - Hotel New Chetan

📋 Guest Details:
Name: ${bookingDetails.name}
Email: ${bookingDetails.email}
Phone: ${bookingDetails.phone}
${bookingDetails.address ? `Address: ${bookingDetails.address}` : ''}

🛏️ Room Details:
Room Type: ${currentRoom.name}
Check-in: ${HotelApp.formatDate(selectedDates.checkin)}
Check-out: ${HotelApp.formatDate(selectedDates.checkout)}
Guests: ${selectedDates.guests}
Nights: ${selectedDates.nights}

💰 Pricing:
Room Rate: ₹${currentRoom.price.toLocaleString()} × ${selectedDates.nights} nights = ₹${selectedDates.subtotal.toLocaleString()}
Taxes & Fees: ₹${selectedDates.taxes.toLocaleString()}
Total Amount: ₹${selectedDates.total.toLocaleString()}

${bookingDetails.specialRequests ? `🎯 Special Requests:\n${bookingDetails.specialRequests}` : ''}

Please confirm this booking and provide payment details.`;
        
        HotelApp.openWhatsAppChat(message);
        closeBookingModal();
        HotelApp.showNotification('Booking request sent via WhatsApp!', 'success');
    });
}

function closeBookingModal() {
    const bookingModal = document.getElementById('bookingModal');
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
}

function loadSimilarRooms() {
    const similarRoomsGrid = document.getElementById('similarRoomsGrid');
    const currentCategory = currentRoom.category;
    
    // Get similar rooms (same category, different rooms)
    const similarRooms = Object.entries(roomData)
        .filter(([key, room]) => room.category === currentCategory && room.name !== currentRoom.name)
        .slice(0, 3);
    
    // If not enough similar rooms, add from other categories
    if (similarRooms.length < 3) {
        const otherRooms = Object.entries(roomData)
            .filter(([key, room]) => room.name !== currentRoom.name && !similarRooms.some(([k, r]) => r.name === room.name))
            .slice(0, 3 - similarRooms.length);
        similarRooms.push(...otherRooms);
    }
    
    similarRoomsGrid.innerHTML = '';
    
    similarRooms.forEach(([key, room]) => {
        const roomCard = document.createElement('div');
        roomCard.className = 'similar-room-card';
        roomCard.innerHTML = `
            <div class="similar-room-image">
                <img src="${room.images[0]}" alt="${room.name}">
            </div>
            <div class="similar-room-info">
                <h3>${room.name}</h3>
                <p>${room.description.substring(0, 100)}...</p>
                <div class="similar-room-price">₹${room.price.toLocaleString()}<span>/night</span></div>
                <a href="room-details.html?room=${key}" class="similar-room-btn">View Details</a>
            </div>
        `;
        similarRoomsGrid.appendChild(roomCard);
    });
}

// Export functions for global use
window.RoomDetailsPage = {
    showImage,
    updatePriceBreakdown,
    closeBookingModal
};