function usernameConfimation(username) {
	if (username.length < 5 || username.length > 10) return false;
	if (/^[a-zA-Z]+$/.test(username) == false) return false;
}

function passwordConfirmation(password) {
	for(let i = 0; i < password.length; i++) {
		if (password.length < 5 || password.length > 15) return false;
		if (/^[a-zA-Z]+$/.test(password[i]) == false && /^[0-9]+$/.test(password[i]) == false) return false;
	}
}

function isEmail(email) {
	var reg = /^[0-9a-zA-Z]+@[0-9a-zA-Z]+.[0-9a-zA-Z]+$/;
	return reg.test(email) ? true : false;
}

var eye = document.getElementById('eye');
var newpassword = document.getElementById('newpassWord');

function showhide() {
	if (newpassword.type=="password") {
		newpassword.type="text";
		eye.className="fa fa-eye-slash";
	}
	else{
		newpassword.type='password';
		eye.className='fa fa-eye'
	}
}


async function handleEdit(event) {
	console.log('edit button!!!!!!!!!!!!!!!!');
	event.preventDefault();

	var oldusername = '';
	var oldpassword = '';
	var oldemail = '';

	try {
		const user = await fetch("/api/profile", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'default',
		})
		.then(res => res.json())
		.then(data => data);
		if (!user) {
			alert('get user failed');
			return ;
		}

		oldusername = user.userName;
		oldpassword = user.passWord;
		oldemail = user.email;

	} catch (err) {
		console.log(err);
	}

	console.log("old info: ", oldusername, oldpassword, oldemail);

	var newusername = document.getElementById('newuserName').value;
	var newpassword = document.getElementById('newpassWord').value;
	var newemail = document.getElementById('newEmail').value;
	


	if (!newusername && !newpassword && !newemail) {
		alert('noting to change');
		return;
	}
	if (newusername != '' && usernameConfimation(newusername) == false) {
		alert('Username is not valid');
		return;
	}
	if (newpassword != '' && passwordConfirmation(newpassword) == false) {
		alert('Passwords do not match');
		return;
	}
	
	if (newemail != '' && isEmail(newemail) == false) {
		alert('Email is not valid');
		return;
	}

	if (!newusername) newusername = oldusername;
	if (!newpassword) newpassword = oldpassword;
	if (!newemail) newemail = oldemail;

	console.log("new info: ", newusername, newpassword, newemail);

	const userUpdate = {
		'oldusername': oldusername,
		'newusername': newusername,
		'newpassword': newpassword,
		'newemail': newemail
	}

	console.log(userUpdate);
	try {
		const newuser = await fetch('/api/edit', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			//JavaScript 值转换为 JSON 字符串。
			body: JSON.stringify(userUpdate), 
			mode: 'cors',
			cache: 'no-cache',
			credentials: 'include',
		}).then(res => res.json())
		.then(data => {
			console.log('data: ????: ', data);
			if (data['edit']= true ) {
				alert('edit successfully');
				location.reload();
			} else {
				alert('edit failed');
			}
		})
	}catch (err) {
			console.log(err);
	}

}

// let notification = document.getElementById('notification');
// /*get notification*/
// async function getNotification() {
// 	console.log('get notification');
// 	try {
// 		const notification = await fetch("/api/getnotification", {
// 			method: "GET",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			mode: 'cors',
// 			cache: 'default',
// 		})
// 		.then(res => res.json())
// 		.then(data => data);
// 		if (!notification) {
// 			alert('get notification failed');
// 			return ;
// 		}
// 		console.log('notification: ', notification);
// 		return notification;
// 	}
// 	catch (err) {
// 		console.log(err);
// 	}
// }
// notification.value = getNotification();



/* HANDLE NOTIFICATION */
async function handleNotification(event) {
	console.log('notification button!!!!!!!!!!!!!!!!');
	event.preventDefault();
	
	if (notification.value == 'on') {
		console.log('notification is on???????????');
		try {
			const response = await fetch("/api/updatenotification", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 'notification': 'off' }),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => {
				if (data['updatenotifications'] == true) {
					document.getElementById('notification').value = 'off';
					document.getElementById('notification').innerHTML = 'ON';
					alert(' notification off');
				}
			})
		} catch (err) {
			console.log(err);
		}
	} else if (notification.value == 'off') {
		console.log('come in ?????????');
		notification.value = 'on';
		notification.innerHTML = 'OFF';
		try {
			const response = await fetch("/api/updatenotification", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ 'notification': 'on' }),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => {
				if (data['updatenotifications'] == true) {
					document.getElementById('notification').value = 'on';
					document.getElementById('notification').innerHTML = 'OFF';
				}
			})
			
		} catch (err) {
			console.log(err);
		}
	}
}


/* HANDLE LOGOUT */
async function handleLogout(event) {
	event.preventDefault();
	try {
		const user = await fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
			mode: 'cors',
			cache: 'default',
		}).then(res => res.json())
		.then(data => data)
		if (user) {
			window.location = '/home';
			alert('logout success');
		}
		else {
			alert('logout failed');
		}
	} catch (error) {
		console.log(error);
	}
}