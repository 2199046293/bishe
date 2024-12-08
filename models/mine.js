/**
 * 创建 Mongoose 的用户模型数据结构
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MineSchema = new Schema({
    //电话号码
    phone: String,
    // 昵称
    nickname:String,
    avatarUrl:String,
    scores:Number,
    // status:{type:Number,default:1},
    //用户名
    username:String
    // create_time: { type: Date, default: Date.now },
    // // 更新时间
    // update_time: { type: Date, default: Date.now }
});

/**
 * 创建并导出模型
 */
module.exports = mongoose.model('Mine', MineSchema);
