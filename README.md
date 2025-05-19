# Pidapipo 官方网站开发指南

## 1. 项目概述
本项目是为 Pidapipo 品牌开发的官方网站。页面设计基于 Figma 模型，并采用 HTML5、CSS3 和原生 JavaScript 实现。目前已形成一个单页应用 (SPA) 的基本结构，通过 JavaScript 动态展示不同页面内容，适合初学者理解和维护。

## 2. 页面结构与模块
本网站采用单页应用 (SPA) 模式，所有"页面"内容均在 `index.html` 文件中定义，通过 JavaScript 控制其显示与隐藏。

### 2.1. 核心 HTML 结构 (`index.html`)
- **`<div id="product-detail-page">`**: 产品详情页容器，内容由 `js/productDetail.js` 动态填充。
- **`<div id="search-overlay">`**: 全屏搜索浮层。
- **`<div class="page-wrapper">`**: 包裹所有主要页面内容。
    - **`<nav class="navbar">`**: 顶部导航栏，在所有页面中通常保持可见。
    - **`<div id="new-homepage-content">`**: 新主页内容容器。
    - **`<div id="about-page-content">`**: "关于"页面内容容器 (最初的主页)。
    - **`<div id="cakes-page-content">`**: "蛋糕"页面内容容器。
    - **`<div id="wishlist-page-content">`**: "愿望清单"页面内容容器。
    - **`<div id="payment-page-content">`**: "支付/确认订单"页面内容容器。

### 2.2. 主要页面模块详情

#### 1. 导航栏 (`<nav class="navbar">`)
- **LOGO**: 点击返回新主页。
- **菜单**: 包括"Shop"、"Gelato"、"Chocolate"、"Cakes"、"About"、"The lab"等链接。部分链接(如 Cakes, About)已实现导航。
- **图标区**:
    - **心形图标 (Wishlist)**: 点击显示愿望清单页面，图标状态会根据愿望清单中是否有商品而改变。
    - **购物袋图标**: (目前为静态图标)
    - **搜索图标**: 点击打开搜索浮层。

#### 2. 新主页 (`#new-homepage-content`)
- **英雄横幅**: 包含背景图片和日期显示。
- **热门产品 (Top products)**: 以网格形式展示特色产品，每个产品有"立即购买"按钮，点击可跳转至产品详情页。
- **新页脚**: 包含社交媒体链接和原住民致谢声明。

#### 3. 关于页面 (`#about-page-content`)
- **英雄区域**: 大标题和副标题。
- **图片切换区域**: (原 `uiElements.js` 控制的图片轮播)。
- **分页组件**: 用于图片轮播的导航。
- **正文内容区**: 详细的品牌和产品介绍。
- **旧页脚**: 包含社交媒体链接和原住民致谢声明。

#### 4. 蛋糕页面 (`#cakes-page-content`)
- **顶部栏**: 包含菜单图标(临时)、LOGO、地图图标(临时)。
- **标题栏**: 包含返回按钮和"CAKES"大标题。
- **描述区域**: 对蛋糕系列的介绍。
- **蛋糕网格 (`<div class="cake-grid">`)**: 展示不同种类的蛋糕，包含图片、名称和价格。
- **页脚**: 原住民致谢声明。

#### 5. 产品详情页面 (`#product-detail-page`)
- 此页面内容由 `js/productDetail.js` 根据选择的产品动态生成。
- **返回按钮**: 返回到之前的页面。
- **产品图片**: 展示产品大图。
- **产品信息**: 名称、描述、价格。
- **数量选择器**: (设计中，当前版本可能简化)。
- **"添加到购物车"按钮**: 点击将商品添加到愿望清单 (当前逻辑如此，未来可分离购物车)。
- **心形图标**: 点击切换产品在愿望清单中的状态。

#### 6. 愿望清单页面 (`#wishlist-page-content`)
- **顶部栏**: 包含返回按钮、"My Wishlist"标题和购物袋图标。
- **愿望清单物品容器 (`<div class="wishlist-items-container">`)**: 动态展示用户添加到愿望清单的商品，每项包含图片、名称、价格和"移除"按钮。
- **摘要区域 (`<div class="wishlist-summary">`)**:
    - **小计 (Subtotal)**: 动态计算。
    - **总计 (Total)**: 动态计算。
    - **"结算 (Check out)"按钮**: 点击导航到支付页面。
