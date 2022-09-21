function handlelogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;
  var login = {username: username, password: password};
  fetch('/api/login', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json',
	},
	body: JSON.stringify(login),
  })
  .then(response => response.json())
  .then(data => {
	if (data.status == 200) {
	  window.location = '/'; //跳转到主页
	} else {
	  alert('Wrong username or password');
	}
  })
  .catch((error) => {
	console.error('Error:', error);
  });
}