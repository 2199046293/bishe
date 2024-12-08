const User = require('../models/user');
const Token = require('../utils/token')
const Homepage = require('../models/homepage');
const recomment=require('../models/recomment')
const secondKill=require('../models/secondKill')
const Detail=require('../models/detail');
// const detail = require('../models/detail');
const Category=require('../models/category');
// const { list } = require('./parents');
const subcategory=require('../models/subcategory');
const Goodslist=require('../models/goodslist');
const Mine=require('../models/mine');
const { get, has } = require('lodash');
const user = require('../models/user');
const Cart = require('../models/getcart');
const homebanners=require('../models/homebanners');
const UserRegister=require('../models/userRegister');
const userRegister = require('../models/userRegister');
const publishCart=require('../models/publish');
const { getNextData } = require('../models/counters'); // 导入计数器函数
const { getNextSequence } = require('../models/counter');
const comment = require('../models/comments');
/**
 * 用户登录处理
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
function login(req, res, next) {
  // 利用解构赋值语法获取用户提交的用户名和密码
  const { username, password } = req.body;

  // 利用 mongoose 在数据库中比对查询登录用户的信息
  User.findOne({
    username,
    password
  }).then(user => {
    if (user) {
      // 登录成功，利用 jwp-simple，生成 token
      const token = Token.generate(user)
      // 登录成功，向前端返回 JSON 格式的数据
      // 在前后端交互时，通常会先进行约定，约定后端向前端
      // 返回的 JSON 对象的格式，比如: {code, message, data}
      // 通常约定，code 为 200 表示成功，-1 表示失败
      //登录成功后生成的token数据，会存储在仓库里面，然后在每次发送请求时候，都会从仓库里面获取token数据，如果有的话，就在请求头中带上token数据。我生成的token数据，已经存储到了仓库里面，并进行了持久化保存，每次页面刷新也不会消失，因此，我的仓库里面已经有了token数据，因此只需要从仓库中获取到token数据作为唯一标识，通过token数据，获取该用户的基本信息。

      //注意，在登录的时候，还需要从数据库中查询有没有phone的值，如果有的话才会登录，没有的话，就跳出提示，请先注册。

      //增加用户信息，将从仓库里面获取到的token数据，在我的页面出现的时候，就会触发一个请求，将token数据和用户登录信息：包括用户账号  （还有三个默认项，scores,nickname,avatarUrl这些设置默认值）一起发送给后端1存储起来（这是增加用户信息的功能）
      // 
      // 然后在页面加载完成后，发送请求，从仓库中找到token数据，然后传给后端，用来作为用户的id使用，通过用户token，找到数据库中对应的用户信息，主要是为了获得phone和nickname两个数据，然后返回给前端。
      res.json({
        code: 200,
        data: {
          // userinfo: user,
          status:200,
          message: '登录成功',
          token,
        },
        message: '',
      })
    } else {
      // 登录失败
      res.json({
        code: -1,
        message: '用户名或密码错误'
      })
    }
  })
}


//
 function ChangePassword(req, res, next){
  const { username, password } = req.body;
  User.findOneAndUpdate(
      {username: username},
      { $set: { password: password } },  
      { returnDocument: "after" } )
  .then(user => {
    if (user) {
      res.json({
        code: 200,
        data: {
          // userinfo: user,
          status:200,
          message: '密码更改成功',
          user,
        },
        message: '',
      })
    } else {
      // 登录失败
      res.json({
        code: -1,
        message: '密码更改失败'
      })
    }
  })
}

// 添加用户信息
async function addgoods(req, res) {
  try {
      const goods = req.body;
      console.log(goods)

      // 输入验证（确保重要的字段不为 null）
      if (!goods.username || !goods.price) {
          return res.status(400).json({
              code: 400,
              message: 'Username and price are required'
          });
      }

      // 检查是否已经存在具有相同 id 的文档（如果使用到 id）
      const existingItem = await recomment.findOne({ id: goods.id });
      if (existingItem) {
          return res.status(400).json({
              code: 400,
              message: 'Item with this ID already exists'
          });
      }

      // 若无问题，则插入数据
      const result = await recomment.create(goods);
      res.status(200).json({
          code: 200,
          message: 'Created',
          data: result
      });
  } catch (error) {
      if (error.code === 11000) {
          res.status(400).json({
              code: 400,
              message: 'Duplicate key error: ' + error.message
          });
      } else {
          res.status(500).json({
              code: 500,
              message: 'Internal Server Error',
              error: error.message
          });
      }
  }
}



// 修改用户发布信息
async function updategoods(req, res){
  const {goods}=req.body
  try{
    const result=await recomment.updateOne({id:goods.id,category:goods.category,desc:goods.desc},{$set:{
      price:goods.price,
  
      img:goods.img,
  
      category:goods.category,
  
      desc:goods.desc,
    }})
    console.log(result)
    res.json({
      code:200,
      message:'更新成功',
      data:result
    })
  }catch(err){  
  res.json({
    code:-1,
    message:'更新失败',
    data:err
  })
  }
}

//修改用户发布信息2

/**
 * 用户注册处理
 */
