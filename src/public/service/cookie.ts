/**
* @jest-environment jsdom
*/

//自己写一个加密的方法
// export function encryptByDES(message:any, key:any) {
// 	var keyHex = CryptoJS.enc.Utf8.parse(key);
// 	var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
// 		mode: CryptoJS.mode.ECB,
// 		padding: CryptoJS.pad.Pkcs7
// 	});
// 	return encrypted.toString();
// }
//token = encryptByDES()

// //自己写一个解密的方法
// export function decryptByDES(ciphertext:any, key:any) {
// 	var keyHex = CryptoJS.enc.Utf8.parse(key);
// 	var decrypted = CryptoJS.DES.decrypt({
// 		ciphertext: CryptoJS.enc.Base64.parse(ciphertext) //这里是密文
// 	}, keyHex, {
// 		mode: CryptoJS.mode.ECB,
// 		padding: CryptoJS.pad.Pkcs7
// 	});
// 	return decrypted.toString(CryptoJS.enc.Utf8);
// }

// export function setCookie(cname:any ,cvalue:any ,exdays:any){
// 	var d = new Date();
// 	d.setTime(d.getTime()+(exdays*24*60*60*1000));
// 	var expires = "expires="+d.toUTCString();
// 	console.log(cname, cvalue, exdays);
// 	return( cname + "=" + cvalue + ";" + expires + ";path=/");
// 	// return document.cookie;
// 	//console.log("Your Cookie : " + document.cookie);
// }

// export function getCookie(cname:any){
// 	var name = cname + "=";
// 	var ca = document.cookie.split(';');
// 	for(var i=0; i<ca.length; i++) {
// 		var c = ca[i].trim();
// 		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
// 	}
// 	return "";
// }

// export function checkCookie(){
// 	var user: any =getCookie("username");
// 	if (user != ""){
// 		alert("Welcome again " + user);
// 	}
// 	else {
// 		user = prompt("Please enter your name:", "");
//   		if (user!="" && user!=null){
//     		setCookie("username",user,365);
//     	}
// 	}
// }