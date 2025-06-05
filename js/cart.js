// js/cart.js
// Handle shopping cart data and UI

// Shopping cart data structure [{id, name, price, quantity, image}]
let cartItems = [];

// Add products to cart
function addToCart(productId, quantity = 1) {
  // Search for product data
  const product = productsData.find(p => p.id === productId);
  
  if (!product) {
    console.error('Product not found:', productId);
    return false;
  }
  
  // Check if the item is already in the shopping cart
  const existingItem = cartItems.find(item => item.id === productId);
  
  if (existingItem) {
    // If it already exists，Increase quantity
    existingItem.quantity += quantity;
    console.log(`Updated ${product.name} quantity to ${existingItem.quantity}`);
  } else {
    // Extract price figures
    const priceValue = parseFloat(product.price.replace('$', ''));
    
    // Add new product
    cartItems.push({
      id: product.id,
      name: product.name,
      price: priceValue,
      quantity: quantity,
      image: product.image
    });
    console.log(`Added ${product.name} to cart`);
  }
  
  // Update shopping cart icon
  updateCartIcon();
  
  // If currently on the shopping cart page，Refresh page content
  if (document.getElementById('cart-page-content').style.display !== 'none') {
    renderCartPage();
  }
  
  // If currently on the mobile shopping cart page，Refresh page content
  if (document.getElementById('mobile-cart-page-content').style.display !== 'none') {
    renderMobileCartPage();
  }
  
  // Local storage of shopping cart data
  saveCartToLocalStorage();
  
  return true;
}

// Remove items from the shopping cart
function removeFromCart(productId) {
  const index = cartItems.findIndex(item => item.id === productId);
  
  if (index > -1) {
    const removedItem = cartItems[index];
    cartItems.splice(index, 1);
    console.log(`Removed ${removedItem.name} from cart`);
    
    // Update shopping cart icon
    updateCartIcon();
    
    // If currently on the shopping cart page，Refresh page content
    if (document.getElementById('cart-page-content').style.display !== 'none') {
      renderCartPage();
    }
    
    // If currently on the mobile shopping cart page，Refresh page content
    if (document.getElementById('mobile-cart-page-content').style.display !== 'none') {
      renderMobileCartPage();
    }
    
    // Local storage of shopping cart data
    saveCartToLocalStorage();
    
    return true;
  }
  
  return false;
}

// Update the quantity of items in the shopping cart
function updateCartItemQuantity(productId, quantity) {
  if (quantity < 1) {
    return removeFromCart(productId);
  }
  
  const item = cartItems.find(item => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    console.log(`Updated ${item.name} quantity to ${quantity}`);
    
    // Update shopping cart icon
    updateCartIcon();
    
    // If currently on the shopping cart page，Refresh page content
    if (document.getElementById('cart-page-content').style.display !== 'none') {
      renderCartPage();
    }
    
    // If currently on the mobile shopping cart page，Refresh page content
    if (document.getElementById('mobile-cart-page-content').style.display !== 'none') {
      renderMobileCartPage();
    }
    
    // Local storage of shopping cart data
    saveCartToLocalStorage();
    
    return true;
  }
  
  return false;
}

// Calculate the total price of the shopping cart
function calculateCartTotal() {
  let subtotal = 0;
  
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // Temporarily not calculating shipping fees
  const shipping = 0;
  
  return {
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping
  };
}

// Update shopping cart icon（Deleted red quantity display）
function updateCartIcon() {
  // No longer displaying cart quantity badge, maintain original shopping bag icon style
  console.log('Cart icon update disabled (no red quantity display)');
}

