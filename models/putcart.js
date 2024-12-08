/**
 * 创建 Mongoose 的用户模型数据结构
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    amount:Number,
    checked:Boolean,
    id:String,
    title:String,
    image:String,
    price:Number,
    initPrice:Number
});

const PutcartSchema = new Schema({
    cart:[itemSchema]
})

/**
 * 创建并导出模型
 */
module.exports = mongoose.model('putcart', PutcartSchema);
