import { displayPartsToString, isNamedExportBindings } from 'typescript';
import './mongodb';

const mongoose = require('./mongodb');	
const schema = mongoose.Schema;

// /** 2) Create a 'User' Model */
export interface User {
  userName: string;
  password: string;
  email: string;
  userId: string;
  active: boolean;
  imgs: [{type: object}];
}

var User:any = new schema ({
	userName: '', //前端没有传参数的时候报错，并不能防止参数为空
	passWord: '',
	email: '',
	userId: '',
	active: false,
	imgs: [{data:'', path: '', comment: ''}],
});

//user model
const userModel = mongoose.model('user', User)

module.exports = userModel;

// /** 3) Create and Save a Person */
// //成功时调用 done(null, data)，在失败时调用 done(err)。
export const createUserToDB = function(userName: string, password: string, email: string) {
	const newUser = new userModel({userName: userName, password: password, email: email})
	//save data
	.save(function(err:any) {
  		if (err) {
			console.log(err);
			return ;
		}
  	});
};


/** 5) Use `Model.find()` */
export const findUserByName = (username:any) => {
	userModel.find({username}, function(err:any, doc:any) {
		if (err) {
			console.log(err);
			return ;
		}
		return doc ;
		//returns array docs
	})
};

// /** 7) Use `Model.findById()` */
export  const findUserById = (obj_id:any) => {
   userModel.findById(obj_id, function(err:any) {
  	if (err) return; console.log(err);
  })
};

// /** 8) Classic Info Update : edit userName */
export const UpdateUserName = (username:any, newname:any) => {
	var whereuser = { 'userName': username };
	var updatename = { 'userName': newname };

	userModel.update(whereuser, updatename, function(err:any, res:Response) {
		if (err) { 
			console.log(err);
			return ;
		} else {
			return res.json();
		}
	})
};


// // /** 8) Classic Info Update : Find, edit Email */
export const UpdateEmail = (username:any, newemail:any) => {
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
export const UpdatePassWord = (username:any, newpassword:any) => {
	var whereuser = { 'username': username };
	var updatePassWord = { 'password': newpassword };

	userModel.update(whereuser, updatePassWord, function(err:any, res:Response) {
		if (err) { 
			console.log(err);
			return ;
		} else {
			return res.json();
		}
	})
};


export const deleUser = (username:any) => {
	var whereuser = { 'username':username };
	userModel.remove(whereuser, function(err: any, res: Response) {
		if (err) {
			console.log(err);
		} else {
			console.log(res);
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




// exports的方法可以直接调用
// module.exports需要new对象之后才可以调用
// var sayHello = function(){
//     console.log('hello')
// }
// exports.sayHello = sayHello

// console.log(exports); 
// console.log(module.exports);
