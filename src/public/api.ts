
import express, { Router, Response, Request } from "express"
import * as userDB from "./userDB";
import { sendMail } from "./service/mail_serv";
import { encrypt, decrypt } from "./service/encrypt_serv";
import { usernameConfimation, passwordConfirmation, isEmail } from "./service/auth_serv";
import { authMiddlewere } from "./service/auth_serv";


export const router: Router = express.Router();
router.use(express.json());

//中间件

//一个请求和一个响应对象作为参数
router.get('/', function(_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/homePage.html");
	console.log("GET 首页")
});

router.get('/home', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/homePage.html");	
	console.log("GET 首页")
});

router.get('/signup', function(_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/signupPage.html");
	console.log("GET注册页面");
});

router.get('/login', function(_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/loginPage.html");
	console.log("GET登陆页面");
})

router.get('/montage', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/montagePage.html");
	console.log("照相页面");
});

router.get('/profile', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/profilPage.html");
	console.log("个人信息页面"); 
});

router.get('/sendmail', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/emailPage.html");
	console.log("个人信息页面"); 
});

///User:create new user  
router.post('/api/createNewUser',  function (req: Request,res: Response) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	if (!username || !password || !email) {
		res.send(null);
		return ;
	}
	if (usernameConfimation(username)==false || passwordConfirmation(password)==false || isEmail(email)==false){
		res.send(null);
		return ;
	}
	try {
		const user:any = userDB.findUserByName(username).then((user: any) => {
			console.log("in creat api user: " + user);
			if (user) {
				console.log("user exist");
				return ;
			}
			userDB.createUserToDB(username, password, email);
			//cookie
			const activeCookie = encrypt(username);
			sendMail(email, `http://localhost:3000/api/verify?cookie=${activeCookie}`);
			res.send({
				'create': true,
			});
		});
		} catch(e) {
		console.log(e);
	 }
		
});

//email verify
router.get('/api/verify',  function (req: Request, res: Response) {
	// console.log("come in verify api");
	//get cookie 
	var cookie = req.query.cookie; //get cookie
	console.log(cookie);
	if (cookie == null) {
		res.send(null);
		return ;
	}
	// decode
	const username:any = decrypt(cookie);
	console.log("decipher: " + username);
	//find user
	try {
		const user:any = userDB.findUserByName(username).then((user: any) => {
			if (!user)  {
				return ;
			}
			userDB.UpdateActive(username); //return json
		});
	} catch (error) {
		console.log(error);
	}	
});


//post /api/login
router.post('/api/login',  function (req: any, res: Response) {
	// console.log("come in~ login API ~~~~~~~~~~~~~~~~~~~~~~~");
	//确认后端的账号格式!!!!!!!!
	const username = req.body.userName;
	const password = req.body.passWord;
	console.log(username + " 取得 " + password);

	if (!username || !password ) {
		res.send(null)
		return ;
	}
	try {
		const user: any = userDB.findUserByName(username).then((user: any) => {
			if (user == null) {
				console.log('User is null');
				return;
			}
			console.log("user: " + user);
			const decryptPassword = decrypt(user.passWord);
			if (decryptPassword != password) {
				console.log("passWord wrong")
				return;
			}
			console.log("logoin success!!");
			req.session.user = user;
			//set sessionid
			req.session.user.sessionID = req.sessionID;
			console.log("session: " + req.session.user + " " + req.session.user.sessionID);
			
			res.send({
				'login': true,
			});
		});
	} catch (error) {
		console.log(error);
	}
});



//post /api/logout
router.post('/api/logout', function (req: any, res: Response) {
	const sessionId = req.session.id;
	console.log("session id: " + sessionId);

	req.session.destroy((err:any) => {	
		if (err) {
			console.log(err);
			return ;
		}
		console.log("logout success", req.headers.cookie);
		res.send ({
			'logout': true,
		});
	});
	
});

//get /api/imgs
router.get('/api/images', function (_req: any, res: Response) {
	console.log("come in imgs API");
	const imgs = userDB.getAllImags();
	if (imgs == null) {
		console.log("没有图片" + imgs);
		res.send(null);
		return ;
	}
	console.log("imgs: 是什么 " + imgs);
	res.send({'imgs': imgs});
});


