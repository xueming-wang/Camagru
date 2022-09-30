
import express, { Router, Response, Request } from "express"
import { User, createUserToDB , findUserByName, UpdateActive } from "./userDB";
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
router.post('/api/createNewUser', async function (req: Request,res: Response) {
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;

	if (!username || !password || !email)
		 res.send(null);
	if (usernameConfimation(username)==false || passwordConfirmation(password)==false || isEmail(email)==false)
		res.send(null);
	console.log('username:' + username);
	
	try {
		//取不到user
		const user:any = await findUserByName(username);  
		console.log('in creat api' + user);
		if (user) {
			console.log("user exist")
			res.send(null);
			return ;
		}
		createUserToDB(username, password, email);
		const activeCookie = encrypt(username);
		sendMail(email, `http://localhost:3000/api/verify?cookie=${activeCookie}`);
		res.send({
			'create': true,
		});
		// res.redirect('/login');
		console.log("create user success");
	} catch(e) {
		console.log(e);
		return ;
	 }
		
});

//email verify
router.get('/api/verify',  function (req: Request, res: Response) {
	console.log("come in verify api");
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
		const user:any = findUserByName(username);
		if (!user)  {
			return ;
		}
		UpdateActive(username); //return json
		res.redirect('/login')
	} catch (error) {
		console.log(error);
		return ;
	}	
});

//post /api/login
router.post('/api/login', async function (req: any, res: Response) {
	console.log("come in~~~~~~~~~~~~~~~~~~~~~~~~");
	//确认后端的账号格式!!!!!!!!
	const username = req.body.userName;
	const password = req.body.passWord;
	console.log(username + " 取得 " + password);

	if (!username || !password ) {
		res.send(null)
		return ;
	}
	try {
		const user:any = await findUserByName(username);//!!!!!!!!!!!!娶不到数据
		console.log('in api: ' + user.passWord);
		// console.log(user.passWord + " " + password);
		if (!user || user.passWord != password) {
			console.log("passWord wrong")
			res.send(null);
			return;
		}
		req.session.user = user;
		res.send ({
			'token': user.token,
		});
	} catch (error){
		res.send(null)
	}
});

//get imgs from mongoDB
// router.get('/api/imgs', function(req: Request, res: Response) {

// })



//login 之后的token是不变的, 退出登陆或过去就变了

// fsdkjfhdksjhfds => {username} ----> verify
// kjsdhfhgrkwlejdfhdksjfh => {username} ---> cookie
// ekjfhgjksdhrdfklsgfhj => {username} ---> seconde login --> cookie

            
//get请求 从网站根目录访问localhost:3000/
// router.get('/profile/:id/:name', function(req: Request, res: Response) {
// 	console.dir(req.params);
// 	res.send("test GET parames " + req.params.name + " " + req.params.id);
// });
