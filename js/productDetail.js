// js/productDetail.js
// 负责生成和管理产品详情页的逻辑

// (依赖 productData.js -> productsData 变量)
// (依赖 navigation.js -> showNewHomepage 函数)

function createProductDetailHTML(product) {
  const productDetailPage = document.getElementById('product-detail-page');
  if (productDetailPage && product.detailPageBgColor) {
    productDetailPage.style.backgroundColor = product.detailPageBgColor;
  }
  return `
    <div class="pdp-top-bar">
      <img src="images/back-arrow.svg" alt="返回" class="pdp-back-btn" id="pdp-back-btn">
      <div class="pdp-logo">LOGO</div>
      <div class="pdp-top-icons">
        <span class="icon-heart">♥</span>
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
        <button class="pdp-add-to-cart-btn">Add to cart</button>
      </div>
    </div>
  `;
}

function showProductDetail(productId) {
  const productDetailPage = document.getElementById('product-detail-page');
  const pageWrapper = document.querySelector('.page-wrapper');
  const searchOverlay = document.getElementById('search-overlay');
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const cakesPageContent = document.getElementById('cakes-page-content');

  if (!productDetailPage || !pageWrapper || !searchOverlay) return;

  const product = productsData.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found with ID:', productId);
    return;
  }

  // 关闭搜索浮层并移除模糊效果 (如果它是开着的)
  if (searchOverlay.classList.contains('active')) {
      closeSearchOverlay(); // 依赖 uiElements.js
  }
  pageWrapper.classList.remove('search-active');

  // 隐藏当前页面内容
  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'none'; 
  
  document.body.style.overflow = ''; 

  productDetailPage.innerHTML = createProductDetailHTML(product);
  productDetailPage.style.display = 'flex';
  document.body.style.overflow = 'hidden'; 

  const pdpBackBtn = document.getElementById('pdp-back-btn');
  if (pdpBackBtn) {
    const existingHandler = pdpBackBtn._clickHandler;
    if(existingHandler) pdpBackBtn.removeEventListener('click', existingHandler);

    const newPdpBackHandler = () => {
      productDetailPage.style.display = 'none';
      productDetailPage.style.backgroundColor = '';
      showNewHomepage(); // 依赖 navigation.js
      window.scrollTo(0, 0); // 返回主页时滚动到顶部
    };
    pdpBackBtn.addEventListener('click', newPdpBackHandler);
    pdpBackBtn._clickHandler = newPdpBackHandler;
  }
  
  let quantity = 1;
  const qtyValueEl = document.getElementById('pdp-quantity-value');
  const qtyIncreaseBtn = document.getElementById('pdp-qty-increase');
  const qtyDecreaseBtn = document.getElementById('pdp-qty-decrease');

  if(qtyValueEl && qtyIncreaseBtn && qtyDecreaseBtn){
      qtyIncreaseBtn.replaceWith(qtyIncreaseBtn.cloneNode(true));
      qtyDecreaseBtn.replaceWith(qtyDecreaseBtn.cloneNode(true));
      
      document.getElementById('pdp-qty-increase').addEventListener('click', () => {
          quantity++;
          document.getElementById('pdp-quantity-value').textContent = quantity < 10 ? '0' + quantity : quantity;
      });
      document.getElementById('pdp-qty-decrease').addEventListener('click', () => {
          if(quantity > 1) {
              quantity--;
              document.getElementById('pdp-quantity-value').textContent = quantity < 10 ? '0' + quantity : quantity;
          }
      });
      document.getElementById('pdp-quantity-value').textContent = '01'; 
  }
}

// 新主页 "Buy Now" 按钮的事件监听器设置
function setupProductLinkListeners() {
    const newBuyNowBtns = document.querySelectorAll('.new-buy-now-btn');
    newBuyNowBtns.forEach(btn => {
        // 移除旧监听器以防重复绑定 (如果此函数被多次调用)
        const existingHandler = btn._clickHandler;
        if (existingHandler) {
            btn.removeEventListener('click', existingHandler);
        }

        const newClickHandler = function() {
            const productId = this.getAttribute('data-product-id');
            if (productId) {
                showProductDetail(productId);
            }
        };
        btn.addEventListener('click', newClickHandler);
        btn._clickHandler = newClickHandler; 
    });
} 