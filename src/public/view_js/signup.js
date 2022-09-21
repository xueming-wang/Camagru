
function usernameConfimation(username) {
	if (username.length < 5 || username.length > 10) {
		alert('Error size(5~10)');
		return false;
	}
	if (/^[a-zA-Z]+$/.test(username) == false) {
		alert('Error type(a~z, A~Z)');
		return false;
	}
}

function passwordConfirmation(password) {
	for(let i = 0; i < password.length; i++) {
		if(password.length < 5 || password.length > 15) {
			alert('Error size(5~15)');
			return false;
		}
		if (/^[a-zA-Z]+$/.test(password[i]) == false && /^[0-9]+$/.test(password[i]) == false) {
			alert('Error type(a~z, A~Z, 0~9)');
			return false;
		}
	}
}

function handleSubmit(event){
	//取消默认事件
	console.log('!!!!!!!!!!!!!!!!');
	event.preventDefault();

	// const form = document.getElementById('signup-form');
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const email = document.getElementById('email').value;
	
	if (passwordConfirmation(password) == false) {
		alert('Passwords do not match');
		return;
	}
	if (usernameConfimation(username) == false) {
		alert('Username is not valid');
		return;
	}
	const user = {
		username: username,
		password: password,
		email: email
	}
	console.log(user);
	
	//发送请求 创建用户 post('/api/usercreate)
	fetch('/api/usercreate', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(user),
	})
	window.location='/login' //跳转到登录页面
}


