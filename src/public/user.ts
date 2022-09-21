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
  imgs: string[];
}

var User:any = new schema ({
	userName: '', //前端没有传参数的时候报错，并不能防止参数为空
	passWord: '',
	email: '',
	userId: '',
	imgs: [{data:'', img: '', Comment: ''}],
});

const userModel = mongoose.model('user', User)
// /** 3) Create and Save a Person */
// //成功时调用 done(null, data)，在失败时调用 done(err)。
export const createUserToDB = function(userName: string, password: string, email: string, done: any) {
	// const userModel = mongoose.model('user', User)
	const newUser = new userModel({userName: userName, password: password, email: email})
	.save(function(err:any, data:any) {
  	if (err) return; console.log(err);
		// newUser.save();
	done(null, data)
  });
};


// /** 5) Use `Model.find()` */
export const findUserByName = (userName:any, done:any) => {
	userModel.find({userName: userName}, function(err:any, data:any) {
     if (err) return; console.log(err);
     done(null, data);
  });
};

// /** 7) Use `Model.findById()` */
export  const findUserById = (userId:any, done:any) => {
   userModel.findById(userId, function(err:any, data:any) {
  if (err) return; console.log(err);
  	done(null, data);
  })
};

// /** 8) Classic Info Update : edit userName */
export  const UpdateUserName = (user:User , userId:any, done:any) => {
	userModel.findById(userId, function(err:any, data:any) {
	  if (err) return; console.log(err);
	  data.username = user.userName;
	  data.email = user.email;
	  data.password = user.password;

	  data.save(function(err:any, data:any) {
		  if (err) return; console.log(err);
		  done(null, data);
	  })
	})
};


// // /** 8) Classic Info Update : Find, edit Email */
// export const UpdateUserEmail = (email:String , userId:any, done:any) => {
// 	User.findById(userId, function(err:any, data:any) {
// 		if (err) return; console.log(err);
// 		data.email = email;
// 		data.save(function(err:any, data:any) {
// 			if (err) return; console.log(err);
// 			done(null, data);
// 		})
// 	})
// };

//  // /** 8) Classic Info Update : Find, edit PassWord */
//  export const UpdateUserPassWord = (PassWord:String , userId:any, done:any) => {
// 	User.findById(userId, function(err:any, data:any) {
// 		if (err) return; console.log(err);
// 		data.PassWord = PassWord;
// 		data.save(function(err:any, data:any) {
// 			if (err) return; console.log(err);
// 			done(null, data);
//  		})
// 	})
// };

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
export const Deleteimg = (img:string, userId:any, done:any) => {
	userModel.findById(userId, function(err:any, userModel:any) {
		if (err) return ;
		userModel.img.pull({img: img}); //pull img from array
		userModel.save(function(err:any, updata:any) {
			if (err) return ;
			done(null, updata)
		})
	})
};

// /** model.findByIdAndRemove **/
const removeUserById = (userId:any, done:any) => {
	userModel.findByIdAndRemove(userId, (err:any, data:any) => {
    if (err) return ;
    done(null, data);
  }) 
};

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
