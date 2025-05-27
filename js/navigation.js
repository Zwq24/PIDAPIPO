// js/navigation.js
// Handle navigation-related logic (such as About page switching, Logo click to return to homepage, etc.)

// Record the page before navigating to PDP or Wishlist, for easy return
let previousPage = 'newHomepage'; // Default to new homepage
const VALID_PAGE_IDS = ['newHomepage', 'about', 'cakes', 'productDetail', 'wishlist', 'payment', 'thankYou', 'mobileHome', 'mobileCakes', 'mobileAbout', 'cart', 'mobileCart'];

// --- Page State Management and Navigation --- //
function setActivePage(pageId) {
    // Record the current page ID before switching to new page
    const currentPage = document.body.dataset.currentPage || 'newHomepage'; 
    if (VALID_PAGE_IDS.includes(currentPage) && currentPage !== pageId) {
        previousPage = currentPage;
        console.log("Previous page was:", previousPage);
    }
    if (VALID_PAGE_IDS.includes(pageId)) {
        document.body.dataset.currentPage = pageId; // Store current page in body dataset
        console.log("Active page set to:", pageId);
    }
}

function hideAllPages() {
    // Desktop Pages - Use stronger hiding method
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
    
    // Force hide all pages
    pages.forEach(pageId => {
        const element = document.getElementById(pageId);
        if (element) {
            element.style.display = 'none';
            // Add hidden class to ensure complete hiding
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

    // Ensure close side menu
    const mobileSideMenu = document.getElementById('mobile-side-menu');
    if (mobileSideMenu && mobileSideMenu.classList.contains('open')) {
        mobileSideMenu.classList.remove('open');
    }

    const pageWrapper = document.querySelector('.page-wrapper');
    if (pageWrapper) pageWrapper.style.display = 'flex'; // Usually keep pageWrapper flex
    document.body.style.overflow = ''; // Restore default scrolling
    document.body.classList.remove('product-detail-active', 'mobile-menu-open'); // Remove any global state classes
}

function showNewHomepage() {
  // Detect device type
  if (window.innerWidth <= 768) {
    // Mobile device, show mobile homepage
    showMobileHomePage();
    return;
  }

  // Desktop device, show desktop homepage
  hideAllPages();
  const homepageElement = document.getElementById('new-homepage-content');
  if (homepageElement) {
    homepageElement.style.display = 'block';
    homepageElement.classList.remove('hidden-page');
    console.log("Showing desktop homepage");
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
    console.log("Showing About page");
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
    console.log("Showing Cakes page");
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
    const paymentPageElement = document.getElementById('payment-page-content');
    if (paymentPageElement) {
        paymentPageElement.style.display = 'flex'; 
        paymentPageElement.classList.remove('hidden-page');
    } else {
        console.error('Payment page element not found!');
        return;
    }
    setActivePage('payment');
    
    // Update payment page amounts based on cart total
    if (typeof calculateCartTotal === 'function') {
        const totals = calculateCartTotal();
        const subtotalEl = document.getElementById('payment-subtotal');
        const totalEl = document.getElementById('payment-total');
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    } else if (typeof calculateWishlistTotals === 'function') {
        // Compatible with entering payment page from wishlist
        const totals = calculateWishlistTotals(); 
        const subtotalEl = document.getElementById('payment-subtotal');
        const totalEl = document.getElementById('payment-total');
        if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
    } else {
        console.error('Cart or wishlist calculation function not defined');
    }

    const paymentBackBtn = document.getElementById('payment-back-btn');
    if (paymentBackBtn && !paymentBackBtn._clickHandlerAttached) {
        const newPaymentBackHandler = (e) => { 
            e.preventDefault();
            
            // Return based on previous page
            const currentPage = document.body.dataset.currentPage || 'payment';
            if (currentPage === 'mobileCart') {
                showCartPage(); // Return to mobile cart if entered from mobile cart
            } else if (currentPage === 'cart') {
                showCartPage(); // Return to desktop cart if entered from desktop cart
            } else {
                showCartPage(); // Always return to cart page, no longer return to wishlist
            }
        };
        paymentBackBtn.addEventListener('click', newPaymentBackHandler);
        paymentBackBtn._clickHandlerAttached = true;
    }

    // Set Edit button click event
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
    
    // Set place order button logic
    const placeOrderBtn = document.getElementById('place-order-btn');
    if (placeOrderBtn && !placeOrderBtn._clickHandlerAttached) {
        placeOrderBtn.addEventListener('click', function(e) {
            const creditCardOption = document.querySelector('.payment-option[data-method="creditcard"]');
            const creditCardForm = document.querySelector('.credit-card-form');

            // Check if credit card payment is selected and form is in edit mode
            if (creditCardOption && creditCardOption.classList.contains('selected') && 
                creditCardForm && creditCardForm.classList.contains('active')) {
                // If form is invalid, prevent default and stay on payment page
                if (!isCreditCardFormValid()) {
                    e.preventDefault(); // Prevent any potential redirects or submissions
                    return; // Stay on current page for user to modify
                }
            }
            
            // If using Apple Pay or other non-credit card payment, or credit card validation passed (or form not used), proceed with payment
            // Clear cart
            if (typeof cartItems !== 'undefined') {
                cartItems = [];
                if (typeof saveCartToLocalStorage === 'function') {
                    saveCartToLocalStorage();
                }
                if (typeof updateCartIcon === 'function') {
                    updateCartIcon();
                }
            }
            
            // Clear wishlist (compatible with entering from wishlist)
            if (typeof wishlistItems !== 'undefined') { 
                wishlistItems = []; 
            }
            if (typeof renderWishlistPage === 'function') renderWishlistPage(); 
            if (typeof updateAllWishlistIcons === 'function') updateAllWishlistIcons(); 
            
            // Navigate to thank you page
            showThankYouPage();
        });
        placeOrderBtn._clickHandlerAttached = true;
    }
    
    // Set payment option selection event listener
    const paymentOptions = document.querySelectorAll('#payment-page-content .payment-option');
    paymentOptions.forEach(option => {
        if (!option._paymentOptionClickHandlerAttached) {
            option.addEventListener('click', function() {
                // Remove all selections
                paymentOptions.forEach(opt => opt.classList.remove('selected'));
                // Add current selection
                this.classList.add('selected');
                
                // Handle credit card form display/hide
                const creditCardForm = document.querySelector('.credit-card-form');
                const editCardBtn = document.querySelector('.edit-card-btn');
                
                if (creditCardForm) {
                    // If non-credit card payment is selected, hide form and edit button
                    if (this.dataset.method !== 'creditcard') {
                        creditCardForm.classList.remove('active');
                        if (editCardBtn) editCardBtn.style.display = 'none';
                    } else {
                        // If credit card is selected, show edit button
                        if (editCardBtn) editCardBtn.style.display = 'inline-block';
                    }
                }
            });
            option._paymentOptionClickHandlerAttached = true; 
        }
    });
    
    // Set credit card form validation
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

    // Update main smiley icon to image
    const mainSuccessIcon = document.querySelector('.main-success-icon');
    if (mainSuccessIcon) {
        // Check if already contains image
        if (!mainSuccessIcon.querySelector('img')) {
            mainSuccessIcon.innerHTML = ''; // Clear text content
            const img = document.createElement('img');
            img.src = 'mobile_images/image 28.png'; // Use most satisfied emoji
            img.alt = 'Smiley Face';
            mainSuccessIcon.appendChild(img);
        }
    }

    // Update emoji options
    const emojisContainer = document.querySelector('.satisfaction-emojis');
    if (emojisContainer) {
        // Check if already contains images
        if (!emojisContainer.querySelector('img')) {
            // Clear existing content
            emojisContainer.innerHTML = '';
            
            // Create 5 emoji images
            const emojiImages = [
                { src: 'mobile_images/image 28.png', rating: 5, alt: 'Very Satisfied' },
                { src: 'mobile_images/image 29.png', rating: 4, alt: 'Satisfied' },
                { src: 'mobile_images/image 30.png', rating: 3, alt: 'Neutral' },
                { src: 'mobile_images/image 31.png', rating: 2, alt: 'Dissatisfied' },
                { src: 'mobile_images/image 32.png', rating: 1, alt: 'Very Dissatisfied' }
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
            alert('View order function not yet implemented, returning to homepage');
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
                console.log('User satisfaction rating:', this.dataset.rating);
            });
            emoji._emojiClickHandlerAttached = true;
        }
    });

    // 在showThankYouPage函数末尾添加
    const thankYouBackArrow = document.getElementById('thank-you-back-arrow-btn');
    if (thankYouBackArrow && !thankYouBackArrow._backHandlerAttached) {
        thankYouBackArrow.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                // Mobile: go to mobile home
                if (typeof showMobileHomePage === 'function') {
                    showMobileHomePage();
                } else {
                    // fallback: show mobile main view
                    const mobileMainAppView = document.getElementById('mobile-main-app-view');
                    if (mobileMainAppView) {
                        hideAllPages();
                        mobileMainAppView.style.display = 'flex';
                        const sections = mobileMainAppView.querySelectorAll(':scope > section');
                        sections.forEach(sec => sec.classList.remove('hidden'));
                    }
                }
            } else {
                // Desktop: go to desktop home
                if (typeof showNewHomepage === 'function') {
                    showNewHomepage();
                } else {
                    // fallback: show desktop homepage content
                    const homepage = document.getElementById('new-homepage-content');
                    if (homepage) homepage.style.display = 'block';
                }
            }
        });
        thankYouBackArrow._backHandlerAttached = true;
    }

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
             // if coming from mobile cakes, go back to mobile cakes
            if (previousPage === 'mobileCakes') {
                showMobileCakesPage();
            } else {
                showNewHomepage(); 
            }
             break;
        case 'payment': showPaymentPage(); break;
        case 'thankYou': showNewHomepage(); break;
        case 'mobileHome': showMobileHomePage(); break;
        case 'mobileCakes': 
            showMobileCakesPage(); // Use the new function
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

