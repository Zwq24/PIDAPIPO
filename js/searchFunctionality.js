// js/searchFunctionality.js
// 搜索输入、结果显示相关的逻辑

// (依赖 uiElements.js -> openSearchOverlay, closeSearchOverlay)
// (依赖 productDetail.js -> showProductDetailFromOtherPage)

function setupSearchFunctionality() {
  // 桌面端搜索相关元素
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;
  const searchResultsPreview = document.getElementById('search-results-preview');

  // 移动端搜索相关元素
  const mobileSearchInput = document.querySelector('.mobile-search-input');
  const mobileSearchResults = document.querySelector('.mobile-search-results');

  // 桌面端搜索开关
  if (openSearchBtn) {
    openSearchBtn.addEventListener('click', () => {
      if (typeof openSearchOverlay === 'function') openSearchOverlay();
    });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener('click', () => {
      if (typeof closeSearchOverlay === 'function') closeSearchOverlay();
    });
  }

  // 桌面端搜索输入事件
  if (searchInput && searchResultsPreview) {
    searchInput.addEventListener('input', function() {
      if (this.value.length > 0) {
        searchResultsPreview.classList.add('active');
        // 设置搜索结果项的点击事件
        setupSearchResultsClickEvents('#search-results-preview .result-item');
      } else {
        searchResultsPreview.classList.remove('active');
      }
    });
  }

  // 移动端搜索输入事件
  if (mobileSearchInput && mobileSearchResults) {
    mobileSearchInput.addEventListener('input', function() {
      if (this.value.length > 0) {
        mobileSearchResults.classList.add('active');
        // 设置移动端搜索结果项的点击事件
        setupSearchResultsClickEvents('.mobile-result-item');
      } else {
        mobileSearchResults.classList.remove('active');
      }
    });

    // 设置点击搜索框以外区域隐藏搜索结果
    document.addEventListener('click', function(event) {
      const isClickInsideSearchBar = event.target.closest('.mobile-search-bar-container');
      if (!isClickInsideSearchBar && mobileSearchResults.classList.contains('active')) {
        mobileSearchResults.classList.remove('active');
      }
    });
    
    // 防止点击搜索结果时关闭搜索结果面板
    mobileSearchResults.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }
}

// 辅助函数：设置搜索结果项的点击事件
function setupSearchResultsClickEvents(selector) {
  document.querySelectorAll(selector).forEach(item => {
    const productId = item.getAttribute('data-product-id');
    if (productId) {
      // 移除可能存在的旧事件处理器
      const existingHandler = item._clickHandler;
      if (existingHandler) {
        item.removeEventListener('click', existingHandler);
      }
      
      // 添加新的事件处理器
      const newItemClickHandler = () => {
        if (typeof showProductDetailFromOtherPage === 'function') {
          // 隐藏搜索结果
          const searchResults = item.closest('.mobile-search-results') || 
                                document.getElementById('search-results-preview');
          if (searchResults) {
            searchResults.classList.remove('active');
          }
          
          // 跳转到商品详情页
          showProductDetailFromOtherPage(productId);
          
          // 清空搜索框
          const searchInput = item.closest('.mobile-search-bar-container') ? 
                              document.querySelector('.mobile-search-input') : 
                              document.querySelector('#search-overlay input[type="text"]');
          if (searchInput) {
            searchInput.value = '';
          }
          
          // 如果是桌面端搜索，关闭搜索浮层
          if (!item.closest('.mobile-search-bar-container') && typeof closeSearchOverlay === 'function') {
            closeSearchOverlay();
          }
        } else {
          console.error('showProductDetailFromOtherPage is not defined. Check productDetail.js');
        }
      };
      
      // 注册点击事件
      item.addEventListener('click', newItemClickHandler);
      item._clickHandler = newItemClickHandler;
    }
  });
} 