// js/main.js (Entry file)
// Responsible for initialization and coordinating other modules

// --- DOM Element Retrieval (only keep necessary global references if other modules don't need direct access) --- //
// const pageWrapper = document.querySelector('.page-wrapper'); // Move to the module that needs it or pass as a parameter
// Specific elements like page containers are retrieved by each module or passed as parameters

// --- Initialization --- //
document.addEventListener('DOMContentLoaded', () => {
  // Set up navigation links (including logo, about, etc. click events)
  // Depends on: navigation.js
  if (typeof setupNavigationListeners === 'function') {
    setupNavigationListeners();
  } else {
    console.error('setupNavigationListeners is not defined. Check navigation.js');
  }

  // Set up event listeners for search functionality (open/close overlay, input handling)
  // Depends on: searchFunctionality.js
  if (typeof setupSearchFunctionality === 'function') {
    setupSearchFunctionality();
  } else {
    console.error('setupSearchFunctionality is not defined. Check searchFunctionality.js');
  }

  // Bind events for "buy now" buttons on the new homepage, possibly including similar buttons on the cakes page
  // Depends on: productDetail.js 
  if (typeof setupProductLinkListeners === 'function') {
    setupProductLinkListeners(); 
  } else {
    console.error('setupProductLinkListeners is not defined. Check productDetail.js');
  }

  // Initialize wishlist functionality (set up icon click events, etc.)
  // Depends on: wishlist.js
  if (typeof initWishlist === 'function') {
    initWishlist();
  } else {
    console.error('initWishlist is not defined. Check wishlist.js');
  }
  
  // Initialize cart functionality
  // Depends on: cart.js
  if (typeof initCart === 'function') {
    initCart();
  } else {
    console.error('initCart is not defined. Check cart.js');
  }
  
  // Note: Image slider for About page (initializeAboutPageSlider from uiElements.js)
  // Called in showAboutPage (navigation.js) because it only needs to be initialized when the About page is displayed.

  // Determine the initial page view based on device size
  if (window.innerWidth <= 768) {
    // Mobile device - display mobile main view
    const mobileMainAppView = document.getElementById('mobile-main-app-view');
    if (mobileMainAppView) {
      hideAllPages(); // Ensure all pages are hidden first
      mobileMainAppView.style.display = 'flex';
      const sections = mobileMainAppView.querySelectorAll(':scope > section');
      sections.forEach(sec => sec.classList.remove('hidden'));
      console.log("Initialize as mobile view");
    }
  } else {
    // Desktop device - display desktop homepage
    if (typeof showNewHomepage === 'function') {
      showNewHomepage(); 
      console.log("Initialize as desktop view");
    } else {
      console.error('showNewHomepage is not defined. Check navigation.js');
    }
  }

  // -------- Mobile menu interaction and page navigation logic (merge and adjust) -------- //
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileSideMenuElement = document.getElementById('mobile-side-menu'); // More explicit variable name
  const mobileCloseMenuBtn = document.getElementById('mobile-close-menu-btn');
  const body = document.body;

  const mobileHomepageSections = [
    document.querySelector('.mobile-hero-section'),
    document.querySelector('.mobile-search-bar-container'),
    document.querySelector('.mobile-categories-section'),
    document.querySelector('.mobile-top-products-section'),
  ].filter(el => el !== null);

  const mobileCakesPage = document.getElementById('mobile-cakes-page-content');
  const mobileCakesBackBtn = document.querySelector('.mobile-cakes-back-btn');

  // --- Menu open/close functionality --- //
  if (mobileMenuBtn && mobileSideMenuElement && mobileCloseMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileSideMenuElement.classList.add('open');
      body.classList.add('mobile-menu-open');
    });

    mobileCloseMenuBtn.addEventListener('click', () => {
      mobileSideMenuElement.classList.remove('open');
      body.classList.remove('mobile-menu-open');
    });
  } else {
    console.error("Mobile menu buttons or side menu element not found. Menu will not work.");
  }

  // --- Page switching functionality --- //
  function showMobilePage(pageElementToShow, sectionsToHide) {
    sectionsToHide.forEach(section => section.classList.add('hidden'));
    if (pageElementToShow) pageElementToShow.style.display = 'flex';
    if (mobileSideMenuElement) mobileSideMenuElement.classList.remove('open'); // Ensure menu is closed
    body.classList.remove('mobile-menu-open');
    window.scrollTo(0, 0);
  }

  function showMobileHomepage(sectionsToShow, pageToHide) {
    if (pageToHide) pageToHide.style.display = 'none';
    sectionsToShow.forEach(section => section.classList.remove('hidden'));
    if (mobileSideMenuElement) mobileSideMenuElement.classList.remove('open'); // Ensure menu is closed
    body.classList.remove('mobile-menu-open');
    window.scrollTo(0, 0);
  }

  // --- Navigation menu item event listeners --- //
  // Ensure mobileSideMenuElement exists before trying to get its children and bind events
  if (mobileSideMenuElement && mobileCakesPage) { 
    const mobileSideMenuItems = mobileSideMenuElement.querySelectorAll('ul li');
    if (mobileSideMenuItems.length > 0) {
      mobileSideMenuItems.forEach(item => {
        item.addEventListener('click', () => {
          const targetPage = item.dataset.target;
          console.log("Menu item clicked, target:", targetPage); // Debugging information

          if (targetPage === 'mobile-cakes-page') {
            showMobilePage(mobileCakesPage, mobileHomepageSections);
             // Ensure setActivePage is called to update page state
            if (typeof setActivePage === 'function') {
                setActivePage('mobileCakes');
            }
          } else if (targetPage === 'mobile-home-view') {
            showMobileHomepage(mobileHomepageSections, mobileCakesPage);
            if (typeof setActivePage === 'function') {
                setActivePage('mobileHome');
            }
          } else if (targetPage === 'mobile-about-page') {
            // Switch to About page via function in navigation.js
            if (typeof showMobileAboutPage === 'function') {
              showMobileAboutPage(); // This function internally calls setActivePage('mobileAbout')
            } else {
              console.error('showMobileAboutPage function is not defined. Check navigation.js');
            }
          } else {
            console.log("Placeholder navigation for:", targetPage);
            // Placeholder: For other pages, ensure they are defined and then call showMobilePage
            if (mobileSideMenuElement) mobileSideMenuElement.classList.remove('open');
            body.classList.remove('mobile-menu-open');
          }
        });
      });
    } else {
      console.error("No items found in mobile side menu (ul li). Navigation will not work.");
    }
  } else {
    if (!mobileSideMenuElement) console.error("Mobile side menu element not found for navigation setup.");
    if (!mobileCakesPage) console.error("Mobile cakes page element not found for navigation setup.");
  }

  // --- Back button event listener (Cakes page) --- //
  if (mobileCakesBackBtn && mobileCakesPage) {
    mobileCakesBackBtn.addEventListener('click', () => {
      showMobileHomepage(mobileHomepageSections, mobileCakesPage);
       if (typeof setActivePage === 'function') {
            setActivePage('mobileHome');
        }
    });
  }

  // --- Added: Event listener for "Cake" in homepage Categories to navigate to Cakes page --- //
  const categoriesGrid = document.querySelector('.mobile-categories-grid');
  if (categoriesGrid) {
    const cakeCategoryItem = Array.from(categoriesGrid.querySelectorAll('.mobile-category-item'))
                                .find(item => item.querySelector('span')?.textContent.trim().toLowerCase() === 'cake');
    
    if (cakeCategoryItem && mobileCakesPage) {
      cakeCategoryItem.addEventListener('click', () => {
        console.log("Cake category clicked, navigating to mobile cakes page.");
        showMobilePage(mobileCakesPage, mobileHomepageSections);
         // Ensure setActivePage is called to update page state
        if (typeof setActivePage === 'function') {
            setActivePage('mobileCakes');
        }
      });
    } else {
      if (!cakeCategoryItem) console.error("Cake category item not found in mobile view.");
      if (!mobileCakesPage) console.error("Mobile cakes page element not found for category navigation.");
    }
  }

  // -------- End: Mobile menu interaction and page navigation logic -------- //

  console.log("Main.js loaded and initialized. Modules coordinated."); 
});

// Note:
// 1. Module files (navigation.js, uiElements.js, productData.js, productDetail.js, searchFunctionality.js, wishlist.js)
//    Need to be included in HTML before this main.js file.
// 2. Ensure function names do not conflict across files, or use a more advanced module system (like ES6 Modules) to manage scope.
// 3. Dependencies are indicated in comments at the top of each file.
// 4. Dependencies are indicated in comments at the top of each file. For example, showProductDetail in productDetail.js calls
//    showNewHomepage in navigation.js, and closeSearchOverlay in uiElements.js.
//    This type of cross-module function call is feasible with the current simple script inclusion method, as all functions are in the global scope.
//    For larger applications, ES6 modules are recommended. 