async function register(req, res, next) {
  // 获取用户提交的用户名和密码
  const { username, password } = req.body;

  try {
    // 查找是否存在该手机号对应的用户
    let user = await User.findOne({ username: username });

    if (user) {
      // 如果用户已经存在，更新密码字段
      await User.updateOne(
        { username: username }, // 查找条件
        { $set: { password: password } } // 更新操作
      );
      
      res.json({
        code: 200,
        message: '密码更新成功',
        data: {
          status: 200,
          message: '密码更新成功',
          data: user
        }
      });
    } else {
      // 如果用户不存在，创建新用户
      user = await User.create({
        username: username,
        password: password,
      });
      res.json({
        code: 200,
        message: '注册成功',
        data: {
          status: 200,
          message: '注册成功',
          data: user
        }
      });
    }
  } catch (err) {
    // 捕捉可能的错误
    res.json({
      code: -1,
      message: '操作失败',
      data: {
        status: -1,
        message: '操作失败',
        data: err
      }
    });
  }
}


/**
 * 用户注册，验证用户名是否已存在
 */
function checkUsername(req, res, next) {
  // 获取用户提交的用户名
  const { username } = req.query;
  // 在数据库中查询用户名是否存在
  User.findOne({
    username
  }).then(user => {
    if (user) {
      // 用户名已存在
      res.json({
        code: 200,
        message: '用户名已存在',
        data:{
          status:200,
          message:'用户名已存在'
        }
      })
    } else {
      // 用户名可用
      res.json({
        code: 404,
        message: '用户名可用',
        data:{
          status:404,
          message:'用户名可用'
        }
      })
    }
  })
}
// 发送验证码
// 发送验证码
async function sendCode(req, res, next) {
  const { phone } = req.body;
  const code = String(Math.floor(Math.random() * 9000) + 1000);

  try {
    // 查找是否存在该手机号的用户
    let user = await User.findOne({ username: phone });

    if (user) {
      // 如果存在，更新验证码
      user.code = code;
      await user.save(); // 保存更新
    } else {
      // 如果不存在，创建新用户
      user = await User.create({
        username: phone,
        code: code,
        password: undefined, // 密码为空，防止前端提交密码
      });
    }

    // 发送成功的响应
    res.json({
      code: 200,
      message: '发送成功',
      data: {
        code
      }
    });
  } catch (err) {
    // 发送失败的响应
    res.json({
      code: -1,
      message: '发送失败',
      data: err
    });
  }
}


//验证验证码

