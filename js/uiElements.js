// js/uiElements.js
// 包含可复用的UI组件逻辑，如图片轮播器、搜索浮层的显示/隐藏

// --- About页面图片切换功能 --- //
let currentImageIndex = 1; // 默认显示第二张 (索引1)
const aboutPageImages = [
  'images/Rectangle 129.jpg',       // 对应按钮 1 (旧主页的图)
  'images/Rectangle 134 (1).jpg',  // 对应按钮 2
  'images/Rectangle 134 (2).jpg',  // 对应按钮 3
  'images/Rectangle 134 (3).jpg'   // 对应按钮 4
];

function initializeAboutPageSlider() {
  // 获取About页内的图片切换元素
  const aboutPageContent = document.getElementById('about-page-content');
  if (!aboutPageContent) return;

  const imageContainer = aboutPageContent.querySelector('#page-container'); 
  const imagePageBtns = aboutPageContent.querySelectorAll('.page-btn');

  if (!imageContainer || imagePageBtns.length === 0) {
    // console.warn('About page slider elements not found.');
    return;
  }

  renderAboutImage(currentImageIndex, null, imageContainer, imagePageBtns); // 初始渲染

  imagePageBtns.forEach(btn => {
    btn.removeEventListener('click', handleAboutPageBtnClickWrapper); // 使用包装器移除
    btn.addEventListener('click', handleAboutPageBtnClickWrapper); // 使用包装器添加
  });
}

// 创建一个包装函数，以便能正确传递 imageContainer 和 imagePageBtns
function handleAboutPageBtnClickWrapper() {
  const aboutPageContent = document.getElementById('about-page-content');
  if (!aboutPageContent) return;
  const imageContainer = aboutPageContent.querySelector('#page-container'); 
  const imagePageBtns = aboutPageContent.querySelectorAll('.page-btn');
  if (!imageContainer || !imagePageBtns) return;

  const targetImageIndex = parseInt(this.getAttribute('data-page'));
  if (targetImageIndex === currentImageIndex) return;
  const slideDirection = targetImageIndex > currentImageIndex ? 'right' : 'left';
  renderAboutImage(targetImageIndex, slideDirection, imageContainer, imagePageBtns);
  currentImageIndex = targetImageIndex;
}


function renderAboutImage(imageIndex, slideDirection = null, imageContainer, imagePageBtns) {
  if (!imageContainer) return;
  const imgPath = aboutPageImages[imageIndex];
  if (!imgPath) {
      console.error('Invalid image index for about page:', imageIndex);
      return;
  }

  if (!slideDirection) {
    imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img">`;
  } else {
    const oldImg = imageContainer.querySelector('img');
    if (oldImg) {
      const slideOutClass = slideDirection === 'left' ? 'slide-out-left' : 'slide-out-right';
      oldImg.className = 'switch-img ' + slideOutClass;
      oldImg.addEventListener('animationend', function handler() {
        oldImg.removeEventListener('animationend', handler); // 清理
        const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
        imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
        updateActiveAboutPageButton(imageIndex, imagePageBtns);
      }, { once: true });
    } else {
      const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
      imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
    }
  }
  updateActiveAboutPageButton(imageIndex, imagePageBtns);
}

function updateActiveAboutPageButton(activeIndex, imagePageBtns) {
  if (!imagePageBtns) return;
  imagePageBtns.forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === activeIndex);
  });
}

// --- 搜索浮层显示/隐藏功能 --- //
function openSearchOverlay() {
  const searchOverlay = document.getElementById('search-overlay');
  const pageWrapper = document.querySelector('.page-wrapper');
  const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;

  if (searchOverlay && pageWrapper) {
    searchOverlay.classList.add('active');
    pageWrapper.classList.add('search-active');
    document.body.style.overflow = 'hidden';
    if(searchInput) searchInput.focus();
  }
}

function closeSearchOverlay() {
  const searchOverlay = document.getElementById('search-overlay');
  const pageWrapper = document.querySelector('.page-wrapper');
  const searchResultsPreview = document.getElementById('search-results-preview');
  const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;
  
  if (searchOverlay && pageWrapper) {
    searchOverlay.classList.remove('active');
    pageWrapper.classList.remove('search-active');
    document.body.style.overflow = '';
    if(searchResultsPreview) searchResultsPreview.classList.remove('active');
    if(searchInput) searchInput.value = '';
  }
} 