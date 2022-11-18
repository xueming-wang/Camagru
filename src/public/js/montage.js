
/* scripy */
var video = document.getElementById('video');
let MediaStreamTrack;
let dataUrl = '';

//open camera after chossen file
function openCamera(event) {
    event.preventDefault();
    const value = selectFilter();
    if (value == "") {
        alert("please select a filter");
        closeVideo(event);
    } else {
        getMedia(value);
    }
}

//选择滤镜
function selectFilter() {
    let filter = document.getElementById("filter");
    filter = filter.value;
    let filterStyle = "";
    switch (filter) {
        case "none":
            filterStyle = "";
            break;
        case "grayscale":
            filterStyle = "grayscale(100%)";
            break;
        case "sepia":
            filterStyle = "sepia(100%)";
            break;
        case "blur":
            filterStyle = "blur(5px)";
            break;
        case "hue-rotate":
            filterStyle = "hue-rotate(90deg)";
            break;
        case "opacity":
            filterStyle = "opacity(50%)";
            break;
    }
    return filterStyle;
}

//获得video摄像头区域
function getMedia(value) {
    //获得Canvas对象
    let constraints = {
        video: {
            width: 200, 
            height: 200,
        },
        audio: false,
    };
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then(function (MediaStream) {
        MediaStreamTrack = MediaStream;
        video.srcObject = MediaStream;
        video.style.filter = value;
        video.play();
    }).
    catch(function (PermissionDeniedError) {
        console.log(PermissionDeniedError);
    }); 
}



//监测滤镜改变
function changeFilter() {
    video.style.filter = selectFilter();
}

//Close
function closeVideo(event){
    event.preventDefault();
    // 两种方法都可以,这个0是指constraints的对象,下标从后面开始计数
    MediaStreamTrack && MediaStreamTrack.getVideoTracks()[0].stop();
}

//创建context对象，getContext("2d") 对象是内建的 HTML5 对象，拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法。
function takePhoto(event) {
    //获得Canvas对象
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext('2d');
    //设置Canvas的宽高为视频的宽高
    canvas.width = video.videoWidth / 2;
    canvas.height = video.videoHeight / 2;
   
    //添加滤镜
    const filter = selectFilter();
    ctx.filter = filter;  //ctx.filter (safari no support)
    //将视频画面绘制到Canvas上
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    if (canvas.width == 0 || canvas.height == 0) {
        alert("please open camera");
        return ;
    } 
    //将Canvas内的信息导出为png格式的图片数据
    dataUrl = canvas.toDataURL('image/png');
    // canvas.toBlob(function(blob) {
    //     saveAs(blob, "photo.png");
    // });
    return dataUrl;
}


//保存照片  ??????save 之后视频关闭
async function savePhoto(event) {
    event.preventDefault();

    //保存照片到数据库
    if (dataUrl == '') {
        alert("please take a photo first");
        return;
    }
    
    let photo = {
        "imgurl":dataUrl,
        "time": new Date().getTime(),
        "like": 0,
    }

    dataUrl = '';
    try {
       const res = await fetch("/api/savePhoto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({photo}),
            mode: 'cors',
            cache: 'no-cache',
        }).then(res => res.json()).then(data => {
            if (data['save'] == true) {
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
    dataUrl = '';
}




/* telecharger phpto*/
function changepicture(event) {
    event.preventDefault();

    let file =  event.target.files[0];
    // console.log('file????????', file);

    let reader;
    if (file) {
    // 创建流对象
    reader = new FileReader()
    reader.readAsDataURL(file)
    }
     // 捕获 转换完毕
    reader.onload = function(e) {
    // 转换后的base64就在e.target.result里面,直接放到img标签的src属性即可
        document.querySelector('img').src = e.target.result
    }
}


// canvas 压缩图片的代码
function compress(base64, quality, mimeType) {
    let canvas = document.createElement('canvas')
    let img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    return new Promise((resolve, reject) => {
        img.src = base64
        img.onload = () => {
        let targetWidth, targetHeight
        if (img.width > 200) {
            targetWidth = 200
            targetHeight = (img.height * 200) / img.width
        } else {
            targetWidth = img.width
            targetHeight = img.height
        }
        canvas.width = targetWidth
        canvas.height = targetHeight
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, targetWidth, targetHeight) // 清除画布
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        let imageData = canvas.toDataURL(mimeType, quality / 100)
        resolve(imageData)
        }
    })
}


// 保存图片
async function savePicture(event) {
    event.preventDefault();

    dataUrl = document.querySelector('img').src;
    // console.log('dataUrl', dataUrl);

    if (dataUrl == '') {
        alert("please take a photo first");
        return;
    }
    dataUrl = await compress(dataUrl, 0.8);
    // console.log("new DATA????????????/",  dataUrl);
 
 
    //保存照片到数据库
    let photo = {
        "imgurl": dataUrl,
        "time": new Date().getTime(),
        "like": 0,
    };
    dataUrl = '';

    try {
        const res = await fetch("/api/savePhoto", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({photo}),
            mode: 'cors',
            cache: 'no-cache',
        }).then(data => {
            if (data['save'] == true) {
                alert("save success");
                
            }
        })
    }
    catch (error) {
        console.log(error);
    }

}





//更新照片
async function updatePages(event) {
    event.preventDefault();
    location.reload();
    openCamera(event);
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