// js/wishlist.js
// Manages wishlist data and UI updates.

// --- Wishlist Data --- //
let wishlistItems = []; // Array to store product IDs in the wishlist

const WISHLIST_EMPTY_ICON_SRC = 'images/heart-outline.svg';
const WISHLIST_FILLED_ICON_SRC = 'images/心.svg'; // Your specified filled heart icon

// --- Helper Functions --- //

/**
 * Checks if a product is already in the wishlist.
 * @param {string} productId - The ID of the product to check.
 * @returns {boolean} True if the product is in the wishlist, false otherwise.
 */
function isProductInWishlist(productId) {
  return wishlistItems.includes(productId);
}

/**
 * Updates the visual state of a single wishlist icon.
 * @param {HTMLElement} iconElement - The <img> element of the icon.
 * @param {boolean} isActive - True if the item is in the wishlist (filled icon), false otherwise (outline icon).
 */
function updateWishlistIconVisual(iconElement, isActive) {
  if (iconElement) {
    iconElement.src = isActive ? WISHLIST_FILLED_ICON_SRC : WISHLIST_EMPTY_ICON_SRC;
  }
}

/**
 * Updates all wishlist icons on the page.
 * Product-specific icons are updated based on their presence in the wishlist.
 * Generic icons (nav, search overlay) are updated based on whether the wishlist has any items.
 * The PDP heart icon is updated based on the currently displayed product.
 */
function updateAllWishlistIcons() {
  const allIcons = document.querySelectorAll('.wishlist-toggle-icon');
  const isWishlistPopulated = wishlistItems.length > 0;

  allIcons.forEach(icon => {
    const productId = icon.dataset.productId;
    if (productId) {
      // This icon is tied to a specific product (e.g., on PDP or a product card in future)
      updateWishlistIconVisual(icon, isProductInWishlist(productId));
    } else {
      // This is a generic icon (e.g., in navbar, search overlay header)
      // Its state reflects if the wishlist has any items.
      updateWishlistIconVisual(icon, isWishlistPopulated);
    }
  });
}

// --- Core Wishlist Functions --- //

/**
 * Adds a product to the wishlist.
 * @param {string} productId - The ID of the product to add.
 */
function addToWishlist(productId) {
  if (!isProductInWishlist(productId)) {
    wishlistItems.push(productId);
    console.log(`Product ${productId} added to wishlist. Wishlist:`, wishlistItems);
    updateAllWishlistIcons();
    // Potentially save to localStorage here
  } else {
    console.log(`Product ${productId} is already in the wishlist.`);
  }
}

/**
 * Removes a product from the wishlist.
 * @param {string} productId - The ID of the product to remove.
 */
function removeFromWishlist(productId) {
  const index = wishlistItems.indexOf(productId);
  if (index > -1) {
    wishlistItems.splice(index, 1);
    console.log(`Product ${productId} removed from wishlist. Wishlist:`, wishlistItems);
    updateAllWishlistIcons();
    // If the wishlist page is currently visible, re-render it.
    // This assumes a way to check if the wishlist page is visible.
    // For now, we will always re-render if an item is removed,
    // as this function is typically called from the wishlist page itself or when a PDP heart is untoggled.
    if (document.getElementById('wishlist-page-content').style.display !== 'none') {
        renderWishlistPage();
    }
    // Potentially save to localStorage here
  } else {
    console.log(`Product ${productId} not found in wishlist for removal.`);
  }
}

/**
 * Toggles a product's presence in the wishlist.
 * Adds if not present, removes if present.
 * @param {string} productId - The ID of the product to toggle.
 */
function toggleWishlistProduct(productId) {
  if (isProductInWishlist(productId)) {
    removeFromWishlist(productId);
  } else {
    addToWishlist(productId);
  }
}

/**
 * Renders the products in the wishlist on the wishlist page.
 */
