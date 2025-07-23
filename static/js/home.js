// Home page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeHeroSlider();
    initializeTestimonialCarousel();
    initializeQuickBookingForm();
});

// Hero Slider functionality
function initializeHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const progressBar = document.querySelector('.progress-bar');

    if (slides.length === 0) return;

    let currentSlide = 0;
    let sliderInterval;
    let progressInterval;

    // Set background images
    slides.forEach((slide, index) => {
        const bgImage = slide.getAttribute('data-bg');
        if (bgImage) {
            slide.style.backgroundImage = `url(${bgImage})`;
        }
    });

    // Create progress bar if it doesn't exist
    if (!progressBar) {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'slider-progress';
        progressContainer.innerHTML = '<div class="progress-bar"></div>';
        document.querySelector('.hero').appendChild(progressContainer);
    }

    // Navigation functions
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        currentSlide = index;
        resetProgress();
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function resetProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.classList.remove('active');
            clearInterval(progressInterval);
            
            setTimeout(() => {
                progressBar.classList.add('active');
                startProgressTimer();
            }, 50);
        }
    }

    function startProgressTimer() {
        progressInterval = setTimeout(() => {
            nextSlide();
        }, 5000);
    }

    // Auto-advance slider
    function startSliderInterval() {
        sliderInterval = setInterval(nextSlide, 5000);
        resetProgress();
    }

    function resetSliderInterval() {
        clearInterval(sliderInterval);
        clearInterval(progressInterval);
        startSliderInterval();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetSliderInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetSliderInterval();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetSliderInterval();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetSliderInterval();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetSliderInterval();
        }
    });

    // Initialize slider
    startSliderInterval();
}

// Testimonial Carousel
function initializeTestimonialCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');

    if (testimonials.length === 0) return;

    let currentTestimonial = 0;
    let testimonialInterval = setInterval(nextTestimonial, 4000);

    function showTestimonial(index) {
        testimonials.forEach(testimonial => testimonial.classList.remove('active'));
        if (testimonials[index]) {
            testimonials[index].classList.add('active');
        }
        currentTestimonial = index;
    }

    function nextTestimonial() {
        const next = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(next);
    }

    function prevTestimonial() {
        const prev = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prev);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextTestimonial();
            resetTestimonialInterval();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevTestimonial();
            resetTestimonialInterval();
        });
    }

    function resetTestimonialInterval() {
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(nextTestimonial, 4000);
    }

    // Pause testimonial on hover
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialsCarousel) {
        testimonialsCarousel.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });

        testimonialsCarousel.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextTestimonial, 4000);
        });
    }
}

// Quick Booking Form with WhatsApp Integration
function initializeQuickBookingForm() {
    const quickBookingForm = document.getElementById('quickBookingForm');
    
    if (quickBookingForm) {
        quickBookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const bookingData = {
                checkin: formData.get('checkin'),
                checkout: formData.get('checkout'),
                roomType: formData.get('roomType'),
                guests: formData.get('guests')
            };

            // Basic validation
            if (!bookingData.checkin || !bookingData.checkout || !bookingData.roomType || !bookingData.guests) {
                HotelApp.showNotification('Please fill in all fields', 'error');
                return;
            }

            // Date validation
            const checkinDate = new Date(bookingData.checkin);
            const checkoutDate = new Date(bookingData.checkout);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (checkinDate < today) {
                HotelApp.showNotification('Check-in date cannot be in the past', 'error');
                return;
            }

            if (checkoutDate <= checkinDate) {
                HotelApp.showNotification('Check-out date must be after check-in date', 'error');
                return;
            }

            // Calculate nights and show availability
            const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Checking...';
            submitBtn.disabled = true;

            // Simulate availability check
            setTimeout(() => {
                // Create WhatsApp message for availability inquiry
                const message = `🏨 ROOM AVAILABILITY INQUIRY - Hotel New Chetan

📅 Booking Details:
Check-in: ${HotelApp.formatDate(bookingData.checkin)}
Check-out: ${HotelApp.formatDate(bookingData.checkout)}
Duration: ${nights} night${nights > 1 ? 's' : ''}
Room Type: ${bookingData.roomType}
Guests: ${bookingData.guests}

Please check availability and provide pricing for these dates.`;

                HotelApp.openWhatsAppChat(message);
                
                // Reset form
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                HotelApp.showNotification('Availability inquiry sent via WhatsApp!', 'success');
            }, 2000);
        });
    }
}

// Room card interactions with booking modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('room-btn')) {
        e.preventDefault();
        const roomCard = e.target.closest('.room-card');
        const roomName = roomCard.querySelector('h3').textContent;
        const roomPrice = roomCard.querySelector('.room-price').textContent.split('₹')[1].split('/')[0];
        
        // Show booking modal for room
        showRoomBookingModal(roomName, roomPrice);
    }
});

