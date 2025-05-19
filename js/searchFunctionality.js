// js/searchFunctionality.js
// 搜索输入、结果显示相关的逻辑

// (依赖 uiElements.js -> openSearchOverlay, closeSearchOverlay)
// (依赖 productDetail.js -> showProductDetailFromOtherPage)

function setupSearchFunctionality() {
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;
  const searchResultsPreview = document.getElementById('search-results-preview');

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

  if (searchInput && searchResultsPreview) {
    searchInput.addEventListener('input', function() {
      if (this.value.length > 0) {
        searchResultsPreview.classList.add('active');
        document.querySelectorAll('#search-results-preview .result-item').forEach(item => {
          const productId = item.getAttribute('data-product-id');
          if (productId) {
              const existingHandler = item._clickHandler;
              if (existingHandler) {
                  item.removeEventListener('click', existingHandler);
              }
              const newItemClickHandler = () => {
                if (typeof showProductDetailFromOtherPage === 'function') {
                    showProductDetailFromOtherPage(productId);
                } else {
                    console.error('showProductDetailFromOtherPage is not defined. Check productDetail.js');
                }
              };
              item.addEventListener('click', newItemClickHandler);
              item._clickHandler = newItemClickHandler; 
          }
        });
      } else {
        searchResultsPreview.classList.remove('active');
      }
    });
  }
} 