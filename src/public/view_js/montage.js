
/* scripy */
var video = document.getElementById('video');
let MediaStreamTrack;

//获得video摄像头区域

function getMedia(event) {
    event.preventDefault();
    let constraints = {
        video: {width: 500, height: 500},
        audio: true
    };
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(function (MediaStream) {
        MediaStreamTrack = MediaStream;
        video.srcObject = MediaStream;
        video.play();
    }).catch(function (PermissionDeniedError) {
        console.log(PermissionDeniedError);
    })
}


function closeVideo(event){
    event.preventDefault();
    // 两种方法都可以,这个0是指constraints的对象,下标从后面开始计数
    MediaStreamTrack && MediaStreamTrack.getVideoTracks()[0].stop();
}


//获得Canvas对象 
//创建context对象，getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
function takePhoto(event) {
    //获得Canvas对象
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
	// canvas画图
    ctx.drawImage(video, 0, 0);
    return canvas.toDataURL("image/png", 0.1);
    // 得到图片的base64编码数据
}
//图片链接也可以是 base64 字符串，直接赋值给 Image 对象 src 即可
// function dataUrl2Image(dataUrl, callback) {
//     var image = new Image();
//     image.onload = function() {
//       callback(image);
//     };
//     image.src = dataUrl;
// }
// function dataUrl2Blob(dataUrl, type) {
//     var data = dataUrl.split(',')[1];
//     var mimePattern = /^data:(.*?)(;base64)?,/;
//     var mime = dataUrl.match(mimePattern)[1];
//     var binStr = atob(data);
//     var arr = new Uint8Array(len);
  
//     for (var i = 0; i < len; i++) {
//       arr[i] = binStr.charCodeAt(i);
//     }
//     return new Blob([arr], {type: type || mime});
//   }
//保存照片
async function savePhoto(event) {
    event.preventDefault();

    const dataUrl = takePhoto(event);
    console.log("dataUrl: ????????? ", dataUrl);
    // let time = new Date().getTime();
    //保存照片到数据库
    let photo = {
        "imgurl":dataUrl,
        "time": new Date().getTime(),
    };
    try {
       const res = fetch("/api/savePhoto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({photo}),
            mode: 'cors',
            cache: 'no-cache',
        }).then(res => res.json()).then(data => {
            console.log(data);
            if (data) {
                alert("save success");
            }
        }
    )
    } catch (error) {
        console.log(error);
    }

}

/*annular*/
function annulePhoto(event) {
    event.preventDefault();
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* telecharger phpto*/
function changepicture(obj) {
    //console.log(obj.files[0]);//这里可以获取上传文件的name
    var newsrc = getObjectURL(obj.files[0])
    document.getElementById('show').src = newsrc
}

function getObjectURL(file) {
    var url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    }else if (window.webkitURL != undefined) {
        // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
    }
    return url;
}

function savePicture(event) {
    event.preventDefault();

    var imgurl = document.getElementById('show').src;
    //保存照片到数据库
    let photo = {
        "imgurl":imgurl,
        "time": new Date().getTime(),
    };

    try {
        const res = fetch("/api/savePhoto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({photo}),
            mode: 'cors',
            cache: 'no-cache',
        }).then(res => res.json()).then(data => {
            console.log(data);
            if (data) {
                alert("save success");
            }
        }
    )
    }
    catch (error) {
        console.log(error);
    }
}

/* HANDLE LOGOUT */
async function handleLogout(event) {
    event.preventDefault();
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