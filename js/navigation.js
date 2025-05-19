// js/navigation.js
// 处理导航相关的逻辑 (如About页切换，Logo点击返回主页等)

// --- 页面状态管理与导航 --- // 
function showNewHomepage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'block';
  if (aboutPageContent) aboutPageContent.style.display = 'none';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'flex'; 
  document.body.style.overflow = '';
}

function showAboutPage() {
  const newHomepageContent = document.getElementById('new-homepage-content');
  const aboutPageContent = document.getElementById('about-page-content');
  const productDetailPage = document.getElementById('product-detail-page');
  const pageWrapper = document.querySelector('.page-wrapper');

  if (newHomepageContent) newHomepageContent.style.display = 'none';
  if (aboutPageContent) aboutPageContent.style.display = 'block';
  if (productDetailPage) productDetailPage.style.display = 'none';
  if (pageWrapper) pageWrapper.style.display = 'flex';
  document.body.style.overflow = '';
  initializeAboutPageSlider(); // 初始化或重新激活About页的图片轮播 (依赖uiElements.js)
}

// 主导航链接的事件监听器设置
function setupNavigationListeners() {
  const logoBtn = document.getElementById('logo-btn');
  const navLinkAbout = document.getElementById('nav-link-about');
  const navLinks = document.querySelectorAll('.nav-menu li');

  if (navLinkAbout) {
    navLinkAbout.addEventListener('click', (e) => {
      e.preventDefault(); 
      showAboutPage();
    });
  }

  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      showNewHomepage();
    });
  }

  navLinks.forEach(link => {
    if (link.id !== 'nav-link-about') { 
      link.addEventListener('click', (e) => {
        if (link.id !== 'open-search-btn') { 
          e.preventDefault();
          showNewHomepage();
        }
      });
    }
  });
} 