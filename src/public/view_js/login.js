
async function handlelogin(event) {

console.log('login botton!!!!!!!!!!!!!!!!');
event.preventDefault();

var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
var login = {username: username, password: password};

try {
  const response =  await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(login),
  });
  if (!response) {
    throw new Error(`Error! status: ${response.status}`);
  }
  window.location='/home' //跳转到登录页面
  } catch (error) {
  console.log(error);
  }
}
