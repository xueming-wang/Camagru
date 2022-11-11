
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
});

router.get('/home', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/homePage.html");	
});

router.get('/signup', function(_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/signupPage.html");
});

router.get('/login', function(_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/loginPage.html");
})

router.get('/montage', authMiddlewere, function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/montagePage.html");
});

router.get('/profile',  authMiddlewere, function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/profilPage.html");
});

router.get('/sendmail', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/emailPage.html"); 
});

router.get('/api/initpwd', function (_req: Request, res: Response) {
	res.sendFile(__dirname + "/views/initpwdPage.html");
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
router.get('/api/verify',  authMiddlewere, function (req: Request, res: Response) {
	// console.log("come in verify api");
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
			// console.log("user: " + user);
			const decryptPassword = decrypt(user.passWord);
			if (decryptPassword != password) {
				console.log("passWord wrong")
				return;
			}
			console.log("logoin success!!");
			req.session.user = user;

			res.send({
				'login': true,
			});
		});
	} catch (error) {
		console.log(error);
	}
});



//post /api/logout
router.post('/api/logout',authMiddlewere, function (req: any, res: Response) {

	
	console.log("in logout : req.session.id: " + req.session.id);
	console.log("in logout : req.sessionID: " + req.sessionID);
	
	req.session.destroy((err:any) => {	
		if (err) {
			console.log(err);
			return ;
		}
		console.log("in logout : req.sessionID: " + req.sessionID);
		res.send ({
			'logout': true,
		});
	});
	
});

//get /api/imgs
router.get('/api/images',  function (_req: any, res: Response) {
	console.log("come in imgs API");
	const imgs =  userDB.getAllImgs().then((imgs: any) => {
		res.send(imgs);
	});
});