async function checkPhone(req, res, next) {
  const { phone,code } = req.query;
  // 在数据库中查询是否正确
  User.findOne({
   username: phone,
   code: code
  }).then(user => {
    if (user) {
      // 正确
      res.json({
        code: 200,
        message: '验证码验证成功',
        data:{
          status:200,
          message:'验证码验证成功'
        }
      })
    } else {
      // 用户名可用
      res.json({
        code: 404,
        message: '验证失败',
        data:{
          status:404,
          message:'验证失败'
        }
      })
    }
  })
 
}
// 首页数据查询，查询首页数据信息
 async function getTabData(req, res, next)
{
 const result= await Homepage.find()
 console.log(result)
 res.json({
  code:200,
  data:{
    banners:result[0].banners,
    items:result[0].items,
  }
 })
}
//增加首页数据信息???失败了，到时候再看
async function addTabData(req, res, next)
{
  
 const homepageData=req.body
 const result= await Homepage.create(homepageData)
 res.json({
  code:200,
  data:result,
  message:'添加成功'
 })

}
//
async function getGuessYouLike(req, res, next){
  
  const result=await recomment.find({
    // start:req.query.start
  })
  // const {isEnd,list,perpage,nextIndex,start,total,username,img,desc,price,avatar,create_time}=result[0]
  const {username,img,desc,price,avatar,create_time,category,id}=result
  console.log(result)
  res.json({
    code:200,
    data:{
      result
    }
  })
}
// 获取我的发布信息
async function getMyPublish(req, res, next) {

  const token = req.headers.authorization?.split(' ')[1];
  // 检查是否提供了 token
    if (!token) {
      return res.json({
        code: -1,
        message: '未提供token'
      });
    }
    try {
      // 解码 token 数据
      const decoded = Token.verify(token);
      // 查询用户详情
      const result = await publishCart.findOne({
        username: decoded.username
      });
      console.log(result)
      res.json({
        code: 200,
        data: result
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        code: -1,
        message: '服务器错误'
    });
     
    }
}


//点击发布，点击了发布了之后，会将token数据和数据一起传给后端
async function publish(req, res, next) {
  const goods = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  // 检查是否提供了 token
  if (!token) {
      return res.json({
          code: -1,
          message: '未提供token'
      });
  }

  try {
      // 解码 token 数据
      const decoded = Token.verify(token);
      // 查询用户详情
      const result = await publishCart.findOne({
          username: decoded.username
      });

      let arrs = [];
      let collections = [];
      const action = goods.goods.action; // 获取动作类型

      // 如果没有用户数据，则创建新数据
      if (!result) {
          
          if (action === 'publish') {
            // 为新商品生成自增 ID
             const newpublish = String(await getNextData('ObjectItem')); // 生成自增 ID
              goods.goods.id = newpublish; // 将 ID 赋值给新商品的 id 字段

              arrs.push(goods.goods);
              const newComment = await publishCart.create({
                  username: decoded.username, // 使用用户名
                  token: token,
                  arrs: arrs,
                  collections: collections,
              });
              res.json({
                  code: 200,
                  data: newComment,
                  message: '发布成功'
              });
          } else if (action === 'collect') {
              collections.push(goods.goods);
              const newCollection = await publishCart.create({
                  username: decoded.username,
                  token: token,
                  arrs: arrs,
                  collections: collections,
              });
              res.json({
                  code: 200,
                  data: newCollection,
                  message: '收藏成功'
              });
          } else {
              return res.json({
                  code: -1,
                  message: '无效的操作'
              });
          }
      } else {
          arrs = result.arrs || []; // 获取已有的发布内容数组
          collections = result.collections || []; // 获取已有的收藏内容数组
          if (action === 'publish') {
             // 为商品生成自增 ID
              const newsId = String(await getNextData('ObjectItem')); // 生成自增 ID
              goods.goods.id = newsId; // 将 ID 赋值给即将添加的商品
              arrs.push(goods.goods);
              // 如果有用户数据，则更新其发布内容
              const updatedComment = await publishCart.findOneAndUpdate(
                  { username: decoded.username }, // 根据用户名查找
                  { $set: { arrs: arrs } }, // 更新发布内容
                  { new: true } // 返回更新后的文档
              );

              res.json({
                  code: 200,
                  data: updatedComment,
                  message: '发布成功'
              });
          } else if (action === 'collect') {
              collections.push(goods.goods);
              // 点击收藏按钮，更新收藏信息
              const updatedCollection = await publishCart.findOneAndUpdate(
                  { username: decoded.username }, // 根据用户名查找
                  { $set: { collections: collections } }, // 更新收藏内容
                  { new: true } // 返回更新后的文档
              );
 
              res.json({
                  code: 200,
                  data: updatedCollection,
                  message: '收藏成功'
              });
          } else {
              return res.json({
                  code: -1,
                  message: '无效的操作'
              });
          }
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          code: -1,
          message: '服务器错误'
      });
  }
}

