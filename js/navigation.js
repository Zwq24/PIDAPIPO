// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// 记录导航到PDP或Wishlist之前的页面，方便返回
let previousPage = 'newHomepage'; // 默认为新主页
const VALID_PAGE_IDS = ['newHomepage', 'about', 'cakes', 'productDetail', 'wishlist', 'payment'];

// --- 页面状态管理与导航 --- // 
function setActivePage(pageId) {
    // 在切换到新页面之前，记录当前显示的页面ID
    const currentPage = document.body.dataset.currentPage || 'newHomepage'; 
    if (VALID_PAGE_IDS.includes(currentPage) && currentPage !== pageId) {
        previousPage = currentPage;
        console.log("Previous page was:", previousPage);
    }
    if (VALID_PAGE_IDS.includes(pageId)) {
        document.body.dataset.currentPage = pageId; // 使用body的dataset存储当前页面
        console.log("Active page set to:", pageId);
    }
}

function hideAllPages() {
    document.getElementById('new-homepage-content').style.display = 'none';
    document.getElementById('about-page-content').style.display = 'none';
    document.getElementById('product-detail-page').style.display = 'none';
    document.getElementById('cakes-page-content').style.display = 'none';
    document.getElementById('wishlist-page-content').style.display = 'none';
    document.getElementById('payment-page-content').style.display = 'none'; // 新增
    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) pageWrapper.style.display = 'flex'; // 通常 pageWrapper 保持 flex
    document.body.style.overflow = ''; // 恢复默认滚动
}

function showNewHomepage() {
  hideAllPages();
  document.getElementById('new-homepage-content').style.display = 'block';
  setActivePage('newHomepage');
  window.scrollTo(0, 0);
}

function showAboutPage() {
  hideAllPages();
  document.getElementById('about-page-content').style.display = 'block';
  setActivePage('about');
  if (typeof initializeAboutPageSlider === 'function') initializeAboutPageSlider();
  window.scrollTo(0, 0);
}

function showCakesPage() {
  hideAllPages();
  document.getElementById('cakes-page-content').style.display = 'block';
  setActivePage('cakes');
  // Cakes 返回按钮事件监听器 (确保只绑定一次或在showCakesPage中处理)
  const cakesBackBtn = document.getElementById('cakes-back-btn');
  if (cakesBackBtn && !cakesBackBtn._clickHandlerAttached) {
    const newCakesBackHandler = (e) => { e.preventDefault(); showNewHomepage(); };
    cakesBackBtn.addEventListener('click', newCakesBackHandler);
    cakesBackBtn._clickHandlerAttached = true; 
  }
  window.scrollTo(0, 0);
}

function showWishlistPage() {
    hideAllPages();
    document.getElementById('wishlist-page-content').style.display = 'block';
    setActivePage('wishlist');
    if (typeof renderWishlistPage === 'function') renderWishlistPage();
    window.scrollTo(0, 0);
}

