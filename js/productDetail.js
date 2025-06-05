// js/productDetail.js
// Responsible for generating and managing the logic of product detail pages

// (be dependent on productData.js -> productsData variable)
// (be dependent on navigation.js -> showNewHomepage, goBackToPreviousPageOrHomepage, setActivePage, showWishlistPage function)
// (be dependent on wishlist.js -> addToWishlist, updateAllWishlistIcons, toggleWishlistProduct function)
// (be dependent on uiElements.js -> closeSearchOverlay function)

let currentProduct = null; // Stores the currently displayed product data

function createProductDetailHTML(product) {
  const productDetailPage = document.getElementById('product-detail-page');
  // Set the background color to light blue，Consistent with the design draft
  productDetailPage.style.backgroundColor = "#A4DDD8";
  
  // use img Tags as wishlist icons，And add data-product-id
  return `
    <div class="pdp-top-bar">
      <img src="mobile_images/back-arrow@2X 1 (1).png" alt="Back" class="pdp-back-btn" id="pdp-back-btn">
      <div class="pdp-logo">
        <img src="mobile_images/logo_apple_black.svg" alt="Pidapipo Logo" class="pdp-logo-img">
      </div>
      <div class="pdp-top-icons">
        <img src="images/heart-outline.svg" alt="Toggle Wishlist" class="icon-heart wishlist-toggle-icon" data-product-id="${product.id}">
        <img src="images/shopping_bag.svg" alt="Shopping Bag" class="icon-bag">
      </div>
    </div>
    <div class="pdp-main-image-container">
      <img src="${product.image}" alt="${product.name}" class="pdp-main-image">
    </div>
    <div class="pdp-info-container">
      <h1 class="pdp-title">${product.name}</h1>
      <p class="pdp-description">${product.description}</p>
      <p class="pdp-price">${product.price}</p>
      <div class="pdp-dimensions-container">
        <p class="pdp-dimensions-label">DIMENSIONS:</p>
        <p class="pdp-dimensions">${product.dimensions || 'BOXED:25CM(L) X (25)CM (W) X 20CM(H)<br>CAKE: 15CM(W) X 5CM(H)'}</p>
        <p class="pdp-tips">TIPS:SERVES 6-8 PEOPLE. CONTAINS GLUTEN, DAIRY, EGGS, ALCOHOL.</p>
      </div>
      <div class="pdp-actions">
        <div class="pdp-quantity-selector">
          <span class="pdp-quantity-value" id="pdp-quantity-value">1</span>
          <div class="pdp-quantity-buttons">
            <button class="pdp-quantity-arrow-up" id="pdp-qty-increase">▲</button>
            <button class="pdp-quantity-arrow-down" id="pdp-qty-decrease">▼</button>
          </div>
        </div>
        <button class="pdp-add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
      </div>
    </div>
  `;
}

// Function to set up event listeners for product links
function setupProductLinkListeners() {
  // Get all the elements that can be clicked to enter the product details page
  const productLinks = document.querySelectorAll('.js-view-product-detail, .new-buy-now-btn, [data-product-id^="cake-"], .cake-item');
  
  // Add click events for each product link
  productLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      
      // Get productsID - First trydata-product-idattribute
      let productId = link.dataset.productId;
      
      // If the current element does not have a productID，Try to find its child or parent elements
      if (!productId) {
        // Search for sub elements downwards
        const childWithId = link.querySelector('[data-product-id]');
        if (childWithId) {
          productId = childWithId.dataset.productId;
        } else {
          // Search for the parent element upwards
          let parent = link.closest('[data-product-id]');
          if (parent) {
            productId = parent.dataset.productId;
          }
        }
      }
      
      // If the product is foundID，Display the product details page
      if (productId) {
        console.log("Prepare to display the product:", productId);
        
        // Store the current view type，In order to return later
        let previousView = determinePreviousView();
        sessionStorage.setItem('previousProductView', previousView);
        
        // Display product details page
        showProductDetail(productId);
      } else {
        console.error("Unable to determine productID");
      }
    });
  });
}