//删除我的收藏
async function deleteCollection(req, res, next){
  const goods=req.body
  console.log(goods)

  const token = req.headers.authorization?.split(' ')[1];

  // 检查是否提供了 token
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  try{
      // 解码 token 数据
      const decoded = Token.verify(token);

      // 查询用户详情

      const result = await publishCart.findOne({

          username: decoded.username

      });
      result.collections.splice(result.collections.findIndex(item => item.id === goods.id), 1);

      const updatedCollection = await publishCart.findOneAndUpdate(

          { username: decoded.username }, // 根据用户名查找

          { $set: { collections: result.collections } }, // 更新收藏内容

          { new: true } // 返回更新后的文档

      );
      res.json({
        code:200,
        data:updatedCollection,
        message:'删除成功'
      })
  }catch(err){
    console.error(err);
    return res.state(500).json({
        code: -1,
        message: '服务器错误'
    })
  }
}


// 收藏的全部商品
async function getMyCollection(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

    // 检查是否提供了 token
    if (!token) {
      return res.json({
          code: -1,
          message: '未提供token'
      });
  }
  try{
      // 解码 token 数据
      const decoded = Token.verify(token);
      // 查询用户详情
      const result = await publishCart.findOne({
          username: decoded.username
      });
      console.log('我的收藏',result) 
      res.json({
        code:200,
        data:result.collections,
        message:'获取成功'
      })

  }catch(err){
    console.error(err);
    return res.status(500).json({
        code: -1,
        message: '服务器错误'
    });
  }
}



// 修改我的发布页面
async function updatepublish(req, res, next) {
  const updatedGoods = req.body; // 假设传来的对象中包含 id 和其他需要更新的数据
  const token = req.headers.authorization?.split(' ')[1];

  // 检查是否提供了 token
  if (!token) {
      return res.json({
          code: -1,
          message: '未提供token'
      });
  }

  try {
      // 解码 token 数据
      const decoded = Token.verify(token);
      // 查询用户详情
      const result = await publishCart.findOne({
          username: decoded.username
      });

      if (!result) {
          return res.json({
              code: -1,
              message: '用户未找到'
          });
      }

      let arrs = result.arrs || [];  // 获取已有的发布内容数组
      const itemIndex = arrs.findIndex(item => item.id == updatedGoods.id); // 根据 ID 找到要更新的对象

      if (itemIndex === -1) {
          return res.json({
              code: -1,
              message: '未找到要更新的商品'
          });
      }

      // 更新找到的对象
      arrs[itemIndex] = { ...arrs[itemIndex], ...updatedGoods }; // 使用传入的数据更新

      // 更新数据库中的发布内容
      const updatedComment = await publishCart.findOneAndUpdate(
          { username: decoded.username }, // 根据用户名查找
          { $set: { arrs: arrs } }, // 更新发布内容
          { new: true } // 返回更新后的文档
      );

      res.json({
          code: 200,
          data: updatedComment,
          message: '更新成功'
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          code: -1,
          message: '服务器错误'
      });
  }
}
//同步到首页，修改recomment数据
async function updateRecomment(req, res, next) {
  const updatedGoods = req.body; // 假设传来的对象中包含 id 和需要更新的数据
  console.log('test',updatedGoods.goods)
  const token = req.headers.authorization?.split(' ')[1];

  // 检查是否提供了 token
  if (!token) {
      return res.json({
          code: -1,
          message: '未提供token'
      });
  }

  try {
      // 解码 token 数据
      const decoded = Token.verify(token);
      
      // 查找要更新的商品
      const result = await recomment.findOne({ id: updatedGoods.goods.id });
      console.log('result',result)
      
      // 检查商品是否存在
      if (!result) {
          return res.json({
              code: -1,
              message: '未找到对应商品'
          });
      }
      // const {goods}=updatedGoods
      // console.log('goods',goods)
      // const data={...result, ...goods}
      // console.log('data',data)
      const updateData = {
        username: updatedGoods.username || result.username,
        img: updatedGoods.goods.img || result.img,
        desc: updatedGoods.goods.desc || result.desc,
        price: updatedGoods.goods.price || result.price,
        avatar: updatedGoods.goods.avatar || result.avatar,
        category: updatedGoods.goods.category || result.category,
        id: updatedGoods.goods.id || result.id,
        // 继续添加需要更新的字段...
    };

    const updatedComment = await recomment.updateOne(
      { id: updatedGoods.goods.id},
      { $set: updateData } // 只更新指定字段
  );
      // const newdata=await recomment.replaceOne({id:updatedGoods.goods.id},data)
      console.log('nihao',updatedComment)
    

      res.json({
          code: 200,
          data:updatedComment,
          message: '更新成功'
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          code: -1,
          message: '服务器错误'
      });
  }
}

