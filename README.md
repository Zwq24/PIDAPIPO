
# Pidapipo Official Website

## Overview

This project is a website for the Pidapipo brand. It's designed to show off products, let people shop, and be easy to use on computers and phones. The site is built using HTML, CSS, and JavaScript. It's set up in a way that's easy to understand and change.

## Features

- **Easy Navigation**: You can see different parts of the site without loading new pages all the time. JavaScript helps show and hide different sections.
- **Works on All Devices**: It looks good and works well on computers, tablets, and phones.
- **Product Pages**: You can look at products, see details about them, and add them to your shopping cart.
- **Shopping Cart**: You can see what's in your cart, change how many items you want, and get ready to buy.
- **Wishlist**: You can save products you like to a wishlist to look at later.
- **Search**: You can quickly search for products and see results right away.
- **Order Process**: You can go through the steps of ordering and see a confirmation when you're done (this is just a simulation).
- **Clear HTML**: The website uses HTML in a way that's easy to understand.
- **Organized Code**: CSS (for styling) and JavaScript (for making things work) are kept in separate files for different parts of the site.

## Project Structure

```
pidapipo/
│
├── index.html                # Main HTML file, has all the different page sections
├── css/                      # All CSS files, for how the site looks
│   ├── global.css            # Styles for the whole site (fonts, colors)
│   ├── navbar.css            # Styles for the menu at the top
│   ├── homepage.css          # Styles for the main page
│   ├── about.css             # Styles for the 'About' page
│   ├── cakes.css             # Styles for the 'Cakes' page
│   ├── product-detail.css    # Styles for when you look at one product
│   ├── cart.css              # Styles for the shopping cart page
│   ├── wishlist.css          # Styles for the wishlist page
│   ├── payment.css           # Styles for the payment page
│   ├── thankyou.css          # Styles for the 'Thank You' page after ordering
│   ├── search.css            # Styles for the search bar
│   ├── mobile-view.css       # Styles just for phones
│   ├── animations.css        # Styles for animations
│   └── ...                   # Other CSS files
│
├── js/                       # All JavaScript files, for making the site interactive
│   ├── main.js               # Starts up the website and makes buttons work
│   ├── navigation.js         # Handles showing and hiding different page sections
│   ├── productData.js        # Information about all the products (name, price, image)
│   ├── productDetail.js      # Makes the product detail page work
│   ├── cart.js               # Makes the shopping cart work
│   ├── wishlist.js           # Makes the wishlist work
│   ├── searchFunctionality.js# Makes the search bar work
│   ├── uiElements.js         # Helper functions for things like image sliders
│   └── ...                   # Other JavaScript files
│
├── images/                   # Images for the computer version of the site
│   └── ...                   # Product pictures, icons, logos
│
├── mobile_images/            # Images specially for the phone version
│   └── ...                   # Phone-friendly pictures
│
├── README.md                 # This file, explaining the project
└── ...                       # Other files
```

## Main Pages & Components

- **Homepage**: Shows a main banner, some top products, and links to other parts of the site.
- **About Page**: Tells the story of the brand and has an image gallery.
- **Cakes Page**: Shows all the cakes with pictures, names, and prices.
- **Product Detail Page**: Shows a big picture of a product, details, price, and buttons to add to cart or wishlist.
- **Cart Page**: Shows what you've added to your cart, lets you change quantities, and shows the total price.
- **Wishlist Page**: Shows products you've saved.
- **Payment/Checkout Page**: Where you'd enter delivery and payment info.
- **Order Confirmation Page**: Shows a message after you "order" something.
- **Search Overlay**: A full-screen search to find products.

## Technologies Used

- **HTML**: Used to build the structure of all the pages.
- **CSS**: Used for all the styling, like colors, layout, and making it look good on different screen sizes.
- **JavaScript**: Used to make the website interactive, like handling clicks and updating what you see on the page. No special frameworks are needed.
- **Optimized Images**: For clear pictures that load quickly.

## How It Works

- **Single Page Feel**: JavaScript shows and hides different parts of the `index.html` file, so it feels like you're moving between pages without full reloads.
- **Dynamic Content**: Things like product lists are created by JavaScript using stored data.
- **Keeping Track of Things**: The site remembers what page you're on, and what's in your cart/wishlist using JavaScript.
- **Interactive Elements**: Clicking buttons or typing in boxes is handled by JavaScript.
- **Mobile Friendly**: There are special sections and styles for when you use the site on a phone.

## Customization & Extensibility

- **Adding Products**: You can add or change products by editing the `js/productData.js` file.
- **Changing Styles**: You can change how the site looks by editing the CSS files in the `css/` folder.
- **New Features**: If you want to add new things, you can create new JavaScript files.
- **Assets**: New images go in the `images/` or `mobile_images/` folders.

## Best Practices

- **Code is commented** to explain what it does, especially in the HTML, CSS, and important JavaScript parts.
- **W3C standards** are followed to make sure it works well in different browsers.
- **Images are optimized** for the web.
- **Accessibility**: The site tries to be easy to use for everyone on the Internet.
- **Responsive design**: The site is made to work on both computers and phones.


