// js/productDetail.js
// 负责生成和管理产品详情页的逻辑

// (依赖 productData.js -> productsData 变量)
// (依赖 navigation.js -> showNewHomepage, goBackToPreviousPageOrHomepage, setActivePage, showWishlistPage 函数)
// (依赖 wishlist.js -> addToWishlist, updateAllWishlistIcons, toggleWishlistProduct 函数)
// (依赖 uiElements.js -> closeSearchOverlay 函数)

let currentProduct = null; // Stores the currently displayed product data

function createProductDetailHTML(product) {
  const productDetailPage = document.getElementById('product-detail-page');
  if (productDetailPage && product.detailPageBgColor) {
    productDetailPage.style.backgroundColor = product.detailPageBgColor;
  }
  // 使用 img 标签作为心愿单图标，并添加 data-product-id
  return `
    <div class="pdp-top-bar">
      <img src="images/back-arrow.svg" alt="返回" class="pdp-back-btn" id="pdp-back-btn">
      <div class="pdp-logo">LOGO</div>
      <div class="pdp-top-icons">
        <img src="images/heart-outline.svg" alt="Toggle Wishlist" class="icon-heart wishlist-toggle-icon" data-product-id="${product.id}">
        <span class="icon-bag">🛍️</span>
      </div>
    </div>
    <div class="pdp-main-image-container">
      <img src="${product.image}" alt="${product.name}" class="pdp-main-image">
    </div>
    <div class="pdp-info-container">
      <h1 class="pdp-title">${product.name}</h1>
      <p class="pdp-description">${product.description}</p>
      <p class="pdp-price">${product.price}</p>
      <hr class="pdp-divider">
      <p class="pdp-dimensions">${product.dimensions}</p>
      <div class="pdp-actions">
        <div class="pdp-quantity-selector">
          <button class="pdp-quantity-btn" id="pdp-qty-decrease">-</button>
          <span class="pdp-quantity-value" id="pdp-quantity-value">01</span>
          <button class="pdp-quantity-btn" id="pdp-qty-increase">+</button>
        </div>
        <button class="pdp-add-to-cart-btn" data-product-id="${product.id}">Add to cart</button>
      </div>
    </div>
  `;
}

// Function to set up event listeners for product links
function setupProductLinkListeners() {
  const productLinks = document.querySelectorAll('.js-view-product-detail, .new-buy-now-btn, [data-product-id^="cake-"]');
  productLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const productId = link.dataset.productId;
      if (productId) {
        let previousView = 'unknown';
        const mobileMainAppView = document.getElementById('mobile-main-app-view');
        const newHomepageContent = document.getElementById('new-homepage-content');
        const cakesPageContent = document.getElementById('cakes-page-content'); // Desktop cakes
        const mobileCakesPageContent = document.getElementById('mobile-cakes-page-content'); // Mobile cakes

        if (mobileMainAppView && getComputedStyle(mobileMainAppView).display !== 'none') {
            const homeSections = mobileMainAppView.querySelectorAll(':scope > section:not(.hidden):not([style*="display: none"])');
            if (homeSections.length > 0) previousView = 'mobile-home';
        } else if (mobileCakesPageContent && getComputedStyle(mobileCakesPageContent).display !== 'none') {
            previousView = 'mobile-cakes';
        } else if (newHomepageContent && getComputedStyle(newHomepageContent).display !== 'none') {
            previousView = 'desktop-home';
        } else if (cakesPageContent && getComputedStyle(cakesPageContent).display !== 'none') {
            previousView = 'desktop-cakes';
        }
        
        sessionStorage.setItem('previousProductView', previousView);
        showProductDetail(productId);
      }
    });
  });
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
  if (typeof hideAllPages === 'function') hideAllPages(); // Hides desktop main pages
  // Hide mobile views
  const mobileMainView = document.getElementById('mobile-main-app-view');
  const mobileCakesView = document.getElementById('mobile-cakes-page-content');
  if (mobileMainView) {
      const sections = mobileMainView.querySelectorAll(':scope > section');
      sections.forEach(sec => sec.classList.add('hidden'));
      // also hide the #mobile-main-app-view itself if it's a flex container for sections
      // but product detail page should overlay, so sections are enough
  }
  if (mobileCakesView) mobileCakesView.style.display = 'none';
  // Ensure search overlay is closed
  if(typeof closeSearchOverlay === 'function') closeSearchOverlay();
  // --- End Hide --- 

  detailPage.innerHTML = createProductDetailHTML(currentProduct);
  detailPage.style.display = 'flex';
  document.body.classList.add('product-detail-active'); // For potential global styling
  window.scrollTo(0, 0);

  setupProductDetailPageEventListeners(currentProduct); // Set up listeners for this newly rendered page
}