function showRoomBookingModal(roomName, roomPrice) {
    // Create booking modal
    const modal = document.createElement('div');
    modal.id = 'roomBookingModal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeRoomBookingModal()">&times;</button>
                <h3>Book ${roomName}</h3>
                <div class="room-booking-info">
                    <p><strong>Room:</strong> ${roomName}</p>
                    <p><strong>Price:</strong> ₹${roomPrice}/night</p>
                </div>
                <form id="roomBookingForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="bookingCheckin">Check-in Date *</label>
                            <input type="date" id="bookingCheckin" name="checkin" required>
                        </div>
                        <div class="form-group">
                            <label for="bookingCheckout">Check-out Date *</label>
                            <input type="date" id="bookingCheckout" name="checkout" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="bookingGuests">Number of Guests *</label>
                            <select id="bookingGuests" name="guests" required>
                                <option value="">Select guests</option>
                                <option value="1">1 Guest</option>
                                <option value="2">2 Guests</option>
                                <option value="3">3 Guests</option>
                                <option value="4">4 Guests</option>
                                <option value="5">5 Guests</option>
                                <option value="6">6 Guests</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="guestName">Full Name *</label>
                            <input type="text" id="guestName" name="name" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="guestPhone">Phone Number *</label>
                            <input type="tel" id="guestPhone" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label for="guestEmail">Email Address *</label>
                            <input type="email" id="guestEmail" name="email" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="specialRequests">Special Requests</label>
                        <textarea id="specialRequests" name="requests" rows="3" placeholder="Any special requirements..."></textarea>
                    </div>
                    <button type="submit" class="confirm-booking-btn">Send Booking Request via WhatsApp</button>
                </form>
            </div>
        </div>
    `;

    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.innerHTML = `
        #roomBookingModal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        #roomBookingModal.active {
            opacity: 1;
            visibility: visible;
        }
        #roomBookingModal .modal-content {
            background: var(--primary-white);
            border-radius: var(--border-radius);
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        #roomBookingModal .modal-close {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: var(--text-light);
            transition: var(--transition);
        }
        #roomBookingModal .modal-close:hover {
            color: var(--primary-red);
        }
        .room-booking-info {
            background: var(--primary-cream);
            padding: 1rem;
            border-radius: var(--border-radius);
            margin-bottom: 1.5rem;
        }
        .room-booking-info p {
            margin-bottom: 0.5rem;
            color: var(--text-dark);
        }
        #roomBookingModal .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        #roomBookingModal .form-group {
            margin-bottom: 1.5rem;
        }
        #roomBookingModal .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-dark);
        }
        #roomBookingModal .form-group input,
        #roomBookingModal .form-group select,
        #roomBookingModal .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--border-light);
            border-radius: var(--border-radius);
            font-family: inherit;
            transition: var(--transition);
        }
        #roomBookingModal .form-group input:focus,
        #roomBookingModal .form-group select:focus,
        #roomBookingModal .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-red);
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        .confirm-booking-btn {
            background: #25d366;
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: var(--border-radius);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            width: 100%;
            font-size: 1rem;
        }
        .confirm-booking-btn:hover {
            background: #128c7e;
            transform: translateY(-2px);
        }
        @media (max-width: 768px) {
            #roomBookingModal .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    document.body.appendChild(modal);

    // Set minimum dates
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    document.getElementById('bookingCheckin').setAttribute('min', today);
    document.getElementById('bookingCheckout').setAttribute('min', tomorrowStr);

    // Add form submission handler
    document.getElementById('roomBookingForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const bookingDetails = {
            checkin: formData.get('checkin'),
            checkout: formData.get('checkout'),
            guests: formData.get('guests'),
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            requests: formData.get('requests')
        };

        // Validate required fields
        if (!bookingDetails.checkin || !bookingDetails.checkout || !bookingDetails.guests || 
            !bookingDetails.name || !bookingDetails.phone || !bookingDetails.email) {
            HotelApp.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Calculate nights and total
        const checkinDate = new Date(bookingDetails.checkin);
        const checkoutDate = new Date(bookingDetails.checkout);
        const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
        const subtotal = parseInt(roomPrice) * nights;
        const taxes = Math.round(subtotal * 0.18);
        const total = subtotal + taxes;

        // Create WhatsApp message
        const message = `🏨 ROOM BOOKING REQUEST - Hotel New Chetan

👤 Guest Details:
Name: ${bookingDetails.name}
Phone: ${bookingDetails.phone}
Email: ${bookingDetails.email}

🛏️ Booking Details:
Room: ${roomName}
Check-in: ${HotelApp.formatDate(bookingDetails.checkin)}
Check-out: ${HotelApp.formatDate(bookingDetails.checkout)}
Guests: ${bookingDetails.guests}
Duration: ${nights} night${nights > 1 ? 's' : ''}

💰 Pricing:
Room Rate: ₹${roomPrice} × ${nights} nights = ₹${subtotal.toLocaleString()}
Taxes & Fees: ₹${taxes.toLocaleString()}
Total Amount: ₹${total.toLocaleString()}

${bookingDetails.requests ? `🎯 Special Requests:\n${bookingDetails.requests}` : ''}

Please confirm availability and provide booking confirmation.`;

        HotelApp.openWhatsAppChat(message);
        closeRoomBookingModal();
        HotelApp.showNotification('Booking request sent via WhatsApp!', 'success');
    });

    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeRoomBookingModal() {
    const modal = document.getElementById('roomBookingModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Smooth scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.room-card, .testimonial-content, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', animateOnScroll);

// Export functions for global use
window.HomePage = {
    showRoomBookingModal,
    closeRoomBookingModal,
    openLightbox,
    closeLightbox
};