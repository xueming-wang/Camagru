

function passwordConfirmation(password) {
	for(let i = 0; i < password.length; i++) {
		if (password.length < 5 || password.length > 15) return false;
		if (/^[a-zA-Z]+$/.test(password[i]) == false && /^[0-9]+$/.test(password[i]) == false) return false;
	}
}

var eye=document.getElementById("eye");
var password=document.getElementById("password");

 function showhide() {
	if (password.type=="password") {
		password.type="text";
		eye.className="fa fa-eye-slash";
	}
	else{
		password.type='password';
		eye.className='fa fa-eye'
	}
}

var eye2=document.getElementById("eye2");
var password2=document.getElementById("password2");

 function showhide2() {
	if (password2.type=="password") {
		password2.type="text";
		eye2.className="fa fa-eye-slash";
	}
	else{
		password2.type='password';
		eye2.className='fa fa-eye'
	}
}

async function handlePWD(event){
	event.preventDefault();

	const password = document.getElementById('password').value;
	const password2 = document.getElementById('password2').value;

	if (!password || !password2) {
		alert('Please fill in all fields'); 
		return;
	}
	if (password != password2) {
		alert('Passwords do not match');
		return;
	}

	if (passwordConfirmation(password) == false) {
		alert('Password must be 5-15 characters and contain only letters and numbers');
		return;
	}

	const params = new URLSearchParams(window.location.search)

	// console.log(params.get('username'), '\n\n')

	try {
	const response = await fetch('/api/initpwd', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			'username': params.get('username'),
			'password': password,
		}),
		mode: 'cors',
	}).then(res => res.json())
	.then(data => {
		if (data['init'] == true) {
			alert('Password init successfully');
			window.location.href = '/login';
		}
		else {
			alert('Password init failed');
		}

	});
	} catch (error) {
		console.log(error);
	}

}