// post api/avtivemail
router.post('/api/activemail', authMiddlewere, function (req: any, res: Response) {
	// const authHeader = req.headers['authorization']
  	// const token = authHeader && authHeader.split(' ')[1]
	console.log("come in activemail API");
	const email = req.body.email;
	const username = req.session.user.userName;
	if (isEmail(email) == false) {
		console.log("email format wrong");
		res.send(null);
		return ;
	}
	try {
		const user: any = userDB.findUserByName(username).then((user: any) => {
		if (user == null) {	
			console.log("user not find");
			return ;
		}
		if (user.active === true) {
			console.log("user is actived");
			return ;
		}
		console.log("active emai user: ", user);
		const activeCookie = encrypt(user.userName);
		sendMail(email, `http://localhost:3000/api/verify?cookie=${activeCookie}`);
		res.send({
			'send': true,
		});
		});
	} catch (error) {
		console.log(error);
	}
});


//post /api/forgetpassword
router.post('/api/forgetpwd', function (req: any, res: Response) {
	const email = req.body.email;
	try {
		const user: any = userDB.findUserByEmail(email).then((user: any) => {
		if (!user) {
			console.log("email not find");
			return ;
		}
		console.log("user find");
		const passWord:string = decrypt(user.passWord);
		const test:string = 'your password is: '+ passWord;
		sendMail(email, test);
		res.send({
			'forget': true,
		});
	});
	} catch (error) {
		console.log(error);
	}
});


//get api/auth
router.get('/api/auth',  function (req: any, res: Response) {
	console.log("come in auth API: ",  req.session.user);
	if (req.session.user) {
		res.send({
			'auth': true,
		});
	}
	else {
		res.send({
			'auth': false,
		});
	}
});


//get /api/userinfo
router.get('/api/profile', function (req: any, res: Response) {
	// const authHeader = req.headers['authorization']
  	// const token = authHeader && authHeader.split(' ')[1]
	const user = req.session.user;
	console.log("come in profile API: ", user);
	if (user == null) {
		console.log("user not find");
		res.send(null);
		return ;
	}
	const username = user.userName;
	try {
		const userinfo: any = userDB.findUserByName(username).then((userinfo: any) => {
			if (!userinfo) {
				console.log("user not find");
				return ;
			}
			userinfo.passWord = decrypt(userinfo.passWord);
			res.send(userinfo);
		});
	}
	catch (error) {
		console.log(error);
		return ;
	}

});


//post edit page
router.post('/api/edit', authMiddlewere, function (req: any, res: Response) {
	
	const newusername = req.body.newusername;
	const newpassword = req.body.newpassword;
	const newemail = req.body.newemail;
	const oldusername = req.body.oldusername;

	console.log("come in edit API: ", oldusername, newusername, newpassword, newemail);

	if (!oldusername) {
		console.log("user not find");
		res.send(null);
		return ;
	}
	if (newusername && usernameConfimation(newusername)==false) {
		res.send(null);
		return ;
	}
	if (newpassword && passwordConfirmation(newpassword)==false) {
		res.send(null);
		return ;
	}
	if (newemail && isEmail(newemail)==false){
		res.send(null);
		return ;
	}

	try {
		const user: any = userDB.findUserByName(oldusername).then((user: any) => {
			if (!user) {
				console.log("user not find");
				return ;
			}
			try {
				const newUserInfo =  userDB.UpdateUserInfo(oldusername, newusername, newpassword, newemail);
				if (newUserInfo != null) {
					console.log("update success newUserinfo: ",  newUserInfo);
					req.session.user = newUserInfo;
					req.session.user.sessionID = req.sessionID;
					console.log("session: " + req.session.user + " " + req.session.user.sessionID);
					res.send({
						'edit': true,
					});
				}
			}
			catch (error) {
				console.log(error);
				return ;
			}
		});
	}
	catch (error) {
		console.log(error);
		return ;
	}
});
