const express = require('express');
const router = express.Router();
const UserService = require('../services/users');

/* GET users listing. */
// 完整资源访问路径：/users/list
router.get('/list', function(req, res, next) {
  res.send('respond with a resource');
});
//查询商品首页数据，主要是轮播图
router.get('/tab/1',UserService.getTabData)
//这个已经实现了√

//测试：添加首页信息
router.post('/test',UserService.addTabData)


//查询用户首页数据，主要是推荐商品
router.get('/tab/1/feeds',UserService.getGuessYouLike)
///这个已经实现了√

/**
 * 用户登录处理路由
 */
router.post('/login', UserService.login);
//这个已经实现√

//获取秒杀商品数据
router.get('/api/home/spike',UserService.getSeckillData)
//这个已经实现了√

/**
 * 用户注册处理路由
 */
router.post('/register', UserService.register);

router.post('/ChangePassword', UserService.ChangePassword);

/**
 * 用户注册，验证用户名是否已存在
 */
router.get('/check', UserService.check);

// 用户注册，发送验证码
router.post('/sendCode', UserService.sendCode);

//用户注册，验证验证码
router.get('/checkCode', UserService.checkPhone);

//商品发布
router.post('/publish', UserService.publish);

//商品发布详情
router.get('/publishDetail', UserService.getMyPublish);

//商品详情页
router.get('/detail',UserService.getProductDetail)
//这个已经实现了√

//商品收藏
router.post('/collect',UserService.publish)

//我的收藏
router.get('/myCollection',UserService.getMyCollection)

//删除我的收藏
router.post('/deleteCollection',UserService.deleteCollection)

//毕设商品详情
router.get('/bisheDetail',UserService.getbisheDetail)
//这个已经实现了√

// 分类推荐产品
router.get('/category', UserService.getMainCategory)
//这个已经实现了√

//子分类推荐产品
router.get('/subcategory', UserService.getSubCategory)
//这个已经实现了√

//商品列表页
router.get('/productlist', UserService.getProductList)
//这个已经实现了√

//我的基本信息
router.get('/myinfo', UserService.getUserInfo)
//这个已经实现了√

//我的购物车
router.get('/cart',UserService.getCartData)
//这个已经实现了√
router.put('/cart',UserService.updateCartData)
//这个已经实现了√
//后台管理系统，添加用户信息
router.post('/addGoods', UserService.addgoods)

//发布评论
router.post('/publishComment', UserService.publishComment)

router.post('/updatePublish', UserService.updatepublish)

router.post('/updateRecomment', UserService.updateRecomment)

router.post('/deleteGoods',UserService.deleteGoods)

router.post('/deleteRecomment',UserService.deleteRecomment)

router.get('/mycomment', UserService.getComment)

router.post('/addLikes', UserService.addLikes)

router.get('/getmycomment',UserService.getMyComment)

//删除评论
router.post('/deleteComment', UserService.deleteComment)

//添加地址
router.post('/addAddress', UserService.addAddress)

//更新地址
router.post('/updateAddress', UserService.updateAddress)

//删除地址
router.post('/deleteAddress', UserService.deleteAddress)

//上传头像
router.post('/uploadavatar', UserService.uploadAvatar)

//获取我的地址
router.get('/myAddress', UserService.myAddress)

//这个已经实现了√
router.get('/homeBanners', UserService.getHomeBanners)


module.exports = router;
