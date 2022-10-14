const { sanitizeFilter } = require("mongoose");
const { couldStartTrivia } = require("typescript");

/* scripy */
var video = document.getElementById('video');
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var getUserMedia = function(constraints, success,error) {
    if(navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(success).catch(error);
    }
}

var success = function(stream) {
    video.secObject = stream;
    video.play();
};

var error = function(error) {
    console.log("video false: ", `${error.message}`);
}

//if can take photo
if (navigator.mediaDevices.getUserMedia || navigator.getUserMedia ){
    getUserMedia({video: {width:400, height: 500}}, success, error);
} else {
    alert('can t use take photo');
}

document.getElementById('capture').addEventListener('click', function() {
    context.drawImage(video, 0, 0, 400, 500);
})