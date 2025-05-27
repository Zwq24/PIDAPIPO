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
                showCartPage(); // 始终返回购物车页面，不再返回心愿单
            }
        };
        paymentBackBtn.addEventListener('click', newPaymentBackHandler);
        paymentBackBtn._clickHandlerAttached = true;
    }

    // 设置Edit按钮点击事件
    const editCardBtn = document.querySelector('.edit-card-btn');
    if (editCardBtn && !editCardBtn._clickHandlerAttached) {
        editCardBtn.addEventListener('click', function() {
            const creditCardForm = document.querySelector('.credit-card-form');
            if (creditCardForm) {
                creditCardForm.classList.toggle('active');
                this.textContent = creditCardForm.classList.contains('active') ? 'Cancel' : 'Edit';
            }
        });
        editCardBtn._clickHandlerAttached = true;
    }
    
    // 设置下单按钮逻辑
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn && !placeOrderBtn._clickHandlerAttached) {
        placeOrderBtn.addEventListener('click', function(e) {
            const creditCardOption = document.querySelector('.payment-option[data-method="creditcard"]');
            const creditCardForm = document.querySelector('.credit-card-form');

            // 检查是否选择了信用卡支付，并且表单处于激活（编辑）状态
            if (creditCardOption && creditCardOption.classList.contains('selected') && 
                creditCardForm && creditCardForm.classList.contains('active')) {
                // 如果表单无效，则阻止默认行为并返回，停留在支付页面
                if (!isCreditCardFormValid()) {
                    e.preventDefault(); // 阻止任何可能的后续跳转或提交
                    return; // 停留在当前页面让用户修改
                }
            }
            
            // 如果是Apple Pay或其他非信用卡支付，或信用卡验证通过（或未使用表单），则继续支付流程
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
            
            // 跳转到感谢页面
            showThankYouPage();
        });
        placeOrderBtn._clickHandlerAttached = true;
    }
    
    // 设置支付方式选择事件监听
    const paymentOptions = document.querySelectorAll('#payment-page-content .payment-option');
    paymentOptions.forEach(option => {
        if (!option._paymentOptionClickHandlerAttached) {
            option.addEventListener('click', function() {
                // 移除所有选择
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                // 添加当前选择
                this.classList.add('selected');
                
                // 处理信用卡表单显示/隐藏
                const creditCardForm = document.querySelector('.credit-card-form');
                const editCardBtn = document.querySelector('.edit-card-btn');
                
                if (creditCardForm) {
                    // 如果选择了非信用卡方式，隐藏表单和编辑按钮
                    if (this.dataset.method !== 'creditcard') {
                        creditCardForm.classList.remove('active');
                        if (editCardBtn) editCardBtn.style.display = 'none';
                    } else {
                        // 如果选择了信用卡，显示编辑按钮
                        if (editCardBtn) editCardBtn.style.display = 'inline-block';
                    }
                }
            });
            option._paymentOptionClickHandlerAttached = true; 
        }
    });
    
    // 设置信用卡表单验证
    setupCreditCardFormValidation();

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
            img.src = 'mobile_images/image 28.png'; // 使用最满意的表情
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
    console.log('=== 显示移动端About页面 (滑动版) ===');
    
    hideAllPages();
    
    const oldAboutPage = document.getElementById('emergency-about-page');
    if (oldAboutPage) {
        document.body.removeChild(oldAboutPage);
        console.log('移除旧的独立About页面');
    }
    
    const images = [
        'mobile_images/Rectangle 110 (1).jpg',
        'mobile_images/Rectangle 114.jpg',
        'mobile_images/Rectangle 114 (1).jpg',
        'mobile_images/Rectangle 114 (2).jpg'
    ];
    let currentImageIndex = 3; // 默认显示第4张图片
    
    const emergencyAboutPage = document.createElement('div');
    emergencyAboutPage.id = 'emergency-about-page';
    
    const pageStyle = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: #EAE4DD; z-index: 9999; overflow-y: auto;
        display: flex; flex-direction: column; padding: 0; margin: 0;
        box-sizing: border-box; font-family: 'Poppins', sans-serif;
        -webkit-overflow-scrolling: touch;
    `;
    emergencyAboutPage.style.cssText = pageStyle;

    // --- 头部 --- (保持不变)
    const headerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background-color: #EAE4DD; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <button id="emergency-back-btn" style="width: 30px; height: 30px; background: none; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <img src="mobile_images/back-arrow@2X 1 (1).png" alt="返回" style="width: 100%; height: 100%;">
            </button>
            <h1 style="margin: 0; font-size: 22px; color: #000; font-family: 'Playfair Display SC', serif;">ABOUT</h1>
            <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                <img src="mobile_images/location.svg" alt="位置" style="width: 24px; height: 24px;">
            </div>
        </div>
    `;

    // --- 图片轮播区域 (重构以支持滑动) ---
    let imageStripHTML = '';
    images.forEach(src => {
        imageStripHTML += `
            <div class="slide-item" style="
                flex: 0 0 100%; 
                width: 100%; 
                height: 180px; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                overflow: hidden;
                background-color: #F5F5F5;
                position: relative;
            ">
                <img src="${src}" alt="About Image" style="
                    max-width: 100%; 
                    max-height: 100%; 
                    width: auto;
                    height: auto;
                    object-fit: contain;
                    display: block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                ">
            </div>
        `;
    });

    const imageSliderHTML = `
        <div id="image-slider-viewport" style="
            width: 100%; 
            height: 180px; 
            margin: 0; 
            overflow: hidden; 
            position: relative;
            background-color: #F5F5F5;
            display: flex;
            align-items: center;
        ">
            <div id="image-strip" style="
                display: flex; 
                width: ${images.length * 100}%; 
                height: 180px; 
                transition: transform 0.5s ease-in-out;
                align-items: center;
            ">
                ${imageStripHTML}
            </div>
        </div>
    `;

    // --- 分页按钮 --- (保持不变)
    const paginationHTML = `
        <div style="display: flex; justify-content: center; gap: 10px; margin: 10px 0; padding: 5px 0;">
            ${images.map((_, index) => `<button id="page-btn-${index}" class="about-page-btn" data-index="${index}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #000; background: ${index === currentImageIndex ? '#000' : 'none'}; color: ${index === currentImageIndex ? '#fff' : '#000'}; padding: 0; cursor: pointer;">${index + 1}</button>`).join('')}
        </div>
    `;

    // --- 主要内容和页脚区域 --- (保持不变)
    const contentHTML = `
        <div style="padding: 15px; background-color: #EAE4DD; flex: 1;">
            <h2 style="text-align: center; margin-bottom: 10px; color: #000; font-family: 'Playfair Display SC', serif; font-size: 20px;">PIDAPIPO EASTER 2025</h2>
            <p style="text-align: center; margin-bottom: 15px; color: #666; font-size: 12px;">Friday 28th March Chocolate, Events, Loves, News</p>
            <div style="font-size: 14px; line-height: 1.5; color: #333;">
                <p style="margin-bottom: 15px;">Since launching its Cioccolato range in 2022, Pidapipo has become the go-to for artisan chocolate, and its Easter eggs are no different. This Easter Pidapipo will offer a range of artisan chocolate eggs made with Pidapipo single origin cacao, all handmade in the Fitzroy Laboratorio. Bags containing a mix of dark and milk chocolate eggs (three of each), perfect as a gift, for an Easter egg hunt, or of course, indulging for one.</p>
                <p style="margin-bottom: 15px;">For those who want to surprise and delight their loved ones this Easter, Pidapipo's large Easter egg is the way to go, with handmade and wrapped mini chocolate eggs and a mystery gift inside. Available in both dark and milk chocolate, it's a classic gifting choice this season.</p>
                <p style="margin-bottom: 15px;">Pidapipo's best-selling tins with praline filled-chocolates are also making a comeback. Encasing a trio of flavours, the selection includes dark chocolate filled with white chocolate peppermint ganache; milk chocolate filled with caramel and malt crumble; and white chocolate with white chocolate and hazelnut ganache.</p>
                <p style="margin-bottom: 15px;">It wouldn't be a Pidapipo Easter without Gelato, and on offer at all stores is a variety of chocolate-focussed Gelato cones inspired by the flavour trio in Pidapipo's mini eggs tin. Served in a waffle cone and dipped in chocolate, three indulgent flavours include peppermint chocolate Gelato with white chocolate fudge, covered in dark chocolate shards; white chocolate bacio Gelato with Nutella swirl, coated in hazelnut merengue; and malted milk chocolate Gelato with caramel swirl, dipped in milk chocolate.</p>
            </div>
        </div>
    `;
    const footerHTML = `
        <div style="padding: 20px 15px; margin-top: 10px; background-color: #D5CCC6;">
            <p style="font-family: 'Poppins', sans-serif; font-size: 10px; text-align: center; margin: 0; color: #333;">PIDAPIPO ACKNOWLEDGES THE WUEUND JERI PEOPLE OF THE KULIN NATION,THE TRADITIONAL CUSTODIANS OF THIS LAND, AND PAY OUR RESPECT TO THE WURUND ELDERS, PAST, PRESENT, AND EMERGING.</p>
        </div>
    `;

    emergencyAboutPage.innerHTML = headerHTML + imageSliderHTML + paginationHTML + contentHTML + footerHTML;
    document.body.appendChild(emergencyAboutPage);
    console.log('✅ 独立About页面(滑动版)创建成功');

    const backBtn = document.getElementById('emergency-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            document.body.removeChild(emergencyAboutPage);
            showMobileHomePage();
        });
    }

    const imageStrip = document.getElementById('image-strip');
    const pageButtons = document.querySelectorAll('.about-page-btn');

    // 初始化第一张图片的位置
    if (imageStrip) {
        imageStrip.style.transform = `translateX(-${currentImageIndex * 100}%)`;
    }

    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newIndex = parseInt(this.dataset.index);
            if (newIndex === currentImageIndex) return; 

            currentImageIndex = newIndex;
            if (imageStrip) {
                imageStrip.style.transform = `translateX(-${currentImageIndex * 100}%)`;
            }

            pageButtons.forEach(btn => {
                const btnIndex = parseInt(btn.dataset.index);
                btn.style.background = btnIndex === currentImageIndex ? '#000' : 'none';
                btn.style.color = btnIndex === currentImageIndex ? '#fff' : '#000';
            });
            console.log(`切换到图片 ${currentImageIndex + 1}`);
        });
    });
    
    // 强制确保图片容器和图片可见性
    setTimeout(() => {
        const viewport = document.getElementById('image-slider-viewport');
        const strip = document.getElementById('image-strip');
        const allImages = document.querySelectorAll('#image-strip img');
        
        if (viewport) {
            viewport.style.display = 'flex';
            viewport.style.visibility = 'visible';
            viewport.style.opacity = '1';
            viewport.style.minHeight = '180px';
            console.log('强制显示轮播容器');
        }
        
        if (strip) {
            strip.style.display = 'flex';
            strip.style.visibility = 'visible';
            strip.style.opacity = '1';
            console.log('强制显示图片条');
        }
        
        allImages.forEach((img, index) => {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.minWidth = '50px';
            img.style.minHeight = '50px';
            
            // 添加图片加载监听
            img.onload = function() {
                console.log(`图片 ${index + 1} 加载成功`);
                this.style.display = 'block';
                this.style.visibility = 'visible';
            };
            
            img.onerror = function() {
                console.log(`图片 ${index + 1} 加载失败，使用备用图片`);
                this.src = 'mobile_images/image (22).png';
            };
        });
        
        console.log('强制显示所有图片元素');
    }, 100);
    
    setActivePage('mobileAbout');
    console.log('=== 独立About页面(滑动版)显示完成 ===');
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
            // 使用goBackToPreviousPageOrHomepage函数确定上一页
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

