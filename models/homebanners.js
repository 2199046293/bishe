const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const homebannersSchema = new Schema({
 src: String,
 background: String,
})

module.exports = mongoose.model('homebanners', homebannersSchema);