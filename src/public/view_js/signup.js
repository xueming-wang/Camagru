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


/* HANDLE SIGN UP*/ 
async function handleSubmit(event){
	//取消默认事件
	console.log('sign up button!!!!!!!!!!!!!!!!');
	event.preventDefault();

	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;
	
	if (!username || !password || !email) {
		alert('Please fill in all fields'); 
		return;
	}
	if (passwordConfirmation(password) == false) {
		alert('Passwords do not match');
		return;
	}
	if (usernameConfimation(username) == false) {
		alert('Username is not valid');
		return;
	}
	if (isEmail(email) == false) {
		alert('Email is not valid');
		return;
	}
	const user = {
		username: username,
		password: password,
		email: email
	}
	console.log(user);
	try {
		const newuser = await fetch('/api/createNewUser', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(user), 
			mode: 'cors',
			cache: 'default',
		}).then(res => res.json())
		.then(data => data);
			console.log('data: ????: ', newuser);
			if (newuser['create']= true ) {
				// set token in cookie
				// document.cookie = `token=${data.token}`;
				alert('Sign up successfully');
				window.location.href = '/login';	
			} else {
				alert('Sign up failed');
			}
		} catch (error) {
			console.log(error);
		}
	}
	

