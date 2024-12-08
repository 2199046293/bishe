const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const categorySchema = new Schema({
    id:Number,
    name:String,
    imageUrl:String,
    note:String,
})
module.exports = mongoose.model('Category', categorySchema);