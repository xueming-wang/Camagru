const dotenv = require('dotenv');
require("dotenv").config();



export function usernameConfimation(username:any) {
	if (username.length < 5 || username.length > 10) 
    return false;
	if (/^[a-zA-Z]+$/.test(username) == false) 
    return false;
  return true;
}

export function passwordConfirmation(password:any) {
	for(let i = 0; i < password.length; i++) {
		if (password.length < 5 || password.length > 15) return false;
		if (/^[a-zA-Z]+$/.test(password[i]) == false && /^[0-9]+$/.test(password[i]) == false) return false;
	}
  return true;
}

export function isEmail(email:any) {
	var reg = /^[0-9a-zA-Z]+@[0-9a-zA-Z]+.[0-9a-zA-Z]+$/;
	return reg.test(email) ? true : false;
}

// get config vars
dotenv.config();
// access config var
process.env.TOKEN_SECRET;
//Node.js’s built-in crypto library内置的加密库
require('crypto').randomBytes(64).toString('hex')

//middleware function for authentication 
// export function authenticateToken(req:any , res:any, next:any) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   // front: authorisation: Bearer TOKEN
//   // so split with space ' '
//   // => ['Bearer', 'TOKEN']
//   // [1]: TOKEN

//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
//     console.log(err)

//     if (err) return res.sendStatus(403)

//     req.user = user

//     next()
//   })
// }