// auxiliary function ：Determine the current view where the user is located
function determinePreviousView() {
  // Check various possible views
  const mobileMainAppView = document.getElementById('mobile-main-app-view');
  const mobileCakesContent = document.getElementById('mobile-cakes-page-content');
  const newHomepageContent = document.getElementById('new-homepage-content');
  const cakesPageContent = document.getElementById('cakes-page-content');
  
  // Check if the element exists and is visible
  const isVisible = (element) => element && getComputedStyle(element).display !== 'none';
  
  // Return view type by priority
  if (isVisible(mobileCakesContent)) {
    return 'mobile-cakes';
  } else if (isVisible(mobileMainAppView)) {
    return 'mobile-home';
  } else if (isVisible(cakesPageContent)) {
    return 'desktop-cakes';
  } else if (isVisible(newHomepageContent)) {
    return 'desktop-home';
  }
  
  // Default return value
  return window.innerWidth <= 768 ? 'mobile-home' : 'desktop-home';
}

// Function to actually display the product detail page
function showProductDetail(productId) {
  currentProduct = productsData.find(p => p.id === productId);
  const detailPage = document.getElementById('product-detail-page');
  
  if (!currentProduct || !detailPage) {
    console.error('Product data or detail page element not found.');
    return;
  }

  // --- Hide other active page views --- (Moved from navigation.js for direct control)
  if (typeof hideAllPages === 'function') {
    hideAllPages(); // This adds 'hidden-page' to relevant containers
  } else {
    console.error("hideAllPages function is not defined. Critical for page transitions.");
    // Fallback: manually hide other common pages if hideAllPages is missing
    const otherPages = ['new-homepage-content', 'about-page-content', 'cakes-page-content', 'mobile-main-app-view', 'mobile-cakes-page-content', 'mobile-about-page-content'];
    otherPages.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }

  // Ensure the product detail page is visible
  detailPage.innerHTML = createProductDetailHTML(currentProduct);
  detailPage.classList.remove('hidden-page'); // Remove class that enforces display:none !important
  detailPage.style.display = 'block'; // Set display to block (or flex if its internal styling requires it)
  
  document.body.classList.add('product-detail-active');
  setActivePage('productDetail');
  window.scrollTo(0, 0);

  setupProductDetailPageEventListeners(currentProduct); // Set up listeners for this newly rendered page
}

function setupProductDetailPageEventListeners(product) {
  const backButton = document.getElementById('pdp-back-btn');
  if (backButton) {
    const newBackButtonHandler = () => handleBackFromProductDetail();
    if (backButton._clickHandler) backButton.removeEventListener('click', backButton._clickHandler);
    backButton.addEventListener('click', newBackButtonHandler);
    backButton._clickHandler = newBackButtonHandler;
  }

  // Add to wishlist from PDP
  const pdpWishlistIcon = document.querySelector('#product-detail-page .wishlist-toggle-icon');
  if (pdpWishlistIcon && typeof handleWishlistToggle === 'function') {
      // Update icon state based on current wishlist
      if (typeof isProductInWishlist === 'function' && isProductInWishlist(product.id)) {
          pdpWishlistIcon.src = wishlistFilledIconPath; // Ensure this path is defined
          pdpWishlistIcon.classList.add('active');
      } else {
          pdpWishlistIcon.src = wishlistOutlineIconPath; // Ensure this path is defined
          pdpWishlistIcon.classList.remove('active');
      }
      // Add click listener
      const newWishlistHandler = () => handleWishlistToggle(product.id, pdpWishlistIcon);
      if(pdpWishlistIcon._wishlistClickHandler) pdpWishlistIcon.removeEventListener('click', pdpWishlistIcon._wishlistClickHandler);
      pdpWishlistIcon.addEventListener('click', newWishlistHandler);
      pdpWishlistIcon._wishlistClickHandler = newWishlistHandler;
  }
  
  // Add shopping bag icon click event，Jump to the shopping cart page
  const pdpCartIcon = document.querySelector('#product-detail-page .icon-bag');
  if (pdpCartIcon) {
    const cartIconHandler = () => {
      if (typeof showCartPage === 'function') {
        showCartPage();
      } else {
        console.error('showCartPage function is not defined');
      }
    };
    
    // Remove possible old event listeners
    if (pdpCartIcon._cartIconClickHandler) {
      pdpCartIcon.removeEventListener('click', pdpCartIcon._cartIconClickHandler);
    }
    
    // Add a new event listener
    pdpCartIcon.addEventListener('click', cartIconHandler);
    pdpCartIcon._cartIconClickHandler = cartIconHandler;
  }
  
  // Update quantity selector event handling
  const decreaseBtn = document.getElementById('pdp-qty-decrease');
  const increaseBtn = document.getElementById('pdp-qty-increase');
  const quantityVal = document.getElementById('pdp-quantity-value');
  
  if (decreaseBtn && increaseBtn && quantityVal) {
    let quantity = 1;
    
    decreaseBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityVal.textContent = quantity;
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      quantity++;
      quantityVal.textContent = quantity;
    });
  }
  
  // Add to cart button
  const addToCartBtn = document.querySelector('.pdp-add-to-cart-btn');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', () => {
      const quantityVal = document.getElementById('pdp-quantity-value');
      const quantity = quantityVal ? parseInt(quantityVal.textContent) : 1;
      
      if (typeof addToCart === 'function') {
        // add to cart，No longer display pop ups
        addToCart(product.id, quantity);
      } else {
        // fallback
        console.error('addToCart function is not defined');
      }
    });
  }
}

