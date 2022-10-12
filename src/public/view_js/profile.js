/* GET USER INFO*/

async function getUserInfo() {
	console.log('get user info');
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
		document.getElementById("email").innerHTML = user.email;
		document.getElementById("username").innerHTML = user.userName;
		document.getElementById("password").innerHTML = user.passWord;
	}
	catch (err) {
		console.log(err);
	}
}

getUserInfo();