async function deleteRecomment(req, res, next) {
  const updatedGoods = req.body; // 假设传来的对象中包含 id 和需要更新的数据
  console.log(updatedGoods)
  const token = req.headers.authorization?.split(' ')[1];

  // 检查是否提供了 token
  if (!token) {
      return res.json({
          code: -1,
          message: '未提供token'
      });
  }
  let id=String(Number(updatedGoods.id))
  try{
    const decoded = Token.verify(token);
       // 查找要删除的商品
       const result = await recomment.deleteOne({ id: id });
       console.log('result',result)
       res.json({
        code: 200,
        data:result,
        message: '删除成功'
    });
  }catch(err){
    console.error(err);
    return res.status(500).json({
        code: -1,
        message: '服务器错误',
        data: err
    });

  }

}


//商品详情页,每一件商品都给他标签id值，根据标签id值查询对应的那一行数据，
async function getProductDetail(req, res, next){
  const result=await Detail.find({
    id:req.query.id
  })
  console.log(result[0])
const {id,image,title,price,originPrice,carouselList,couponValue,descContentList,photo,detail}=result[0]
// console.log('xx',detail)
  res.json({
    code:200,
    data:{
      detail:{
        id,
        image,
        title,
        price,
        originPrice,
        carouselList,
        couponValue,
        descContentList,
        photo
      }
    },
  })
}
//商品详情毕设
async function getbisheDetail(req, res, next){
  const result=await recomment.find({
    id:req.query.id,
    // username:req.query.username
  })
  console.log(result)
const {username,img,desc,price,avatar,create_time,category,id,_id}=result[0]
// console.log('xx',detail)
  res.json({
    code:200,
    data:{
        username,
        img,
        desc,
        price,
        avatar,
        create_time,
        category,
        id,
        _id,
    
    },
  })
}

//商品秒杀数据查询，轮播图
async function getSeckillData(req, res, next){
  const result=await secondKill.find()
  console.log(result)
  res.json({
    code:200,
    data:{
      list:result[0].list,
    },
    message:'获取成功'
  })
}

//删除商品

