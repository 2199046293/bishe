/* 引入依赖模块 */
const createError = require('http-errors'); // 处理错误
const express = require('express'); // Express核心模块
const path = require('path'); // 用于处理路径
const cookieParser = require('cookie-parser'); // 处理 cookie
const logger = require('morgan'); // 测试使用
const mongoose = require('mongoose'); // 用于连接操作mongodb数据库
const cors = require('cors')

/* 引入路由模块 */
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const parentsRouter = require('./routes/parents');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/hms-2401')
.then(() => {
  console.log('数据库连接成功');
}).catch(err => {
  console.log('数据库连接失败');
});

// 创建 Experss 应用实例
const app = express();

// 视图模板引擎使用
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 使用中间件实现功能
app.use(logger('dev'));
app.use(express.json()); // 请求主体处理 JSON 格式数据
app.use(express.urlencoded({ extended: false })); // 请求主体处理 普通文本 格式数据
app.use(cookieParser()); // 用于服务端处理 cookie
app.use(express.static(path.join(__dirname, 'public'))); // 托管静态资源

// 使用中间件，实现 CORS 跨域资源共享
app.use(cors())

// // 访问白名单，无需验证登录权限
// const whiteList = ['/users/login', '/users/register']

// // 验证 token 通过后继续访问
// app.use((req, res, next) => {
//   // 获取请求路径
//   const pathname = req.path

//   // 判断请求路径是否在白名单中
//   if (whiteList.includes(pathname)) {
//     // 如果在白名单中，则继续访问
//     next()
//   } else {
//     // 如果不在白名单中，则验证 token
//     const token = req.headers.authorization
//     if (token){
//       if (Token.verify(token)) {
//         next()
//       } else {
//         res.status(401).json({
//           code: 401,
//           message: 'token 无效'
//         })
//       }
//     } else {
//       res.status(401).json({
//         code: 401,
//         message: 'token 无效'
//       })
//     }
//   }
// })

// 使用路由中间件
app.use('/', indexRouter);
app.use('/users', usersRouter); // 访问 /users 路径下的资源
app.use('/parents', parentsRouter); // 访问 /parents 路径下的资源

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
