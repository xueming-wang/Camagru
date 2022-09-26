import express, { Router, Response, Request } from "express"
import { User, createUserToDB ,  UpdateUserName, findUserByName, findUserById} from "./userDB";
import { sendMail } from "./service/mail_serv";
import { generateAccessToken } from './service/auth_serv';
import { authenticateToken } from './service/auth_serv';


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

///User:create new user  !!!!!!!!!problem!!!!!!!!!
router.post('/api/createNewUser', function (req: Request,res: Response) {
	const { username, email, password }  = req.body;

	if (!username || !password || !email)
		 res.send({});
	try {
		const user = findUserByName(username) as unknown as User;
		if (!user) res.send({});

		const activetoken:any = generateAccessToken(username);
		createUserToDB(username, password, email);
		
		sendMail(email, `click this link: "http://localhost:3000"/verify?token=${activetoken}`);
		res.send ({
			"token": true,
			"email": email
		});
	
	}catch(e) {
		res.send({});
	}
		
});

//email verify
router.post('/api/active',  function (req: Request, res: Response) {
	console.log("come in active api");
	// var token = req.query; //get token
	// try {
	// 	const user:any = findUserByName(username);
	// 	if (!user) {
	// 		res.send({});
	// 	}
	// 	res.send(user);
	// } catch (err) {
	// 	res.send({});
	// }
});

// ///User: put ate user info
// router.put('/api/userupdate/:username', authenticateToken, function (user:User,  req:Request, done:any) {
// 	UpdateUserName(user, req.body.id, done);
// });

//post /api/login
// router.post('/api/login', function (req: Request, res: Response, done:any) {
// 	console.log("come in~~~~~~~~~~~~~~~~~~~~~~~~");
// 	const { username, password } = req.body;
// 	if (!username || !password ) {
// 		res.send({})
// 		return ;
// 	}
// 	try {
// 		const user = findUserByName(username, done) as unknown as User;
// 		if (!user || user.password != password) {
// 			res.send({});
// 			return;
// 		}
// 		const token = generateAccessToken({ username: req.body.username });
//     	res.send({ token });
// 	} catch (error){
// 		res.send({})
// 	}
// });



            
//get请求 从网站根目录访问localhost:3000/
// router.get('/profile/:id/:name', function(req: Request, res: Response) {
// 	console.dir(req.params);
// 	res.send("test GET parames " + req.params.name + " " + req.params.id);
// });
