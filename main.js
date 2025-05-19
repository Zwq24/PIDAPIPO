// main.js
// 包含图片切换和搜索浮层功能脚本，详细中文注释

// --- 图片切换功能 --- //
const images = [
  'images/Rectangle 129.jpg',       // 对应按钮 1
  'images/Rectangle 134 (1).jpg',  // 对应按钮 2
  'images/Rectangle 134 (2).jpg',  // 对应按钮 3
  'images/Rectangle 134 (3).jpg'   // 对应按钮 4
];

// 获取所有分页按钮和图片容器
const imagePageBtns = document.querySelectorAll('.page-btn');
const imageContainer = document.getElementById('page-container'); // 容器ID已更新

// 当前显示图片的索引 (默认显示第二张，所以是1)
let currentImageIndex = 1;

// 渲染指定索引的图片（可带动画方向）
function renderImage(imageIndex, slideDirection = null) {
  if (!imageContainer) return; // 如果图片容器不存在则退出
  if (!slideDirection) {
    imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img">`;
    imagePageBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
    });
    return;
  }
  const oldImg = imageContainer.querySelector('img');
  if (oldImg) {
    const slideOutClass = slideDirection === 'left' ? 'slide-out-left' : 'slide-out-right';
    oldImg.className = 'switch-img ' + slideOutClass;
    oldImg.addEventListener('animationend', function handler() {
      oldImg.removeEventListener('animationend', handler);
      const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
      imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
      imagePageBtns.forEach(btn => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
      });
    }, { once: true });
  } else {
    const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
    imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
    imagePageBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
    });
  }
}

// 给每个分页按钮添加点击事件
imagePageBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const targetImageIndex = parseInt(this.getAttribute('data-page'));
    if (targetImageIndex === currentImageIndex) return;
    const slideDirection = targetImageIndex > currentImageIndex ? 'right' : 'left';
    renderImage(targetImageIndex, slideDirection);
    currentImageIndex = targetImageIndex;
  });
});

if (imageContainer) { // 确保在图片容器存在时才执行
    renderImage(currentImageIndex);
}

// --- 搜索浮层功能 --- //
const openSearchBtn = document.getElementById('open-search-btn');
const closeSearchBtn = document.getElementById('close-search-btn');
const searchOverlay = document.getElementById('search-overlay');
const pageWrapper = document.querySelector('.page-wrapper');
const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"] cityscape') : null;
const searchResultsPreview = document.getElementById('search-results-preview');

if (openSearchBtn && searchOverlay && pageWrapper) {
  openSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.add('active');
    pageWrapper.classList.add('search-active');
    document.body.style.overflow = 'hidden';
    if(searchInput) searchInput.focus(); // 打开时自动聚焦到输入框
  });
}

if (closeSearchBtn && searchOverlay && pageWrapper) {
  closeSearchBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    pageWrapper.classList.remove('search-active');
    document.body.style.overflow = '';
    if(searchResultsPreview) searchResultsPreview.classList.remove('active'); // 关闭时隐藏预览
    if(searchInput) searchInput.value = ''; // 清空输入
  });
}

// 简单演示：当在搜索框输入时，显示/隐藏静态的预览结果区
if (searchInput && searchResultsPreview) {
  searchInput.addEventListener('input', function() {
    if (this.value.length > 0) {
      searchResultsPreview.classList.add('active');
    } else {
      searchResultsPreview.classList.remove('active');
    }
  });
}

renderImage(currentImageIndex); 