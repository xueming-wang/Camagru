
import express, { Router, Response, Request } from "express"
import * as userDB from "./userDB";
import { sendMail } from "./service/mail_serv";
import { encrypt, decrypt } from "./service/encrypt_serv";
import { usernameConfimation, passwordConfirmation, isEmail } from "./service/auth_serv";
import { authMiddlewere } from "./service/auth_serv";
import { isNonNullChain } from "typescript";


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
			// console.log("req.session.user: " + req.session.user);
			//same sessionid
			// console.log("req.sessionID: " + req.sessionID);
			// console.log("req.session.id: " + req.session.id);

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

	
	console.log("in logout : req.session.id: " + req.session.id);
	console.log("in logout : req.sessionID: " + req.sessionID);
	// console.log("in logout : req.session.user: " + req.session.user);
	req.session.destroy((err:any) => {	
		if (err) {
			console.log(err);
			return ;
		}
		//删除了req.session.id 和 req.session.user
		// console.log("in logout : sessionId: " + req.session.id);
		// console.log("in logout : req.session.user: " + req.session.user);
		console.log("in logout : req.sessionID: " + req.sessionID);
		res.send ({
			'logout': true,
		});
	});
	
});

//get /api/imgs
router.get('/api/images', function (_req: any, res: Response) {
	console.log("come in imgs API");
	const imgs =  userDB.getAllImgs().then((imgs: any) => {
		res.send(imgs);
	});
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
	// console.log("come in auth API: ",  req.session.user);
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
				const newUserInfo =  userDB.UpdateUserInfo(oldusername, newusername, newpassword, newemail).then((newUserInfo: any) => {
				if (newUserInfo != null) {
					console.log("update success newUserinfo: ",  newUserInfo);
					req.session.user = newUserInfo;
					console.log("session: " + req.session.user + " " + req.sessionID);
					res.send({
						'edit': true,
					});
				}
			});
			} catch (error) {
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

//post /api/addimg
router.post('/api/savePhoto', authMiddlewere, function (req: any, res: Response) {
	const user = req.session.user;
	// const userId = user._id;
	const username = user.userName;
	var imgInfo = req.body.photo;
	// imgInfo.userId = userId;
	userDB.addImg(username, imgInfo).then((result: any) => {
		if (result) {
			res.send({
				'save': true,
			});
		}
	}
	);
});


//get /api/getimg
router.get('/api/allimgs',  function (_req: any, res: Response) {
	try {
		const imgs =  userDB.getAllImgs().then((imgs: any) => {
		if (imgs == null) {
			console.log("imgs not find");
			return ;
		}
		const sortimgs = Array.from(imgs).sort((a: any, b: any) => {
			if (a.time < b.time) return -1;
			if (a.time > b.time) return 1;
			return 0;
		});
		// console.log("sortimgs: ", sortimgs);
		//显示 所有的图片 faux
		// console.log("api get all imgs ");
		res.send({'imgs': sortimgs});
		});
	}catch (error) {
		console.log(error);
		return ;
	}
}
);


//post /api/islike	
router.post('/api/islike', function (req: any, res: Response) {
	const imgId= req.body.imgId;
	try {
		const user = req.session.user;
		if (user == null) {
			console.log("user not find");
			res.send({
				'user': false,
			});
			return ;
		}
		const username = user.userName;
		const islike =   userDB.LikeUserExit(username, imgId).then((islike: any) => {
			if (islike == true) {
				res.send({
					'islike': true,
				});
			}
			else {
				res.send({
					'islike': false,
				});
			}
		});
	}catch (error) {
		console.log(error);
		return ;
	}
});



//post /api/like
router.post('/api/like',  function (req: any, res: Response) {
	const imgId= req.body.imgId;
	// console.log("come in like API: ", imgId);
	try {
		const user = req.session.user;
		if (user == null) {
			console.log("user not find");
			res.send({
				'user': false,
			});
			return ;
		}
		const username = user.userName;
		const num = userDB.addLike(username, imgId);
		res.send({
			'like': true,
		});
	
	}catch (error) {
		console.log(error);
		return ;
	}
});

//post /api/unlike
router.post('/api/unlike',  function (req: any, res: Response) {

	const imgId = req.body.imgId;
	console.log("come in unlike API: ", imgId);
	try {
		const user = req.session.user;
		if (user == null) {
			console.log("user not find");
			res.send({
				'user': false,
			});
			return ;
		}
		const username = user.userName;
		userDB.subLike(username, imgId);
		res.send({
			'unlike': true,
		});
	}	catch (error){
		console.log(error);
		return ;
	}
});


//get /api/likenum
router.post('/api/likenum',  function (req: any, res: Response) {	
	const imgId = req.body.imgId;
	// console.log("come in likenum API: ");
	try {
		const num = userDB.getLikeNum(imgId).then((num: any) => {
		res.send({
			'like': num,
		});
		});
	}	catch (error){
		console.log(error);
		return ;
	}
});

