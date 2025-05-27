// js/searchFunctionality.js
// Search input and results display logic

// (Depends on uiElements.js -> openSearchOverlay, closeSearchOverlay)
// (Depends on productDetail.js -> showProductDetailFromOtherPage)
// (Depends on productData.js -> productsData variable)
// (Depends on navigation.js -> showCakesPage, showNewHomepage functions)

function setupSearchFunctionality() {
  // Desktop search related elements
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('close-search-btn');
  const searchOverlay = document.getElementById('search-overlay');
  const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="text"]') : null;
  const searchResultsPreview = document.getElementById('search-results-preview');
  
  // Get search page suggestion buttons
  const suggestionButtons = document.querySelectorAll('.search-overlay-suggestions button');

  // Mobile search related elements
  const mobileSearchInput = document.querySelector('.mobile-search-input');
  const mobileSearchResults = document.querySelector('.mobile-search-results');
  const mobileResultsList = mobileSearchResults ? mobileSearchResults.querySelector('.mobile-results-list') : null;

  // Desktop search toggle
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
  
  // Add click events for search suggestion buttons
  if (suggestionButtons.length > 0) {
    suggestionButtons.forEach(button => {
      button.addEventListener('click', function() {
        const buttonText = this.textContent.trim().toLowerCase();
        
        // Close search overlay
        if (typeof closeSearchOverlay === 'function') {
          closeSearchOverlay();
        }
        
        // Navigate to corresponding page based on button text
        if (buttonText === 'cake') {
          if (typeof showCakesPage === 'function') {
            showCakesPage();
          } else {
            console.error('showCakesPage function is not defined');
          }
        } else if (buttonText === 'shop') {
          if (typeof showNewHomepage === 'function') {
            showNewHomepage();
          } else {
            console.error('showNewHomepage function is not defined');
          }
        } else {
          // Add navigation logic for other buttons
          console.log(`Navigation for ${buttonText} not yet implemented`);
        }
      });
    });
  }

  // Desktop search input event
  if (searchInput && searchResultsPreview) {
    searchInput.addEventListener('input', function() {
      if (this.value.length > 0) {
        searchResultsPreview.classList.add('active');
        // Set click events for search result items
        setupSearchResultsClickEvents('#search-results-preview .result-item');
      } else {
        searchResultsPreview.classList.remove('active');
      }
    });
  }

  // Mobile search input event
  if (mobileSearchInput && mobileSearchResults && mobileResultsList) {
    mobileSearchInput.addEventListener('input', function() {
      // Instead of regenerating the list, simply show/hide it based on input
      if (this.value.length > 0) {
        // Show the results panel
        mobileSearchResults.classList.add('active');
        
        // Setup click events for the static results
        setupSearchResultsClickEvents('.mobile-result-item');
      } else {
        // Hide the results panel when input is empty
        mobileSearchResults.classList.remove('active');
      }
    });

    // Set up hiding search results when clicking outside search bar
    document.addEventListener('click', function(event) {
      const isClickInsideSearchBar = event.target.closest('.mobile-search-bar-container');
      if (!isClickInsideSearchBar && mobileSearchResults.classList.contains('active')) {
        mobileSearchResults.classList.remove('active');
      }
    });
    
    // Prevent closing search results panel when clicking on results
    mobileSearchResults.addEventListener('click', function(event) {
      event.stopPropagation();
    });
  }
}

// Helper function: Search products
function searchProducts(query) {
  // Ensure productsData exists
  if (typeof productsData === 'undefined' || !Array.isArray(productsData)) {
    console.error('productsData is not defined or not an array');
    return [];
  }
  
  // Convert query to lowercase for case-insensitive search
  const lowerQuery = query.toLowerCase();
  
  // Filter matching products
  return productsData.filter(product => 
    product.name.toLowerCase().includes(lowerQuery)
  );
}

// Helper function: Set up click events for search result items
function setupSearchResultsClickEvents(selector) {
  document.querySelectorAll(selector).forEach(item => {
    // Skip "no matching products found" prompt item
    if (item.classList.contains('no-results')) return;
    
    const productId = item.getAttribute('data-product-id');
    if (productId) {
      // Remove possible existing event handlers
      const existingHandler = item._clickHandler;
      if (existingHandler) {
        item.removeEventListener('click', existingHandler);
      }
      
      // Add new event handler
      const newItemClickHandler = () => {
        if (typeof showProductDetailFromOtherPage === 'function') {
          // Hide search results
          const searchResults = item.closest('.mobile-search-results') || 
                                document.getElementById('search-results-preview');
          if (searchResults) {
            searchResults.classList.remove('active');
          }
          
          // Navigate to product detail page
          showProductDetailFromOtherPage(productId);
          
          // Clear search input
          const searchInput = item.closest('.mobile-search-bar-container') ? 
                              document.querySelector('.mobile-search-input') : 
                              document.querySelector('#search-overlay input[type="text"]');
          if (searchInput) {
            searchInput.value = '';
          }
          
          // If desktop search, close search overlay
          if (!item.closest('.mobile-search-bar-container') && typeof closeSearchOverlay === 'function') {
            closeSearchOverlay();
          }
        } else {
          console.error('showProductDetailFromOtherPage is not defined. Check productDetail.js');
        }
      };
      
      // Register click event
      item.addEventListener('click', newItemClickHandler);
      item._clickHandler = newItemClickHandler;
    }
  });
} 