/* GET GALLERY*/	
getImages();   //可以评论


async function getImages() {
	// let galleryParent = document.getElementById("Gallery");
	try {
		const imgs = await fetch("/api/allimgs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'no-cache',
		}).then(res => res.json())
		if (imgs) {
			for (const img of imgs.imgs) {
				const sortImgs = Array. from(img).sort((a, b) => {
					return b.time - a.time;
				});
				// console.log("home js time sort??????????:", sortImgs);
				for(const i of sortImgs) {
					await createHtmlElement(i.imgurl, i._id);
				}
			}
		}
	} catch (error) {
		console.log(error);
	}
}


//创建html元素 图片, 评论, 点赞
async function createHtmlElement(imgurl, imgid) {

	const likeButton = await getLikeButton(imgid)
	const likeNumber = await getLikeNum(imgid)
	const Comments = await getComments(imgid)
	
	const galleryParent = document.getElementById("Gallery");

	let img = document.createElement("img");
	img.id = imgid;
    img.src = imgurl;

	let commentInput = document.createElement("input");
	commentInput.id = `${imgid}_comment`;
	commentInput.type = "text";

	let commentButton = document.createElement("button");
	commentButton.id = `${imgid}_comment_button`;
	commentButton.innerHTML = "valide";
	commentButton.onclick = handleCommentButton;

	galleryParent.appendChild(img);
	galleryParent.appendChild(likeButton);
	galleryParent.appendChild(likeNumber);
	galleryParent.appendChild(commentInput);
	galleryParent.appendChild(commentButton);
	galleryParent.appendChild(Comments);
}


async function getLikeButton(imgid) {
	let likeButton = document.createElement("button");
	likeButton.id = `${imgid}_button`;
	// console.log("get likeButton.id:      ????????", likeButton.id);
	likeButton.onclick = HandlelikeButton;
	likeButton.innerHTML = "LIKE";
	likeButton.value = "like";
	
	try {
		const user = await fetch('/api/auth', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		cache: 'no-cache',
		}).then(res => res.json())
			.then(data => {
			if (data['auth'] == true)  {
				try {
					const islike = fetch("/api/islike", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({'imgId': imgid}),
						mode: 'cors',
						cache: 'no-cache',
					}).then(res => res.json())
					.then(data => {
						if (data['islike'] == true) {
							likeButton.innerHTML = "UNLIKE";
							likeButton.value = "unlike";
						}
						else {
							likeButton.innerHTML = "LIKE";
							likeButton.value = "like";
						}
					})
				} catch (error) {
					console.log(error);
				}
			}	
		})
	} catch (error) {
		console.log(error);
	}
	return likeButton;
	
}

async function getLikeNum(imgid) {
	let likeNumber = document.createElement("p");
	likeNumber.id = `${imgid}_number`;
	likeNumber.innerHTML = 0;
	
	try { 
		const num = await fetch("/api/likenum", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({'imgId': imgid}),
		mode: 'cors',
		cache: 'no-cache',
		}).then(res => res.json())
		.then(data => {
			if (data != null) {
				const num = data['like'];
				likeNumber.innerHTML = num;
			}
		})
	} catch (error) {
		console.log(error);
	}
	return likeNumber;
}


async function handleCommentButton(event) {
	event.preventDefault();
	let commentId = String(event.target.id).split("_")[0];
	console.log("commentId: ", commentId);
	let commentInput = document.getElementById(`${commentId}_comment`);
	let comment = '';
	 comment = commentInput.value;
	console.log("comment: ", comment);

	if (comment != null) {
		try {
			const res = await fetch("/api/addcomment", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					'imgId': commentId, 
					'comment': comment,
				}),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => {
				if (data['user'] === false) {
					alert('please login first');
				}
				if (data['addcomment'] == true) {
					console.log("comment success");
					location.reload();
				}
			})
		} catch (error) {
			console.log(error);
		}
	}
}
	
async  function getComments(imgId) {
	//拿到所有comments array
	let comments = document.createElement("div");
	comments.id = `${imgId}_cms`;
	//创建p元素
	try {
		const res = await fetch("/api/getcomments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({'imgId': imgId}),
			mode: 'cors',
			cache: 'no-cache',
		}).then(res => res.json())
		.then(data => {
			if (data['commentsArray'] != null) {
				let commentsArray = data['commentsArray'];
				for (let i = 0; i < commentsArray.length; i++) {
					let comment = document.createElement("p");
					comment.innerHTML = commentsArray[i];
					comments.appendChild(comment);
				}
			}
		})
	} catch (error) {
		console.log(error);
	}
	return comments;
}



//点赞按钮
async function HandlelikeButton(event) {
	event.preventDefault();
	//get img 的id 
	let imgId = String(event.target.id).split("_")[0];
	const likeButton = document.getElementById(`${imgId}_button`);
	console.log("进去 handle likeButton.id:      ????????", likeButton.id);
	// const img = document.getElementById(imgId)

	if(likeButton.value == "like") {
		//当前img id ok 
		console.log("like button imgId:", imgId);
		try {
			const like = await fetch("/api/like", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					'imgId': imgId,
				}),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => {
				console.log("HandlelikeButton data:", data);
				if (data['user'] === false) {
					alert('please login first');
				}
				if (data['like'] === true) {
					alert('like success');
					likeButton.style.color = "red";
					likeButton.innerHTML= "UNLIKE";
					likeButton.value= "unlike";
					// likeNumber.innerHTML = data['like'];
					console.log("likeButton.value:????????", likeButton.value);
					location.reload();
				}
			})
		} catch (error) {
			console.log(error);
		}
	}
	else if (likeButton.value == "unlike"){
		console.log("unlike button imgId:", imgId);
		try {
			const unlike = await fetch("/api/unlike", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					'imgId': imgId ,
				}),
				mode: 'cors',
				cache: 'no-cache',
			}).then(res => res.json())
			.then(data => {
				console.log("Handle unlikeButton data:", data);
				if (data['user'] === false) {
					alert('please login first');
				}
				if (data['unlike'] === true) {
					alert('unlike success');
					likeButton.style.color = "black";
					likeButton.value= "like";
					likeButton.innerHTML = "LIKE";
					// likeNumber.innerHTML = data['like'];
					console.log("unlikeButton.value: !!!!!!!!!!!1", likeButton.value);
					location.reload();
				}
				else {
					alert('unlike failed');
				}
			})
		} catch (error) {
			console.log(error);
		}

	}
}

// //评论按钮
// function HandlecommentButton(event) {
// 	event.preventDefault();
// 	let commentInput = document.getElementById("commentInput");
// 	let commentBtton = document.getElementById("commentBtton");

// 	let img = document.getElementById("img");



// }

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


