let bodyPix;
let video;
let segmentation;
let frameRate = 1; // Frames per second
let captureDuration = 2; // Duration in seconds

function preload() {
  bodyPix = ml5.bodySegmentation("SelfieSegmentation", {
    maskType: "background",
  });
}

function setup() {
  createCanvas(640, 480);
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
  console.log("Button clicked"); // Add this line for debugging
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

function createGIFfromFrames(frames) {
  var gif = new GIF({
    workers: 2,
    quality: 10,
    width: 640, // Set width based on the frame dimensions
    height: 480, // Set height based on the frame dimensions
    transparent: [0, 0, 0, 0], // Set transparent color to rgba(0, 0, 0, 0) for full transparency
  });

  gif.on("finished", function (blob) {
    var data_url = URL.createObjectURL(blob);
    console.log("Data URL:", data_url); // Log the data URL

    // Create a download link and trigger the download
    var a = document.createElement("a");
    a.href = data_url;
    a.download = "animated.gif";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  var loadedFrames = 0; // Track the number of loaded frames

  frames.forEach(function (frameDataURL, index) {
    var img = new Image();
    img.src = frameDataURL;

    img.onload = function () {
      console.log("Loaded frame " + (index + 1) + "/" + frames.length); // Log frame loading progress
      // Add each frame to the gif
      gif.addFrame(img, { delay: 200 });

      loadedFrames++;

      if (loadedFrames === frames.length) {
        console.log("All frames loaded. Rendering the GIF..."); // Log when all frames are loaded
        // Render the gif
        gif.render();
      }
    };
  });
}