async function deleteGoods(req, res, next){
  const goods=req.body
  console.log(goods)
  const token = req.headers.authorization?.split(' ')[1];
  // 检查是否提供了 token
  if (!token) {
      return res.json({
          code: -1,
          message: '未提供token'
      });
  }
  try {
      // 解码 token 数据
      const decoded = Token.verify(token);
          // 查询用户详情
          const result = await publishCart.findOne({
            username: decoded.username
        });
  
        if (!result) {
            return res.json({
                code: -1,
                message: '用户未找到'
            });
        }

        let arrs = result.arrs || [];  // 获取已有的发布内容数组
        const itemIndex = arrs.findIndex(item => item.id == goods.id); // 根据 ID 找到要删除的对象
        if (itemIndex === -1) {
          return res.json({
              code: -1,
              message: '未找到要删除的商品'
          });
      }
      arrs.splice(itemIndex, 1); // 删除数组中的元素
      // 更新数据库中的发布内容
      const updatedComment = await publishCart.findOneAndUpdate(
        { username: decoded.username }, // 根据用户名查找
        { $set: { arrs: arrs } }, // 更新发布内容
        { new: true } // 返回更新后的文档
    );
    res.json({ 
      code: 200,
      data: updatedComment,
      message: '更新成功'
  });

      
  }catch (err) {

      console.error(err);

      return res.status(500).json({
          code: -1,
          message: '服务器错误'
      });
}
}


//主分类数据查询
async function getMainCategory(req, res, next){
  const result=await Category.find({}).skip(55)
  console.log(result)
  res.json({
    code:200,
    data:{
      result,

    }
  })
}

// 子分类数据查询
async function getSubCategory(req, res, next){
  const result=await subcategory.find({
    parentCategoryId:req.query.id
  })
  console.log(result)
  res.json({
    code:200,
    data:{
      categories:result
    }
  })

}

//商品列表查询
//根据id项找到对应商品列表
async function getProductList(req, res, next){
  const result=await Goodslist.find({
    tabId:req.query.id,
    start:req.query.start
  })
  
  console.log(result)
  res.json({
    code:200,
    data:{
      isEnd:result[0].isEnd,
      tabId:result[0].tabId,
      list:result[0].list,
      perpage:result[0].perpage,
      nextIndex:result[0].nextIndex,
      start:result[0].start,
      total:result[0].total
    }
  })
}

// 根据token获取用户信息,获取请求头中的token，解码token,用户登录的数据库数据包括username,password,nickname,avatar四种数据类型，token数据的结果就是这四种数据类型的内容数据。
// phone: String,
// // 昵称
// nickname:{type:String,default:'白丁用户'},
// avatarUrl: {type:String,default:'https://joeschmoe.io/api/v1/random'},
// scores:{type:Number,default:999},
// // status:{type:Number,default:1},
// //用户名
// username:String
// 点击登录，向服务器发送请求，携带token，服务器根据token获取用户信息
async function getUserInfo(req, res, next) {
  try {
    const token=req.headers.authorization?.split(' ')[1]
    if(!token){
      return res.json({
        code:-1,
        message:'未提供token'
      })
    }
//解码token数据
    const decoded=Token.verify(token)
    //查询电话对应的用户详情信息，包括电话号码，昵称，头像，积分，用户名
    const result=await User.findOne({
      username:decoded.username
    })
    console.log(result)
    res.json({
      code:200,
      data:{
        userInfo:result
      }
    })
  } catch (error) {
    console.error('Get user info error:', error);
  }
}

//获取当前用户的购物车数据
async function getCartData(req,res,next){
 try{
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  //解码用户token数据，
  const decoded=Token.verify(token)
  const result=await Cart.find({
    phone:decoded.username
  })
  console.log('chaxun:', result)
  res.json({
    code:200,
    data:{
      cart:result[0].cart}
  })
 }catch (error) {
  console.error('Get user info error:', error);

 }

}

