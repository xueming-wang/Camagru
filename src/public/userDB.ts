import './mongodb';
import { encrypt } from './service/encrypt_serv';

const mongoose = require('./mongodb');	
const schema = mongoose.Schema;

// /** 2) Create a 'User' Model  JSON*/
const Img:any = new schema ({
	'imgurl': String,
	'comment': Array,
	'time': { type: Date, default: Date.now },
	'like': Number,
	'likeUser': Array,
});


const User:any = new schema ({
	'userName': String,
 	'passWord': String,
  	'email': String,
  	'active': Boolean,
	'notification': Boolean,
});

User.add({'imgs': [Img]});
// //user model
export const userModel = mongoose.model('user', User)
export const imgsModel = mongoose.model('imgs', Img);


// /** 3) Create and Save a Person */
export function  createUserToDB(username: string, password: string, email: string) {
	console.log('createUserToDB!!!!!!!!!')
	//Encrypt user password
    const encryptPassword:string =  encrypt(password);
	const newUser = new userModel({'userName': username, 'passWord': encryptPassword, 'email': email, 'active': false, 'notification': true})
	.save(function(err:any, newUser:any) {
  		if (err) {
			console.log(err);
			return ;
		}
		else {
			console.log(newUser + 'saved successfully!');
		}
  	});
};


/** 5) //find user if exit by username  
 * 当查询到即一个符合条件的数据时，将停止继续查询 返回单个文档*/
export async function findUserByName (username:String){
	const user:any = await userModel.findOne({'userName': username }).exec();
	if (!user) {
		console.log('findUserByName is null');
		return null;
	}
	return user;
}

export async function findUser(username:String, email:String, ) {
	const user = await userModel.findOne({'userName': username, 'email': email }).exec();
	if (!user) {
		console.log('username or email is not exit');
		return null;
	}
	return user;
}

/* active email*/
export async function UpdateActive (username:any) {
	var whereuser = { 'userName': username };
	var updateActive = { 'active': true };
	userModel.updateOne(whereuser, updateActive, function(err:any, _res:Response) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('updateActive succuess');
	})
};

export async function getActiveEmail (username:any){
	var whereuser = { 'userName': username };
	await userModel.findOne(whereuser, function(err:any, res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('getActiveEmail succuess');
		return res.active;
	})
};

// /** 8) Classic Info Update : edit userName */
export async function UpdateUserInfo (oldusername:any, newusername:any, newpassword:any, newemail:any) {
	var whereuser = { 'userName': oldusername };
	const encryptPassword:string =  encrypt(newpassword);
	var update = { $set: {'userName': newusername , 'passWord': encryptPassword, 'email': newemail} };
	

	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('update succuess');
	})
	const newuser:any = await userModel.findOne({'userName': newusername }).exec();
	if (!newuser) {
		console.log('findNewUserByName is null');
		return null;
	}
	return newuser;
}


/* get all imgs */
export async function getAllImgs () {
	const user:any = await userModel.find({"imgs": {$exists: true}}).exec();
	if (!user) {
		console.log('getAllImgs is null');
		return null;
	}
	return user;
}

/* get user imgs */
export async function getUserImgs (username:any) {
	// console.log("getUserImgs username: ", username);
	const user:any = await userModel.findOne({'userName': username }).exec();
	if (!user) {
		console.log('getUserImgs is null');
		return null;
	}
	// console.log("get 结果 getUserImgs: ", user.imgs);
	return user.imgs;
}

// /** 9 add img, then Save **/
export  async function addImg (username:any, img:object) {
	//添加照片到数据库
	var whereuser = { 'userName': username };
	var update = { $push: {'imgs': img} };
	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('addImg succuess');
	});
};

export async function getLikeUser(imgid:any) {
	const user:any = await userModel.findOne({'_id': imgid }).exec();
	if (!user) {
		console.log('getLikeUser is null');
		return null;
	}
	const username = user.imgs;
	for (const i of username) {
		if (i._id == imgid) {
			console.log("i.likeUser", i.likeUser);
			return i.likeUser;
		}
	}
}