// 新增函数：显示支付页面
function showPaymentPage() {
    hideAllPages();
    document.getElementById('payment-page-content').style.display = 'flex'; // payment page is flex container
    setActivePage('payment');
    
    // 更新订单摘要
    if (typeof calculateWishlistTotals === 'function') {
        const totals = calculateWishlistTotals(); // 假设这个函数在wishlist.js中
        const subtotalEl = document.getElementById('payment-subtotal');
        const totalEl = document.getElementById('payment-total');
        // const shippingEl = document.getElementById('payment-shipping'); // 运费暂时为0
        
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`; // 目前 total = subtotal
        // if (shippingEl) shippingEl.textContent = '$0.00';
    } else {
        console.error('calculateWishlistTotals function is not defined. Check wishlist.js');
    }

    // 支付页面返回按钮事件监听器
    const paymentBackBtn = document.getElementById('payment-back-btn');
    if (paymentBackBtn && !paymentBackBtn._clickHandlerAttached) {
        const newPaymentBackHandler = (e) => { 
            e.preventDefault(); 
            showWishlistPage(); // 从支付页面返回到心愿单/购物车摘要页面
        };
        paymentBackBtn.addEventListener('click', newPaymentBackHandler);
        paymentBackBtn._clickHandlerAttached = true;
    }

    // "Place to order" 按钮的事件监听器
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn && !placeOrderBtn._clickHandlerAttached) {
        placeOrderBtn.addEventListener('click', () => {
            alert('Order placed successfully! (This is a demo)');
            if (typeof wishlistItems !== 'undefined') { // Ensure wishlistItems is defined
              wishlistItems = []; 
            }
            if (typeof renderWishlistPage === 'function') renderWishlistPage(); 
            if (typeof updateAllWishlistIcons === 'function') updateAllWishlistIcons(); 
            showNewHomepage(); 
        });
        placeOrderBtn._clickHandlerAttached = true;
    }

    // --- Payment Method Selection Logic --- //
    const paymentOptions = document.querySelectorAll('#payment-page-content .payment-option');
    paymentOptions.forEach(option => {
        if (!option._paymentOptionClickHandlerAttached) {
            option.addEventListener('click', function() {
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                // const selectedMethod = this.dataset.method;
                // console.log('Selected payment method:', selectedMethod);
            });
            option._paymentOptionClickHandlerAttached = true; 
        }
    });

    window.scrollTo(0, 0);
}

function goBackToPreviousPageOrHomepage() {
    const pageToGo = previousPage || 'newHomepage'; // Fallback to newHomepage
    console.log("Going back. Previous page was:", previousPage, "Navigating to:", pageToGo);
    switch (pageToGo) {
        case 'newHomepage': showNewHomepage(); break;
        case 'about': showAboutPage(); break;
        case 'cakes': showCakesPage(); break;
        case 'wishlist': showWishlistPage(); break;
        // PDP 返回时，previousPage 应该是 PDP 打开前的页面，由setActivePage在显示PDP前设置。
        // productDetail.js 中的返回按钮直接调用此函数。
        case 'productDetail': 
             // This case might be tricky. If productDetail was the *actual* previous page (e.g., user navigated payment -> pdp)
             // then this is fine. But usually, productDetail calls this to go to *its* previous page.
             // Let's assume setActivePage in showProductDetailFromOtherPage correctly sets previousPage to what was before PDP.
             // The current setActivePage logic needs refinement for this to work perfectly.
             // For now, this might default to homepage if previousPage was 'productDetail' due to PDP itself being previous.
             // A better `previousPage` management would be a stack or more context.
             // Simplified: if previousPage is 'productDetail', it means we were on PDP, and its own 'previousPage' should be used.
             // This logic is flawed for PDP. PDP's back button should rely on `previousPage` set *before* PDP was shown.
             // The current `setActivePage` has been updated to try and manage `previousPage` better.
             showNewHomepage(); // Fallback, this needs robust previousPage management.
             break;
        case 'payment': showPaymentPage(); break;
        default: showNewHomepage(); break;
    }
}

// 主导航链接的事件监听器设置
function setupNavigationListeners() {
  const logoBtn = document.getElementById('logo-btn');
  const navLinkAbout = document.getElementById('nav-link-about');
  const navLinkCakes = document.getElementById('nav-link-cakes');
  // const navLinkWishlist = document.querySelector('.nav-icons .wishlist-toggle-icon'); // 这个由wishlist.js的initWishlist处理
  const navLinks = document.querySelectorAll('.nav-menu li a, .nav-menu button'); // 更通用地选择链接和按钮

  if (navLinkAbout) {
    navLinkAbout.addEventListener('click', (e) => {
      e.preventDefault(); 
      showAboutPage();
    });
  }

  if (navLinkCakes) {
    navLinkCakes.addEventListener('click', (e) => {
      e.preventDefault();
      showCakesPage();
    });
  }

  // 导航栏心形图标的点击由 wishlist.js 中的 initWishlist 处理，它会调用 showWishlistPage
  // 所以这里不需要为导航栏心形图标单独添加监听器来显示页面

  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showNewHomepage();
    });
  }

  navLinks.forEach(link => {
    // 排除已经有特定处理的链接/按钮 和 打开搜索的按钮
    const id = link.id || (link.parentElement && link.parentElement.id);
    if (id !== 'nav-link-about' && id !== 'nav-link-cakes' && 
        id !== 'open-search-btn' && !link.classList.contains('wishlist-toggle-icon') && 
        id !== 'logo-btn' && link.closest('.nav-icons') === null) { 
      link.addEventListener('click', (e) => {
          e.preventDefault();
          showNewHomepage(); // 其他导航链接（如Shop, Gelato）都导向新主页
      });
    }
  });
} 