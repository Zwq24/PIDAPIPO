// main.js
// 包含页面切换、图片切换、搜索浮层和产品详情功能脚本

// --- DOM 元素获取 --- //
const pageWrapper = document.querySelector('.page-wrapper');

// 页面容器
const newHomepageContent = document.getElementById('new-homepage-content');
const aboutPageContent = document.getElementById('about-page-content');
const productDetailPage = document.getElementById('product-detail-page');

// 导航元素
const logoBtn = document.getElementById('logo-btn');
const navLinkAbout = document.getElementById('nav-link-about');
// (可以为其他导航链接添加ID和引用，如果它们需要特定行为)
const navLinks = document.querySelectorAll('.nav-menu li'); // 获取所有导航项

// 搜索相关 (保持不变)
const openSearchBtn = document.getElementById('open-search-btn');
const closeSearchBtn = document.getElementById('close-search-btn');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;
const searchResultsPreview = document.getElementById('search-results-preview');

// 新主页 "Buy Now" 按钮
const newBuyNowBtns = document.querySelectorAll('.new-buy-now-btn');

// About页面图片切换元素 (在显示About页面时再具体获取和初始化)
let imagePageBtns, imageContainer;
let currentImageIndex = 1; // 默认显示第二张 (索引1)
const aboutPageImages = [
  'images/Rectangle 129.jpg',       // 对应按钮 1 (旧主页的图)
  'images/Rectangle 134 (1).jpg',  // 对应按钮 2
  'images/Rectangle 134 (2).jpg',  // 对应按钮 3
  'images/Rectangle 134 (3).jpg'   // 对应按钮 4
];

// --- 页面状态管理 --- // 
function showNewHomepage() {
  if (newHomepageContent) newHomepageContent.style.display = 'block';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'flex'; // 确保page-wrapper可见
  document.body.style.overflow = '';
}

function showAboutPage() {
  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'block';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'flex';
  document.body.style.overflow = '';
  initializeAboutPageSlider(); // 初始化或重新激活About页的图片轮播
}

// --- About页面图片切换功能 --- //
function initializeAboutPageSlider() {
  // 获取About页内的图片切换元素
  imageContainer = aboutPageContent.querySelector('#page-container'); 
  imagePageBtns = aboutPageContent.querySelectorAll('.page-btn');

  if (!imageContainer || imagePageBtns.length === 0) {
    console.warn('About page slider elements not found.');
    return;
  }

  renderAboutImage(currentImageIndex); // 初始渲染

  imagePageBtns.forEach(btn => {
    // 移除旧监听器，防止重复绑定 (如果函数被多次调用)
    btn.removeEventListener('click', handleAboutPageBtnClick);
    btn.addEventListener('click', handleAboutPageBtnClick);
  });
}

function handleAboutPageBtnClick() {
  const targetImageIndex = parseInt(this.getAttribute('data-page'));
  if (targetImageIndex === currentImageIndex) return;
  const slideDirection = targetImageIndex > currentImageIndex ? 'right' : 'left';
  renderAboutImage(targetImageIndex, slideDirection);
  currentImageIndex = targetImageIndex;
}

function renderAboutImage(imageIndex, slideDirection = null) {
  if (!imageContainer) return;
  const imgPath = aboutPageImages[imageIndex];
  if (!imgPath) {
      console.error('Invalid image index for about page:', imageIndex);
      return;
  }

  if (!slideDirection) {
    imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img">`;
  } else {
    const oldImg = imageContainer.querySelector('img');
    if (oldImg) {
      const slideOutClass = slideDirection === 'left' ? 'slide-out-left' : 'slide-out-right';
      oldImg.className = 'switch-img ' + slideOutClass;
      oldImg.addEventListener('animationend', function handler() {
        oldImg.removeEventListener('animationend', handler); // 清理
        const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
        imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
        updateActiveAboutPageButton(imageIndex);
      }, { once: true });
    } else {
      const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
      imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
    }
  }
  updateActiveAboutPageButton(imageIndex);
}

function updateActiveAboutPageButton(activeIndex) {
  if (!imagePageBtns) return;
  imagePageBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === activeIndex);
  });
}


// --- 搜索浮层功能 --- //
if (openSearchBtn && searchOverlay && pageWrapper) {
  openSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    pageWrapper.classList.add('search-active'); // 主要由此控制背景模糊
    // 下面这两行针对特定内容区域的 search-active 是多余的，如果模糊由 pageWrapper 控制
    // if (newHomepageContent && newHomepageContent.style.display !== 'none') newHomepageContent.classList.add('search-active');
    // if (aboutPageContent && aboutPageContent.style.display !== 'none') aboutPageContent.classList.add('search-active');

    document.body.style.overflow = 'hidden';
    if(searchInput) searchInput.focus();
  });
}

if (closeSearchBtn && searchOverlay && pageWrapper) {
  closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    pageWrapper.classList.remove('search-active'); // 主要由此移除背景模糊
    // 下面这两行针对特定内容区域的 search-active 是多余的
    // if (newHomepageContent) newHomepageContent.classList.remove('search-active');
    // if (aboutPageContent) aboutPageContent.classList.remove('search-active');
    
    document.body.style.overflow = '';
    if(searchResultsPreview) searchResultsPreview.classList.remove('active');
    if(searchInput) searchInput.value = '';
  });
}

