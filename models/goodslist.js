const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const itemSchema = new Schema({
    id: Number,
    title: String,
    image: String,
    price: Number,
    originPrice: Number,
    saleNum: Number,
    couponValue: String,
    isFreePostage: Boolean,
    tabId: Number
  });


const goodslistSchema = new Schema({
    list: [itemSchema],
    total: Number,
    start: Number,
    nextIndex: Number,
    perpage: Number,
    isEnd: Boolean,
    tabId: Number
})

module.exports = mongoose.model('Goodslist', goodslistSchema);