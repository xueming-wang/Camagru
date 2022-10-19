import { request } from 'express';
import { setSourceMapRange } from 'typescript';
import './mongodb';
import { encrypt } from './service/encrypt_serv';

const mongoose = require('./mongodb');	
const schema = mongoose.Schema;

// /** 2) Create a 'User' Model  JSON*/
const Img:any = new schema ({
	'imgurl': String,
	'Comment': Array,
	'time': String,
	'like': Number,
	// 'userId': String,
});


const User:any = new schema ({
	'userName': String,
 	'passWord': String,
  	'email': String,
  	'active': false,
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
	const newUser = new userModel({'userName': username, 'passWord': encryptPassword, 'email': email})
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
	for (var i = 0; i < user.length; i++) {
		console.log("user.length: " + user.length);
		console.log("user[0] : " + user[0]);
		console.log("user[1] : " + user[1]);
	
		console.log('send ????', user[i].imgs);
		return user[i].imgs;
	}
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

