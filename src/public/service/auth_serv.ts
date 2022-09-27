const dotenv = require('dotenv');
require("dotenv").config();

const jwt = require('jsonwebtoken');

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
//Node.js’s built-in crypto library内置的加密库
require('crypto').randomBytes(64).toString('hex')

//生成访问令牌
export function generateAccessToken(username:any) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


/*用户使用用户名密码来请求服务器
服务器进行验证用户的信息
服务器通过验证发送给用户一个token
客户端存储token，并在每次请求时附送上这个token值
服务端验证token值，并返回数据
*/

// GET https://example.com:4000/api/userOrders
// Authorization: Bearer JWT_ACCESS_TOKEN

// // get token from fetch request
// const token = await res.json();

// // set token in cookie
// document.cookie = `token=${token}`

//middleware function for authentication 
export function authenticateToken(req:any , res:any, next:any) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  // front: authorisation: Bearer TOKEN
  // so split with space ' '
  // => ['Bearer', 'TOKEN']
  // [1]: TOKEN

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}