if (searchInput && searchResultsPreview) {
  searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      searchResultsPreview.classList.add('active');
      document.querySelectorAll('#search-results-preview .result-item').forEach(item => {
        const productId = item.getAttribute('data-product-id');
        if (productId) {
            // 确保事件监听器不重复绑定
            const existingHandler = item._clickHandler;
            if (existingHandler) {
                item.removeEventListener('click', existingHandler);
            }
            const newItemClickHandler = () => showProductDetail(productId);
            item.addEventListener('click', newItemClickHandler);
            item._clickHandler = newItemClickHandler; 
        }
      });
    } else {
      searchResultsPreview.classList.remove('active');
    }
  });
}

// --- 产品数据 (保持不变) --- //
const productsData = [
  {
    id: "pb-brownie",
    name: "Peanut Butter & Caramel Brownie",
    image: "images/Ellipse 1.jpg",
    description: "A caramel brownie base, filled with soft, salty caramel gelato, peanut butter gelato and milk chocolate gelato, finished with a thin chocolate glaze and covered with peanut crunch.",
    price: "$78",
    dimensions: "DEMENSIONS:<br>BOXED: 25CM (L) X 25CM (W) X 20CM (H)<br>CAKE:17CM (W) X 14CM (H)",
    detailPageBgColor: "#F3D8A1"
  },
  {
    id: "tiramisu-cake",
    name: "Tiramisu' alla Pidapipo",
    image: "images/Rectangle 154.jpg",
    description: "Chocolate sponge drenched with coffee and sherry syrup, mascarpone gelato dusted with Dutch cocoa powder.",
    price: "$65",
    dimensions: "DIMENSIONS:<br>BOXED:25CM(L) X (25)CM (W) X 20CM(H)<br>CAKE: 15CM(W) X 5CM(H)",
    detailPageBgColor: "#A4D5D4"
  },
  {
    id: "milk-chocolate-hazelnut",
    name: "Milk Chocolate & Hazelnut",
    image: "images/Rectangle 157.jpg",
    description: "Our range of single origin chocolate celebrates the art and craftsmanship of the great Italian cioccolatieri. Handmade from scratch in Fitzroy, our chocolates are crafted in small batches using only the best, ethically-sourced ingredients – from Dominican Republic organic cacao to hazelnuts from Piemonte – and our own caramels, pralines and ganaches. Classic simplicity meets traditional technique and modern innovation. Delizioso.",
    price: "$65",
    dimensions: "DIMENSIONS:<br>46% Milk Chocolate & Hazelnut – 100g",
    detailPageBgColor: "#EDC1D5"
  }
];

// --- 产品详情页功能 (基本保持不变) --- //
function createProductDetailHTML(product) {
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
  if (!productDetailPage || !pageWrapper || !searchOverlay) return;

  const product = productsData.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found with ID:', productId);
    return;
  }

  // 关闭搜索浮层并移除模糊效果
  searchOverlay.classList.remove('active');
  pageWrapper.classList.remove('search-active'); // <--- 关键：确保移除模糊

  // 隐藏当前页面内容
  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'none'; // 隐藏整个 .page-wrapper
  
  document.body.style.overflow = ''; // 临时恢复body滚动，以防PDP未能正确设置

  productDetailPage.innerHTML = createProductDetailHTML(product);
  productDetailPage.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // PDP打开时禁止body滚动

  const pdpBackBtn = document.getElementById('pdp-back-btn');
  if (pdpBackBtn) {
    const existingHandler = pdpBackBtn._clickHandler;
    if(existingHandler) pdpBackBtn.removeEventListener('click', existingHandler);

    const newPdpBackHandler = () => {
      productDetailPage.style.display = 'none';
      productDetailPage.style.backgroundColor = '';
      showNewHomepage(); 
    };
    pdpBackBtn.addEventListener('click', newPdpBackHandler);
    pdpBackBtn._clickHandler = newPdpBackHandler;
  }
  
  let quantity = 1;
  const qtyValueEl = document.getElementById('pdp-quantity-value');
  const qtyIncreaseBtn = document.getElementById('pdp-qty-increase');
  const qtyDecreaseBtn = document.getElementById('pdp-qty-decrease');
  if(qtyValueEl && qtyIncreaseBtn && qtyDecreaseBtn){
      // 清理旧监听器，防止重复计数
      qtyIncreaseBtn.replaceWith(qtyIncreaseBtn.cloneNode(true));
      qtyDecreaseBtn.replaceWith(qtyDecreaseBtn.cloneNode(true));
      // 获取新的按钮引用并添加事件
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
      document.getElementById('pdp-quantity-value').textContent = '01'; // 重置数量显示
  }
}

// --- 事件监听器绑定 --- //
if (navLinkAbout) {
  navLinkAbout.addEventListener('click', (e) => {
    e.preventDefault(); //阻止可能的默认行为
    showAboutPage();
  });
}

if (logoBtn) {
  logoBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showNewHomepage();
  });
}

// 为新主页上的 "buy now" 按钮绑定事件
newBuyNowBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const productId = this.getAttribute('data-product-id');
    if (productId) {
      showProductDetail(productId);
    }
  });
});

// 为其他主导航链接（除了About）添加返回新主页的逻辑
navLinks.forEach(link => {
  if (link.id !== 'nav-link-about') { // 排除About链接本身
    link.addEventListener('click', (e) => {
      // 简单的示例：如果不是特殊链接，都返回主页
      // 你可能需要根据链接ID实现更复杂的路由或页面加载
      if (link.id !== 'open-search-btn') { //排除打开搜索按钮
          e.preventDefault();
          showNewHomepage();
      }
    });
  }
});


// --- 初始化 --- //
// 初始显示新主页
showNewHomepage();

// 移除旧的全局 renderImage(currentImageIndex); 调用
// 它现在由 showAboutPage -> initializeAboutPageSlider 内部调用

console.log("Main.js loaded and initialized."); 