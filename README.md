# Pidapipo 官网首页开发说明

## 1. 项目简介
本项目为 Pidapipo 品牌的官方网站首页，页面设计参考了 Figma 设计稿，采用 HTML5 和 CSS3 实现，适合初学者学习和维护。

## 2. 页面结构
- 顶部导航栏：包含 LOGO、菜单（Shop、gelato、Chocolate、Cakes、About、The lab）、心形图标、购物袋图标、搜索图标。
- 主视觉区：大标题"PIDAPIPO EASTER 2025"，副标题"Friday 28th March Chocolate, Events, Loves, News"。
- 内容区：多段品牌和产品介绍文字。
- 底部社交媒体区：Twitter、Facebook、Instagram 图标。
- 页脚：原住民致敬声明。

## 3. 设计规范
- **主色调**：#EAE4DD（背景）、#000000（文字）、#FFFFFF（部分元素背景）。
- **字体**：
  - Poppins（导航、标题、副标题）
  - Abhaya Libre（正文、日期、分页数字）
- **布局**：
  - 使用 Flexbox 和 Grid 实现响应式布局。
  - 主要内容居中，宽度最大 1106px。
- **图片与图标**：
  - LOGO、社交媒体图标、装饰图片等均可用 SVG 或 PNG 占位。

## 4. 文件说明
- `index.html`：首页 HTML 文件。
- `style.css`：全局样式文件。

## 5. 开发建议
- 所有 HTML 和 CSS 代码均添加详细中文注释，便于初学者理解。
- 遵循 W3C 标准，保证多浏览器兼容性。
- 图片资源建议压缩优化，提升加载速度。

## 6. 后续优化建议
- 增加移动端适配，提升用户体验。
- 可根据实际需求扩展更多页面和功能。
