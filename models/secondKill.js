const mongoose = require('mongoose');
const { list } = require('../services/parents');
const Schema = mongoose.Schema;
const listSchema = new Schema({
    id: Number,
    title: String,
    image: String,
    price: Number,
    originPrice: Number,
    saleNum: Number,
    couponValue: String,
    isFreePostage: Boolean,
})
const secondKillSchema = new Schema({
    list: [listSchema]
})

  

// 创建并导出模型
module.exports = mongoose.model('secondKill', secondKillSchema);