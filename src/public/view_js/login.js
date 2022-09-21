
function handlelogin(event) {
	console.log('login botton!!!!!!!!!!!!!!!!');
	event.preventDefault();

	
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
  window.location = '/'; //跳转到主页
}