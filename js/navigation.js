// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// 记录导航到PDP或Wishlist之前的页面，方便返回
let previousPage = 'newHomepage'; // 默认为新主页
const VALID_PAGE_IDS = ['newHomepage', 'about', 'cakes', 'productDetail', 'wishlist'];

// --- 页面状态管理与导航 --- // 
function setActivePage(pageId) {
    if (VALID_PAGE_IDS.includes(pageId)) {
        previousPage = pageId;
        console.log("Active page set to:", previousPage);
    }
}

function showNewHomepage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const wishlistPageContent = document.getElementById('wishlist-page-content'); // 新增
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'block';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'none';
  if (wishlistPageContent) wishlistPageContent.style.display = 'none'; // 新增
  if (pageWrapper) pageWrapper.style.display = 'flex'; 
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  setActivePage('newHomepage');
}

function showAboutPage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const wishlistPageContent = document.getElementById('wishlist-page-content'); // 新增
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'block';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'none';
  if (wishlistPageContent) wishlistPageContent.style.display = 'none'; // 新增
  if (pageWrapper) pageWrapper.style.display = 'flex';
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  setActivePage('about');
  // 确保 initializeAboutPageSlider 在 uiElements.js 中定义并且已加载
  if (typeof initializeAboutPageSlider === 'function') {
      initializeAboutPageSlider();
  } else {
      console.warn('initializeAboutPageSlider function is not defined.');
  }
}

function showCakesPage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const wishlistPageContent = document.getElementById('wishlist-page-content'); // 新增
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'block';
  if (wishlistPageContent) wishlistPageContent.style.display = 'none'; // 新增
  if (pageWrapper) pageWrapper.style.display = 'flex';
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  setActivePage('cakes');

  const cakesBackBtn = document.getElementById('cakes-back-btn');
  if (cakesBackBtn) {
    const existingHandler = cakesBackBtn._clickHandler;
    if (existingHandler) {
        cakesBackBtn.removeEventListener('click', existingHandler);
    }
    const newCakesBackHandler = (e) => {
        e.preventDefault();
        showNewHomepage(); // Cakes 返回按钮总是导航到主页
    };
    cakesBackBtn.addEventListener('click', newCakesBackHandler);
    cakesBackBtn._clickHandler = newCakesBackHandler; 
  }
}

// 新增函数：显示心愿单页面
function showWishlistPage() {
    console.log("Attempting to show wishlist page. Current previousPage:", previousPage);
    // 不需要在这里再次设置 previousPage，因为它应该在导航到心愿单之前被设置
    // 或者，如果直接通过导航栏心形图标进入，那么 previousPage 就是当前显示的页面

    const newHomepageContent = document.getElementById('new-homepage-content');
    const aboutPageContent = document.getElementById('about-page-content');
    const productDetailPage = document.getElementById('product-detail-page');
    const cakesPageContent = document.getElementById('cakes-page-content');
    const wishlistPageContent = document.getElementById('wishlist-page-content');
    const pageWrapper = document.querySelector('.page-wrapper');

    if (newHomepageContent) newHomepageContent.style.display = 'none';
    if (aboutPageContent) aboutPageContent.style.display = 'none';
    if (productDetailPage) productDetailPage.style.display = 'none';
    if (cakesPageContent) cakesPageContent.style.display = 'none';
    if (wishlistPageContent) wishlistPageContent.style.display = 'block';
    
    // 心愿单页通常是覆盖整个视窗或主要内容区，pageWrapper 的显示可能需要调整
    // 如果心愿单是全屏覆盖，则 pageWrapper 可能也需要隐藏或特殊处理
    // 暂时保持 pageWrapper 显示，因为心愿单内容在 pageWrapper 内部
    if (pageWrapper) pageWrapper.style.display = 'flex'; 
    document.body.style.overflow = ''; // 或 'hidden' 如果心愿单是模态的
    window.scrollTo(0, 0);

    // 确保 renderWishlistPage 在 wishlist.js 中定义并且已加载
    if (typeof renderWishlistPage === 'function') {
        renderWishlistPage();
    } else {
        console.error('renderWishlistPage function is not defined.');
    }
    // setActivePage('wishlist'); // 不在这里设置，因为我们想保留之前的页面状态用于返回
}

// 新增函数：返回上一页或主页
function goBackToPreviousPageOrHomepage() {
    console.log("Going back from page. previousPage was:", previousPage);
    switch (previousPage) {
        case 'newHomepage':
            showNewHomepage();
            break;
        case 'about':
            showAboutPage();
            break;
        case 'cakes':
            showCakesPage();
            break;
        case 'productDetail': // PDP的返回按钮会调用这个
            // 如果是从PDP返回，通常是返回到它被打开的列表页或主页
            // 这里的逻辑可能需要更精细，例如，如果PDP是从Cakes页打开的，应该返回Cakes页
            // 但我们当前的 previousPage 只记录了PDP本身，而不是PDP之前的页面。
            // 暂时，从PDP返回都去主页，除非PDP逻辑自己处理。
            // 或者 productDetail.js 在调用 showProductDetailFromOtherPage 之前，设置一个更具体的返回点。
            // 现在，我们依赖于调用 showProductDetailFromOtherPage 之前 previousPage 的状态。
            // 例如，如果在 Cakes 页面点击 Buy Now，则 previousPage 是 'cakes'。
            // 然后 productDetail.js 会调用 showProductDetailFromOtherPage，这个函数会把 previousPage 设为 'productDetail'
            // 所以，这里的 previousPage (当从PDP返回时)实际上是 *打开PDP之前的页面*。
            // 这意味着，如果 showProductDetailFromOtherPage 正确地在它改变页面之前保存了状态，这里的逻辑是OK的。
            // 让我们假设 productDetail.js 的 showProductDetailFromOtherPage 会在显示PDP前调用 setActivePage('productBeingViewed'sSource')
            // 不， это не так. productDetail.js 中的 showProductDetailFromOtherPage 函数会隐藏其他所有页面。
            // 所以，当 PDP 显示时，previousPage 应该是打开 PDP 之前的页面。
            // 因此，这里的 previousPage 应该是正确的。
            showNewHomepage(); // 默认返回到主页，后续可以优化
            break;
        default:
            showNewHomepage();
            break;
    }
    // previousPage 会在新页面显示的函数中被重置，所以这里不需要重置
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