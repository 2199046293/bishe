/**
 * 创建 Mongoose 的用户模型数据结构
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//每次登录的时候，
const UserSchema = new Schema({
    username: { type: String, unique: true },
    // 密码，每次查询数据时不查询密码
    password: { type: String, select: false },
    // 昵称
    nickname: String,
    // 头像
    avatar: String,
    code: String,
    // 创建时间
    // create_time: { type: Date, default: Date.now },
    // // 更新时间
    // update_time: { type: Date, default: Date.now }
});

/**
 * 创建并导出模型
 */
module.exports = mongoose.model('UserRegister', UserSchema);
