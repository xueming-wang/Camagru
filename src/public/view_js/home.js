/* GET GALLERY*/	
getImages();   //可以评论

//按时间排序
function sortTime(imgsArray) {
	imgsArray.sort(function (a, b) {
		return a.time > b.time? 1: -1;
	});
}



async function getImages() {
	// let galleryParent = document.getElementById("Gallery");
	try {
		const imgs = await fetch("/api/allimgs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'default',
		}).then(res => res.json())

		if (imgs) {
			console.log('tt?', imgs)
			for (const img of imgs.imgs) {
				console.log("imgs[i]._id:",  img._id);
				createHtmlElement(img.imgurl, img._id);
			}
		}
	} catch (error) {
		console.log(error);
	}
}

let getImgId = null;
//创建html元素 图片, 评论, 点赞
function createHtmlElement(imgurl, imgId) {
	let galleryParent = document.getElementById("Gallery");
    //创建一个Div
    const img_container = document.createElement("div");
    //创建一个img
    let img = document.createElement("img");
    img.src = imgurl;
	getImgId = imgId;
	//显示点赞数
	let likeNumber = document.createElement("p");
	likeNumber.innerHTML = "0";

    let likeButton = document.createElement("button");
	let t = document.createTextNode("LIKE");
	likeButton.id = "likeButton";
	likeButton.onclick = HandlelikeButton;
	// let likeIcon = document.createElement("i");
	
    let commentInput = document.createElement("input");
	commentInput.value = "enter your comment";
	let commentBtton = document.createElement("button");

	galleryParent.appendChild(img_container);
    img_container.appendChild(img);
    img_container.appendChild(likeButton);
	// <i class=></i>
	likeButton.appendChild(t);
	img_container.appendChild(likeNumber);
    img_container.appendChild(commentInput);
	img_container.appendChild(commentBtton);

    return img_container;
}

let a = true;
//点赞按钮
function HandlelikeButton(event) {
	event.preventDefault();
	let likeButton = document.getElementById("likeButton");

	let imgId = getImgId;
	console.log("HandlelikeButton imgid:", imgId);

	if (a) {
		try {
			const like = fetch("/api/like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imgId: imgId,
				}),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => data)
			if (like) {
				likeButton.style.color = "red";
				a = false;
			}
		} catch (error) {
			console.log(error);
		}
	}
	else if (!a) {
		try {
			const unlike = fetch("/api/unlike", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					imgId: imgId,
				}),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => data)
			if (unlike) {
				likeButton.style.color = "black";
				a = true;
			}
		} catch (error) {
			console.log(error);
		}

	}
}

//评论按钮
function HandlecommentButton(event) {
	event.preventDefault();
	let commentInput = document.getElementById("commentInput");
	let commentBtton = document.getElementById("commentBtton");

	let img = document.getElementById("img");



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


