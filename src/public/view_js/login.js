
async function handlelogin(event) {

console.log('login botton!!!!!!!!!!!!!!!!');
event.preventDefault();

var username = document.getElementById("username").value;
var password = document.getElementById("password").value;
var login = {
  'userName': username,
  'passWord': password,
};
console.log('in js : ' + username + ' ' + password);
try {
  //把res.json 放进去response
    const res =  await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
      mode: 'cors',
      cache: 'default',
      credentials: 'include',
    })    
    if (!res) {
      alert('login failed');
      return ;
    }
    console.log('login fetch return :' , res);
    window.location = '/home'//跳转到登录页面

  } catch (error) {
    console.log(error);
  }
}
