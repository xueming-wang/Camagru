
async function handleSendEmail(event) {
	console.log("send email botton!!!!!!!!!!!!!!!!");
	event.preventDefault();

	var email = document.getElementById("email").value;
	var emailInfo = {
		'email': email,
	};
	try {
		const res = await fetch('//sendEmail', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				},
				body: JSON.stringify(emailInfo),
				mode: 'cors',
				cache: 'default',
				credentials: 'include',
			})
			if (!res) {
				alert('send email failed');
				return ;
			}
			console.log('send email fetch return :' , res);
			location.reload();
		} catch (error) {
			console.log(error);
		}
}