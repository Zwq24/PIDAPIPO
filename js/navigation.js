// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// 记录导航到PDP或Wishlist之前的页面，方便返回
let previousPage = 'newHomepage'; // 默认为新主页
const VALID_PAGE_IDS = ['newHomepage', 'about', 'cakes', 'productDetail', 'wishlist', 'payment', 'thankYou'];

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
    document.getElementById('payment-page-content').style.display = 'none'; 
    document.getElementById('thank-you-page-content').style.display = 'none';
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
  const logoBtn = document.getElementById('logo-btn');
  const navLinkAbout = document.getElementById('nav-link-about');
  const navLinkCakes = document.getElementById('nav-link-cakes');
  const navLinks = document.querySelectorAll('.nav-menu li a, .nav-menu button');

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

  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showNewHomepage();
    });
  }

  navLinks.forEach(link => {
    const id = link.id || (link.parentElement && link.parentElement.id);
    if (id !== 'nav-link-about' && id !== 'nav-link-cakes' && 
        id !== 'open-search-btn' && !link.classList.contains('wishlist-toggle-icon') && 
        id !== 'logo-btn' && link.closest('.nav-icons') === null) { 
      link.addEventListener('click', (e) => {
          e.preventDefault();
          showNewHomepage(); 
      });
    }
  });
} 