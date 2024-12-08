const express = require('express');
const router = express.Router(); // 创建路由

/* GET home page. */
// 这和我们在 app.js 中之前调用 app.get('/', (req, res, next) => {}) 是一个意思
router.get('/', function(req, res, next) {
  // 这里是拿 views 目录下的 `index.jade` 文件进行渲染
  res.render('index', { title: 'Express' });
});

module.exports = router;
