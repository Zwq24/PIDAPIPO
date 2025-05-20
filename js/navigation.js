// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// 记录导航到PDP或Wishlist之前的页面，方便返回
let previousPage = 'newHomepage'; // 默认为新主页
const VALID_PAGE_IDS = ['newHomepage', 'about', 'cakes', 'productDetail', 'wishlist', 'payment', 'thankYou', 'mobileHome', 'mobileCakes'];

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
    // Desktop Pages - 使用较强的隐藏方式
    const pages = [
        'new-homepage-content',
        'about-page-content',
        'product-detail-page',
        'cakes-page-content',
        'wishlist-page-content',
        'payment-page-content',
        'thank-you-page-content'
    ];
    
    // 强制隐藏所有页面
    pages.forEach(pageId => {
        const element = document.getElementById(pageId);
        if (element) {
            element.style.display = 'none';
            // 添加隐藏类以确保彻底隐藏
            element.classList.add('hidden-page');
        }
    });

    // Mobile Page Containers
    const mobileMainAppView = document.getElementById('mobile-main-app-view');
    const mobileCakesPageContent = document.getElementById('mobile-cakes-page-content');
    // Add other mobile page containers here if they exist, e.g., mobile-about-page, mobile-product-detail etc.

    if (mobileMainAppView) {
        // Hide all direct section children of mobile-main-app-view
        const sections = mobileMainAppView.querySelectorAll(':scope > section');
        sections.forEach(sec => sec.classList.add('hidden')); // Use class for main mobile sections
        mobileMainAppView.style.display = 'none'; // Also hide the container itself
    }
    if (mobileCakesPageContent) {
        mobileCakesPageContent.style.display = 'none';
    }

    // 确保关闭侧边菜单
    const mobileSideMenu = document.getElementById('mobile-side-menu');
    if (mobileSideMenu && mobileSideMenu.classList.contains('open')) {
        mobileSideMenu.classList.remove('open');
    }

    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) pageWrapper.style.display = 'flex'; // 通常 pageWrapper 保持 flex
    document.body.style.overflow = ''; // 恢复默认滚动
    document.body.classList.remove('product-detail-active', 'mobile-menu-open'); // Remove any global state classes
}

function showNewHomepage() {
  hideAllPages();
  const homepageElement = document.getElementById('new-homepage-content');
  if (homepageElement) {
    homepageElement.style.display = 'block';
    homepageElement.classList.remove('hidden-page');
    console.log("显示主页");
  }
  setActivePage('newHomepage');
  window.scrollTo(0, 0);
}

function showAboutPage() {
  hideAllPages();
  const aboutElement = document.getElementById('about-page-content');
  if (aboutElement) {
    aboutElement.style.display = 'block';
    aboutElement.classList.remove('hidden-page');
    console.log("显示About页面");
  }
  setActivePage('about');
  if (typeof initializeAboutPageSlider === 'function') initializeAboutPageSlider();
  window.scrollTo(0, 0);
}

