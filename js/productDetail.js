// js/productDetail.js
// 负责生成和管理产品详情页的逻辑

// (依赖 productData.js -> productsData 变量)
// (依赖 navigation.js -> showNewHomepage, goBackToPreviousPageOrHomepage, setActivePage 函数)
// (依赖 wishlist.js -> addToWishlist, updateAllWishlistIcons 函数)
// (依赖 uiElements.js -> closeSearchOverlay 函数)

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

// 重命名函数
function showProductDetailFromOtherPage(productId) {
  const productDetailPage = document.getElementById('product-detail-page');
  const pageWrapper = document.querySelector('.page-wrapper');
  const searchOverlay = document.getElementById('search-overlay');
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const wishlistPageContent = document.getElementById('wishlist-page-content'); // 新增

  if (!productDetailPage || !pageWrapper || !searchOverlay) {
    console.error("PDP or Page Wrapper or Search Overlay not found");
    return;
  }

  const product = productsData.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found with ID:', productId);
    return;
  }

  // navigation.js 中的 previousPage 应该在调用此函数前已被正确设置。
  // 我们现在将当前页面标记为 'productDetail'，以便从PDP导航到其他地方（如心愿单）时，返回功能知道PDP是上一页。
  // 注意: setActivePage 是在 navigation.js 中定义的。
  if (typeof setActivePage === 'function') {
    setActivePage('productDetail'); 
  } else {
    console.error("setActivePage function is not defined in navigation.js");
  }


  // 关闭搜索浮层并移除模糊效果 (如果它是开着的)
  if (searchOverlay.classList.contains('active')) {
      if (typeof closeSearchOverlay === 'function') {
        closeSearchOverlay(); 
      } else {
        console.error("closeSearchOverlay function not defined in uiElements.js");
      }
  }
  if (pageWrapper) pageWrapper.classList.remove('search-active');

  // 隐藏其他主要内容区域
  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'none';
  if (wishlistPageContent) wishlistPageContent.style.display = 'none'; // 新增
  if (pageWrapper) pageWrapper.style.display = 'none'; 
  
  document.body.style.overflow = ''; 

  productDetailPage.innerHTML = createProductDetailHTML(product);
  productDetailPage.style.display = 'flex';
  document.body.style.overflow = 'hidden'; 

  // PDP 返回按钮
  const pdpBackBtn = document.getElementById('pdp-back-btn');
  if (pdpBackBtn) {
    // 清理旧的事件监听器
    const existingHandler = pdpBackBtn._clickHandler;
    if(existingHandler) pdpBackBtn.removeEventListener('click', existingHandler);

    const newPdpBackHandler = () => {
      productDetailPage.style.display = 'none';
      productDetailPage.style.backgroundColor = ''; // 重置背景色
      document.body.style.overflow = ''; // 恢复滚动
      // 调用 navigation.js 中的返回函数
      if (typeof goBackToPreviousPageOrHomepage === 'function') {
        goBackToPreviousPageOrHomepage();
      } else {
        console.error("goBackToPreviousPageOrHomepage function is not defined, falling back to homepage.");
        if(typeof showNewHomepage === 'function') showNewHomepage(); // Fallback
      }
      window.scrollTo(0, 0); 
    };
    pdpBackBtn.addEventListener('click', newPdpBackHandler);
    pdpBackBtn._clickHandler = newPdpBackHandler;
  }
  
  // 数量选择器逻辑 (保持不变)
  let quantity = 1;
  const qtyValueEl = document.getElementById('pdp-quantity-value');
  const qtyIncreaseBtn = document.getElementById('pdp-qty-increase');
  const qtyDecreaseBtn = document.getElementById('pdp-qty-decrease');

  if(qtyValueEl && qtyIncreaseBtn && qtyDecreaseBtn){
      // 克隆并替换按钮以移除旧监听器
      const newIncreaseBtn = qtyIncreaseBtn.cloneNode(true);
      qtyIncreaseBtn.parentNode.replaceChild(newIncreaseBtn, qtyIncreaseBtn);
      const newDecreaseBtn = qtyDecreaseBtn.cloneNode(true);
      qtyDecreaseBtn.parentNode.replaceChild(newDecreaseBtn, qtyDecreaseBtn);
      
      newIncreaseBtn.addEventListener('click', () => {
          quantity++;
          qtyValueEl.textContent = quantity < 10 ? '0' + quantity : quantity;
      });
      newDecreaseBtn.addEventListener('click', () => {
          if(quantity > 1) {
              quantity--;
              qtyValueEl.textContent = quantity < 10 ? '0' + quantity : quantity;
          }
      });
      qtyValueEl.textContent = '01'; 
  }

  // “添加到购物车”按钮事件监听器
  const addToCartBtn = productDetailPage.querySelector('.pdp-add-to-cart-btn');
  if (addToCartBtn) {
    // 移除旧的监听器 (如果适用)
    const existingCartHandler = addToCartBtn._clickHandler;
    if (existingCartHandler) addToCartBtn.removeEventListener('click', existingCartHandler);
    
    const newCartHandler = function() {
        const currentProductId = this.dataset.productId;
        if (currentProductId && typeof addToWishlist === 'function') {
            addToWishlist(currentProductId);
            // 可以添加一些用户反馈，比如按钮状态改变或提示信息
            console.log(`Product ${currentProductId} added to wishlist from PDP.`);
            // 注意：不在此处导航到心愿单页面，只是添加商品
        } else {
            console.error("addToWishlist function is not defined or product ID is missing.");
        }
    };
    addToCartBtn.addEventListener('click', newCartHandler);
    addToCartBtn._clickHandler = newCartHandler;
  }

  // 更新所有心愿单图标状态 (包括PDP上的)
  if (typeof updateAllWishlistIcons === 'function') {
    updateAllWishlistIcons();
  } else {
    console.error("updateAllWishlistIcons function is not defined in wishlist.js");
  }
}

// 更新主页 "Buy Now" 按钮的事件监听器设置
function setupProductLinkListeners() {
    const newBuyNowBtns = document.querySelectorAll('.new-buy-now-btn');
    newBuyNowBtns.forEach(btn => {
        // 移除旧监听器以防重复绑定
        const existingHandler = btn._clickHandler;
        if (existingHandler) {
            btn.removeEventListener('click', existingHandler);
        }

        const newClickHandler = function() {
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                // previousPage 应该由 showNewHomepage/showCakesPage 等设置
                showProductDetailFromOtherPage(productId); // 调用重命名后的函数
            }
        };
        btn.addEventListener('click', newClickHandler);
        btn._clickHandler = newClickHandler; 
    });

    // 为搜索结果中的产品项添加事件监听 (如果它们还没有的话)
    // 这个逻辑之前可能在 searchFunctionality.js 中，需要确认是否需要在这里合并或确保它独立工作
    // 暂时假设 searchFunctionality.js 会处理其结果项的点击事件
} 