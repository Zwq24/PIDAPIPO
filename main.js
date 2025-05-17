// main.js
// 分页切换功能脚本，详细中文注释

// 获取所有分页按钮和内容区
const pageBtns = document.querySelectorAll('.page-btn');
const pageContents = document.querySelectorAll('.page-content');

// 给每个按钮添加点击事件
pageBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    const page = this.getAttribute('data-page');

    // 切换内容显示
    pageContents.forEach(section => {
      if(section.getAttribute('data-page') === page) {
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    });

    // 切换按钮高亮
    pageBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
}); 