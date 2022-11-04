/* GET USER INFO*/

getUserInfo();
getNotification();


async function getUserInfo() {
	console.log('get user info');
	try {
		const user = await fetch("/api/profile", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'no-cache',
		})
		.then(res => res.json())
		.then(data => {
		if (!data) {
			alert('get user failed');
			return ;
		}
		document.getElementById("email").innerHTML = data.email;
		document.getElementById("username").innerHTML = data.userName;
		});
	}catch (err) {
		console.log(err);
	}
}


/*get notification*/
async function getNotification() {
	console.log('get notification');
	try {
		const notification = await fetch("/api/getnotification", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'default',
		})
		.then(res => res.json())
		.then(data =>  {
			console.log('notification?????????????: ', data);
			if (data['notification'] == true) {
				document.getElementById('notification').innerHTML = 'OFF';
				document.getElementById('notification').value = 'on';
			} else {
				document.getElementById('notification').innerHTML = 'ON';
				document.getElementById('notification').value = 'off';
			}
		});
	}catch (err) {
		console.log(err);
	}
}



