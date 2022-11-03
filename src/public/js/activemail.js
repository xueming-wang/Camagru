
async function handleSendEmail(event) {
	console.log("send email botton!!!!!!!!!!!!!!!!");
	event.preventDefault();

	const email = document.getElementById("email").value;
	const emailInfo = {
		email: email,
	}
	try {
		const sendMail = await fetch('/api/activemail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify(emailInfo),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data =>data);
				console.log('Success:', response);
				if(sendMail['send'] == true){
					alert('email has been sent');
					window.location.href = '/home'//跳转到登录页面;
				} else {
					alert('send email failed');
				}
		} catch (error) {
			console.log(error);
		}
}

// request.session