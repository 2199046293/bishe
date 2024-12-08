const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const carouselListItem =new Schema({
    nickName: String,
    avatar: String,
    desc: String,
  })
const descContentListItem =new Schema({
    id: Number,
    url: String

})
const photoItem =new Schema({
    id: Number,
    url: String
  })
const detailSchema=new Schema({
  
    id: String,
    image: String,
    title: String,
    price: Number,
    originPrice: Number,
    carouselList: [carouselListItem],
    couponValue: String,
    descContentList: [descContentListItem],
    photo: [photoItem]
})
// const detailSchema=new Schema({
//     detail: detail
// })


module.exports = mongoose.model('Detail', detailSchema);