// post api/avtivemail
router.post('/api/activemail', authMiddlewere, async function (req: any, res: Response) {
	console.log("come in activemail API");
	const email = req.body.email;
	const username = req.session.user.userName;
	if (isEmail(email) == false) {
		console.log("email format wrong");
		res.send(null);
		return ;
	}
	try {
		const user: any = await userDB.findUserByName(username).then((user: any) => {
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
router.post('/api/forgetpwd',function (req: any, res: Response) {
	const email = req.body.email;
	const username = req.body.username;

	try {
		const user: any = userDB.findUser(username, email).then((user: any) => {
		if (!user) {
			console.log("email not find");
			return ;
		}
		console.log("user find");
		const encryptname = encrypt(username);
	;
		// 发送一个重新设置密码的链接
		const test = "http://localhost:3000/api/initpwd?username=" + encryptname;
		sendMail(email, test);
		res.send({
			'forget': true,
		});
	});
	} catch (error) {
		console.log(error);
	}
});


//post /api/initpwd //初始化密
router.post('/api/initpwd', async function (req: any, res: Response) {
	console.log(req.body.username, '\n\n\n')
	const decryptname = decrypt(req.body.username);
	console.log(decryptname, '\n\n\n')
	const repassword = req.body.password;
	console.log("decryptname, repassword:?????? ", decryptname, "+" ,repassword);
	const password = encrypt(repassword);
	console.log("password: ", password);

	try {
		await userDB.updatePwd(decryptname, password);
		res.send({
			'init': true,
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
router.get('/api/profile',authMiddlewere, function (req: any, res: Response) {
	
	const user = req.session.user;
	console.log("come in profile API: ");
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
router.post('/api/savePhoto', authMiddlewere, async function (req: any, res: Response) {
	const user = req.session.user;
	const username = user.userName;
	var photo = req.body.photo;
	// console.log("come in savePhoto API: ", username, photo);
	await userDB.addImg(username, photo)
	res.send({
		'save': true,
	});
});


//get /api/getimg
router.get('/api/allimgs', async function (_req: any, res: Response) {
	try {
		const userArray =  await userDB.getAllImgs();
		if (userArray== null) {
			console.log("users not find");
			return ;
		}
		const array :any= [];
		// console.log("imgs API ?????????: ", userArray);
		for(const i of userArray) {
			for(const j of i.imgs) {
				array.push(j);
			}
		}
		res.send(array);
		
	}catch (error) {
		console.log(error);
		return ;
	}
}
);


//post /api/islike	
router.post('/api/islike', authMiddlewere, function (req: any, res: Response) {
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
router.post('/api/like',  authMiddlewere, function (req: any, res: Response) {
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
		userDB.addLike(username, imgId);
		res.send({
			'like': true,
		});
	
	}catch (error) {
		console.log(error);
		return ;
	}
});

//post /api/unlike
router.post('/api/unlike', authMiddlewere, async function (req: any, res: Response) {

	const imgId = req.body.imgId;
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
		await userDB.subLike(username, imgId);
		res.send({
			'unlike': true,
		});
	}	catch (error){
		console.log(error);
		return ;
	}
});


//get /api/likenum
router.post('/api/likenum',  async function (req: any, res: Response) {	
	const imgId = req.body.imgId;
	try {
		const num = await userDB.getLikeNum(imgId).then((num: any) => {
			res.send({
				'like': num,
			});
		});
	}	catch (error){
		console.log(error);
		return ;
	}
});


//post /api/addcomment
router.post('/api/addcomment',  authMiddlewere,  async function (req: any, res: Response) {
	const commentinfo = req.body.comment;
	const imgId = req.body.imgId;
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
		await userDB.addComment(imgId, commentinfo);
		res.send({
			'addcomment': true,
		});
		const email:any= await userDB.getUserEmail(imgId).then((email: any) => {
			if (email == null) {
				// console.log("user not find or user not notification");
				return ;
			}
			const test: string = "some one comment your photo: " + commentinfo;
			sendMail(email, test);	
		});
	}	catch (error){
		console.log(error);
		return ;
	}
});

router.post('/api/getcomments',  async function (req: any, res: Response) {
	const imgId = req.body.imgId;
	// console.log("come in getcomment API: ");
	try {
		const comments = await userDB.getCommentByImgId(imgId).then((comments: any) => {
			res.send({
				'commentsArray': comments,
			});
		});
	}	catch (error) {
		console.log(error);
		return ;
	}
});

router.post('/api/getnotification', authMiddlewere,  async function (req: any, res: Response) {
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
		const notification = await userDB.getNotification(username).then((notification: any) => {
			console.log("API get notification: ", notification);
			res.send({
				'notification': notification,
			});
		});
	}	catch (error) {
		console.log(error);
		return ;
	}
});

router.post('/api/updatenotification', authMiddlewere, async function (req: any, res: Response) {
	const notification = req.body.notification;
	// console.log("come in notification API: ", notification);

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
	
	await userDB.updateNotification(username, notification);
	res.send({
		'updatenotifications': true,
	});
	}	catch (error) {
		console.log(error);
		return ;
	}
});

/*  getActiveEmail */
router.get('/api/:user/getActiveEmail', authMiddlewere, async function (req: any, res: Response) {
	const user = req.params.user;
	console.log("come in getActiveEmail API: ", user);

	try {
		const activeInfo:any = await userDB.getActiveEmail(user);
		if (activeInfo == null) {	
			console.log("user not find");
			return ;
		}
		res.send({
			'active': activeInfo,
		});
	}	catch (error) {
		console.log(error);
		return ;
	}
});


/* user ->imgs */

router.get('/api/userimgs', authMiddlewere, async function (req: any, res: Response) {
	const user = req.session.user;
	const username = user.userName;
	// console.log("come in userimgs API: ", username);
	
	try {
		const imgs:any = await userDB.getUserImgs(username);
		if (imgs == null) {	
			console.log("user not find");
			return ;
		}
		// console.log("API userimgs: ", imgs);
		res.send(imgs);
	}	catch (error) {
		console.log(error);
		return ;
	}
});

//delete /api/deleteimg
router.delete('/api/delimg', authMiddlewere, async function (req: any, res: Response) {
	const imgId = req.body.imgid;
	console.log("come in deleteimg API: ", imgId);
	
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
		await userDB.deleteImg(imgId);
		res.send({
			'deleteimg': true,
		});
	}	catch (error) {
		console.log(error);
		return ;
	}
});

