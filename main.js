// main.js
// 包含图片切换和搜索浮层功能脚本，详细中文注释

// --- 图片切换功能 --- //
const images = [
  'images/Rectangle 129.jpg',       // 对应按钮 1
  'images/Rectangle 134 (1).jpg',  // 对应按钮 2
  'images/Rectangle 134 (2).jpg',  // 对应按钮 3
  'images/Rectangle 134 (3).jpg'   // 对应按钮 4
];

// 获取所有分页按钮和图片容器
const imagePageBtns = document.querySelectorAll('.page-btn');
const imageContainer = document.getElementById('page-container'); // 容器ID已更新

// 当前显示图片的索引 (默认显示第二张，所以是1)
let currentImageIndex = 1;

// 渲染指定索引的图片（可带动画方向）
function renderImage(imageIndex, slideDirection = null) {
  if (!imageContainer) return; // 如果图片容器不存在则退出
  if (!slideDirection) {
    imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img">`;
    imagePageBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
    });
    return;
  }
  const oldImg = imageContainer.querySelector('img');
  if (oldImg) {
    const slideOutClass = slideDirection === 'left' ? 'slide-out-left' : 'slide-out-right';
    oldImg.className = 'switch-img ' + slideOutClass;
    oldImg.addEventListener('animationend', function handler() {
      oldImg.removeEventListener('animationend', handler);
      const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
      imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
      imagePageBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
      });
    }, { once: true });
  } else {
    const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
    imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
    imagePageBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
    });
  }
}

// 给每个分页按钮添加点击事件
imagePageBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const targetImageIndex = parseInt(this.getAttribute('data-page'));
    if (targetImageIndex === currentImageIndex) return;
    const slideDirection = targetImageIndex > currentImageIndex ? 'right' : 'left';
    renderImage(targetImageIndex, slideDirection);
    currentImageIndex = targetImageIndex;
  });
});

if (imageContainer) { // 确保在图片容器存在时才执行
    renderImage(currentImageIndex);
}

// --- 搜索浮层功能 --- //
const openSearchBtn = document.getElementById('open-search-btn');
const closeSearchBtn = document.getElementById('close-search-btn');
const searchOverlay = document.getElementById('search-overlay');
const pageWrapper = document.querySelector('.page-wrapper');
const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;
const searchResultsPreview = document.getElementById('search-results-preview');

// 调试信息
console.log('Search Input Element:', searchInput);
console.log('Search Results Preview Element:', searchResultsPreview);

if (openSearchBtn && searchOverlay && pageWrapper) {
  openSearchBtn.addEventListener('click', () => {
    console.log('Open search button clicked'); // 调试
    searchOverlay.classList.add('active');
    pageWrapper.classList.add('search-active');
    document.body.style.overflow = 'hidden';
    if(searchInput) {
        console.log('Focusing on search input'); // 调试
        searchInput.focus();
    }
  });
}

if (closeSearchBtn && searchOverlay && pageWrapper) {
  closeSearchBtn.addEventListener('click', () => {
    console.log('Close search button clicked'); // 调试
    searchOverlay.classList.remove('active');
    pageWrapper.classList.remove('search-active');
    document.body.style.overflow = '';
    if(searchResultsPreview) searchResultsPreview.classList.remove('active');
    if(searchInput) searchInput.value = '';
  });
}

if (searchInput && searchResultsPreview) {
  console.log('Adding input listener to searchInput'); // 调试
  searchInput.addEventListener('input', function() {
    console.log('Search input value:', this.value); // 调试
    if (this.value.length > 0) {
      searchResultsPreview.classList.add('active');
      console.log('Search results preview activated'); // 调试
      document.querySelectorAll('.search-overlay .result-item').forEach(item => {
        const productId = item.getAttribute('data-product-id'); // 获取产品ID
        if (productId) {
            // 为每个item动态创建事件监听器，确保每次只绑定一个
            const newItemClickHandler = () => showProductDetail(productId);
            item.removeEventListener('click', item._clickHandler); // 移除旧的（如果存在）
            item.addEventListener('click', newItemClickHandler);
            item._clickHandler = newItemClickHandler; // 存储引用以便移除
        }
      });
    } else {
      searchResultsPreview.classList.remove('active');
      console.log('Search results preview deactivated'); // 调试
    }
  });
} else {
    console.error('Search input or search results preview not found. Input event listener not added.');
}

// --- 产品数据 --- //
const productsData = [
  {
    id: "pb-brownie",
    name: "Peanut Butter & Caramel Brownie",
    image: "images/Ellipse 1.jpg",
    description: "A caramel brownie base, filled with soft, salty caramel gelato, peanut butter gelato and milk chocolate gelato, finished with a thin chocolate glaze and covered with peanut crunch.",
    price: "$78",
    dimensions: "DEMENSIONS:<br>BOXED: 25CM (L) X 25CM (W) X 20CM (H)<br>CAKE:17CM (W) X 14CM (H)",
    detailPageBgColor: "#F3D8A1" // 第一个产品详情页的背景色
  },
  {
    id: "tiramisu-cake",
    name: "Tiramisu' alla Pidapipo",
    image: "images/Rectangle 154.jpg",
    description: "Chocolate sponge drenched with coffee and sherry syrup, mascarpone gelato dusted with Dutch cocoa powder.",
    price: "$65",
    dimensions: "DIMENSIONS:<br>BOXED:25CM(L) X (25)CM (W) X 20CM(H)<br>CAKE: 15CM(W) X 5CM(H)",
    detailPageBgColor: "#A4D5D4" // 第二个产品详情页的背景色
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
  // 可以继续添加更多产品...
];

// --- 产品详情页功能 --- //
const productDetailPage = document.getElementById('product-detail-page');

// 生成产品详情页HTML的函数
function createProductDetailHTML(product) {
  // 更新产品详情页的背景色
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

  searchOverlay.classList.remove('active');
  pageWrapper.classList.remove('search-active');
  pageWrapper.style.display = 'none';
  document.body.style.overflow = '';

  productDetailPage.innerHTML = createProductDetailHTML(product);
  productDetailPage.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const pdpBackBtn = document.getElementById('pdp-back-btn');
  if (pdpBackBtn) {
    pdpBackBtn.addEventListener('click', () => {
      productDetailPage.style.display = 'none';
      productDetailPage.style.backgroundColor = ''; // 清除背景色
      pageWrapper.style.display = 'flex';
      document.body.style.overflow = '';
    });
  }
  let quantity = 1;
  const qtyValueEl = document.getElementById('pdp-quantity-value');
  const qtyIncreaseBtn = document.getElementById('pdp-qty-increase');
  const qtyDecreaseBtn = document.getElementById('pdp-qty-decrease');
  if(qtyValueEl && qtyIncreaseBtn && qtyDecreaseBtn){
      qtyIncreaseBtn.addEventListener('click', () => {
          quantity++;
          qtyValueEl.textContent = quantity < 10 ? '0' + quantity : quantity;
      });
      qtyDecreaseBtn.addEventListener('click', () => {
          if(quantity > 1) {
              quantity--;
              qtyValueEl.textContent = quantity < 10 ? '0' + quantity : quantity;
          }
      });
  }
}

renderImage(currentImageIndex); 