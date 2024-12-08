const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 定义轮播图 schema
const bannerSchema = new Schema({
    id: Number,
    image: String,
});

const subcategorySchema = new Schema({
    id: Number,
    title: String,
    imageUrl: String,
    word: String,
    parentCategoryId: Number,
    listId: Number,
    listType:String
    
})

// // 定义商品 schema
// const itemSchema = new Schema({
//   id: Number,
//   title: String,
//   image: String,
//   price: Number,
//   originPrice: Number,
//   saleNum: Number,
//   couponValue: String,
//   isFreePostage: Boolean,
//   tabId: Number
// });

// // 定义首页数据 schema
// const  = new Schema({
//   // banners: [bannerSchema],
//   // items: {
//   //   list: [itemSchema],
//   //   total: Number,
//   //   startIndex: Number,
//   //   nextIndex: Number,
//   //   perpage: Number,
//   //   isEnd: Boolean
//   // },
//   categories: [categoriesSchema]
// });

// 创建并导出模型
module.exports = mongoose.model('subcategory', subcategorySchema);