//更新购物车的数据，点击登录了之后，请求头中携带token数据，当添加了商品到购物车中，会将数据存储到仓库里面，在每次购物车的数据发生了变化，都会触发更新购物车数据的请求，他会获取到当前请求头中的token数据，获取当前用户的phone,将用户名和购物车列表都传给后端进行修改更新。 
// 当每次登录之后，都会生成token数据，根据生成的token数据找到token数据的username，在数据库中查询username对应的购物车数据，默认购物车的数据为空，但是当购物车的数据变化了，同步仓库里面数据的变化，当仓库里面的数据变化，将修改数据库中购物车里面的数据，在每次登录的时候，生成一个token数据，当页面登录过后，就会找到token数据对应的phone，同时查询phone对应的购物车数据，传给前端。
// 然后当购物车的数据变化后，在后端接口中实时更新当前用户的token数据和购物车数据。每次登录之后，生成的token数据
async function updateCartData(req,res,next){
  try{
    const token=req.headers.authorization?.split(' ')[1]
    if(!token){
      return res.json({
        code:-1,
        message:'未提供token'
      })
    }
    //解码用户token数据
    const decoded=Token.verify(token)

    const {cart}=req.body

    // 根据token数据对应的phone,修改购物车的数据
    const result=await Cart.updateOne({phone:decoded.username},{$set:{cart:[...cart]}})
    console.log(result)
    res.json({
      code:200,
      message:'更新成功',
      data:result
    })
  }catch (error) {
    console.error('Get user info error:', error);
  }
}

// 发布评论
async function publishComment(req,res,next){
  const {content,goodsId,parentId}=req.body
  console.log('评论',content)
  console.log('商品id',goodsId)
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  } 
  try{
    const decoded=Token.verify(token)
    const result=await comment.create({
      content:content,
      goodsId: goodsId,
      nickName:decoded.username,
      parentId:parentId
    })
    res.json({
      code:200,
      data:result
    })


  }catch(error){
    console.error('Get user info error:', error);
  }
   
}
// 查找商品评论
async function getComment(req,res,next){
  const {goodsId}=req.query
  console.log('商品id',goodsId)
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  
  }
  try{
    const result=await comment.find({
      goodsId:goodsId
    })
    console.log(result)
    res.json({
      code:200,
      data:{
        message:"评论显示成功",
        result
      }
    })

  }catch(error){
    console.error('Get user info error:', error);
  }
 
}

//查找我的评论信息
async function getMyComment(req,res,next){
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  
  }
  try{
    const decoded=Token.verify(token)
    const result=await comment.find({
      nickName:decoded.username
    })
    console.log(result)
    res.json({
      code:200,
      data:{
        message:"评论显示成功",
        result
      }
    })

  }catch(error){
    console.error('Get user info error:', error);
    return res.status(500).json({
      code:500,
      message: '服务器错误'
    });
  }
}

//删除我的评论
async function deleteComment(req,res,next){
  const {id}=req.body
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  try{
    const result=await comment.deleteOne({
      id:id
    })
    console.log(result)
    res.json({
      code:200,
      data:result
    })

  }catch(error){
    console.error('Get user info error:', error);
    return res.status(500).json({
      code:500,
      message: '服务器错误'
    });
  
  }
}
//喜欢商品，给商品点赞
async function addLikes(req,res,next){
  const {goodsId}=req.body
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  try{
      // 确定新的 hasLike 值
      const commentToUpdate = await comment.findOne({ id: goodsId });
      const incrementValue = commentToUpdate.hasLike ? -1 : 1; // 更新 likeNum：如果有赞则加1，否则减1
      const result = await comment.updateOne(
      { id: goodsId }, // 查找对应的商品
      {
         $set:{hasLike:!commentToUpdate.hasLike},
         $inc:{likeNum:incrementValue}
      },  
  );
  
    console.log('点赞结果',result)
    res.json({
      code:200,
      data:result
    })

  }catch(err){
    console.error('Get user info error:', err);
  }
}

async function getHomeBanners(req,res,next){
  const result=await homebanners.find()
  console.log(result)
  res.json({
    code:200,
    data:{
      message:"轮播图显示成功",
      result
    }})
}

