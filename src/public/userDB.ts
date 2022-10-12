import { request } from 'express';
import { setSourceMapRange } from 'typescript';
import './mongodb';
import { encrypt } from './service/encrypt_serv';

const mongoose = require('./mongodb');	
const schema = mongoose.Schema;

// /** 2) Create a 'User' Model  JSON*/
const oneImg:any = new schema ({
	'imgurl': String,
	'Comment': String,
	'date': String,
	'imgId': String,
});


const User:any = new schema ({
	'userName': String,
 	'passWord': String,
  	'email': String,
  	'active': Boolean,
});

User.add({'imgs': [oneImg]});

//user model
export const userModel = mongoose.model('user', User)

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

/* get alluser imgs */
export const getAllImags = () => {
	userModel.find({'imgs': oneImg.imgurl}), function(err:any, res:any) {
		if (err) {
			console.log(err);
			return ;
		}
		console.log('getAllImags succuess', res);
		return res;
	}
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



// findUserByToken
// export const findUserByToken = (token:any) => {
// 	var whereuser = { 'token': token };
// 	userModel.findOne(whereuser, function(err:any, res:any) {
// 		if (err) {
// 			console.log(err);
// 			return ;
// 		}
// 		console.log('findUserByToken succuess', res);
// 		return res;
// 	})
// }

// export const deleUser = (username:any) => {
// 	var whereuser = { 'username':username };
// 	userModel.remove(whereuser, function(err: any) {
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log('delete success');
// 		}
// 	})
// };


// /** 9 add img, then Save **/
// export  const Addimg = (img:string, userId:any, done:any) => {
//   // .findById() method to find a user by _id with the parameter     userId as search key. 
//   userModel.findById(userId, function(err:any, userModel:any) {
//     if (err) return ;
//     userModel.imgs.push({imgs: img}); //push img to array
//   //and inside the find callback - save() the updated User.
//   userModel.save(function(err:any, updata:any) {
//         if (err) return ;
//         done(null, updata)
//     })
//   })
// };


// export const findAllImg = (userId:any, done:any) => {
// 	userModel.findById(userId, function(err:any, userModel:any) {
// 		if (err) return ;
// 		done(null, userModel.imgs)
// 	})


// /** model.findOneAndUpdate() **/
// export const Deleteimg = (img:string, userId:any, done:any) => {
// 	userModel.findById(userId, function(err:any, userModel:any) {
// 		if (err) return ;
// 		userModel.img.pull({img: img}); //pull img from array
// 		userModel.save(function(err:any, updata:any) {
// 			if (err) return ;
// 			done(null, updata)
// 		})
// 	})
// };

// /** addComment to img */
// const addComment = (img:string, userId:any, comment:string) => {
// 	const img = {
// 		img: img,
// 		comment: comment
// 	};
// 	User.findById(userId, function(err:any, User:any) {
// 		if (err) return ;
// 		User.img.forEach((element:any) => {
// 			if(element.img == img) {
// 				element.comment = comment;
// 			}
// 		})
// 	})
// }


