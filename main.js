// main.js
// 图片切换功能脚本，详细中文注释

// 四张图片路径 (数组索引从0开始)
const images = [
  'images/Rectangle 129.jpg',       // 对应按钮 1
  'images/Rectangle 134 (1).jpg',  // 对应按钮 2
  'images/Rectangle 134 (2).jpg',  // 对应按钮 3
  'images/Rectangle 134 (3).jpg'   // 对应按钮 4
];

// 获取所有分页按钮和图片容器
const pageBtns = document.querySelectorAll('.page-btn');
const imageContainer = document.getElementById('page-container'); // 容器ID已更新

// 当前显示图片的索引 (默认显示第二张，所以是1)
let currentImageIndex = 1;

// 渲染指定索引的图片（可带动画方向）
function renderImage(imageIndex, slideDirection = null) {
  // 如果没有动画方向（例如首次加载），直接替换图片
  if (!slideDirection) {
    imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img">`;
    // 更新按钮高亮状态
    pageBtns.forEach((btn, i) => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
    });
    return;
  }

  // 有动画方向，先让当前图片滑出，再滑入新图片
  const oldImg = imageContainer.querySelector('img');
  if (oldImg) {
    // 根据滑动方向确定滑出动画类
    const slideOutClass = slideDirection === 'left' ? 'slide-out-left' : 'slide-out-right';
    oldImg.className = 'switch-img ' + slideOutClass; // 替换类名以触发动画

    // 动画结束后执行操作
    oldImg.addEventListener('animationend', function handler() {
      oldImg.removeEventListener('animationend', handler); // 避免重复触发
      // 替换为新图片并根据反方向滑入
      const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
      imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
      // 更新按钮高亮
      pageBtns.forEach((btn, i) => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
      });
    }, { once: true }); // 确保事件只触发一次
  } else {
    // 如果容器中没有旧图片（例如首次加载有动画的情况），直接滑入
    const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
    imageContainer.innerHTML = `<img src="${images[imageIndex]}" alt="Pidapipo 产品图片 ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
    pageBtns.forEach((btn, i) => {
        btn.classList.toggle('active', parseInt(btn.getAttribute('data-page')) === imageIndex);
    });
  }
}

// 给每个分页按钮添加点击事件
pageBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const targetImageIndex = parseInt(this.getAttribute('data-page')); // 获取目标图片索引

    if (targetImageIndex === currentImageIndex) return; // 如果已经是当前图片，则不执行任何操作

    // 判断滑动方向
    const slideDirection = targetImageIndex > currentImageIndex ? 'right' : 'left';
    renderImage(targetImageIndex, slideDirection);
    currentImageIndex = targetImageIndex; // 更新当前图片索引
  });
});

// 页面加载时，默认显示第二张图片 (索引为1)
renderImage(currentImageIndex); 