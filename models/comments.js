const mongoose = require('mongoose');
const { getNextSequence } = require('./counter'); // 导入计数器函数

const CommentSchema = new mongoose.Schema({
    
        id: String,
        owner: {type:Boolean,default:false},
        hasLike :{type:Boolean,default:false},
        likeNum:{type:Number,default:0},
        avatarUrl:{type:String,default:null},
        nickName: String,
        content: String,
        parentId: {type:String, default:null},
        goodsId: String,
        createTime: {type:Date, default:Date.now}
      
});

const commentListItem = new mongoose.Schema({
    readNumer:{type:Number, default:0},
    commentList: [CommentSchema]
})

CommentSchema.pre('save', async function(next) {
    if (this.isNew) {
        this.id = String(await getNextSequence('PublishComment')); // 对每个 item 获取自增 ID
    }
    next();
});

module.exports = mongoose.model('comment', CommentSchema);