function handleBackFromProductDetail() {
  const productDetailPage = document.getElementById('product-detail-page');
  const previousView = sessionStorage.getItem('previousProductView');
  
  if(productDetailPage) productDetailPage.style.display = 'none';
  document.body.classList.remove('product-detail-active');

  // Ensure that all page containers are hidden，In order to display only the target page
  if (typeof hideAllPages === 'function') hideAllPages();
  
  console.log("Return from the product details page to:", previousView);

  // Based on storagepreviousViewDecide which view to return to
  switch(previousView) {
    case 'mobile-home':
      const mobileMainAppView = document.getElementById('mobile-main-app-view');
      if (mobileMainAppView) {
        // Display the mobile main view
        mobileMainAppView.style.display = 'flex';
        // Display all its parts
        const sections = mobileMainAppView.querySelectorAll(':scope > section');
        sections.forEach(sec => sec.classList.remove('hidden'));
      }
      break;
      
    case 'mobile-cakes':
      const mobileCakesContent = document.getElementById('mobile-cakes-page-content');
      if (mobileCakesContent) {
        mobileCakesContent.style.display = 'flex';
      }
      break;
      
    case 'desktop-home':
      if (typeof showNewHomepage === 'function') {
        showNewHomepage();
      } else {
        document.getElementById('new-homepage-content').style.display = 'block';
      }
      break;
      
    case 'desktop-cakes':
      if (typeof showCakesPage === 'function') {
        showCakesPage();
      } else {
        document.getElementById('cakes-page-content').style.display = 'block';
      }
      break;
      
    default:
      // If there is no effectivepreviousViewOr unable to determine，Determine which homepage to return to based on device width
      if (window.innerWidth <= 768) {
        const mobileMainAppView = document.getElementById('mobile-main-app-view');
        if (mobileMainAppView) {
          mobileMainAppView.style.display = 'flex';
          const sections = mobileMainAppView.querySelectorAll(':scope > section');
          sections.forEach(sec => sec.classList.remove('hidden'));
        }
      } else {
        if (typeof showNewHomepage === 'function') {
          showNewHomepage();
        } else {
          document.getElementById('new-homepage-content').style.display = 'block';
        }
      }
  }
  
  // Clear stored datapreviousView
  sessionStorage.removeItem('previousProductView');
  
  // Scroll to the top of the page
  window.scrollTo(0, 0);
}

// Helper to ensure these are available if not using modules
// window.setupProductLinkListeners = setupProductLinkListeners;
// window.showProductDetail = showProductDetail;

// (The rest of the original productDetail.js content, including setupProductDetailListeners and its call within showProductDetail)
// Make sure the original setupProductDetailListeners is now setupProductDetailPageEventListeners
// and that showProductDetail (previously showProductDetailFromOtherPage) calls it.

// Update the status of all wishlist icons (includePDPUp there)
if (typeof updateAllWishlistIcons === 'function') {
  updateAllWishlistIcons();
} else {
  console.error("updateAllWishlistIcons function is not defined in wishlist.js");
}

// Function to jump from search results to product details page
function showProductDetailFromOtherPage(productId) {
  // Record the current page status
  const currentPageId = document.body.dataset.currentPage || 'newHomepage';
  sessionStorage.setItem('previousProductView', determinePreviousViewFromId(currentPageId));
  
  // Display product details page
  showProductDetail(productId);
}

// Helper function: Determine view type based on page ID
function determinePreviousViewFromId(pageId) {
  // Desktop view types
  if (pageId === 'newHomepage') return 'desktop-home';
  if (pageId === 'cakes') return 'desktop-cakes';
  
  // Mobile view types
  if (pageId === 'mobileHome') return 'mobile-home';
  if (pageId === 'mobileCakes') return 'mobile-cakes';
  
  // If view type cannot be determined, return default based on device width
  return window.innerWidth <= 768 ? 'mobile-home' : 'desktop-home';
} 