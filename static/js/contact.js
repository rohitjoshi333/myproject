// Contact page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    initializeFAQ();
    initializeContactAnimations();
});

// Initialize contact form functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const contactData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                newsletter: formData.get('newsletter') === 'on'
            };
            
            // Validate required fields
            if (!contactData.firstName || !contactData.lastName || !contactData.email || !contactData.subject || !contactData.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }
            
            // Validate email format
            if (!isValidEmail(contactData.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.querySelector('span').textContent;
            const spinner = submitBtn.querySelector('.loading-spinner');
            
            submitBtn.disabled = true;
            submitBtn.querySelector('span').textContent = 'Sending...';
            spinner.style.display = 'block';
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Create WhatsApp message
                const message = createContactWhatsAppMessage(contactData);
                
                // Send via WhatsApp
                HotelApp.openWhatsAppChat(message);
                
                // Reset form
                contactForm.reset();
                
                // Show success message
                showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.querySelector('span').textContent = originalText;
                spinner.style.display = 'none';
            }, 2000);
        });
    }
}

function createContactWhatsAppMessage(data) {
    let message = `📧 CONTACT FORM SUBMISSION - Hotel New Chetan\n\n`;
    message += `👤 Contact Details:\n`;
    message += `Name: ${data.firstName} ${data.lastName}\n`;
    message += `Email: ${data.email}\n`;
    if (data.phone) {
        message += `Phone: ${data.phone}\n`;
    }
    message += `\n📋 Inquiry Details:\n`;
    message += `Subject: ${data.subject}\n`;
    message += `Message:\n${data.message}\n`;
    
    if (data.newsletter) {
        message += `\n📬 Newsletter: Subscribed to newsletter updates\n`;
    }
    
    message += `\nPlease respond to this inquiry at your earliest convenience.`;
    
    return message;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert before form
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Initialize FAQ functionality
function initializeFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            toggleFAQ(this);
        });
    });
}

function toggleFAQ(questionElement) {
    const faqItem = questionElement.parentElement;
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        faqItem.classList.add('active');
    }
}

// Initialize contact page animations
function initializeContactAnimations() {
    const contactCards = document.querySelectorAll('.contact-card');
    const hoursCards = document.querySelectorAll('.hours-card');
    const faqItems = document.querySelectorAll('.faq-item');
    
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
    
    [...contactCards, ...hoursCards, ...faqItems].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Contact action functions
function openGoogleMaps() {
    const address = "123 Hotel Street, City Center, State 12345, India";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
}

function callHotel() {
    const phoneNumber = '+919876543210';
    window.location.href = `tel:${phoneNumber}`;
}

function emailHotel() {
    const email = 'info@hotelnewchetan.com';
    const subject = 'Inquiry from Website';
    const body = 'Hello,\n\nI would like to inquire about...\n\nBest regards,';
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Form field validation
function initializeFormValidation() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (fieldName === 'email' && value && !isValidEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }
    
    // Phone validation (if provided)
    if (fieldName === 'phone' && value && !isValidPhone(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    } else {
        clearFieldError(field);
    }
    
    return isValid;
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--error-red)';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = 'var(--error-red)';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = 'var(--border-light)';
    
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Initialize form validation
document.addEventListener('DOMContentLoaded', initializeFormValidation);

// Auto-resize textarea
function initializeTextareaResize() {
    const textarea = document.getElementById('message');
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

// Character counter for message field
function initializeCharacterCounter() {
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        
        // Create counter element
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.textAlign = 'right';
        counter.style.fontSize = '0.8rem';
        counter.style.color = 'var(--text-light)';
        counter.style.marginTop = '0.25rem';
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const currentLength = messageField.value.length;
            counter.textContent = `${currentLength}/${maxLength} characters`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = 'var(--warning-orange)';
            } else {
                counter.style.color = 'var(--text-light)';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter(); // Initial count
    }
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initializeTextareaResize();
    initializeCharacterCounter();
});

// Export functions for global use
window.ContactPage = {
    toggleFAQ,
    openGoogleMaps,
    callHotel,
    emailHotel,
    validateField,
    showFormMessage
};