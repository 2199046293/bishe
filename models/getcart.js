const { identity } = require('lodash');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义商品 schema
const itemSchema = new Schema({

 amount:Number,
 checked:Boolean,
 id:String,
 title:String,
 image:String,
 price:Number,

});

// 定义首页数据 schema
const cartSchema = new Schema({
 phone:String,
 cart:[itemSchema]
});

// 创建并导出模型
module.exports = mongoose.model('Cart', cartSchema);