// Add: Show mobile About page function
function showMobileAboutPage() {
    console.log('=== Showing mobile About page (slide version) ===');
    
    hideAllPages();
    
    const oldAboutPage = document.getElementById('emergency-about-page');
    if (oldAboutPage) {
        document.body.removeChild(oldAboutPage);
        console.log('Removed old standalone About page');
    }
    
    const images = [
        'mobile_images/Rectangle 110 (1).jpg',
        'mobile_images/Rectangle 114.jpg',
        'mobile_images/Rectangle 114 (1).jpg',
        'mobile_images/Rectangle 114 (2).jpg'
    ];
    let currentImageIndex = 3; // Default show 4th image
    
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

    // --- Header --- (keep unchanged)
    const headerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background-color: #EAE4DD; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <button id="emergency-back-btn" style="width: 30px; height: 30px; background: none; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                <img src="mobile_images/back-arrow@2X 1 (1).png" alt="Back" style="width: 100%; height: 100%;">
            </button>
            <h1 style="margin: 0; font-size: 22px; color: #000; font-family: 'Playfair Display SC', serif;">ABOUT</h1>
            <div style="width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
                <img src="mobile_images/location.svg" alt="Location" style="width: 24px; height: 24px;">
            </div>
        </div>
    `;

    // --- Image Carousel Area (restructured to support sliding) ---
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

    // --- Pagination Buttons --- (keep unchanged)
    const paginationHTML = `
        <div style="display: flex; justify-content: center; gap: 10px; margin: 10px 0; padding: 5px 0;">
            ${images.map((_, index) => `<button id="page-btn-${index}" class="about-page-btn" data-index="${index}" style="width: 24px; height: 24px; border-radius: 50%; border: 1px solid #000; background: ${index === currentImageIndex ? '#000' : 'none'}; color: ${index === currentImageIndex ? '#fff' : '#000'}; padding: 0; cursor: pointer;">${index + 1}</button>`).join('')}
        </div>
    `;

    // --- Main Content and Footer Area --- (keep unchanged)
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
    console.log('✅ Standalone About page (slide version) created successfully');

    const backBtn = document.getElementById('emergency-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            document.body.removeChild(emergencyAboutPage);
            showMobileHomePage();
        });
    }

    const imageStrip = document.getElementById('image-strip');
    const pageButtons = document.querySelectorAll('.about-page-btn');

    // Initialize first image position
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
            console.log(`Switched to image ${currentImageIndex + 1}`);
        });
    });
    
    // Force ensure image container and image visibility
    setTimeout(() => {
        const viewport = document.getElementById('image-slider-viewport');
        const strip = document.getElementById('image-strip');
        const allImages = document.querySelectorAll('#image-strip img');
        
        if (viewport) {
            viewport.style.display = 'flex';
            viewport.style.visibility = 'visible';
            viewport.style.opacity = '1';
            viewport.style.minHeight = '180px';
            console.log('Force show carousel container');
        }
        
        if (strip) {
            strip.style.display = 'flex';
            strip.style.visibility = 'visible';
            strip.style.opacity = '1';
            console.log('Force show image strip');
        }
        
        allImages.forEach((img, index) => {
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            img.style.minWidth = '50px';
            img.style.minHeight = '50px';
            
            // Add image load listener
            img.onload = function() {
                console.log(`Image ${index + 1} loaded successfully`);
                this.style.display = 'block';
                this.style.visibility = 'visible';
            };
            
            img.onerror = function() {
                console.log(`Image ${index + 1} failed to load, using fallback image`);
                this.src = 'mobile_images/image (22).png';
            };
        });
        
        console.log('Force show all image elements');
    }, 100);
    
    setActivePage('mobileAbout');
    console.log('=== Standalone About page (slide version) display complete ===');
}

// Show mobile homepage function
function showMobileHomePage() {
    hideAllPages();
    const mobileMainAppView = document.getElementById('mobile-main-app-view');
    if (mobileMainAppView) {
        mobileMainAppView.style.display = 'flex';
        mobileMainAppView.classList.remove('hidden-page'); // Ensure hidden-page class is removed
        // Show all sections of homepage
        const sections = mobileMainAppView.querySelectorAll(':scope > section');
        sections.forEach(sec => sec.classList.remove('hidden'));
        console.log("Showing mobile homepage");
        
        // Ensure bottom navigation bar is visible
        const mobileBottomNav = document.querySelector('.mobile-bottom-nav');
        if (mobileBottomNav) {
            mobileBottomNav.style.display = 'flex';
        }
    } else {
        console.error("Mobile homepage element does not exist");
        // Fallback to desktop homepage if mobile homepage doesn't exist
        showNewHomepage();
        return;
    }
    setActivePage('mobileHome');
    window.scrollTo(0, 0);
}

// Show cart page
function showCartPage() {
    hideAllPages();
    
    // Detect device type
    if (window.innerWidth <= 768) {
        // Mobile
        const mobileCartPage = document.getElementById('mobile-cart-page-content');
        if (mobileCartPage) {
            mobileCartPage.style.display = 'flex';
            console.log("Showing mobile cart page");
            setActivePage('mobileCart');
        }
    } else {
        // Desktop
        const cartPage = document.getElementById('cart-page-content');
        if (cartPage) {
            cartPage.style.display = 'block';
            cartPage.classList.remove('hidden-page');
            console.log("Showing desktop cart page");
            setActivePage('cart');
        }
    }
    
    // Render cart content - update both desktop and mobile
    if (typeof renderCartPage === 'function') {
        renderCartPage();
    }
    
    if (typeof renderMobileCartPage === 'function') {
        renderMobileCartPage();
    }
    
    // Set back button event listener
    const cartBackBtn = document.getElementById('cart-back-btn');
    if (cartBackBtn && !cartBackBtn._clickHandlerAttached) {
        cartBackBtn.addEventListener('click', () => {
            goBackToPreviousPageOrHomepage();
        });
        cartBackBtn._clickHandlerAttached = true;
    }
    
    // Set mobile back button event listener
    const mobileCartBackBtn = document.querySelector('.mobile-cart-back-btn');
    if (mobileCartBackBtn && !mobileCartBackBtn._clickHandlerAttached) {
        mobileCartBackBtn.addEventListener('click', () => {
            // Use goBackToPreviousPageOrHomepage function to determine previous page
            goBackToPreviousPageOrHomepage();
        });
        mobileCartBackBtn._clickHandlerAttached = true;
    }
    
    // Set continue shopping button event listener
    const continueShoppingBtn = document.querySelector('.cart-continue-shopping-btn');
    if (continueShoppingBtn && !continueShoppingBtn._clickHandlerAttached) {
        continueShoppingBtn.addEventListener('click', () => {
            showNewHomepage();
        });
        continueShoppingBtn._clickHandlerAttached = true;
    }
    
    // Set checkout button event listener
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn && !checkoutBtn._clickHandlerAttached) {
        checkoutBtn.addEventListener('click', () => {
            if (typeof showPaymentPage === 'function') {
                showPaymentPage();
            } else {
                console.error('showPaymentPage function is not defined');
                alert('Checkout function not yet implemented');
            }
        });
        checkoutBtn._clickHandlerAttached = true;
    }
    
    // Set mobile checkout button event listener
    const mobileCheckoutBtn = document.getElementById('mobile-cart-checkout-btn');
    if (mobileCheckoutBtn && !mobileCheckoutBtn._clickHandlerAttached) {
        mobileCheckoutBtn.addEventListener('click', () => {
            if (typeof showPaymentPage === 'function') {
                showPaymentPage();
            } else {
                console.error('showPaymentPage function is not defined');
                alert('Checkout function not yet implemented');
            }
        });
        mobileCheckoutBtn._clickHandlerAttached = true;
    }
    
    window.scrollTo(0, 0);
}

// Helper function: Credit card form validation
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
    if (!cvv || cvv.length < 3) {
        alert('Please enter a valid 3-digit security code (CVV).');
        return false;
    }
    return true;
}

// Modified setupCreditCardFormValidation function
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

// Add function to show mobile cakes page
function showMobileCakesPage() {
    hideAllPages();
    const mobileCakesElement = document.getElementById('mobile-cakes-page-content');
    if (mobileCakesElement) {
        mobileCakesElement.style.display = 'flex'; // Use flex for column layout
        mobileCakesElement.classList.remove('hidden-page');
        console.log("Showing mobile Cakes page");

        // Dynamically load cake items for mobile view
        const cakesContainer = mobileCakesElement.querySelector('.mobile-cakes-grid-container');
        if (cakesContainer) {
            cakesContainer.innerHTML = ''; // Clear previous content
            if (typeof productsData !== 'undefined' && Array.isArray(productsData)) {
                const cakeProducts = productsData.filter(p => p.category === 'cake');

                if (cakeProducts.length > 0) {
                    cakeProducts.forEach(cake => {
                        const cakeItemHTML = `
                            <div class="mobile-cake-card js-view-product-detail" data-product-id="${cake.id}">
                                <div class="mobile-cake-image-container">
                                    <img src="${cake.image}" alt="${cake.name}" class="mobile-cake-image">
                                </div>
                                <div class="mobile-cake-info">
                                    <h3 class="mobile-cake-name">${cake.name}</h3>
                                    <p class="mobile-cake-price">${cake.price}</p>
                                </div>
                            </div>
                        `;
                        cakesContainer.innerHTML += cakeItemHTML;
                    });
                    // Re-setup product link listeners for newly added items
                    if (typeof setupProductLinkListeners === 'function') {
                        setupProductLinkListeners(); 
                    }
                } else {
                    cakesContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No cakes available at the moment.</p>';
                }
            } else {
                cakesContainer.innerHTML = '<p style="text-align: center; padding: 20px;">Error loading cake data.</p>';
            }
        }
    }
    setActivePage('mobileCakes');
    
    const mobileCakesBackBtn = document.querySelector('#mobile-cakes-page-content .mobile-cakes-back-btn');
    if (mobileCakesBackBtn && !mobileCakesBackBtn._clickHandlerAttached) {
        const newMobileCakesBackHandler = (e) => { 
            e.preventDefault(); 
            showMobileHomePage(); // Or goBackToPreviousPageOrHomepage(); if more dynamic return is needed
        };
        mobileCakesBackBtn.addEventListener('click', newMobileCakesBackHandler);
        mobileCakesBackBtn._clickHandlerAttached = true; 
    }
    window.scrollTo(0, 0);
} 