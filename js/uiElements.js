// js/uiElements.js
// Contains reusable UI component logic, such as image carousel and search overlay display/hide

// --- About Page Image Switching Function --- //
let currentImageIndex = 1; // Default show second image (index 1)
const aboutPageImages = [
  'images/Rectangle 129.jpg',       // Corresponds to button 1 (old homepage image)
  'images/Rectangle 134 (1).jpg',  // Corresponds to button 2
  'images/Rectangle 134 (2).jpg',  // Corresponds to button 3
  'images/Rectangle 134 (3).jpg'   // Corresponds to button 4
];

function initializeAboutPageSlider() {
  // Get image switching elements within About page
  const aboutPageContent = document.getElementById('about-page-content');
  if (!aboutPageContent) return;

  const imageContainer = aboutPageContent.querySelector('#page-container'); 
  const imagePageBtns = aboutPageContent.querySelectorAll('.page-btn');

  if (!imageContainer || imagePageBtns.length === 0) {
    // console.warn('About page slider elements not found.');
    return;
  }

  renderAboutImage(currentImageIndex, null, imageContainer, imagePageBtns); // Initial render

  imagePageBtns.forEach(btn => {
    btn.removeEventListener('click', handleAboutPageBtnClickWrapper); // Use wrapper to remove
    btn.addEventListener('click', handleAboutPageBtnClickWrapper); // Use wrapper to add
  });
}

// Create a wrapper function to correctly pass imageContainer and imagePageBtns
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
    imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo Product Image ${imageIndex + 1}" class="switch-img">`;
  } else {
    const oldImg = imageContainer.querySelector('img');
    if (oldImg) {
      const slideOutClass = slideDirection === 'left' ? 'slide-out-left' : 'slide-out-right';
      oldImg.className = 'switch-img ' + slideOutClass;
      oldImg.addEventListener('animationend', function handler() {
        oldImg.removeEventListener('animationend', handler); // Cleanup
        const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
        imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo Product Image ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
        updateActiveAboutPageButton(imageIndex, imagePageBtns);
      }, { once: true });
    } else {
      const slideInClass = slideDirection === 'left' ? 'slide-in-right' : 'slide-in-left';
      imageContainer.innerHTML = `<img src="${imgPath}" alt="Pidapipo Product Image ${imageIndex + 1}" class="switch-img ${slideInClass}">`;
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

// --- Search Overlay Display/Hide Function --- //
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