function setupProductDetailPageEventListeners(product) {
  const backButton = document.getElementById('product-detail-back-btn');
  if (backButton) {
    const newBackButtonHandler = () => handleBackFromProductDetail();
    if (backButton._clickHandler) backButton.removeEventListener('click', backButton._clickHandler);
    backButton.addEventListener('click', newBackButtonHandler);
    backButton._clickHandler = newBackButtonHandler;
  }

  // Add to wishlist from PDP
  const pdpWishlistIcon = document.querySelector('#product-detail-page .product-detail-wishlist-icon');
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
  // ... (quantity, add to cart listeners as before) ...
  const decreaseBtn = document.getElementById('decrease-quantity');
  const increaseBtn = document.getElementById('increase-quantity');
  const quantityVal = document.getElementById('quantity-value');
  const addToCartBtnPDP = document.getElementById('add-to-cart-pdp');

  if (decreaseBtn && increaseBtn && quantityVal) {
    let quantity = 1;
    decreaseBtn.addEventListener('click', () => {
      if (quantity > 1) {
        quantity--;
        quantityVal.textContent = quantity < 10 ? '0' + quantity : quantity;
      }
    });
    increaseBtn.addEventListener('click', () => {
      quantity++;
      quantityVal.textContent = quantity < 10 ? '0' + quantity : quantity;
    });
  }
  if (addToCartBtnPDP && typeof addItemToCart === 'function') {
    addToCartBtnPDP.addEventListener('click', () => {
        addItemToCart(product, parseInt(quantityVal.textContent));
        // Add some visual feedback if possible
        alert(`${product.name} added to cart!`); 
    });
  }
}

function handleBackFromProductDetail() {
  const productDetailPage = document.getElementById('product-detail-page');
  const previousView = sessionStorage.getItem('previousProductView');
  
  if(productDetailPage) productDetailPage.style.display = 'none';
  document.body.classList.remove('product-detail-active');

  // Ensure all primary page containers are hidden before showing the target one
  if (typeof hideAllPages === 'function') hideAllPages(); // Hides main desktop pages
  const mobileMainAppView = document.getElementById('mobile-main-app-view');
  const mobileCakesContent = document.getElementById('mobile-cakes-page-content');
  if (mobileMainAppView) mobileMainAppView.style.display = 'none'; // Hide the whole container first
  if (mobileCakesContent) mobileCakesContent.style.display = 'none';
  
  // Unhide all sections within mobile home if returning there
  if (previousView === 'mobile-home' && mobileMainAppView) {
      const sections = mobileMainAppView.querySelectorAll(':scope > section');
      sections.forEach(sec => sec.classList.remove('hidden'));
      mobileMainAppView.style.display = 'flex'; 
  } else if (previousView === 'mobile-cakes' && mobileCakesContent) {
      mobileCakesContent.style.display = 'flex'; 
      if(mobileMainAppView) mobileMainAppView.style.display = 'flex'; // Parent container of mobile-cakes-page if needed
  } else if (previousView === 'desktop-home') {
      if (typeof showNewHomepage === 'function') showNewHomepage();
  } else if (previousView === 'desktop-cakes') {
      if (typeof showCakesPage === 'function') showCakesPage(); 
  } else { // Fallback
      if (window.innerWidth <= 768 && mobileMainAppView) {
          const sections = mobileMainAppView.querySelectorAll(':scope > section');
          sections.forEach(sec => sec.classList.remove('hidden'));
          mobileMainAppView.style.display = 'flex';
      } else if (typeof showNewHomepage === 'function') {
          showNewHomepage();
      }
  }
  sessionStorage.removeItem('previousProductView');
  window.scrollTo(0, 0);
}

// Helper to ensure these are available if not using modules
// window.setupProductLinkListeners = setupProductLinkListeners;
// window.showProductDetail = showProductDetail;

// (The rest of the original productDetail.js content, including setupProductDetailListeners and its call within showProductDetail)
// Make sure the original setupProductDetailListeners is now setupProductDetailPageEventListeners
// and that showProductDetail (previously showProductDetailFromOtherPage) calls it.

// 更新所有心愿单图标状态 (包括PDP上的)
if (typeof updateAllWishlistIcons === 'function') {
  updateAllWishlistIcons();
} else {
  console.error("updateAllWishlistIcons function is not defined in wishlist.js");
} 