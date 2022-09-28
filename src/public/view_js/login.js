
async function handlelogin(event) {

console.log('login botton!!!!!!!!!!!!!!!!');
event.preventDefault();

var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
var login = {username: username, password: password};

try {
  //把res.json 放进去response
  const response =  await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(login),
  }).then(res => res.json());
  document.cookie = `token=${response.token}`; //设置ookie
  window.location='/home' //跳转到登录页面
  } catch (error) {
  console.log(error);
  }
}
