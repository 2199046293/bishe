const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    model: { type: String, required: true },
    sequence: { type: Number, default: 0 }
});

const Counters = mongoose.model('Counters', counterSchema);

// 获取下一个自增 ID 的函数
async function getNextData(modelName) {
    const updatedCounter = await Counters.findOneAndUpdate(
        { model: modelName },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true } // 若不存在则插入新的计数器
    );
    return updatedCounter.sequence;
}

module.exports = { Counters, getNextData };