//查看用户是否已经点赞
export async function LikeUserExit (username:any, imgid:any) {
	// console.log("进去LikeUserExit?????????", imgid);
	const user:any = await userModel.findOne({'imgs._id': imgid, 'imgs.likeUser': username}).exec();
	if (user != null && user.imgs != null) {
		for(const img of user.imgs) {
		// {	console.log("img?????????", img);
			if (img._id == imgid) {
				if (img.likeUser.includes(username)) {
					// console.log("LikeUserExit?????????");
					return true;
				}
			} 
		}
	}
	return false
}

// /* add lick */
export  async function addLike(username:any , imgid: any) {
	// console.log("addLike database: ", username, "+" , imgid);
	var whereuser = {"imgs._id": imgid};
	// console.log('data: username: ', username);
	//like +1
	if ( await LikeUserExit(username, imgid) == true) {
		console.log('likeUserExit, return');
		return ;
	}
	else {
		var update = { $inc: {'imgs.$.like': 1}, $push: {'imgs.$.likeUser':username} };
		userModel.updateOne(whereuser, update, function(err:any, _res:any) {
			if (err) {
				console.log(err);
				return ;
			}
			// console.log('addLikeNum succuess');
		})
	}
};

// like -1
export  async function subLike(username:any, imgid: any) {
	// console.log("subLike database: ", username, "+" , imgid);
	var whereuser = {"imgs._id": imgid};
	var update = { $inc: {'imgs.$.like': -1} , $pull: {'imgs.$.likeUser':username}};
	const you:any =  await LikeUserExit(username, imgid);
	if ( await LikeUserExit(username, imgid) == false) {
		console.log('likeUser no Exit, can not sub');
		return ;
	}
	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		// console.log('minusLikeNum succuess');
	})
};

//
export async function getLikeNum (imgid:any) {
	// console.log("in getLikeNum: ????????");
	const img:any = await userModel.findOne({'imgs._id': imgid}).exec();
	if (!img) {
		console.log('findLikeNum is null');
		return null;
	}
	for(const i of img.imgs) {
		if (i._id == imgid) {
			return i.like;
		}
	}
	return null;
}


// /* add comment */
export async function addComment(imgId:any, comment:any) {
	const whereimg = {"imgs._id": imgId};
	const update = { $push: {'imgs.$.comment':comment} };
	
	userModel.updateOne(whereimg, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		// console.log('addComment succuess');
	})
};

// /* get userEmail by imgid */
export async function getUserEmail(imgId:any) {
	const user:any = await userModel.findOne({'imgs._id': imgId}).exec();
	if (!user) {
		console.log('getUserEmail is null');
		return null;
	}
	if (user.notification == false) {
		console.log("user not notification: ", user.notification);
		return null;
	}
	console.log("user.email", user.email);
	return user.email;
}


// /* get comment by imgid */
export async function getCommentByImgId(imgId:any) {
	const user:any = await userModel.findOne({'imgs._id': imgId}).exec();
	if (!user) {
		console.log('getCommentByImgId is null');
		return null;
	}
	for(const i of user.imgs) {
		if (i._id == imgId) {
			
			return i.comment;
		}
	}
	return null;
}

export async function getNotification(username:any) {
	const user:any = await userModel.findOne({'userName': username}).exec();
	if (!user) {
		console.log('getNotification is null');
		return null;
	}
	console.log("user.notification", user.notification);
	return user.notification;
}

// /* update notification */
export async function updateNotification(username:any, notification:any) {
	const whereuser = { 'userName': username };
	console.log("updateNotification: ", username, notification);
	if (notification == 'on') {
		var update = { $set: {'notification': true} };
	}
	else {
		var update = { $set: {'notification': false} };
	}
	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('updateNotification succuess');
	})
}



export async function updatePwd(username:any, password:any) {
	const whereuser = { 'userName': username };
	var update = { $set: {'passWord': password} };
	console.log("updatePwd: ", username, password);
	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('updatePwd succuess');
	})
}


export async function deleteImg(imgId:any) {
	const whereimg = {"imgs._id": imgId};
	//删除图片
	const update = { $pull: {'imgs': {'_id': imgId}} };
	userModel.updateOne(whereimg, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('deleteImg succuess');
	})
}