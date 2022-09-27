/**
* @jest-environment jsdom
*/
export function setCookie(cname:any ,cvalue:any ,exdays:any){
	var d = new Date();
	d.setTime(d.getTime()+(exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	console.log(cname, cvalue, exdays);
	document.cookie = cname + "=" + cvalue + "; " + expires;
	// return document.cookie;
	//console.log("Your Cookie : " + document.cookie);
}

export function getCookie(cname:any){
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
	}
	return "";
}

export function checkCookie(){
	var user: any =getCookie("username");
	if (user != ""){
		alert("Welcome again " + user);
	}
	else {
		user = prompt("Please enter your name:", "");
  		if (user!="" && user!=null){
    		setCookie("username",user,365);
    	}
	}
}