function renderWishlistPage() {
  const container = document.querySelector('#wishlist-page-content .wishlist-items-container');
  // The empty message is now part of the container's responsibility or handled by CSS :empty selector
  
  if (!container) {
    console.error('Wishlist items container not found!');
    return;
  }
  container.innerHTML = ''; // Clear previous items

  if (wishlistItems.length === 0) {
    container.innerHTML = '<p class="wishlist-empty-message">Your wishlist is currently empty.</p>';
    // Ensure heart icons are updated to empty if wishlist becomes empty
    updateAllWishlistIcons();
    return;
  }

  wishlistItems.forEach(productId => {
    // Ensure productsData is available globally or passed appropriately
    const product = productsData.find(p => p.id === productId); 
    if (product) {
      const itemHTML = `
        <div class="wishlist-item" data-product-id="${product.id}">
          <div class="wishlist-item-image-container"> <!-- Added a container for better styling -->
            <img src="${product.image}" alt="${product.name}" class="wishlist-item-image">
          </div>
          <div class="wishlist-item-details">
            <h3 class="wishlist-item-name">${product.name}</h3>
            <p class="wishlist-item-price">${product.price}</p>
            <button class="wishlist-item-remove-btn" data-product-id="${product.id}" aria-label="Remove ${product.name} from wishlist">Remove</button>
          </div>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', itemHTML);
    }
  });

  // Add event listeners to the new remove buttons
  document.querySelectorAll('#wishlist-page-content .wishlist-item-remove-btn').forEach(button => {
    button.addEventListener('click', function() {
      const prodId = this.dataset.productId;
      removeFromWishlist(prodId); // This will re-render the wishlist page
    });
  });
  // Ensure heart icons are updated (e.g. general ones if list was empty and now has items)
  updateAllWishlistIcons();
}

/**
 * Initializes wishlist functionality.
 * Sets up event listeners for all wishlist-related UI elements.
 */
function initWishlist() {
  // Event listeners for all heart icons
  document.querySelectorAll('.wishlist-toggle-icon').forEach(icon => {
    icon.addEventListener('click', function() {
      const productId = this.dataset.productId;
      if (productId) {
        // This is a product-specific heart icon (e.g., on PDP)
        toggleWishlistProduct(productId);
      } else {
        // This is a generic heart icon (e.g., in navbar, search overlay)
        // Clicking it should show the wishlist page.
        // This function needs to be available from navigation.js
        if (typeof showWishlistPage === 'function') {
          showWishlistPage();
        } else {
          console.error('showWishlistPage function is not defined. Make sure navigation.js is loaded and correct.');
        }
      }
    });
  });

  // Event listener for the "Back" button on the wishlist page
  const wishlistBackButton = document.querySelector('#wishlist-page-content .wishlist-back-button');
  if (wishlistBackButton) {
    wishlistBackButton.addEventListener('click', function() {
      // This function needs to be available from navigation.js
      if (typeof goBackToPreviousPageOrHomepage === 'function') {
        goBackToPreviousPageOrHomepage();
      } else {
        console.error('goBackToPreviousPageOrHomepage function is not defined. Make sure navigation.js is loaded and correct.');
        // Fallback to homepage if the back function isn't ready
        if (typeof showNewHomepage === 'function') showNewHomepage();
      }
    });
  }

  // Event listener for the "Continue Shopping" button on the wishlist page
  const continueShoppingButton = document.querySelector('#wishlist-page-content .wishlist-continue-shopping-btn');
  if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', function() {
      // This function should be available from navigation.js
      if (typeof showNewHomepage === 'function') {
        showNewHomepage();
      } else {
        console.error('showNewHomepage function is not defined. Make sure navigation.js is loaded and correct.');
      }
    });
  }
  
  // Initial update of all icons based on current wishlist state (e.g. loaded from localStorage in future)
  updateAllWishlistIcons();
}

// Note: `productsData` is assumed to be globally available from productData.js
// Note: `showWishlistPage`, `goBackToPreviousPageOrHomepage`, `showNewHomepage` are assumed to be available from navigation.js 