

# Pidapipo Official Website

## Overview

This project is a modern, responsive website for the Pidapipo brand, designed to showcase products, facilitate shopping, and provide a smooth user experience on both desktop and mobile devices. The site is built using HTML5, CSS3, and vanilla JavaScript, following a modular and maintainable structure.

## Features

- **Single Page Application (SPA) style navigation**: All main content is loaded in a single HTML file, with JavaScript controlling which sections are visible.
- **Responsive design**: Optimized for both desktop and mobile, with dedicated layouts and navigation for each.
- **Product catalog and detail pages**: Users can browse products, view detailed information, and add items to their cart.
- **Shopping cart**: Full cart management, including quantity adjustment and checkout.
- **Wishlist**: Users can add/remove products to a wishlist for future reference.
- **Search functionality**: Quick product search with live preview results.
- **Order/payment flow**: Simulated checkout and order confirmation.
- **Accessible and semantic HTML**: Designed for usability and future accessibility improvements.
- **Separation of concerns**: CSS and JS are organized by feature/page for clarity.

## Project Structure

```
pidapipo/
│
├── index.html                # Main HTML file, contains all page containers
├── css/                      # All CSS files, organized by feature/page
│   ├── global.css            # Global styles, fonts, color variables
│   ├── navbar.css            # Navigation bar styles
│   ├── homepage.css          # Homepage styles
│   ├── about.css             # About page styles
│   ├── cakes.css             # Cakes page styles
│   ├── product-detail.css    # Product detail page styles
│   ├── cart.css              # Cart page styles
│   ├── wishlist.css          # Wishlist page styles
│   ├── payment.css           # Payment/checkout page styles
│   ├── thankyou.css          # Order confirmation page styles
│   ├── search.css            # Search overlay styles
│   ├── mobile-view.css       # Mobile-specific styles and overrides
│   ├── animations.css        # CSS animations
│   └── ...                   # Other CSS files as needed
│
├── js/                       # All JavaScript files, organized by feature
│   ├── main.js               # App entry point, initializes event listeners
│   ├── navigation.js         # SPA navigation and page state management
│   ├── productData.js        # Product data array (id, name, price, image, etc.)
│   ├── productDetail.js      # Product detail page logic and rendering
│   ├── cart.js               # Cart logic and UI rendering
│   ├── wishlist.js           # Wishlist logic and UI rendering
│   ├── searchFunctionality.js# Search overlay and live search logic
│   ├── uiElements.js         # Common UI utilities (e.g., image sliders)
│   └── ...                   # Other JS files as needed
│
├── images/                   # Desktop images and SVG icons
│   └── ...                   # Product images, icons, logos, etc.
│
├── mobile_images/            # Mobile-optimized images and icons
│   └── ...                   # Mobile-specific assets
│
├── README.md                 # This documentation
└── ...                       # Other files (e.g., .gitignore, etc.)
```

## Main Pages & Components

- **Homepage**: Hero banner, featured products, and navigation to other sections.
- **About Page**: Brand story, image carousel, and acknowledgments.
- **Cakes Page**: Product grid for cakes, with images, names, and prices.
- **Product Detail Page**: Large product image, description, price, quantity selector, add-to-cart button, and wishlist toggle.
- **Cart Page**: List of cart items, quantity controls, subtotal/total calculation, and checkout button.
- **Wishlist Page**: List of saved products, subtotal/total, and checkout option.
- **Payment/Checkout Page**: Delivery address, payment method selection, order summary, and place order button.
- **Order Confirmation Page**: Success message, satisfaction feedback, and navigation options.
- **Search Overlay**: Full-screen search with live product filtering and quick links.

## Technologies Used

- **HTML5**: Semantic markup for all content and structure.
- **CSS3**: Flexbox, Grid, and media queries for responsive layouts. Organized by feature for maintainability.
- **JavaScript (ES6+)**: Modular scripts for each major feature. No frameworks required.
- **SVG & Optimized Images**: For crisp icons and fast loading.

## How It Works

- **SPA Navigation**: JavaScript shows/hides different page containers in `index.html` based on user actions, simulating page transitions.
- **Dynamic Rendering**: Product and wishlist/cart content is generated dynamically from JavaScript data arrays.
- **State Management**: Page state is tracked using `data-attributes` on the `<body>`, and in-memory arrays for cart/wishlist.
- **Event-Driven UI**: All user interactions (clicks, input, etc.) are handled via event listeners in JS.
- **Mobile Support**: Mobile-specific containers and styles are used for small screens, with touch-friendly controls and navigation.

## Customization & Extensibility

- **Adding Products**: Update `js/productData.js` to add or modify products.
- **Styling**: Adjust or extend CSS files in the `css/` directory for new themes or layouts.
- **New Features**: Add new JS modules for additional functionality as needed.
- **Assets**: Place new images or icons in the appropriate `images/` or `mobile_images/` directory.

## Best Practices

- **Code is commented** for clarity, especially in HTML structure, CSS, and key JS functions.
- **W3C standards** are followed for maximum compatibility.
- **Images are optimized** for web use; consider further compression for performance.
- **Accessibility**: Semantic tags and alt attributes are used; further improvements are encouraged.
- **Responsive design**: All pages are designed to work on both desktop and mobile devices.

## Notes

- This project is intended as a learning and demonstration site. It does not include backend integration, user authentication, or real payment processing.
- The codebase is modular and easy to extend, but you are free to adapt, refactor, or reorganize as your needs evolve.
- No pop-up alerts are used for cart actions; all feedback is provided visually within the UI.
- The README is intentionally broad and flexible to accommodate future changes without requiring constant updates.

---

If you have any questions or want to extend the project, simply follow the modular structure and add your new features or styles in the appropriate place!
