import './mongodb';
import { encrypt } from './service/encrypt_serv';

const mongoose = require('./mongodb');	
const schema = mongoose.Schema;

// /** 2) Create a 'User' Model  JSON*/
const Img:any = new schema ({
	'imgurl': String,
	'Comment': [{ body: String}],
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
//export const imgsModel = mongoose.model('imgs', Imgs)

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

export async function findUserByEmail(email:String){
	const user:any = await userModel.findOne({'email': email }).exec();
	if (!user) {
		console.log('find User Email is null');
		return ;
	}
	console.log('findUserByEmail exist');
	return user;
}

/* active email*/
export const UpdateActive = (username:any) => {
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

//按时间排序
function sortTime(imgsArray:any) {
	imgsArray.sort(function (a:any, b:any) {
		return a.time > b.time? 1: -1;
	});
}

/* get all imgs */
export async function getAllImgs () {
	const user:any = await userModel.find({"imgs": {$exists: true}}).exec();
	if (!user) {
		console.log('getAllImgs is null');
		return null;
	}
	let allimgs = [];
	for (const u of user) {
		// console.log("u????!!!!!!!!!!!!!", u.imgs);
		allimgs.push(u.imgs);
	}
	// console.log("imgs: ??");
	return allimgs;
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
		console.log('userDB addimg 返回', _res);
		return _res;
	})
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
	console.log("LikeUserExit?????????", imgid);
	const user:any = await userModel.findOne({'imgs._id': imgid, 'imgs.likeUser': username}).exec();
	if (user) {
		console.log('findLikeUser exist');
		return true;
	}
	console.log('no exist')
	return false;
}

// /* add lick */
export  async function addLike(username:any , imgid: any) {
	console.log("addLike database: ", username, "+" , imgid);
	var whereuser = {"imgs._id": imgid};
	// console.log('data: username: ', username);
	//like +1
	if ( await LikeUserExit(username, imgid) == true) {
		console.log('likeUserExit, return');
		return ;
	}
	var update = { $inc: {'imgs.$.like': 1}, $push: {'imgs.$.likeUser':username} };
	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('addLikeNum succuess');
	})
};

// like -1
export  async function subLike(username:any, imgid: any) {
	console.log("subLike database: ", username, "+" , imgid);
	var whereuser = {"imgs._id": imgid};
	var update = { $inc: {'imgs.$.like': -1} , $pull: {'imgs.$.likeUser':username}};
	if ( await LikeUserExit(username, imgid) == false) {
		console.log('likeUser no Exit, can not sub');
		return ;
	}
	userModel.updateOne(whereuser, update, function(err:any, _res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('minusLikeNum succuess');
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




