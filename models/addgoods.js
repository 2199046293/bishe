/**
 * 创建 Mongoose 的家长模型数据结构
 */
const mongoose = require('mongoose');
const category = require('./category');
const Schema = mongoose.Schema;


const addgoodsSchema = new Schema({
    // name: String, // 家长姓名
    // childName: String, // 学生姓名
    // relationShip: String, // 所属关系
    // className: String, // 所属班级
    // guardian: Boolean, // 是否监护人
    // together: Boolean, // 是否一起生活
    // phone: String, // 手机号
    // email: String, // 邮箱
    // address: String, // 家庭地址
    // remark: String, // 备注
    username: String, // 用户名
    img:[String], // 图片数组
    desc: String, // 描述
    price: Number, // 价格
    avatar: String, // 头像
    category:String, // 分类
    id: String, // 商品id
    // 创建时间
    create_time: { type: Date, default: Date.now },
    // 更新时间
    update_time: { type: Date, default: Date.now }
});

/**
 * 创建并导出模型
 */
module.exports = mongoose.model('addgoods', addgoodsSchema);
