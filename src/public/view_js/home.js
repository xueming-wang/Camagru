/* GET GALLERY*/	
async function getImages() {
	var galleryParent = document.getElementById("Gallery");
	try {
		const imgs = await fetch("/api/images", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'default',
		}).then(data => data)
		if (imgs) {
			for (var i = 0; i < imgs.length; i++) {
				var img = document.createElement("img");
				img.src = imgs[i].url;
				img.alt = data[i].name;
				galleryParent.appendChild(img);
			}
		}
		else {
			alert('get images failed');
		}
	} catch (error) {
		console.log(error);
	}
}
getImages();   //可以评论


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