// 新增：信用卡表单验证辅助函数
function isCreditCardFormValid() {
    const cardNumberInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');

    if (!cardNumberInput || !cardHolderInput || !expiryDateInput || !cvvInput) {
        console.error("Credit card form elements not found for validation.");
        alert('An error occurred. Please try refreshing the page.');
        return false;
    }

    const cardNumber = cardNumberInput.value;
    const cardHolder = cardHolderInput.value;
    const expiryDate = expiryDateInput.value;
    const cvv = cvvInput.value;

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        alert('Please enter a valid 16-digit card number.');
        return false;
    }
    if (!cardHolder || cardHolder.trim() === '') {
        alert('Please enter the card holder\'s name.');
        return false;
    }
    if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter a valid expiry date in MM/YY format.');
        return false;
    }
    if (!cvv || cvv.length < 3) { // Assuming CVV is typically 3 digits
        alert('Please enter a valid 3-digit security code (CVV).');
        return false;
    }
    return true;
}

// 修改后的 setupCreditCardFormValidation 函数
function setupCreditCardFormValidation() {
    const cardNumberInput = document.getElementById('card-number');
    const cardHolderInput = document.getElementById('card-holder'); 
    const expiryDateInput = document.getElementById('expiry-date');
    const cvvInput = document.getElementById('cvv');
    
    if (!cardNumberInput || !cardHolderInput || !expiryDateInput || !cvvInput) {
        console.warn("One or more credit card input fields are missing. Skipping input formatting.");
        return;
    }
    
    cardNumberInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        let formattedValue = '';
        for (let i = 0; i < value.length; i++) {
            if (i > 0 && i % 4 === 0) {
                formattedValue += ' ';
            }
            formattedValue += value[i];
        }
        this.value = formattedValue;
    });
    
    expiryDateInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 2) {
            this.value = value.substring(0, 2) + '/' + value.substring(2);
        } else {
            this.value = value;
        }
    });
    
    cvvInput.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '');
    });
} 