///新增地址
async function addAddress(req,res,next){
  const data=req.body
  console.log(data)
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  try{
    const decoded=Token.verify(token)
    const result = await publishCart.findOne({
      username: decoded.username
  });
  console.log(result)
  arrs = result.arrs || []; // 获取已有的发布内容数组
  collections = result.collections || []; // 获取已有的收藏内容数组
  addressArr = result.addresslist || [];
  const newsId = String(await getNextData('Address')); // 生成自增 ID
  data.id = newsId; // 将 ID 赋值给即将添加的商品
  addressArr.push(data);
  // 如果有用户数据，则更新其发布内容
  const updatedComment = await publishCart.findOneAndUpdate(
      { username: decoded.username }, // 根据用户名查找
      { $set: { addresslist: addressArr } }, // 更新发布内容
      { new: true } // 返回更新后的文档
  );

  res.json({
      code: 200,
      data: updatedComment,
      message: '发布成功'
  });

  }catch(error){
    console.error('Get user info error:', error);
}

}
// 修改地址
async function updateAddress(req,res,next){
  const data=req.body
  console.log(data)
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  try{
    const decoded=Token.verify(token)
    const result = await publishCart.findOne({
      username: decoded.username,
  });
  console.log(result)
  addressArr = result.addresslist || [];
  const goods=addressArr.filter(item => item.id != data.id);
  //拼接新的数组
  const newArr=[...goods,data]

  // 如果有用户数据，则更新其发布内容    
  const updatedComment = await publishCart.findOneAndUpdate(
      { username: decoded.username }, // 根据用户名查找
      { $set: { addresslist: newArr } }, // 更新发布内容
      { new: true } // 返回更新后的文档
  );

  res.json({
      code: 200,
      data: updatedComment,
      message: '修改成功'
  });

  }catch(error){
    console.error('Get user info error:', error);
  }
}
async function myAddress(req,res,next){
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
  try{
    const decoded=Token.verify(token)
    const result=await publishCart.findOne({
      username:decoded.username
    })
    console.log(result)
    res.json({
      code:200,
      data:{
        addresslist:result.addresslist
      }
    })
  }catch(error){
    console.error('Get user info error:', error);

  }
}

//删除我的地址
async function deleteAddress(req,res,next){
  const data=req.body
  console.log(data)
  const token=req.headers.authorization?.split(' ')[1]
  if(!token){
    return res.json({
      code:-1,
      message:'未提供token'
    })
  }
    try{
      const decoded=Token.verify(token)
      const result = await publishCart.findOne({
        username: decoded.username
    });
      console.log(result)
      addressArr = result.addresslist || [];
      const index=addressArr.findIndex(item => item.id == data.id);
    addressArr.splice(index,1)
    const updatedComment = await publishCart.findOneAndUpdate(
      { username: decoded.username }, // 根据用户名查找
      { $set: { addresslist: addressArr } }, // 更新发布内容
      { new: true } // 返回更新后的文档
  ); 
    res.json({
        code: 200,
        data: updatedComment,
        message: '删除成功'
    });

  }catch(error){
    console.error('Get user info error:', error);

  }

}
//上传头像
async function uploadAvatar(req, res, next) {
  const data = req.body; // 确保包含 avatarUrl
  console.log('data',data);
  
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.json({ code: 401, message: '请先登录' });
  }
  
  try {
    const decoded = Token.verify(token);
    
    // 检查 avatarUrl 是否存在
    if (!data.avatarUrl) {
      return res.json({ code: 400, message: '缺少头像 URL' });
    }

    const result = await User.updateOne(
      { username: decoded.username },
      { $set: { avatarUrl: 'nihao' } }
    );
    
    console.log(result);
    
    if (result.nModified > 0) {
      res.json({
        code: 200,
        message: '头像更新成功',
        data: result
      });
    } else {
      res.json({
        code: 404,
        message: '用户未找到或头像未更改'
      });
    }
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}



// 导出
module.exports = { login, register, check: checkUsername, getTabData ,addTabData,getGuessYouLike,getSeckillData,getProductDetail,getMainCategory,getSubCategory,getProductList,getUserInfo,getCartData,updateCartData,addgoods,getHomeBanners,getbisheDetail,sendCode,checkPhone,ChangePassword,publish,getMyPublish,updategoods,updatepublish,updateRecomment,deleteGoods,deleteRecomment,getMyCollection,deleteCollection,publishComment,getComment,addLikes,getMyComment,deleteComment,addAddress,updateAddress,myAddress,deleteAddress,uploadAvatar }