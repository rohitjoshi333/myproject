// Menu page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeMenuFilters();
    initializeMenuAnimations();
    initializeMenuSearch();
    initializeCart();
});

// Cart functionality
let cart = [];
let cartTotal = 0;

// Initialize menu filtering functionality
function initializeMenuFilters() {
    const filterButtons = document.querySelectorAll('.menu-filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter menu items
            filterMenuItems(category, menuItems);
        });
    });
}

function filterMenuItems(category, menuItems) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.classList.add('loading');
    
    setTimeout(() => {
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.classList.remove('hidden');
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                    item.classList.add('filter-animate');
                }, 100);
            } else {
                item.classList.add('hidden');
                item.style.display = 'none';
            }
        });
        
        menuGrid.classList.remove('loading');
    }, 300);
}

// Initialize scroll animations
function initializeMenuAnimations() {
    const menuItems = document.querySelectorAll('.menu-item');
    const infoCards = document.querySelectorAll('.info-card');
    
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
    
    [...menuItems, ...infoCards].forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// Initialize menu search
function initializeMenuSearch() {
    // Create search bar
    const menuFilters = document.querySelector('.menu-filters .container');
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div class="search-box">
            <input type="text" id="menuSearch" placeholder="Search menu items..." />
            <span class="search-icon">🔍</span>
        </div>
    `;
    
    // Add search styles
    const searchStyles = document.createElement('style');
    searchStyles.innerHTML = `
        .search-container {
            margin-bottom: 2rem;
            display: flex;
            justify-content: center;
        }
        .search-box {
            position: relative;
            max-width: 400px;
            width: 100%;
        }
        .search-box input {
            width: 100%;
            padding: 0.75rem 3rem 0.75rem 1rem;
            border: 2px solid var(--border-light);
            border-radius: 25px;
            font-size: 1rem;
            transition: var(--transition);
        }
        .search-box input:focus {
            outline: none;
            border-color: var(--primary-gold);
            box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.1);
        }
        .search-icon {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
            font-size: 1.2rem;
        }
    `;
    document.head.appendChild(searchStyles);
    
    menuFilters.insertBefore(searchContainer, menuFilters.firstChild);
    
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                const itemName = item.querySelector('h3').textContent.toLowerCase();
                const itemDescription = item.querySelector('p').textContent.toLowerCase();
                
                if (itemName.includes(searchTerm) || itemDescription.includes(searchTerm)) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            });
        });
    }
}

// Initialize cart functionality
function initializeCart() {
    // Add cart buttons to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        const orderBtn = item.querySelector('.order-btn');
        const itemInfo = item.querySelector('.menu-item-info');
        
        // Create cart controls
        const cartControls = document.createElement('div');
        cartControls.className = 'cart-controls';
        cartControls.innerHTML = `
            <button class="add-to-cart-btn" data-item-name="${item.querySelector('h3').textContent}" 
                    data-item-price="${item.querySelector('.price').textContent.replace('₹', '')}"
                    data-item-image="${item.querySelector('img').src}">
                Add to Cart
            </button>
            <div class="quantity-controls" style="display: none;">
                <button class="quantity-btn minus">-</button>
                <span class="quantity">1</span>
                <button class="quantity-btn plus">+</button>
            </div>
        `;
        
        // Insert cart controls before order button
        itemInfo.insertBefore(cartControls, orderBtn);
        
        // Add event listeners
        const addToCartBtn = cartControls.querySelector('.add-to-cart-btn');
        const quantityControls = cartControls.querySelector('.quantity-controls');
        const minusBtn = cartControls.querySelector('.minus');
        const plusBtn = cartControls.querySelector('.plus');
        const quantitySpan = cartControls.querySelector('.quantity');
        
        addToCartBtn.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item-name');
            const itemPrice = parseInt(this.getAttribute('data-item-price'));
            const itemImage = this.getAttribute('data-item-image');
            
            addToCart({
                name: itemName,
                price: itemPrice,
                image: itemImage,
                quantity: 1
            });
            
            this.style.display = 'none';
            quantityControls.style.display = 'flex';
            updateCartDisplay();
        });
        
        minusBtn.addEventListener('click', function() {
            const itemName = addToCartBtn.getAttribute('data-item-name');
            const currentQuantity = parseInt(quantitySpan.textContent);
            
            if (currentQuantity > 1) {
                updateCartItemQuantity(itemName, currentQuantity - 1);
                quantitySpan.textContent = currentQuantity - 1;
            } else {
                removeFromCart(itemName);
                addToCartBtn.style.display = 'block';
                quantityControls.style.display = 'none';
            }
            updateCartDisplay();
        });
        
        plusBtn.addEventListener('click', function() {
            const itemName = addToCartBtn.getAttribute('data-item-name');
            const currentQuantity = parseInt(quantitySpan.textContent);
            
            updateCartItemQuantity(itemName, currentQuantity + 1);
            quantitySpan.textContent = currentQuantity + 1;
            updateCartDisplay();
        });
    });
    
    // Add cart styles
    const cartStyles = document.createElement('style');
    cartStyles.innerHTML = `
        .cart-controls {
            margin-bottom: 1rem;
        }
        .add-to-cart-btn {
            background: var(--primary-navy);
            color: var(--primary-white);
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: var(--border-radius);
            font-weight: 500;
            cursor: pointer;
            transition: var(--transition);
            width: 100%;
            font-size: 1rem;
        }
        .add-to-cart-btn:hover {
            background: var(--primary-gold);
            transform: translateY(-2px);
        }
        .quantity-controls {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            background: var(--primary-cream);
            padding: 0.75rem;
            border-radius: var(--border-radius);
        }
        .quantity-btn {
            background: var(--primary-gold);
            color: var(--primary-white);
            border: none;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1.2rem;
            font-weight: bold;
            transition: var(--transition);
        }
        .quantity-btn:hover {
            background: var(--primary-navy);
            transform: scale(1.1);
        }
        .quantity {
            font-weight: bold;
            font-size: 1.2rem;
            color: var(--primary-navy);
            min-width: 30px;
            text-align: center;
        }
        .cart-sidebar {
            position: fixed;
            top: 70px;
            right: -400px;
            width: 400px;
            height: calc(100vh - 70px);
            background: var(--primary-white);
            box-shadow: var(--shadow-heavy);
            z-index: 1000;
            transition: var(--transition);
            overflow-y: auto;
        }
        .cart-sidebar.open {
            right: 0;
        }
        .cart-header {
            background: var(--primary-navy);
            color: var(--primary-white);
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cart-close {
            background: none;
            border: none;
            color: var(--primary-white);
            font-size: 1.5rem;
            cursor: pointer;
        }
        .cart-items {
            padding: 1rem;
        }
        .cart-item {
            display: flex;
            gap: 1rem;
            padding: 1rem;
            border-bottom: 1px solid var(--border-light);
        }
        .cart-item-image {
            width: 60px;
            height: 60px;
            border-radius: 6px;
            overflow: hidden;
        }
        .cart-item-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .cart-item-info {
            flex: 1;
        }
        .cart-item-name {
            font-weight: 600;
            color: var(--primary-navy);
            margin-bottom: 0.5rem;
        }
        .cart-item-price {
            color: var(--primary-gold);
            font-weight: 500;
        }
        .cart-item-quantity {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 0.5rem;
        }
        .cart-total {
            background: var(--primary-cream);
            padding: 1.5rem;
            margin: 1rem;
            border-radius: var(--border-radius);
            text-align: center;
        }
        .cart-total-amount {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary-navy);
            margin-bottom: 1rem;
        }
        .cart-checkout-btn {
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
        .cart-checkout-btn:hover {
            background: #128c7e;
            transform: translateY(-2px);
        }
        .cart-float-btn {
            position: fixed;
            bottom: 100px;
            right: 20px;
            background: var(--primary-navy);
            color: var(--primary-white);
            border: none;
            padding: 1rem;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: var(--shadow-medium);
            z-index: 999;
            transition: var(--transition);
            display: none;
        }
        .cart-float-btn.show {
            display: block;
        }
        .cart-float-btn:hover {
            background: var(--primary-gold);
            transform: scale(1.1);
        }
        .cart-badge {
            position: absolute;
            top: -8px;
            right: -8px;
            background: var(--error-red);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8rem;
            font-weight: bold;
        }
        @media (max-width: 768px) {
            .cart-sidebar {
                width: 100%;
                right: -100%;
            }
        }
    `;
    document.head.appendChild(cartStyles);
    
    // Create cart sidebar
    createCartSidebar();
    
    // Create cart float button
    createCartFloatButton();
}

function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += item.quantity;
    } else {
        cart.push(item);
    }
    
    updateCartTotal();
}

function removeFromCart(itemName) {
    cart = cart.filter(item => item.name !== itemName);
    updateCartTotal();
}

function updateCartItemQuantity(itemName, newQuantity) {
    const item = cart.find(cartItem => cartItem.name === itemName);
    if (item) {
        item.quantity = newQuantity;
        updateCartTotal();
    }
}

function updateCartTotal() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const cartFloatBtn = document.getElementById('cartFloatBtn');
    const cartBadge = document.getElementById('cartBadge');
    
    // Update cart items
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 2rem;">Your cart is empty</p>';
        cartFloatBtn.classList.remove('show');
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateCartItemFromSidebar('${item.name}', ${item.quantity - 1})">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateCartItemFromSidebar('${item.name}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        cartFloatBtn.classList.add('show');
    }
    
    // Update total
    cartTotalAmount.textContent = `₹${cartTotal.toLocaleString()}`;
    
    // Update badge
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';
}

function updateCartItemFromSidebar(itemName, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(itemName);
        
        // Reset menu item display
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const addToCartBtn = item.querySelector('.add-to-cart-btn');
            if (addToCartBtn && addToCartBtn.getAttribute('data-item-name') === itemName) {
                addToCartBtn.style.display = 'block';
                item.querySelector('.quantity-controls').style.display = 'none';
            }
        });
    } else {
        updateCartItemQuantity(itemName, newQuantity);
        
        // Update menu item quantity display
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const addToCartBtn = item.querySelector('.add-to-cart-btn');
            if (addToCartBtn && addToCartBtn.getAttribute('data-item-name') === itemName) {
                const quantitySpan = item.querySelector('.quantity-controls .quantity');
                if (quantitySpan) {
                
                    quantitySpan.textContent = newQuantity;
                }
            }
        });
    }
    
    updateCartDisplay();
}

function createCartSidebar() {
    const cartSidebar = document.createElement('div');
    cartSidebar.id = 'cartSidebar';
    cartSidebar.className = 'cart-sidebar';
    cartSidebar.innerHTML = `
        <div class="cart-header">
            <h3>Your Order</h3>
            <button class="cart-close" onclick="closeCart()">&times;</button>
        </div>
        <div class="cart-items" id="cartItems">
            <p style="text-align: center; color: var(--text-light); padding: 2rem;">Your cart is empty</p>
        </div>
        <div class="cart-total">
            <div class="cart-total-amount" id="cartTotalAmount">₹0</div>
            <button class="cart-checkout-btn" onclick="proceedToCheckout()">
                Order via WhatsApp
            </button>
        </div>
    `;
    document.body.appendChild(cartSidebar);
}

function createCartFloatButton() {
    const cartFloatBtn = document.createElement('button');
    cartFloatBtn.id = 'cartFloatBtn';
    cartFloatBtn.className = 'cart-float-btn';
    cartFloatBtn.innerHTML = `
        🛒
        <span class="cart-badge" id="cartBadge">0</span>
    `;
    cartFloatBtn.addEventListener('click', openCart);
    document.body.appendChild(cartFloatBtn);
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.body.style.overflow = '';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        HotelApp.showNotification('Your cart is empty', 'error');
        return;
    }
    
    // Create order details modal
    createOrderDetailsModal();
}

function createOrderDetailsModal() {
    // Remove existing modal if present
    const existingModal = document.getElementById('orderDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modal = document.createElement('div');
    modal.id = 'orderDetailsModal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" onclick="closeOrderModal()">&times;</button>
                <h3>Order Details</h3>
                <form id="orderDetailsForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="customerName">Full Name *</label>
                            <input type="text" id="customerName" name="customerName" required>
                        </div>
                        <div class="form-group">
                            <label for="customerPhone">Phone Number *</label>
                            <input type="tel" id="customerPhone" name="customerPhone" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="deliveryAddress">Delivery Address *</label>
                        <textarea id="deliveryAddress" name="deliveryAddress" rows="3" required placeholder="Enter your complete delivery address..."></textarea>
                    </div>
                    <div class="form-group">
                        <label for="orderNotes">Special Instructions</label>
                        <textarea id="orderNotes" name="orderNotes" rows="2" placeholder="Any special requests or dietary requirements..."></textarea>
                    </div>
                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        <div id="orderSummaryItems"></div>
                        <div class="summary-total">
                            <strong>Total: ₹${cartTotal.toLocaleString()}</strong>
                        </div>
                    </div>
                    <button type="submit" class="confirm-order-btn">Confirm Order via WhatsApp</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = document.createElement('style');
    modalStyles.innerHTML = `
        #orderDetailsModal {
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
        #orderDetailsModal.active {
            opacity: 1;
            visibility: visible;
        }
        #orderDetailsModal .modal-content {
            background: var(--primary-white);
            border-radius: var(--border-radius);
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        #orderDetailsModal .modal-close {
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
        #orderDetailsModal .modal-close:hover {
            color: var(--primary-gold);
        }
        #orderDetailsModal .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        #orderDetailsModal .form-group {
            margin-bottom: 1.5rem;
        }
        #orderDetailsModal .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-dark);
        }
        #orderDetailsModal .form-group input,
        #orderDetailsModal .form-group textarea {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid var(--border-light);
            border-radius: var(--border-radius);
            font-family: inherit;
            transition: var(--transition);
        }
        #orderDetailsModal .form-group input:focus,
        #orderDetailsModal .form-group textarea:focus {
            outline: none;
            border-color: var(--primary-gold);
            box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.1);
        }
        .order-summary {
            background: var(--primary-cream);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            margin-bottom: 1.5rem;
        }
        .order-summary h4 {
            color: var(--primary-navy);
            margin-bottom: 1rem;
        }
        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-light);
        }
        .summary-total {
            font-size: 1.2rem;
            color: var(--primary-navy);
            text-align: center;
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 2px solid var(--primary-gold);
        }
        .confirm-order-btn {
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
        .confirm-order-btn:hover {
            background: #128c7e;
            transform: translateY(-2px);
        }
        @media (max-width: 768px) {
            #orderDetailsModal .form-row {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(modalStyles);
    
    document.body.appendChild(modal);
    
    // Populate order summary
    const orderSummaryItems = modal.querySelector('#orderSummaryItems');
    cart.forEach(item => {
        const summaryItem = document.createElement('div');
        summaryItem.className = 'summary-item';
        summaryItem.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
            <span>₹${(item.price * item.quantity).toLocaleString()}</span>
        `;
        orderSummaryItems.appendChild(summaryItem);
    });
    
    // Add form submission handler
    const orderForm = modal.querySelector('#orderDetailsForm');
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const orderDetails = {
            name: formData.get('customerName'),
            phone: formData.get('customerPhone'),
            address: formData.get('deliveryAddress'),
            notes: formData.get('orderNotes')
        };
        
        // Validate required fields
        if (!orderDetails.name || !orderDetails.phone || !orderDetails.address) {
            HotelApp.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Create WhatsApp message
        let message = `🍽️ FOOD ORDER - Hotel New Chetan Restaurant\n\n`;
        message += `👤 Customer Details:\n`;
        message += `Name: ${orderDetails.name}\n`;
        message += `Phone: ${orderDetails.phone}\n`;
        message += `Address: ${orderDetails.address}\n\n`;
        
        message += `📋 Order Items:\n`;
        cart.forEach(item => {
            message += `• ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}\n`;
        });
        
        message += `\n💰 Total Amount: ₹${cartTotal.toLocaleString()}\n`;
        
        if (orderDetails.notes) {
            message += `\n📝 Special Instructions:\n${orderDetails.notes}\n`;
        }
        
        message += `\nPlease confirm this order and provide delivery time estimate.`;
        
        HotelApp.openWhatsAppChat(message);
        closeOrderModal();
        closeCart();
        
        // Clear cart
        cart = [];
        cartTotal = 0;
        updateCartDisplay();
        
        // Reset all menu items
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            const addToCartBtn = item.querySelector('.add-to-cart-btn');
            const quantityControls = item.querySelector('.quantity-controls');
            if (addToCartBtn && quantityControls) {
                addToCartBtn.style.display = 'block';
                quantityControls.style.display = 'none';
                quantityControls.querySelector('.quantity').textContent = '1';
            }
        });
        
        HotelApp.showNotification('Order sent via WhatsApp!', 'success');
    });
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }, 10);
}

function closeOrderModal() {
    const modal = document.getElementById('orderDetailsModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Export functions for global use
window.MenuPage = {
    filterMenuItems,
    openCart,
    closeCart,
    proceedToCheckout,
    updateCartItemFromSidebar,
    closeOrderModal
};