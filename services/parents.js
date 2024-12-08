const Parent = require('../models/parent');
const Goods=require('../models/addgoods')

/**
 * 分页查询家长数据
 */
async function list(req, res) {
  // 从GET请求的查询字符串参数中获取分页信息
  const { page = 1, pageSize = 10 } = req.query
  // 查询总记录数量
  const total = await Parent.find().countDocuments()
  // 分页查询
  const list = await Parent.find().limit(pageSize).skip((page - 1) * pageSize)
  
  res.json({
    code: 200,
    message: 'OK',
    data: {
      list,
      page,
      pageSize,
      total,
      isEnd: page * pageSize >= total, // 是否所有数据查询结束
    }
  })
}

/**
 * 新增家长数据
 */
async function add(req, res) {
  const parent = req.body

  // 向数据集合中添加文档
  const result = await Parent.create(parent)

  res.json({
    code: 200,
    message: 'OK',
    data: result
  })
}
//新增商品信息
async function addgoods(req, res){
  const goods=req.body
  const result=await Goods.create(goods)
  res.json({
    code: 200,
    message: 'OK',
    data: result
  })
}

/**
 * 修改家长数据
 */
async function update(req, res) {
  // 获取待修改家长id
  const {id} = req.params
  // 获取待修改家长数据
  const {...parent} = req.body
  // 根据id查询并修改家长数据
  const result = await Parent.updateOne({_id: id}, parent)

  res.json({
    code: 200,
    message: 'OK',
    data: result
  })
}

/**
 * 删除家长数据
 */
async function remove(req, res) {
  // req.query 是获取查询字符串参数
  // req.params 是获取路径参数
  // req.body 是获取请求体参数

  // 获取路径参数中的待删除家长的id
  const { id } = req.params
  // 删除家长数据
  const result = await Parent.deleteOne({ _id: id })

  res.json({
    code: 200,
    message: 'OK',
    data: result
  })
}

// 导出
module.exports = { list, add, update, remove,addgoods }