- **页脚**: 包含"继续购物 (Continue Shopping)"按钮，点击返回新主页。

#### 7. 支付/确认订单页面 (`#payment-page-content`)
- **顶部栏**: 包含返回按钮和"Confirm Order"标题。
- **主要内容区域**:
    - **配送地址 (Delivery Address)**: (当前为静态展示内容)。
    - **支付方式 (Payment Method)**: (当前为静态展示内容)。
    - **订单摘要 (Order Summary)**:
        - **小计 (Subtotal)**: 从愿望清单传递或重新计算。
        - **运费 (Shipping)**: (当前硬编码为 $0.00)。
        - **总计 (Total)**: 动态计算。
- **页脚**: 包含"下单 (Place to order)"按钮，点击后会清空愿望清单并返回主页 (并弹窗提示)。

#### 8. 搜索浮层 (`#search-overlay`)
- **顶部栏**: LOGO、心形图标(同步愿望清单状态)、购物袋图标、关闭按钮。
- **搜索输入区**: 搜索图标、文本输入框、筛选器图标(临时)。
- **推荐搜索词**: 预设的快速搜索按钮。
- **搜索结果预览区 (`#search-results-preview`)**: 用户输入时动态显示匹配的商品预览。

## 3. 设计规范
- **主要颜色**:
  - `#EAE4DD` (背景)
  - `#000000` (文本)
  - `#FFFFFF` (部分元素背景)
  - (其他颜色根据具体页面和组件的 Figma 设计稿确定)
- **字体**:
  - `Playfair Display SC`, `Poppins`, `Abhaya Libre`, `Inter` (具体应用见 `global.css` 和各组件CSS)。
- **布局**:
  - 主要采用 Flexbox 和 Grid 实现响应式和灵活的页面布局。
  - 各页面和组件的具体设计参考 Figma 设计稿。
- **图片和图标**:
  - 项目使用的图片和SVG图标位于 `images/` 目录下。

## 4. 文件结构与说明

- **`index.html`**: 网站的唯一 HTML 文件，定义了所有页面模块的骨架。
- **`css/` (目录)**: 存放所有 CSS 样式文件。
    - `global.css`: 定义全局样式、字体、颜色变量等。
    - `animations.css`: 定义 CSS 动画效果。
    - `navbar.css`: 顶部导航栏的样式。
    - `homepage.css`: 新主页 (`#new-homepage-content`) 的特定样式。
    - `about.css`: 关于页面 (`#about-page-content`) 的特定样式。
    - `search.css`: 搜索浮层 (`#search-overlay`) 的样式。
    - `product-detail.css`: 产品详情页 (`#product-detail-page`) 的样式。
    - `cakes.css`: 蛋糕页面 (`#cakes-page-content`) 的样式。
    - `wishlist.css`: 愿望清单页面 (`#wishlist-page-content`) 的样式。
    - `payment.css`: 支付页面 (`#payment-page-content`) 的样式。
- **`js/` (目录)**: 存放所有 JavaScript 脚本文件。
    - `main.js`: JavaScript 的主入口文件。负责在 `DOMContentLoaded` 后初始化各个模块的事件监听器和初始页面状态。
    - `productData.js`: 包含一个 `productsData` 数组，存储网站所有产品的详细信息 (ID, 名称, 价格, 图片等)。
    - `uiElements.js`: 包含一些通用的UI交互功能，例如旧版关于页面的图片轮播器 (`initializeAboutPageSlider`)。
    - `navigation.js`: 核心导航逻辑。包含显示/隐藏不同页面内容的函数 (如 `showNewHomepage`, `showAboutPage`, `showCakesPage`, `showProductDetail`, `showWishlistPage`, `showPaymentPage`, `goBackToPreviousPageOrHomepage`, `setActivePage`, `hideAllPages`) 以及设置导航栏链接事件监听的 `setupNavigationListeners` 函数。
    - `productDetail.js`: 负责产品详情页的逻辑。包括根据产品ID从 `productsData` 获取数据并动态渲染 PDP 内容 (`showProductDetailFromOtherPage`, `renderProductDetail`)，以及处理PDP上的交互 (如添加到购物车按钮)。`setupProductLinkListeners` 函数用于初始化主页和蛋糕页上产品链接的点击事件。
    - `searchFunctionality.js`: 管理搜索浮层的显示/隐藏、用户输入响应、以及从 `productsData` 筛选并显示搜索结果预览。包含 `setupSearchFunctionality`, `openSearchOverlay`, `closeSearchOverlay`, `handleSearchInput` 等函数。
    - `wishlist.js`: 管理愿望清单功能。包括添加 (`addToWishlist`)、移除 (`removeFromWishlist`)、切换 (`toggleWishlistProduct`) 商品，在愿望清单页面渲染商品列表和总计 (`renderWishlistPage`)，更新所有心形图标的状态 (`updateAllWishlistIcons`)，以及计算总价 (`calculateWishlistTotals`)。`initWishlist` 函数用于初始化愿望清单相关的事件监听器。
