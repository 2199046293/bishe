const jwt = require('jwt-simple');

const secret = '12l3k4jlAsa8JiLSj892314.asfd.1234hjas'

// 导出生成 token 与 验证 token 的方法
module.exports = {
  generate: payload => {
    return jwt.encode(payload, secret);
  },
  verify: token => {
    return jwt.decode(token, secret);
  }
}
