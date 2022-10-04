const galleryParent = document.getElementById("Gallery");

//check有没有登录:没有登录就显示login和signup，有登录就显示logout
function checkLogin() {
	console.log('cnm:', window.document.cookie.Camagru_xuwang)
		//没有cookie
		//如果没有cookie，就显示login和signup，隐藏logout
		if (window.document.cookie.Camagru_xuwang === null) {
			console.log("no token");
			document.getElementById("login").style.display = "block";
			document.getElementById("signup").style.display = "block";
			document.getElementById("logout").style.display = "none";
		}
		//有cookie
		else {
			console.log("have token");
			console.log(window.localStorage.getItem("token"));
			document.getElementById("login").style.display = "none";
			document.getElementById("signup").style.display = "none";
			document.getElementById("logout").style.display = "block";
		}
}

async function handleLogout(event) {
	try {
		const response = await fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
		});
		if (!response) {
			alert("logout response is null");
			// throw new Error(`Error! status: ${response.status}`);
		}
		console.log("in home js : " + response); //ok
		window.localStorage.removeItem("token");
		window.location = "/home";
		} catch (error) {
			console.log(error);
		}	
}



// const imgs = getImages()
// // 从数据库中获取图片
// async function getImages() { 
// 	await fetch("/images"// 	.then(res => res.json())
// 	.then(data => {
// 		console.log('Success:', data);
// 		return data;
// 	})
// }

// // 将图片添加到页面中
// imgs.forEach.call(img => {
// 	for (let i = 0; i < img.length; i++) {
// 		const imgElement = document.createElement("img");
// 		imgElement.src = img[i].imgurl;
// 		imgElement.alt = img[i].imgId;
// 		galleryParent.appendChild(imgElement);
// }
// })

