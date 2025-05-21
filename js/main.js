// js/main.js (入口文件)
// 负责初始化、协调其他模块

// --- DOM 元素获取 (仅保留必要的全局引用，如果其他模块不需要直接访问) --- //
// const pageWrapper = document.querySelector('.page-wrapper'); // 移到需要它的模块或通过参数传递
// 页面容器等具体元素由各模块自行获取或通过参数传递

// --- 初始化 --- //
document.addEventListener('DOMContentLoaded', () => {
  // 设置导航链接（包括logo、about等点击事件）
  // 依赖: navigation.js
  if (typeof setupNavigationListeners === 'function') {
    setupNavigationListeners();
  } else {
    console.error('setupNavigationListeners is not defined. Check navigation.js');
  }

  // 设置搜索功能的事件监听 (打开/关闭浮层, 输入处理)
  // 依赖: searchFunctionality.js
  if (typeof setupSearchFunctionality === 'function') {
    setupSearchFunctionality();
  } else {
    console.error('setupSearchFunctionality is not defined. Check searchFunctionality.js');
  }

  // 为新主页上的 "buy now" 按钮绑定事件, 也可能包括cakes页面的类似按钮
  // 依赖: productDetail.js 
  if (typeof setupProductLinkListeners === 'function') {
    setupProductLinkListeners(); 
  } else {
    console.error('setupProductLinkListeners is not defined. Check productDetail.js');
  }

  // 初始化心愿单功能 (设置图标点击事件等)
  // 依赖: wishlist.js
  if (typeof initWishlist === 'function') {
    initWishlist();
  } else {
    console.error('initWishlist is not defined. Check wishlist.js');
  }
  
  // 初始化购物车功能
  // 依赖: cart.js
  if (typeof initCart === 'function') {
    initCart();
  } else {
    console.error('initCart is not defined. Check cart.js');
  }
  
  // 注意: About页面的图片轮播器 (initializeAboutPageSlider from uiElements.js)
  // 在 showAboutPage (navigation.js) 中被调用,因为它只在About页面显示时才需要初始化。

  // 根据设备尺寸决定初始显示的页面视图
  if (window.innerWidth <= 768) {
    // 移动设备 - 显示移动主视图
    const mobileMainAppView = document.getElementById('mobile-main-app-view');
    if (mobileMainAppView) {
      hideAllPages(); // 确保先隐藏所有页面
      mobileMainAppView.style.display = 'flex';
      const sections = mobileMainAppView.querySelectorAll(':scope > section');
      sections.forEach(sec => sec.classList.remove('hidden'));
      console.log("初始化为移动端视图");
    }
  } else {
    // 桌面设备 - 显示桌面主页
    if (typeof showNewHomepage === 'function') {
      showNewHomepage(); 
      console.log("初始化为桌面端视图");
    } else {
      console.error('showNewHomepage is not defined. Check navigation.js');
    }
  }

  // -------- 移动端菜单交互 和 页面导航逻辑 (合并和调整) --------
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileSideMenuElement = document.getElementById('mobile-side-menu'); // 更明确的变量名
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

  // --- 菜单打开/关闭功能 ---
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

  // --- 页面切换功能 ---
  function showMobilePage(pageElementToShow, sectionsToHide) {
    sectionsToHide.forEach(section => section.classList.add('hidden'));
    if (pageElementToShow) pageElementToShow.style.display = 'flex';
    if (mobileSideMenuElement) mobileSideMenuElement.classList.remove('open'); // 确保菜单关闭
    body.classList.remove('mobile-menu-open');
    window.scrollTo(0, 0);
  }

  function showMobileHomepage(sectionsToShow, pageToHide) {
    if (pageToHide) pageToHide.style.display = 'none';
    sectionsToShow.forEach(section => section.classList.remove('hidden'));
    if (mobileSideMenuElement) mobileSideMenuElement.classList.remove('open'); // 确保菜单关闭
    body.classList.remove('mobile-menu-open');
    window.scrollTo(0, 0);
  }

  // --- 导航菜单项事件监听 ---
  // 确保 mobileSideMenuElement 存在后再尝试获取其子项并绑定事件
  if (mobileSideMenuElement && mobileCakesPage) { 
    const mobileSideMenuItems = mobileSideMenuElement.querySelectorAll('ul li');
    if (mobileSideMenuItems.length > 0) {
      mobileSideMenuItems.forEach(item => {
        item.addEventListener('click', () => {
          const targetPage = item.dataset.target;
          console.log("Menu item clicked, target:", targetPage); // 调试信息

          if (targetPage === 'mobile-cakes-page') {
            showMobilePage(mobileCakesPage, mobileHomepageSections);
          } else if (targetPage === 'mobile-home-view') {
            showMobileHomepage(mobileHomepageSections, mobileCakesPage);
            // TODO: Hide other specific pages if they are open
          } else if (targetPage === 'mobile-about-page') {
            // 通过navigation.js中的函数切换到About页面
            if (typeof showMobileAboutPage === 'function') {
              showMobileAboutPage();
            } else {
              console.error('showMobileAboutPage function is not defined. Check navigation.js');
            }
          } else {
            console.log("Placeholder navigation for:", targetPage);
            // For other pages, ensure they are defined and then call showMobilePage
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

  // --- 返回按钮事件监听 (Cakes page) ---
  if (mobileCakesBackBtn && mobileCakesPage) {
    mobileCakesBackBtn.addEventListener('click', () => {
      showMobileHomepage(mobileHomepageSections, mobileCakesPage);
    });
  }
  // -------- 结束：移动端菜单交互 和 页面导航逻辑 --------

  console.log("Main.js loaded and initialized. Modules coordinated."); 
});

// 注意：
// 1. 各模块文件 (navigation.js, uiElements.js, productData.js, productDetail.js, searchFunctionality.js, wishlist.js)
//    需要在HTML中此 main.js 文件之前引入。
// 2. 确保函数名在不同文件中不冲突，或者使用更高级的模块系统 (如 ES6 Modules) 来管理作用域。
// 3. 依赖关系已在各文件顶部注释中标明。
// 4. 依赖关系已在各文件顶部注释中标明。例如, productDetail.js 中的 showProductDetail 调用了
//    navigation.js 中的 showNewHomepage，以及 uiElements.js 中的 closeSearchOverlay。
//    这种跨模块函数调用在当前简单脚本引入方式下是可行的，因为所有函数都挂在全局作用域下。
//    对于更大型应用，推荐使用 ES6 模块。 