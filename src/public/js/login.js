/* HANDLE LOGIN*/

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
    const res =  await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(login),
      mode: 'cors',
      cache: 'default',
      credentials: 'include',
    }).then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      if(data['login'] == true){
        window.location = '/home';
      }
      else{
        alert('login failed');
      }
    })
  } catch (error) {
    console.log(error);
  }
}

/* FORGET PWD */
async function fogetpwd(event){ 
  event.preventDefault();

  var username = prompt("entre your username");
  console.log(username);
  if (!username) {
    alert('Please enter your username'); 
  }

  var email = prompt("entre your Email address");
  console.log(email);
  if(!email){ 
    alert("email can not be empty");
  }

  else{
      var emailInfo = {
          'email': email,
          'username': username,
      };
      try {
          const res =  await fetch('/api/forgetpwd', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(emailInfo),
              mode: 'cors',
              cache: 'default',
              credentials: 'include',
          }).then(response => response.json())
          .then(data => {
              console.log('Success:', data);
              if(data['forget'] == true){
                  alert('send email success');
              }
              else{
                  alert('send email failed');
              }
          })
      } catch (error) {
          console.log(error);
      }
  }
}