function showCakesPage() {
  hideAllPages();
  const cakesElement = document.getElementById('cakes-page-content');
  if (cakesElement) {
    cakesElement.style.display = 'block';
    cakesElement.classList.remove('hidden-page');
    console.log("显示Cakes页面");
  }
  setActivePage('cakes');
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

function showPaymentPage() {
    hideAllPages();
    document.getElementById('payment-page-content').style.display = 'flex'; 
    setActivePage('payment');
    
    if (typeof calculateWishlistTotals === 'function') {
        const totals = calculateWishlistTotals(); 
        const subtotalEl = document.getElementById('payment-subtotal');
        const totalEl = document.getElementById('payment-total');
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`; 
    } else {
        console.error('calculateWishlistTotals function is not defined. Check wishlist.js');
    }

    const paymentBackBtn = document.getElementById('payment-back-btn');
    if (paymentBackBtn && !paymentBackBtn._clickHandlerAttached) {
        const newPaymentBackHandler = (e) => { 
            e.preventDefault(); 
            showWishlistPage(); 
        };
        paymentBackBtn.addEventListener('click', newPaymentBackHandler);
        paymentBackBtn._clickHandlerAttached = true;
    }

    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn && !placeOrderBtn._clickHandlerAttached) {
        placeOrderBtn.addEventListener('click', () => {
            if (typeof wishlistItems !== 'undefined') { 
              wishlistItems = []; 
            }
            if (typeof renderWishlistPage === 'function') renderWishlistPage(); 
            if (typeof updateAllWishlistIcons === 'function') updateAllWishlistIcons(); 
            
            showThankYouPage();
        });
        placeOrderBtn._clickHandlerAttached = true;
    }
    
    const paymentOptions = document.querySelectorAll('#payment-page-content .payment-option');
    paymentOptions.forEach(option => {
        if (!option._paymentOptionClickHandlerAttached) {
            option.addEventListener('click', function() {
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
            option._paymentOptionClickHandlerAttached = true; 
        }
    });

    window.scrollTo(0, 0);
}

// Revised showThankYouPage function
function showThankYouPage() {
    hideAllPages();
    const thankYouPage = document.getElementById('thank-you-page-content');
    if (thankYouPage) {
        thankYouPage.style.display = 'flex'; 
    }
    setActivePage('thankYou');
    document.body.style.overflow = 'auto';

    const backHomeBtn = document.getElementById('thank-you-back-home-btn');
    if (backHomeBtn && !backHomeBtn._clickHandlerAttachedThankYouHome) {
        backHomeBtn.addEventListener('click', () => {
            showNewHomepage();
        });
        backHomeBtn._clickHandlerAttachedThankYouHome = true;
    }

    const backArrowBtn = document.getElementById('thank-you-back-arrow-btn');
    if (backArrowBtn && !backArrowBtn._clickHandlerAttachedThankYouBack) {
        backArrowBtn.addEventListener('click', () => {
            goBackToPreviousPageOrHomepage();
        });
        backArrowBtn._clickHandlerAttachedThankYouBack = true;
    }

    const viewOrderBtn = document.getElementById('thank-you-view-order-btn');
    if (viewOrderBtn && !viewOrderBtn._clickHandlerAttachedThankYouView) {
        viewOrderBtn.addEventListener('click', () => {
            alert('"View Order" functionality is not yet implemented. Returning to homepage.');
            showNewHomepage();
        });
        viewOrderBtn._clickHandlerAttachedThankYouView = true;
    }
    
    const emojis = document.querySelectorAll('#thank-you-page-content .emoji-option');
    emojis.forEach(emoji => {
        if (!emoji._emojiClickHandlerAttached) {
            emoji.addEventListener('click', function() {
                emojis.forEach(em => em.classList.remove('selected-emoji'));
                this.classList.add('selected-emoji');
                console.log('Satisfaction rating:', this.dataset.rating);
            });
            emoji._emojiClickHandlerAttached = true;
        }
    });

    window.scrollTo(0, 0);
}

function goBackToPreviousPageOrHomepage() {
    const pageToGo = previousPage || 'newHomepage'; 
    console.log("Going back. Previous page was:", previousPage, "Navigating to:", pageToGo);
    switch (pageToGo) {
        case 'newHomepage': showNewHomepage(); break;
        case 'about': showAboutPage(); break;
        case 'cakes': showCakesPage(); break;
        case 'wishlist': showWishlistPage(); break;
        case 'productDetail': 
             showNewHomepage(); 
             break;
        case 'payment': showPaymentPage(); break;
        case 'thankYou': showNewHomepage(); break;
        default: showNewHomepage(); break;
    }
}

function setupNavigationListeners() {
  // 使用最可靠的查询方式获取导航元素
  const navMenu = document.querySelector('.nav-menu');
  const logoBtn = document.querySelector('.logo');
  
  // Logo 点击 => 主页
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      console.log("Logo clicked");
      e.preventDefault();
      showNewHomepage();
    });
  }

  // 确保navMenu存在
  if (navMenu) {
    // 获取所有导航项
    const allNavLinks = navMenu.querySelectorAll('li');
    
    // 为每个导航项绑定事件
    allNavLinks.forEach(link => {
      const linkText = link.textContent.trim().toLowerCase();
      
      link.addEventListener('click', (e) => {
        console.log(`Nav link clicked: ${linkText}`);
        e.preventDefault();
        
        // 根据链接文本确定导航目标
        if (linkText === 'about') {
          showAboutPage();
        } else if (linkText === 'cakes') {
          showCakesPage();
        } else if (linkText === 'shop') {
          showNewHomepage();
        } else {
          // 其他链接默认显示主页或执行其他操作
          console.log(`Navigation to ${linkText} not yet implemented`);
          showNewHomepage();
        }
      });
    });
  } else {
    console.error("Navigation menu not found");
  }
} 