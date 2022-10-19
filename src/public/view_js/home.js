/* GET GALLERY*/	
getImages();   //可以评论

//按时间排序
function sortTime(imgsArray) {
	imgsArray.sort(function (a, b) {
		return a.time > b.time? 1: -1;
	});
}


async function getImages() {
	var galleryParent = document.getElementById("Gallery");
	try {
		const imgs = await fetch("/api/allimgs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'default',
		}).then(res => res.json())
		.then(data => data)
		if (imgs) {
			for (var i = 0; i < imgs.length; i++) {
				//创建一个Div
				const img_container = document.createElement("div");
				img_container.className = "img_container";
				//创建一个img
				var img = document.createElement("img");
				console.log("imgs[i].imgurl:", imgs[i].imgurl);
				img.src = imgs[i].imgurl;
				//创建一个like图标
				var like = document.createElement("img");
				
				//创建一个评论框
				var comment_input = document.createElement("input");
				comment_input.className = "comment_input";

				img_container.appendChild(img);
				galleryParent.appendChild(img_container);
			}
		}
	} catch (error) {
		console.log(error);
	}
}






/* HANDLE LOGOUT */
async function handleLogout(event) {
	try {
		const user = await fetch("/api/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({}),
			mode: 'cors',
			cache: 'default',
		}).then(res => res.json())
		.then(data => data)
		if (user) {
			window.location = '/home';
			alert('logout success');
		}
		else {
			alert('logout failed');
		}
	} catch (error) {
		console.log(error);
	}
}