// Rendering the shopping cart page
function renderCartPage() {
  const cartContainer = document.querySelector('#cart-page-content .cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!cartContainer || !subtotalEl || !totalEl) {
    console.error('Cart page elements not found!');
    return;
  }
  
  // Clear the current content
  cartContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    // Reminder that the shopping cart is empty
    cartContainer.innerHTML = '<p class="cart-empty-message">Your cart is currently empty.</p>';
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    
    // Disable checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('disabled');
    }
    
    return;
  }
  
  // Calculate the total price
  const totals = calculateCartTotal();
  subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  totalEl.textContent = `$${totals.total.toFixed(2)}`;
  
  // Enable checkout button
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('disabled');
  }
  
  // Rendering each shopping cart item
  cartItems.forEach(item => {
    const itemHTML = `
      <div class="cart-item" data-product-id="${item.id}">
        <div class="cart-item-image-container">
          <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        </div>
        <div class="cart-item-details">
          <h3 class="cart-item-name">${item.name}</h3>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="cart-quantity-decrease" data-product-id="${item.id}">-</button>
            <span class="cart-quantity-value">${item.quantity}</span>
            <button class="cart-quantity-increase" data-product-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-product-id="${item.id}">×</button>
      </div>
    `;
    
    cartContainer.insertAdjacentHTML('beforeend', itemHTML);
  });
  
  // Add event monitoring for quantity adjustment button
  document.querySelectorAll('.cart-quantity-decrease').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const item = cartItems.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        updateCartItemQuantity(productId, item.quantity - 1);
      } else {
        removeFromCart(productId);
      }
    });
  });
  
  document.querySelectorAll('.cart-quantity-increase').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const item = cartItems.find(item => item.id === productId);
      if (item) {
        updateCartItemQuantity(productId, item.quantity + 1);
      }
    });
  });
  
  // Add event listener to remove button
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      removeFromCart(productId);
    });
  });
}

// newly added：Rendering the mobile shopping cart page
function renderMobileCartPage() {
  const mobileCartContainer = document.querySelector('#mobile-cart-page-content .mobile-cart-items');
  const mobileSubtotalEl = document.getElementById('mobile-cart-subtotal');
  const mobileShippingEl = document.getElementById('mobile-cart-shipping');
  const mobileTotalEl = document.getElementById('mobile-cart-total');
  
  if (!mobileCartContainer || !mobileSubtotalEl || !mobileShippingEl || !mobileTotalEl) {
    console.error('Mobile cart page elements not found!');
    return;
  }
  
  // Clear the current content
  mobileCartContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    // Reminder that the shopping cart is empty
    mobileCartContainer.innerHTML = '<p class="mobile-cart-empty">Your cart is currently empty.</p>';
    mobileSubtotalEl.textContent = '$0.00';
    mobileShippingEl.textContent = '$0.00';
    mobileTotalEl.textContent = '$0.00';
    
    // Disable checkout button
    const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
    if (mobileCheckoutBtn) {
      mobileCheckoutBtn.disabled = true;
      mobileCheckoutBtn.classList.add('disabled');
    }
    
    return;
  }
  
  // Calculate the total price
  const totals = calculateCartTotal();
  mobileSubtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  mobileShippingEl.textContent = `$${totals.shipping.toFixed(2)}`;
  mobileTotalEl.textContent = `$${totals.total.toFixed(2)}`;
  
  // Enable checkout button
  const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
  if (mobileCheckoutBtn) {
    mobileCheckoutBtn.disabled = false;
    mobileCheckoutBtn.classList.remove('disabled');
  }
  
  // Rendering each shopping cart item
  cartItems.forEach(item => {
    const itemHTML = `
      <div class="mobile-cart-item" data-product-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="mobile-cart-item-image">
        <div class="mobile-cart-item-details">
          <h3 class="mobile-cart-item-name">${item.name}</h3>
          <p class="mobile-cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="mobile-cart-item-quantity">
            <button class="mobile-cart-quantity-decrease" data-product-id="${item.id}">-</button>
            <span class="mobile-cart-quantity-value">${item.quantity}</span>
            <button class="mobile-cart-quantity-increase" data-product-id="${item.id}">+</button>
          </div>
        </div>
        <button class="mobile-cart-item-remove" data-product-id="${item.id}">×</button>
      </div>
    `;
    
    mobileCartContainer.insertAdjacentHTML('beforeend', itemHTML);
  });
  
  // Add event monitoring for quantity adjustment button
  document.querySelectorAll('.mobile-cart-quantity-decrease').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const item = cartItems.find(item => item.id === productId);
      if (item && item.quantity > 1) {
        updateCartItemQuantity(productId, item.quantity - 1);
      } else {
        removeFromCart(productId);
      }
    });
  });
  
  document.querySelectorAll('.mobile-cart-quantity-increase').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const item = cartItems.find(item => item.id === productId);
      if (item) {
        updateCartItemQuantity(productId, item.quantity + 1);
      }
    });
  });
  
  // Add event listener to remove button
  document.querySelectorAll('.mobile-cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      removeFromCart(productId);
    });
  });
}

