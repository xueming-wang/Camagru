import { request } from 'express';
import { displayPartsToString, isNamedExportBindings } from 'typescript';
import './mongodb';

const mongoose = require('./mongodb');	
const schema = mongoose.Schema;

// /** 2) Create a 'User' Model */
export interface User {
  'userName': string;
  'passWord': string;
  'email': string;
  'active': boolean;
  'imgs': [{type: object}];
}

var User:any = new schema ({
	'userName': '', //前端没有传参数的时候报错，并不能防止参数为空
	'passWord': '',
	'email': '',
	'active': false,
	'imgs': [{data:'', path: '', comment: ''}],
});

//user model
const userModel = mongoose.model('user', User)

// /** 3) Create and Save a Person */
export function  createUserToDB(username: string, password: string, email: string) {
	console.log('createUserToDB!!!!!!!!!')
	const newUser = new userModel({'userName': username, 'passWord': password, 'email': email})
	.save(function(err:any, newUser:any) {
  		if (err) {
			console.log(err);
			return ;
		}
		else {
			console.log(newUser);
		}
  	});
};


/** 5) //find user if exit by username  
 * 当查询到即一个符合条件的数据时，将停止继续查询 返回单个文档*/
export function findUserByName (username:String){
	console.log('findUserByName!!!!!!!!!')
	userModel.findOne({'userName': username }, function (err:any, user:any) {
		if (err) {
			console.log(err);
			return ;
		}
		else {
			console.log('in database + ' +  user);
			return user;
		}
	});
	
};


//6: find():所有满足条件的结果值 返回一个数组



// /** 8) Classic Info Update : edit userName */
const UpdateUserName = (newname:any) => {
	var whereuser = { 'username': request.body.username };
	var updatename = { $set: {'userName': newname }};

	userModel.update(whereuser, updatename, function(err:any) {
		if (err) { 
			console.log(err);
			return ;
		}
		return ;
	})
};


// // /** 8) Classic Info Update : Find, edit Email */
const UpdateEmail = (username:any, newemail:any) => {
	var whereuser = { 'username': username };
	var updateEmail = { 'email': newemail };

	userModel.update(whereuser, updateEmail, function(err:any, res:Response) {
		if (err) { 
			console.log(err);
			return ;
		} else {
			return res.json();
		}
	})
};

//  // /** 8) Classic Info Update : Find, edit PassWord */
const UpdatePassWord = (username:any, newpassword:any) => {
	var whereuser = { 'username': username };
	var updatePassWord = { 'password': newpassword };

	userModel.update(whereuser, updatePassWord, function(err:any, res:Response) {
		if (err) { 
			console.log(err);
			return ;
		} else {
			console.log(res);
		}
	})
};

export const UpdateActive = (username:any) => {
	console.log('Update active!!!!!!!!!');
	var whereuser = { 'username': username };
	var updateActive = { 'active': true };

	userModel.update(whereuser, updateActive, function(err:any, res:Response) {
		if (err) {
			console.log(err);
			return ;
		}
		else {
			console.log(res);
		}
	})
};

export const deleUser = (username:any) => {
	var whereuser = { 'username':username };
	userModel.remove(whereuser, function(err: any) {
		if (err) {
			console.log(err);
		} else {
			console.log('delete success');
		}
	})
};


// /** 9 add img, then Save **/
export  const Addimg = (img:string, userId:any, done:any) => {
  // .findById() method to find a user by _id with the parameter     userId as search key. 
  userModel.findById(userId, function(err:any, userModel:any) {
    if (err) return ;
    userModel.imgs.push({imgs: img}); //push img to array
  //and inside the find callback - save() the updated User.
  userModel.save(function(err:any, updata:any) {
        if (err) return ;
        done(null, updata)
    })
  })
};


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

// /** **Well Done !!**
// /* You completed these challenges, let's go celebrate !
//  */

// //----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

// exports.PersonModel = Person;
// exports.createAndSavePerson = createAndSavePerson;
// exports.findPeopleByName = findPeopleByName;
// exports.findOneByFood = findOneByFood;
// exports.findPersonById = findPersonById;
// exports.findEditThenSave = findEditThenSave;
// exports.findAndUpdate = findAndUpdate;
// exports.createManyPeople = createManyPeople;
// exports.removeById = removeById;
// exports.removeManyPeople = removeManyPeople;
// exports.queryChain = queryChain;
