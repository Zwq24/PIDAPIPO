// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// 记录导航到PDP或Wishlist之前的页面，方便返回
let previousPage = 'newHomepage'; // 默认为新主页
const VALID_PAGE_IDS = ['newHomepage', 'about', 'cakes', 'productDetail', 'wishlist', 'payment', 'thankYou', 'mobileHome', 'mobileCakes', 'mobileAbout', 'cart', 'mobileCart'];

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
        'thank-you-page-content',
        'cart-page-content'
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
    const mobileAboutPageContent = document.getElementById('mobile-about-page-content');
    const mobileCartPageContent = document.getElementById('mobile-cart-page-content');
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
    if (mobileAboutPageContent) {
        mobileAboutPageContent.style.display = 'none';
    }
    if (mobileCartPageContent) {
        mobileCartPageContent.style.display = 'none';
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
        case 'mobileHome': showMobileHomePage(); break;
        case 'mobileCakes': 
            const mobileCakesPage = document.getElementById('mobile-cakes-page-content');
            if (mobileCakesPage) {
                hideAllPages();
                mobileCakesPage.style.display = 'flex';
            } else {
                showMobileHomePage();
            }
            break;
        case 'mobileAbout': showMobileAboutPage(); break;
        case 'cart': showCartPage(); break;
        case 'mobileCart': showCartPage(); break;
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

// 新增：显示移动端About页面的函数
function showMobileAboutPage() {
    hideAllPages();
    const mobileAboutElement = document.getElementById('mobile-about-page-content');
    if (mobileAboutElement) {
        mobileAboutElement.style.display = 'flex';
        console.log("显示移动端About页面");
    }
    setActivePage('mobileAbout');
    
    // 初始化移动端About页面的图片轮播
    initializeMobileAboutPageSlider();
    
    // 设置返回按钮事件
    const mobileAboutBackBtn = document.querySelector('.mobile-about-back-btn');
    if (mobileAboutBackBtn && !mobileAboutBackBtn._clickHandlerAttached) {
        mobileAboutBackBtn.addEventListener('click', () => {
            showMobileHomePage();
        });
        mobileAboutBackBtn._clickHandlerAttached = true;
    }
    
    window.scrollTo(0, 0);
}

// 初始化移动端About页面的图片轮播
function initializeMobileAboutPageSlider() {
    const mobilePageContainer = document.getElementById('mobile-page-container');
    const mobilePageBtns = document.querySelectorAll('.mobile-page-btn');
    
    if (!mobilePageContainer || mobilePageBtns.length === 0) {
        console.error('移动端About页面的轮播元素未找到');
        return;
    }
    
    // 图片数据（使用移动端的图片）
    const slidesData = [
        { src: 'mobile_images/Rectangle 110 (1).jpg', alt: 'Easter Eggs 1' },
        { src: 'mobile_images/Rectangle 114.jpg', alt: 'Easter Eggs 2' },
        { src: 'mobile_images/Rectangle 114 (1).jpg', alt: 'Easter Eggs 3' },
        { src: 'mobile_images/Rectangle 114 (2).jpg', alt: 'Easter Eggs 4' },
    ];
    
    // 清空容器
    mobilePageContainer.innerHTML = '';
    
    // 添加初始图片 - 使用第4张图片(index为3)
    const initialPage = 3; // 设计稿显示第4张图片被激活
    const img = document.createElement('img');
    img.src = slidesData[initialPage].src;
    img.alt = slidesData[initialPage].alt;
    mobilePageContainer.appendChild(img);
    
    // 设置初始活动按钮
    mobilePageBtns.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.page) === initialPage) {
            btn.classList.add('active');
        }
        
        // 添加点击事件
        btn.addEventListener('click', function() {
            const pageIndex = parseInt(this.dataset.page);
            
            // 更新图片
            mobilePageContainer.innerHTML = '';
            const newImg = document.createElement('img');
            newImg.src = slidesData[pageIndex].src;
            newImg.alt = slidesData[pageIndex].alt;
            mobilePageContainer.appendChild(newImg);
            
            // 更新按钮状态
            mobilePageBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 显示移动端主页的函数
function showMobileHomePage() {
    hideAllPages();
    const mobileMainAppView = document.getElementById('mobile-main-app-view');
    if (mobileMainAppView) {
        mobileMainAppView.style.display = 'flex';
        // 显示主页的所有部分
        const sections = mobileMainAppView.querySelectorAll(':scope > section');
        sections.forEach(sec => sec.classList.remove('hidden'));
        console.log("显示移动端主页");
    }
    setActivePage('mobileHome');
    window.scrollTo(0, 0);
}

// 显示购物车页面
function showCartPage() {
    hideAllPages();
    
    // 检测设备类型
    if (window.innerWidth <= 768) {
        // 移动端
        const mobileCartPage = document.getElementById('mobile-cart-page-content');
        if (mobileCartPage) {
            mobileCartPage.style.display = 'flex';
            console.log("显示移动端购物车页面");
            setActivePage('mobileCart');
        }
    } else {
        // 桌面端
        const cartPage = document.getElementById('cart-page-content');
        if (cartPage) {
            cartPage.style.display = 'block';
            cartPage.classList.remove('hidden-page');
            console.log("显示桌面端购物车页面");
            setActivePage('cart');
        }
    }
    
    // 渲染购物车内容
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
    
    // 设置返回按钮事件监听
    const cartBackBtn = document.getElementById('cart-back-btn');
    if (cartBackBtn && !cartBackBtn._clickHandlerAttached) {
        cartBackBtn.addEventListener('click', () => {
            goBackToPreviousPageOrHomepage();
        });
        cartBackBtn._clickHandlerAttached = true;
    }
    
    // 设置移动端返回按钮事件监听
    const mobileCartBackBtn = document.querySelector('.mobile-cart-back-btn');
    if (mobileCartBackBtn && !mobileCartBackBtn._clickHandlerAttached) {
        mobileCartBackBtn.addEventListener('click', () => {
            goBackToPreviousPageOrHomepage();
        });
        mobileCartBackBtn._clickHandlerAttached = true;
    }
    
    // 设置继续购物按钮事件监听
    const continueShoppingBtn = document.querySelector('.cart-continue-shopping-btn');
    if (continueShoppingBtn && !continueShoppingBtn._clickHandlerAttached) {
        continueShoppingBtn.addEventListener('click', () => {
            showNewHomepage();
        });
        continueShoppingBtn._clickHandlerAttached = true;
    }
    
    // 设置结账按钮事件监听
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn && !checkoutBtn._clickHandlerAttached) {
        checkoutBtn.addEventListener('click', () => {
            alert('结账功能暂未实现');
        });
        checkoutBtn._clickHandlerAttached = true;
    }
    
    // 设置移动端结账按钮事件监听
    const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
    if (mobileCheckoutBtn && !mobileCheckoutBtn._clickHandlerAttached) {
        mobileCheckoutBtn.addEventListener('click', () => {
            alert('结账功能暂未实现');
        });
        mobileCheckoutBtn._clickHandlerAttached = true;
    }
    
    window.scrollTo(0, 0);
} 