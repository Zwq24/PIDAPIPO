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
  
  // 注意: About页面的图片轮播器 (initializeAboutPageSlider from uiElements.js)
  // 在 showAboutPage (navigation.js) 中被调用,因为它只在About页面显示时才需要初始化。

  // 初始显示新主页
  // 依赖: navigation.js
  if (typeof showNewHomepage === 'function') {
    showNewHomepage(); 
  } else {
    console.error('showNewHomepage is not defined. Check navigation.js');
  }

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