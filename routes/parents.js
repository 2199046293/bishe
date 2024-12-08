const express = require('express');
const ParentService = require('../services/parents')
const router = express.Router(); // 创建路由

/**
 * 分页查询家长列表数据
 */
router.get('/list', ParentService.list)

/**
 * 添加/新增家长信息
 */
router.post('/add', ParentService.add)

//添加商品信息
router.post('/addGoods',ParentService.addgoods)
/**
 * 修改家长信息
 */
router.put('/update/:id', ParentService.update)

/**
 * 删除家长信息
 */
router.delete('/remove/:id', ParentService.remove)



module.exports = router;
