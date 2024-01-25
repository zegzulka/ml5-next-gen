let bodyPix;
let video;
let segmentation;
let frameRate = 10; 
let captureDuration = 2; 
let quality = 1; 
let frameDelay = 500;

function preload() {
  bodyPix = ml5.bodySegmentation("SelfieSegmentation", {
    maskType: "background",
  });
}

function setup() {
  const canvas = createCanvas(640, 480); 
  canvas.style('width', '100%'); 
  canvas.style('height', '100%'); 
  canvas.parent("player"); 
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();
  bodyPix.detectStart(video, gotResults);

  document
    .getElementById("captureButton")
    .addEventListener("click", startGIFCapture);
}



function draw() {
  clear();
  if (segmentation) {
    video.mask(segmentation);
    image(video, 0, 0);
  }
}

function gotResults(result) {
  segmentation = result.mask;
}

function startGIFCapture() {
  console.log("Button clicked"); 

  frameRate = parseFloat(document.getElementById("frameRate").value);
  captureDuration = parseFloat(document.getElementById("duration").value);
  frameDelay = parseInt(document.getElementById("frameDelay").value);

  updateStatusIndicator(captureDuration);

  let frames = [];
  let captureFrameCount = captureDuration * frameRate;
  let interval = 1000 / frameRate;

  function captureFrame() {
    if (frames.length < captureFrameCount) {
      frames.push(
        document.getElementById("defaultCanvas0").toDataURL("image/jpeg")
      );
      setTimeout(captureFrame, interval);
    } else {
      createGIFfromFrames(frames);
    }
  }

  captureFrame();
}

function updateStatusIndicator(duration) {
  const statusElement = document.getElementById("status");
  statusElement.innerText = duration;
  statusElement.style.opacity = 1;

  let remainingDuration = duration;
  const statusInterval = setInterval(() => {
    remainingDuration--;
    if (remainingDuration >= 0) {
      statusElement.innerText = remainingDuration;
    } else {
      clearInterval(statusInterval);
      statusElement.style.opacity = 0.3;
    }
  }, 1000); 
}

function createGIFfromFrames(frames) {
  var gif = new GIF({
    workers: 2,
    quality: 1,
    width: 1280,
    height: 960, 
    transparent: [0, 0, 0, 0], 
    repeat: 0,
  });

  gif.on("finished", function (blob) {
    var data_url = URL.createObjectURL(blob);
    console.log("Data URL:", data_url); 

    var a = document.createElement("a");
    a.href = data_url;
    a.download = "animated.gif";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    displayGeneratedGIF(data_url);
  });

  var loadedFrames = 0; 

  frames.forEach(function (frameDataURL, index) {
    var canvas = document.createElement("canvas");
    canvas.width = 1280; 
    canvas.height = 960; 
    var context = canvas.getContext("2d");

    var img = new Image();
    img.src = frameDataURL;

    img.onload = function () {
      console.log("Loaded frame " + (index + 1) + "/" + frames.length);
      context.clearRect(0, 0, canvas.width, canvas.height);

      var x = (canvas.width - img.width) / 2;
      var y = (canvas.height - img.height) / 2;

      context.drawImage(img, x, y);

      gif.addFrame(canvas, { delay: frameDelay });

      loadedFrames++;

      if (loadedFrames === frames.length) {
        console.log("All frames loaded. Rendering the GIF...");
        gif.render();
      }
    };
  });
}

function displayGeneratedGIF(dataURL) {
  var imgElement = document.createElement("img");

  imgElement.src = dataURL;

  imgElement.className = "exported_video";

  var exportedVideosContainer = document.querySelector(".exported_videos");
  if (exportedVideosContainer) {
    exportedVideosContainer.appendChild(imgElement);
  } else {
    console.error("Exported videos container not found.");
  }
}
