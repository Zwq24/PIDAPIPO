// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// --- 页面状态管理与导航 --- // 
function showNewHomepage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'block';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'flex'; 
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
}

function showAboutPage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'block';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'flex';
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  initializeAboutPageSlider(); // 初始化或重新激活About页的图片轮播 (依赖uiElements.js)
}

// 新增函数：显示Cakes页面
function showCakesPage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const cakesPageContent = document.getElementById('cakes-page-content');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (cakesPageContent) cakesPageContent.style.display = 'block';
  if (pageWrapper) pageWrapper.style.display = 'flex';
  document.body.style.overflow = '';
  window.scrollTo(0, 0);

  // 如果Cakes页内部有返回按钮，也在这里统一处理返回到主页
  const cakesBackBtn = document.getElementById('cakes-back-btn');
  if (cakesBackBtn) {
    // 移除旧监听器，防止重复绑定
    const existingHandler = cakesBackBtn._clickHandler;
    if (existingHandler) {
        cakesBackBtn.removeEventListener('click', existingHandler);
    }
    const newCakesBackHandler = (e) => {
        e.preventDefault();
        showNewHomepage();
    };
    cakesBackBtn.addEventListener('click', newCakesBackHandler);
    cakesBackBtn._clickHandler = newCakesBackHandler; 
  }
}

// 主导航链接的事件监听器设置
function setupNavigationListeners() {
  const logoBtn = document.getElementById('logo-btn');
  const navLinkAbout = document.getElementById('nav-link-about');
  const navLinkCakes = document.getElementById('nav-link-cakes');
  const navLinks = document.querySelectorAll('.nav-menu li');

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
    if (link.id !== 'nav-link-about' && link.id !== 'nav-link-cakes') { 
      link.addEventListener('click', (e) => {
        if (link.id !== 'open-search-btn') { 
          e.preventDefault();
          showNewHomepage();
        }
      });
    }
  });
} 