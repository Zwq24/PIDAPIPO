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
      <img src="mobile_images/back-arrow@2X 1 (1).png" alt="Back" class="pdp-back-btn" id="pdp-back-btn">
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
  // 获取所有可点击进入产品详情页的元素
  const productLinks = document.querySelectorAll('.js-view-product-detail, .new-buy-now-btn, [data-product-id^="cake-"], .cake-item');
  
  // 为每个产品链接添加点击事件
  productLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      
      // 获取产品ID - 首先尝试data-product-id属性
      let productId = link.dataset.productId;
      
      // 如果当前元素没有产品ID，尝试查找它的子元素或父元素
      if (!productId) {
        // 向下查找子元素
        const childWithId = link.querySelector('[data-product-id]');
        if (childWithId) {
          productId = childWithId.dataset.productId;
        } else {
          // 向上查找父元素
          let parent = link.closest('[data-product-id]');
          if (parent) {
            productId = parent.dataset.productId;
          }
        }
      }
      
      // 如果找到产品ID，则显示产品详情页
      if (productId) {
        console.log("准备显示产品:", productId);
        
        // 存储当前所在视图类型，以便后续返回
        let previousView = determinePreviousView();
        sessionStorage.setItem('previousProductView', previousView);
        
        // 显示产品详情页
        showProductDetail(productId);
      } else {
        console.error("无法确定产品ID");
      }
    });
  });
}

// 辅助函数：确定用户当前所在的视图
function determinePreviousView() {
  // 检查各种可能的视图
  const mobileMainAppView = document.getElementById('mobile-main-app-view');
  const mobileCakesContent = document.getElementById('mobile-cakes-page-content');
  const newHomepageContent = document.getElementById('new-homepage-content');
  const cakesPageContent = document.getElementById('cakes-page-content');
  
  // 检查元素是否存在并且可见
  const isVisible = (element) => element && getComputedStyle(element).display !== 'none';
  
  // 按优先级返回视图类型
  if (isVisible(mobileCakesContent)) {
    return 'mobile-cakes';
  } else if (isVisible(mobileMainAppView)) {
    return 'mobile-home';
  } else if (isVisible(cakesPageContent)) {
    return 'desktop-cakes';
  } else if (isVisible(newHomepageContent)) {
    return 'desktop-home';
  }
  
  // 默认返回值
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

  // 确保所有页面容器都隐藏，以便只显示目标页面
  if (typeof hideAllPages === 'function') hideAllPages();
  
  console.log("从产品详情页返回到:", previousView);

  // 基于存储的previousView决定返回到哪个视图
  switch(previousView) {
    case 'mobile-home':
      const mobileMainAppView = document.getElementById('mobile-main-app-view');
      if (mobileMainAppView) {
        // 显示移动主视图
        mobileMainAppView.style.display = 'flex';
        // 显示其所有部分
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
      // 如果没有有效的previousView或无法确定，根据设备宽度决定返回到哪个主页
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
  
  // 清除存储的previousView
  sessionStorage.removeItem('previousProductView');
  
  // 滚动到页面顶部
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