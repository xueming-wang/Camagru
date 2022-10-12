/* check LOGIN */


async function checkLogin() {
	const user = await fetch('/api/auth', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		cache: 'no-cache',
		credentials: 'include',
	}).then(res => res.json())
		.then(data => data) 
		console.log("checkLogin", user);
		if(user['auth'] == true){
			console.log("login ^^^^^^^^^^^^^^^^^^^");
			document.getElementById("signup").style.display = "block";
			document.getElementById("login").style.display = "none";
			document.getElementById("logout").style.display = "block";
			document.getElementById("profile").style.display = "block";
			document.getElementById("montage").style.display = "block";
			document.getElementById("email").style.display = "block";
		}
		else {
			console.log("no login^^^^^^^^^^^^^^^^^^^");
			document.getElementById("signup").style.display = "block";
			document.getElementById("login").style.display = "block";
			document.getElementById("logout").style.display = "none";
			document.getElementById("profile").style.display = "none";
			document.getElementById("montage").style.display = "none";
			document.getElementById("email").style.display = "none";
		}
}

checkLogin();
