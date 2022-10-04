
import express, { Router, Response, Request } from "express"
import {createUserToDB , UpdateActive, findUserByName, getAllImags } from "./userDB";
import { sendMail } from "./service/mail_serv";
import { encrypt, decrypt } from "./service/encrypt_serv";
import { usernameConfimation, passwordConfirmation, isEmail } from "./service/auth_serv";

export const router: Router = express.Router();
router.use(express.json());


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

router.get('/profil', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/profilPage.html");
	console.log("个人信息页面"); 
});

router.get('/avtivemail', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/emailPage.html");
	console.log("个人信息页面"); 
});

///User:create new user  
router.post('/api/createNewUser',  function (req: Request,res: Response) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	if (!username || !password || !email)
		 res.send(null);
	if (usernameConfimation(username)==false || passwordConfirmation(password)==false || isEmail(email)==false)
		res.send(null);
	console.log('username:' + username);
	try {
		const user:any = findUserByName(username).then((user: any) => {
			console.log("in creat api user: " + user);
			if (user) {
				console.log("user exist")
				res.send(null);
				return ;
			}
			createUserToDB(username, password, email);
			//cookie
			const activeCookie = encrypt(username);
			sendMail(email, `http://localhost:3000/api/verify?cookie=${activeCookie}`);
			res.send({
				'create': true,
			});
		});
	} catch(e) {
		console.log(e);
		return ;
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
		return;
	}
	// decode
	const username:any = decrypt(cookie);
	console.log("decipher: " + username);
	//find user
	try {
		const user:any = findUserByName(username).then((user: any) => {
			if (!user)  {
				alert("user not find")
				return ;
			}
			UpdateActive(username); //return json
		});
	} catch (error) {
		console.log(error);
		return ;
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
		const user: any = findUserByName(username).then((user: any) => {
			if (user == null) {
				console.log('User is null');
				res.send(null);
				return;
			}
			if (user.passWord != password) {
				console.log("passWord wrong")
				res.send(null);
				return;
			}
			console.log("logoin success!!");
			req.session.user = user;
			const Cookie = encrypt(username);
			res.cookie('activeCookie', Cookie);
			res.send({
				'login': true,
			});
		});
	} catch (error) {
		console.log(error);
		return ;
	}
});



//post /api/logout
router.post('/api/logout', function (req: any, res: Response) {
	console.log("come in logout API");
	req.session.destroy((err:any) => {	
		if (err) {
			console.log(err);
			return ;
		}
		res.clearCookie('activeCookie');
		res.send({
			'logout': true,
		});
	});
	
});

//get /api/imgs
router.get('/api/images', function (_req: any, res: Response) {
	console.log("come in imgs API");
	const imgs = getAllImags();
	if (imgs == null) {
		res.send(null);
		return ;
	}
	res.send(imgs);
});


// post api/avtivemail
router.post('/api/activemail', function (req: any, res: Response) {
	const email = req.body.email;
	console.log("come in activemail API");
	if (isEmail(email) == false) {
		res.send(null);
		return ;
	}
	const activeCookie = encrypt(email);
	sendMail(email, `http://localhost:3000/api/verify?cookie=${activeCookie}`);
	res.send({
		'active': true,
	});
});

