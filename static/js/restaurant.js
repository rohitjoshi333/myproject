// Restaurant page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeRestaurantAnimations();
    initializeDishOrdering();
});

// Initialize scroll animations for restaurant page
function initializeRestaurantAnimations() {
    const dishCards = document.querySelectorAll('.dish-card');
    const featureCards = document.querySelectorAll('.feature-card');
    const features = document.querySelectorAll('.feature');
    
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
    
    [...dishCards, ...featureCards, ...features].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize dish ordering functionality
function initializeDishOrdering() {
    const orderButtons = document.querySelectorAll('.order-btn');
    
    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dishCard = this.closest('.dish-card');
            const dishName = dishCard.querySelector('h3').textContent;
            const dishPrice = dishCard.querySelector('.dish-price').textContent.replace('₹', '');
            
            // Show loading state
            const originalText = this.textContent;
            this.textContent = 'Processing...';
            this.disabled = true;
            
            // Reset button after 2 seconds
            setTimeout(() => {
                this.textContent = originalText;
                this.disabled = false;
                HotelApp.showNotification(`${dishName} added to your order!`, 'success');
            }, 2000);
        });
    });
}

// Table reservation functionality
function makeTableReservation() {
    const reservationData = {
        date: prompt('Enter preferred date (YYYY-MM-DD):'),
        time: prompt('Enter preferred time (HH:MM):'),
        guests: prompt('Number of guests:'),
        specialRequests: prompt('Any special requests (optional):') || 'None'
    };
    
    if (reservationData.date && reservationData.time && reservationData.guests) {
        const message = `Hi! I would like to make a table reservation at Hotel New Chetan restaurant.
        
Details:
- Date: ${reservationData.date}
- Time: ${reservationData.time}
- Number of guests: ${reservationData.guests}
- Special requests: ${reservationData.specialRequests}

Please confirm availability and let me know the booking details.`;
        
        HotelApp.openWhatsAppChat(message);
    } else {
        HotelApp.showNotification('Please fill in all required reservation details', 'error');
    }
}

// Menu category filtering (for menu page)
function filterMenuItems(category) {
    const menuItems = document.querySelectorAll('.menu-item');
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    
    // Update active filter button
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Filter menu items
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        } else {
            item.style.display = 'none';
        }
    });
}

// Special dietary requirements handler
function handleDietaryRequirements(dishName) {
    const requirements = [
        'Vegetarian',
        'Vegan',
        'Gluten-Free',
        'Dairy-Free',
        'Nut-Free',
        'Spicy',
        'Mild',
        'No Onion/Garlic'
    ];
    
    let selectedRequirements = [];
    
    requirements.forEach(req => {
        if (confirm(`Do you need ${req} preparation for ${dishName}?`)) {
            selectedRequirements.push(req);
        }
    });
    
    if (selectedRequirements.length > 0) {
        const message = `Hi! I would like to order ${dishName} with the following dietary requirements:
        
${selectedRequirements.map(req => `- ${req}`).join('\n')}

Please confirm if this can be prepared according to these requirements.`;
        
        HotelApp.openWhatsAppChat(message);
    }
}

// Restaurant feedback system
function submitRestaurantFeedback() {
    const feedback = {
        rating: prompt('Rate your dining experience (1-5 stars):'),
        foodQuality: prompt('Rate food quality (1-5):'),
        service: prompt('Rate service (1-5):'),
        ambiance: prompt('Rate ambiance (1-5):'),
        comments: prompt('Additional comments (optional):') || 'No additional comments'
    };
    
    if (feedback.rating && feedback.foodQuality && feedback.service && feedback.ambiance) {
        const message = `Restaurant Feedback - Hotel New Chetan

Overall Rating: ${feedback.rating}/5 stars
Food Quality: ${feedback.foodQuality}/5
Service: ${feedback.service}/5
Ambiance: ${feedback.ambiance}/5

Comments: ${feedback.comments}

Thank you for dining with us!`;
        
        HotelApp.openWhatsAppChat(message);
        HotelApp.showNotification('Thank you for your feedback!', 'success');
    } else {
        HotelApp.showNotification('Please provide all ratings', 'error');
    }
}

// Chef's special recommendations
function getChefRecommendations() {
    const recommendations = [
        {
            name: 'Butter Chicken',
            description: 'Our signature creamy tomato-based curry',
            price: '₹450'
        },
        {
            name: 'Hyderabadi Biryani',
            description: 'Aromatic rice dish with tender meat',
            price: '₹380'
        },
        {
            name: 'Dal Makhani',
            description: 'Rich and creamy black lentils',
            price: '₹280'
        }
    ];
    
    let message = "Chef's Special Recommendations for today:\n\n";
    
    recommendations.forEach((dish, index) => {
        message += `${index + 1}. ${dish.name} - ${dish.price}\n   ${dish.description}\n\n`;
    });
    
    message += "Would you like to order any of these specialties?";
    
    HotelApp.openWhatsAppChat(message);
}

// Export functions for global use
window.RestaurantPage = {
    makeTableReservation,
    filterMenuItems,
    handleDietaryRequirements,
    submitRestaurantFeedback,
    getChefRecommendations
};