- **`images/` (目录)**: 存放网站所需的所有图片资源 (JPG, PNG) 和 SVG 图标。
- **`README.md`**: 本开发指南。

## 5. 核心功能实现

- **单页应用 (SPA) 导航**: 通过 `js/navigation.js` 中的函数控制不同 `div` 内容块的显示和隐藏，模拟页面跳转效果。使用 `history.pushState` 或 `data-attributes` 来管理页面状态和返回逻辑。
- **动态内容加载**:
    - 产品详情页: 根据用户点击的产品，从 `js/productData.js` 提取数据并动态生成HTML。
    - 愿望清单页: 根据 `wishlistItems` 数组动态生成商品列表。
    - 搜索结果预览: 根据用户输入动态筛选并展示商品。
- **状态管理 (初级)**:
    - **当前页面**: 通过 `document.body.dataset.currentPage` 和 `previousPage` 变量 (在 `navigation.js`) 追踪。
    - **愿望清单**: 通过 `wishlistItems` 数组 (在 `wishlist.js`) 管理商品ID。
- **事件驱动交互**: 大量使用 `addEventListener` 来响应用户操作，如点击按钮、输入文本等。
- **模块化**:
    - CSS 按页面/组件拆分为多个文件，便于管理。
    - JavaScript 按功能拆分为多个文件，职责更清晰。通过 HTML 中的 `<script>` 标签顺序引入，函数多为全局作用域(未来可考虑 ES6 模块)。

## 6. 开发与维护建议
- **代码注释**: 所有 HTML 结构和 CSS 样式，以及关键的 JavaScript 函数都应包含详细的中文注释，方便初学者理解。
- **W3C 标准**: 遵循 W3C 标准编写 HTML 和 CSS，确保良好的跨浏览器兼容性。
- **资源优化**:
    - 图片: 压缩图片大小，选择合适的图片格式 (如 WebP)。
    - CSS/JS: 未来可考虑使用工具进行压缩合并，减少 HTTP 请求。
- **响应式设计**: 虽然目前主要针对桌面端，但应在后续迭代中考虑移动设备的适配。
- **可访问性 (A11y)**: 注意使用语义化 HTML 标签，为图片添加 `alt` 属性，确保键盘导航等。

## 7. 未来优化与功能扩展方向
- **完整购物车功能**: 将愿望清单和购物车分离，实现更完善的购物车管理 (数量修改、独立购物车页面等)。
- **用户账户系统**: 实现用户注册、登录，持久化保存愿望清单和订单信息。
- **后端集成**: 对接后端 API，实现真实的产品数据管理、库存同步、订单处理和支付网关集成。
- **高级搜索与筛选**: 在搜索功能中加入更复杂的筛选条件 (如价格范围、分类等)。
- **ES6 模块**: 将 JavaScript 代码迁移到 ES6 模块系统，以获得更好的代码组织和依赖管理。
- **自动化测试**: 引入单元测试和端到端测试，确保代码质量。
- **构建工具**: 使用 Webpack, Parcel 或 Vite 等构建工具自动化开发流程 (代码转换、打包、热重载等)。

---
*本 README 最后更新于开发支付页面功能之后。*
