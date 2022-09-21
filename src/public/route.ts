import express, { Router, Response, Request } from "express"
import { User, createUserToDB , findUserByName,  UpdateUserName} from "./user";
import { sendMail } from "./service/mail_serv";

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


//User: get user info
// router.get('/api/user', function(req: Request, res: Response) {
// 	console.log("GET user");
// 	res.send("GET user");

// });

///User:create new user
router.post('/api/usercreate', function (req: Request,_res: Response,done:any) {
	
	if (req.body.username && req.body.password && req.body.email) {
		createUserToDB(req.body.username, req.body.password, req.body.email, done);
		sendMail(req.body.email);
		
		console.log("signup success");
	} else {
		console.log("signup error");
	}
});

///User: put ate user info
router.put('/api/userupdate/:username', function (user:User,  req:Request, done:any) {
	UpdateUserName(user, req.body.id, done);
});

//post /api/login
router.post('/api/login', function (_req: Request, _res: Response, _done:any) {
	
});


//get请求 从网站根目录访问localhost:3000/
// router.get('/profile/:id/:name', function(req: Request, res: Response) {
// 	console.dir(req.params);
// 	res.send("test GET parames " + req.params.name + " " + req.params.id);
// });
