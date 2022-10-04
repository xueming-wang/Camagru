

async function getImages() {
	var galleryParent = document.getElementById("Gallery");
	try {
		const res = await fetch("/api/images", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'default',
		})
		if (!res) {
			alert('get images failed');
			return ;
		}
		console.log(res);
		for (let i = 0; i < res.length; i++) {
			let img = document.createElement("img");
			img.src = res[i].url;
			img.alt = res[i].name;
			galleryParent.appendChild(img);
		}
	}
	catch (error) {
		console.log(error);
	}
}

const cookie = document.cookie;
console.log("cookie : " + cookie.length);

if (cookie.length === 0) {
	console.log("no token");
	document.getElementById("login").style.display = "block";
	document.getElementById("signup").style.display = "block";
	document.getElementById("logout").style.display = "none";
	getImages();  //不能评论
}
//有cookie
else {
	console.log("have token");
	document.getElementById("login").style.display = "none";
	document.getElementById("signup").style.display = "none";
	document.getElementById("logout").style.display = "block";
	document.getElementById("email").style.display = "block";
	getImages();   //可以评论
}



async function handleLogout(event) {
	try {
		const res = await fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
			mode: 'cors',
			cache: 'default',
		});
		if (!res) {
			alert("logout response is null");
			return ;
		}
		console.log("in home : " + res); //ok
		location.reload();
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

