// js/cart.js
// 处理购物车数据和UI

// 购物车数据结构 [{id, name, price, quantity, image}]
let cartItems = [];

// 添加商品到购物车
function addToCart(productId, quantity = 1) {
  // 查找产品数据
  const product = productsData.find(p => p.id === productId);
  
  if (!product) {
    console.error('Product not found:', productId);
    return false;
  }
  
  // 检查购物车中是否已有该商品
  const existingItem = cartItems.find(item => item.id === productId);
  
  if (existingItem) {
    // 如果已存在，增加数量
    existingItem.quantity += quantity;
    console.log(`Updated ${product.name} quantity to ${existingItem.quantity}`);
  } else {
    // 提取价格数字
    const priceValue = parseFloat(product.price.replace('$', ''));
    
    // 添加新商品
    cartItems.push({
      id: product.id,
      name: product.name,
      price: priceValue,
      quantity: quantity,
      image: product.image
    });
    console.log(`Added ${product.name} to cart`);
  }
  
  // 更新购物车图标
  updateCartIcon();
  
  // 如果当前在购物车页面，刷新页面内容
  if (document.getElementById('cart-page-content').style.display !== 'none') {
    renderCartPage();
  }
  
  // 如果当前在移动端购物车页面，刷新页面内容
  if (document.getElementById('mobile-cart-page-content').style.display !== 'none') {
    renderMobileCartPage();
  }
  
  // 本地存储购物车数据
  saveCartToLocalStorage();
  
  return true;
}

// 从购物车中移除商品
function removeFromCart(productId) {
  const index = cartItems.findIndex(item => item.id === productId);
  
  if (index > -1) {
    const removedItem = cartItems[index];
    cartItems.splice(index, 1);
    console.log(`Removed ${removedItem.name} from cart`);
    
    // 更新购物车图标
    updateCartIcon();
    
    // 如果当前在购物车页面，刷新页面内容
    if (document.getElementById('cart-page-content').style.display !== 'none') {
      renderCartPage();
    }
    
    // 如果当前在移动端购物车页面，刷新页面内容
    if (document.getElementById('mobile-cart-page-content').style.display !== 'none') {
      renderMobileCartPage();
    }
    
    // 本地存储购物车数据
    saveCartToLocalStorage();
    
    return true;
  }
  
  return false;
}

// 更新购物车中商品数量
function updateCartItemQuantity(productId, quantity) {
  if (quantity < 1) {
    return removeFromCart(productId);
  }
  
  const item = cartItems.find(item => item.id === productId);
  
  if (item) {
    item.quantity = quantity;
    console.log(`Updated ${item.name} quantity to ${quantity}`);
    
    // 更新购物车图标
    updateCartIcon();
    
    // 如果当前在购物车页面，刷新页面内容
    if (document.getElementById('cart-page-content').style.display !== 'none') {
      renderCartPage();
    }
    
    // 如果当前在移动端购物车页面，刷新页面内容
    if (document.getElementById('mobile-cart-page-content').style.display !== 'none') {
      renderMobileCartPage();
    }
    
    // 本地存储购物车数据
    saveCartToLocalStorage();
    
    return true;
  }
  
  return false;
}

// 计算购物车总价
function calculateCartTotal() {
  let subtotal = 0;
  
  cartItems.forEach(item => {
    subtotal += item.price * item.quantity;
  });
  
  // 暂时不计算运费
  const shipping = 0;
  
  return {
    subtotal: subtotal,
    shipping: shipping,
    total: subtotal + shipping
  };
}

// 更新购物车图标（已删除红色数量显示）
function updateCartIcon() {
  // 不再显示购物车数量图标，保持原始购物袋图标样式
  console.log('购物车图标更新已禁用（无红色数量显示）');
}

