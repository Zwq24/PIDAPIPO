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
  // 检测设备类型
  if (window.innerWidth <= 768) {
    // 移动设备，显示移动端首页
    showMobileHomePage();
    return;
  }

  // 桌面设备，显示桌面端首页
  hideAllPages();
  const homepageElement = document.getElementById('new-homepage-content');
  if (homepageElement) {
    homepageElement.style.display = 'block';
    homepageElement.classList.remove('hidden-page');
    console.log("显示桌面端主页");
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
    const paymentPageElement = document.getElementById('payment-page-content'); // 获取元素
    if (paymentPageElement) {
        paymentPageElement.style.display = 'flex'; 
        paymentPageElement.classList.remove('hidden-page'); // 移除 hidden-page 类
    } else {
        console.error('Payment page element not found!');
        return; // 如果元素未找到，则提前返回
    }
    setActivePage('payment');
    
    // 根据购物车总额更新支付页面金额
    if (typeof calculateCartTotal === 'function') {
        const totals = calculateCartTotal();
        const subtotalEl = document.getElementById('payment-subtotal');
        const totalEl = document.getElementById('payment-total');
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    } else if (typeof calculateWishlistTotals === 'function') {
        // 兼容从心愿单进入支付页面的情况
        const totals = calculateWishlistTotals(); 
        const subtotalEl = document.getElementById('payment-subtotal');
        const totalEl = document.getElementById('payment-total');
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    } else {
        console.error('购物车或心愿单计算函数未定义');
    }

    const paymentBackBtn = document.getElementById('payment-back-btn');
    if (paymentBackBtn && !paymentBackBtn._clickHandlerAttached) {
        const newPaymentBackHandler = (e) => { 
            e.preventDefault();
            
            // 根据前一页面返回
            const currentPage = document.body.dataset.currentPage || 'payment';
            if (currentPage === 'mobileCart') {
                showCartPage(); // 从移动端购物车进入的，返回移动端购物车
            } else if (currentPage === 'cart') {
                showCartPage(); // 从桌面端购物车进入的，返回桌面端购物车
            } else {
                showWishlistPage(); // 默认返回心愿单页面
            }
        };
        paymentBackBtn.addEventListener('click', newPaymentBackHandler);
        paymentBackBtn._clickHandlerAttached = true;
    }

    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn && !placeOrderBtn._clickHandlerAttached) {
        placeOrderBtn.addEventListener('click', () => {
            // 清空购物车
            if (typeof cartItems !== 'undefined') {
                cartItems = [];
                if (typeof saveCartToLocalStorage === 'function') {
                    saveCartToLocalStorage();
                }
                if (typeof updateCartIcon === 'function') {
                    updateCartIcon();
                }
            }
            
            // 清空心愿单（兼容从心愿单进入的情况）
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
        thankYouPage.classList.remove('hidden-page');
    }
    setActivePage('thankYou');
    document.body.style.overflow = 'auto';

    // 更新主要笑脸图标为图片
    const mainSuccessIcon = document.querySelector('.main-success-icon');
    if (mainSuccessIcon) {
        // 检查是否已经包含图片
        if (!mainSuccessIcon.querySelector('img')) {
            mainSuccessIcon.innerHTML = ''; // 清除文本内容
            const img = document.createElement('img');
            img.src = 'mobile_images/image 30.png'; // 使用中间(满意)的表情
            img.alt = '笑脸';
            mainSuccessIcon.appendChild(img);
        }
    }

    // 更新表情选项
    const emojisContainer = document.querySelector('.satisfaction-emojis');
    if (emojisContainer) {
        // 检查是否已经包含图片
        if (!emojisContainer.querySelector('img')) {
            // 清空现有内容
            emojisContainer.innerHTML = '';
            
            // 创建5个表情图片
            const emojiImages = [
                { src: 'mobile_images/image 28.png', rating: 5, alt: '非常满意' },
                { src: 'mobile_images/image 29.png', rating: 4, alt: '满意' },
                { src: 'mobile_images/image 30.png', rating: 3, alt: '一般' },
                { src: 'mobile_images/image 31.png', rating: 2, alt: '不满意' },
                { src: 'mobile_images/image 32.png', rating: 1, alt: '非常不满意' }
            ];
            
            emojiImages.forEach(emoji => {
                const emojiOption = document.createElement('span');
                emojiOption.className = 'emoji-option';
                emojiOption.dataset.rating = emoji.rating;
                
                const img = document.createElement('img');
                img.src = emoji.src;
                img.alt = emoji.alt;
                
                emojiOption.appendChild(img);
                emojisContainer.appendChild(emojiOption);
            });
        }
    }

    const backHomeBtn = document.getElementById('thank-you-back-home-btn');
    if (backHomeBtn && !backHomeBtn._clickHandlerAttachedThankYouHome) {
        backHomeBtn.addEventListener('click', () => {
            // 根据设备类型选择正确的首页
            if (window.innerWidth <= 768) {
                showMobileHomePage();
            } else {
                showNewHomepage();
            }
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
            alert('查看订单功能暂未实现，将返回首页');
            showNewHomepage();
        });
        viewOrderBtn._clickHandlerAttachedThankYouView = true;
    }
    
    const emojis = document.querySelectorAll('#thank-you-page-content .emoji-option');
    emojis.forEach(emoji => {
        if (!emoji._emojiClickHandlerAttached) {
            emoji.addEventListener('click', function() {
                emojis.forEach(em => em.classList.remove('selected'));
                this.classList.add('selected');
                console.log('用户满意度评分:', this.dataset.rating);
            });
            emoji._emojiClickHandlerAttached = true;
        }
    });

    window.scrollTo(0, 0);
}

function goBackToPreviousPageOrHomepage() {
    const pageToGo = previousPage || 'newHomepage'; 
    console.log("Going back. Previous page was:", previousPage, "Navigating to:", pageToGo);
    
    // 如果pageToGo是newHomepage且在移动设备上，则显示mobileHome
    if (pageToGo === 'newHomepage' && window.innerWidth <= 768) {
        showMobileHomePage();
        return;
    }
    
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
        case 'mobileCart': showMobileHomePage(); break;
        default: 
            // 如果是移动设备但没有找到对应页面，则返回移动端主页
            if (window.innerWidth <= 768) {
                showMobileHomePage();
            } else {
                showNewHomepage();
            }
            break;
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
        mobileMainAppView.classList.remove('hidden-page'); // 确保移除hidden-page类
        // 显示主页的所有部分
        const sections = mobileMainAppView.querySelectorAll(':scope > section');
        sections.forEach(sec => sec.classList.remove('hidden'));
        console.log("显示移动端主页");
        
        // 确保底部导航栏显示
        const mobileBottomNav = document.querySelector('.mobile-bottom-nav');
        if (mobileBottomNav) {
            mobileBottomNav.style.display = 'flex';
        }
    } else {
        console.error("移动端主页元素不存在");
        // 如果移动端主页不存在，回退到桌面端主页
        showNewHomepage();
        return;
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
    
    // 渲染购物车内容 - 同时更新桌面端和移动端
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
    
    if (typeof renderMobileCartPage === 'function') {
        renderMobileCartPage();
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
            // 直接返回移动端主页，而不是使用goBackToPreviousPageOrHomepage
            if (window.innerWidth <= 768) {
                showMobileHomePage();
            } else {
                goBackToPreviousPageOrHomepage();
            }
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
            if (typeof showPaymentPage === 'function') {
                showPaymentPage();
            } else {
                console.error('showPaymentPage function is not defined');
                alert('结账功能暂未实现');
            }
        });
        checkoutBtn._clickHandlerAttached = true;
    }
    
    // 设置移动端结账按钮事件监听
    const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
    if (mobileCheckoutBtn && !mobileCheckoutBtn._clickHandlerAttached) {
        mobileCheckoutBtn.addEventListener('click', () => {
            if (typeof showPaymentPage === 'function') {
                showPaymentPage();
            } else {
                console.error('showPaymentPage function is not defined');
                alert('结账功能暂未实现');
            }
        });
        mobileCheckoutBtn._clickHandlerAttached = true;
    }
    
    window.scrollTo(0, 0);
} 