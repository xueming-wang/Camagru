

// const showImgsDiv = document.getElementById('allimgs');

async function getAllImgsByUser() {
	try {
		const imgs = await fetch("/api/userimgs", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'no-cache',
		}).then(res => res.json()).then(data => {
			// console.log("js 拿到???????????",data);
		if (data) { //得到所有imgs
			for (const img of data) {
				creatImgsElement(img.imgurl, img._id);
			}
		}
	})
	} catch (error) {
		console.log(error);
	}
}

//创建html图片
function creatImgsElement(imgurl, imgid) {

	let img = document.createElement("img");
	img.id =`${imgid}_show`;
	img.src = imgurl;

	let delbutton = document.createElement("button");
	delbutton.innerHTML = "delete";
	delbutton.id = `${imgid}_del`;
	delbutton.onclick = handleDelButton;

	document.getElementById('allimgs').appendChild(img);
	document.getElementById('allimgs').appendChild(delbutton);
}

getAllImgsByUser();

//删除图片
async function handleDelButton(e) {
	e.preventDefault();

	const imgid = e.target.id.split("_")[0];
	//get imgid

	try {
		const res = await fetch("/api/delimg", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			mode: 'cors',
			cache: 'no-cache',
			body: JSON.stringify({
				'imgid': imgid,
			}),
		}).then(res => res.json()).then(data => {
			if (data['deleteimg'] === true) { //得到所有imgs
				console.log("删除图片成功");
				location.reload();
			}
		})
	} catch (error) {
		console.log(error);
	}
}