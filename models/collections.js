const mongoose = require('mongoose');
const { getNextData } = require('./counters'); // 导入计数器函数

const recommentSchema = new mongoose.Schema({  
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

// 在保存之前生成自增 ID
recommentSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            let nextId = await getNextData('ObjectItem'); // 获取下一个自增 ID
            this.id = String(nextId); // 转换为字符串类型并赋值
            console.log('生成自增ID成功：', nextId);
        } catch (error) {
            return next(new Error('生成ID失败'));
        }
    }
    
    this.update_time = Date.now(); // 更新修改时间
    next();
});

// 创建并导出模型
module.exports = mongoose.model('recomment', recommentSchema);
