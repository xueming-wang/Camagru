import { request } from 'express';
import { setSourceMapRange } from 'typescript';
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

/* get all imgs */
export async function getAllImgs () {
	const user:any = await userModel.find({"imgs": {$exists: true}}).exec();
	if (!user) {
		console.log('getAllImgs is null');
		return null;
	}
	let imgs:any = [];
	for (const u of user) {
		imgs = u.imgs
		for (const i in imgs) {
			imgs.push(i);
		}
	}
	return imgs;
	// console.log('getAllImgs exist', user[0].imgs);
	// return user[0].imgs;
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
	})
};

// /* add lick */
export  async function addLikeNum(imgId: any) {
	console.log('addLikeNum: ', imgId);
	var whereuser = {"imgs._id": imgId };
	//like +1
	var update = { $inc: {'imgs.$.like': 1} };
	userModel.updateOne(whereuser, update, function(err:any, res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('addLikeNum succuess', res);
	})
};

// like -1
export  async function subLikeNum(imgId: any) {
	var whereuser = {'imgs._id': imgId };
	var update = { $inc: {'imgs.$.like': -1} };
	userModel.updateOne(whereuser, update, function(err:any, res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('minusLikeNum succuess', res);
	})
};