// Local storage of shopping cart data
function saveCartToLocalStorage() {
  localStorage.setItem('pidapipo-cart', JSON.stringify(cartItems));
}

// Load shopping cart data from local storage
function loadCartFromLocalStorage() {
  const storedCart = localStorage.getItem('pidapipo-cart');
  if (storedCart) {
    try {
      cartItems = JSON.parse(storedCart);
      updateCartIcon();
    } catch (e) {
      console.error('Failed to parse cart data from localStorage:', e);
    }
  }
}

// Initialize shopping cart
function initCart() {
  // Load locally stored shopping cart data
  loadCartFromLocalStorage();
  
  // Binding shopping cart icon click event (Desktop and mobile devicesPDP)
  const cartIcons = document.querySelectorAll('.icon-bag'); // All .icon-bag
  cartIcons.forEach(icon => {
    // Check if the event has already been bound，Prevent duplicate binding
    if (!icon.listenerAttached) {
    icon.addEventListener('click', () => {
      if (typeof showCartPage === 'function') {
        showCartPage();
      } else {
        console.error('showCartPage function is not defined.');
      }
    });
      icon.listenerAttached = true; // Tag bound
    }
  });
  
  // Add click events to the shopping bag icon in the bottom navigation bar of mobile devices
  const mobileNavCartIcon = document.querySelector('.mobile-bottom-nav .mobile-nav-item:nth-child(3)');
  if (mobileNavCartIcon && !mobileNavCartIcon.listenerAttached) {
    mobileNavCartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof showCartPage === 'function') {
        showCartPage();
      } else {
        console.error('showCartPage function is not defined.');
      }
    });
    mobileNavCartIcon.listenerAttached = true;
  }
  
  // Update all add to cart buttons (Product Details Page、home pageTop Productsetc.)
  // selector '.pdp-add-to-cart-btn' Used for product detail page
  // selector '.mobile-add-to-cart-btn' Used for mobile homepageTop ProductsThe plus button
  // selector '.new-buy-now-btn' Used for desktop homepageTop Productsof "buy now" button
  const allAddToCartButtons = document.querySelectorAll('.pdp-add-to-cart-btn, .mobile-add-to-cart-btn, .new-buy-now-btn');
  
  allAddToCartButtons.forEach(btn => {
    if (!btn.listenerAttached) { // Prevent duplicate binding
      btn.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent event bubbling，Especially important，If the button is within the clickable card
      const productId = this.dataset.productId;
        
        // regarding .pdp-add-to-cart-btn (Product Details Page), We need to obtain the quantity
        // For other buttons (home pageTop Products), The default quantity is1
        let quantity = 1;
        if (this.classList.contains('pdp-add-to-cart-btn')) {
      const quantityInput = document.getElementById('pdp-quantity-value');
          quantity = quantityInput ? parseInt(quantityInput.textContent) : 1;
        }
      
        if (productId) {
          addToCart(productId, quantity);
          // optional：Add a brief visual feedback here，For example, changes in button status
          this.classList.add('item-added');
          setTimeout(() => {
            this.classList.remove('item-added');
          }, 300); // 0.3Remove in secondsclass (originally be1000ms)
        } else {
          console.error('Product ID not found for this button:', this);
      }
    });
      btn.listenerAttached = true;
    }
  });
  
  // Initial update of shopping cart icon
  updateCartIcon();
} 