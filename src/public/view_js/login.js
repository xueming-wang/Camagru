
async function handlelogin(event) {

console.log('login botton!!!!!!!!!!!!!!!!');
event.preventDefault();

var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
var login = {
  'userName': username,
  'passWord': password,
};
console.log('in js' + username + ' ' + password);
try {

  //把res.json 放进去response
  const response  =  await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(login),
  }).then(res => res.text());
  if (!response) {
    alert('login response is null');
    // throw new Error(`Error! status: ${response.status}`);
  }
  console.log('js : ' + response);  //ok

  window.localStorage.setItem('token', response.token);
  getToken = window.localStorage.getItem('token');
  
  window.location = '/home'//跳转到登录页面
  } catch (error) {
    console.log(error);
  }
}