// 渲染购物车页面
function renderCartPage() {
  const cartContainer = document.querySelector('#cart-page-content .cart-items-container');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  
  if (!cartContainer || !subtotalEl || !totalEl) {
    console.error('Cart page elements not found!');
    return;
  }
  
  // 清空当前内容
  cartContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    // 购物车为空的提示
    cartContainer.innerHTML = '<p class="cart-empty-message">Your cart is currently empty.</p>';
    subtotalEl.textContent = '$0.00';
    totalEl.textContent = '$0.00';
    
    // 禁用结账按钮
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('disabled');
    }
    
    return;
  }
  
  // 计算总价
  const totals = calculateCartTotal();
  subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  totalEl.textContent = `$${totals.total.toFixed(2)}`;
  
  // 启用结账按钮
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('disabled');
  }
  
  // 渲染每个购物车项目
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
  
  // 为数量调整按钮添加事件监听
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
  
  // 为移除按钮添加事件监听
  document.querySelectorAll('.cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      removeFromCart(productId);
    });
  });
}

// 新增：渲染移动端购物车页面
function renderMobileCartPage() {
  const mobileCartContainer = document.querySelector('#mobile-cart-page-content .mobile-cart-items');
  const mobileSubtotalEl = document.getElementById('mobile-cart-subtotal');
  const mobileShippingEl = document.getElementById('mobile-cart-shipping');
  const mobileTotalEl = document.getElementById('mobile-cart-total');
  
  if (!mobileCartContainer || !mobileSubtotalEl || !mobileShippingEl || !mobileTotalEl) {
    console.error('Mobile cart page elements not found!');
    return;
  }
  
  // 清空当前内容
  mobileCartContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    // 购物车为空的提示
    mobileCartContainer.innerHTML = '<p class="mobile-cart-empty">Your cart is currently empty.</p>';
    mobileSubtotalEl.textContent = '$0.00';
    mobileShippingEl.textContent = '$0.00';
    mobileTotalEl.textContent = '$0.00';
    
    // 禁用结账按钮
    const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
    if (mobileCheckoutBtn) {
      mobileCheckoutBtn.disabled = true;
      mobileCheckoutBtn.classList.add('disabled');
    }
    
    return;
  }
  
  // 计算总价
  const totals = calculateCartTotal();
  mobileSubtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  mobileShippingEl.textContent = `$${totals.shipping.toFixed(2)}`;
  mobileTotalEl.textContent = `$${totals.total.toFixed(2)}`;
  
  // 启用结账按钮
  const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
  if (mobileCheckoutBtn) {
    mobileCheckoutBtn.disabled = false;
    mobileCheckoutBtn.classList.remove('disabled');
  }
  
  // 渲染每个购物车项目
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
  
  // 为数量调整按钮添加事件监听
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
  
  // 为移除按钮添加事件监听
  document.querySelectorAll('.mobile-cart-item-remove').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      removeFromCart(productId);
    });
  });
}

// 本地存储购物车数据
function saveCartToLocalStorage() {
  localStorage.setItem('pidapipo-cart', JSON.stringify(cartItems));
}

// 从本地存储加载购物车数据
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

// 初始化购物车
function initCart() {
  // 加载本地存储的购物车数据
  loadCartFromLocalStorage();
  
  // 绑定购物车图标点击事件
  const cartIcons = document.querySelectorAll('.icon-bag');
  cartIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      if (typeof showCartPage === 'function') {
        showCartPage();
      } else {
        console.error('showCartPage function is not defined.');
      }
    });
  });
  
  // 为移动端底部导航栏中的购物袋图标添加点击事件
  const mobileCartIcon = document.querySelector('.mobile-nav-item:nth-child(3)');
  if (mobileCartIcon) {
    mobileCartIcon.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof showCartPage === 'function') {
        showCartPage();
      } else {
        console.error('showCartPage function is not defined.');
      }
    });
  }
  
  // 更新所有Add to Cart按钮
  document.querySelectorAll('.pdp-add-to-cart-btn, .add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const productId = this.dataset.productId;
      const quantityInput = document.getElementById('pdp-quantity-value');
      const quantity = quantityInput ? parseInt(quantityInput.textContent) : 1;
      
      if (addToCart(productId, quantity)) {
        // 显示添加成功提示
        alert(`已将 ${productsData.find(p => p.id === productId).name} 添加到购物车！`);
      }
    });
  });
  
  // 初始更新购物车图标
  updateCartIcon();
} 