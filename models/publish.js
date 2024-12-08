const mongoose = require('mongoose');
const { getNextData } = require('./counters'); // 导入计数器函数
// const collections = require('./collections');
const Schema = mongoose.Schema;

const itemsSchema = new Schema({  
    id: {
        type: String
    },
    title: String,
    image: String,
    price: Number,
    originPrice: Number,
    saleNum: Number,
    couponValue: String,
    isFreePostage: Boolean,
    tabId: Number,
});
const addressSchema=new Schema({
    address: String,
    name: String,
    phone: String,
    isdefult: Number,
    id: {
        type: String
    },
    moreAddres: String,
})

const objectItemSchema = new Schema({  
    img: [String],
    desc: String,
    price: Number,
    avatar: String,
    category: String,
    id: {
        type: String,
    },
    create_time: {
        type: Date,
        default: Date.now
    },
    update_time: {
        type: Date,
        default: Date.now
    },
});

// 修改recommentSchema
const recommentSchema = new Schema({  
    isEnd: Boolean,
    perpage: Number,
    start: Number,
    nextIndex: Number,
    total: Number,
    username: String,
    token: String,
    img: [String],
    desc: String,
    price: Number,
    avatar: String,
    category: String,
    //这是每次发布的时候会再arrs中添加一个对象，每个对象都有id字段，id字段的值为自增ID
    arrs: [{
        type: objectItemSchema,
        id: { type: String } // 为每个 arrs 中的对象添加 id 字段
    }],
    collections:[{
        type: objectItemSchema,
        id: { type: String }
    }],
    addresslist:[{
        type: addressSchema,
        id: { type: String }

    }],
    create_time: {
        type: Date,
        default: Date.now
    },
    update_time: {
        type: Date,
        default: Date.now
    },
});

// 在保存之前生成自增 ID并赋值给arrs中的每个对象
recommentSchema.pre('save', async function(next) {
    if (this.isNew) {
        for (const item of this.collections) {
            item.id = String(await getNextData('PublishCart')); // 对每个 item 获取自增 ID
        }
        this.id = String(nextId); // 转换为字符串类型
        console.log('nextId:', nextId);
        for(const item of this.addresslist){
            item.id = String(await getNextData('Address')); // 对每个 item 获取自增 ID
        }
        
        // 为arrs中的每个对象生成自增 ID
        for (const item of this.arrs) {
            item.id = String(await getNextData('ObjectItem')); // 对每个 item 获取自增 ID
        }
    }
    next();
});

// 单例定义模型以防止重复定义
const PublishCartModel = mongoose.models.publishCart || mongoose.model('publishCart', recommentSchema);

// 导出模型
module.exports = PublishCartModel;
