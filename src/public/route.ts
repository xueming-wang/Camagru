
import express, { Router, Response, Request } from "express"
import { User, createUserToDB , findUserByName } from "./userDB";
import { sendMail } from "./service/mail_serv";
import { generateAccessToken } from './service/auth_serv';
import { setCookie,  getCookie, checkCookie } from './service/cookie';
// import { authenticateToken } from './service/auth_serv';


export const router: Router = express.Router();
router.use(express.json());

//一个请求和一个响应对象作为参数
router.get('/', function(_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/homePage.html");
	console.log("GET 首页")
});

router.get('/home', function (_req: Request, res: Response) {
	console.log("/home GET 请求");
	res.sendFile(__dirname + "/views/homePage.html");
});

router.get('/signup', function(_req: Request, res: Response) {
	console.log("GET注册页面");
	res.sendFile(__dirname + "/views/signupPage.html");
});

router.get('/login', function(_req: Request, res: Response) {
	console.log("GET登陆页面");
	res.sendFile(__dirname + "/views/loginPage.html");
})

router.get('/montage', function (_req: Request, res: Response) {
	console.log("照相页面");
	res.sendFile(__dirname + "/views/montagePage.html");
});

router.get('/profil', function (_req: Request, res: Response) {
	console.log("个人信息页面"); 
	res.sendFile(__dirname + "/views/profilPage.html");
});

///User:create new user  
router.post('/api/createNewUser', function (req: Request,res: Response) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	if (!username || !password || !email)
		 res.send({});
	console.log('username:' + username);
	const user:any = findUserByName(username);
	if (user) {
		console.log("user already exist");
		res.send({});
		return;
	}
	try {
		createUserToDB(username, password, email);
	}catch(e) {
		console.log('什么鬼?????????????');
		console.log(e);
		res.send({});
	 }
		
});

//email verify
router.post('/api/verify',  function (req: Request, res: Response) {
	console.log("come in verify api");
	var cookie = req.query.cookie; //get cookie
	if (cookie == null) {
		res.send({});
		return;
	}
	try {
		const decode:any = getCookie(cookie);
		const username:any = decode.username;
		const user:any  =  findUserByName (username) as unknown as User;
		if (!user) {
		  res.send({});
		  return ;
		}
		const activeCookie = setCookie('username', username, 1000);
		sendMail(user.email, `${process.env.API_URL || "http://localhost:3000"}/api/verify?cookie=${activeCookie}`);
		res.send({
			"cookie": true,
			"email": user.email
		});
	  } catch (error) {
		console.log(error);
		res.send({});
	  }
});

//post /api/login
router.post('/api/login', function (req: Request, res: Response) {
	console.log("come in~~~~~~~~~~~~~~~~~~~~~~~~");
	const { username, password } = req.body;
	if (!username || !password ) {
		res.send({})
		return ;
	}
	try {
		const user = findUserByName(username) as unknown as User;
		if (!user || user.password != password) {
			res.send({});
			return;
		}
		const token = generateAccessToken({ username: req.body.username });
    	res.send({ token });
	} catch (error){
		res.send({})
	}
});



            
//get请求 从网站根目录访问localhost:3000/
// router.get('/profile/:id/:name', function(req: Request, res: Response) {
// 	console.dir(req.params);
// 	res.send("test GET parames " + req.params.name + " " + req.params.id);
// });
