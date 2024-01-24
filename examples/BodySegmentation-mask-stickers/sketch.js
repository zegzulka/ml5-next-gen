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
  let encoder = new GIFEncoder();
  encoder.setRepeat(0);
  encoder.setDelay(200);

  // Set the transparent color to rgba(0, 0, 0, 0) for full transparency
  encoder.setTransparent([0, 0, 0, 0]);

  encoder.start();

  let processedFrames = 0;

  frames.forEach(function (frameDataURL) {
    let img = new Image();
    img.src = frameDataURL;

    img.onload = function () {
      let canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      // Ensure that the canvas has a transparent background
      let context = canvas.getContext("2d", { alpha: true });
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image onto the canvas with transparency
      context.drawImage(img, 0, 0);

      encoder.addFrame(context);

      processedFrames++;

      if (processedFrames === frames.length) {
        encoder.finish();
        var binary_gif = encoder.stream().getData();
        var data_url = "data:image/gif;base64," + encode64(binary_gif);
        console.log("Data URL:", data_url); // Log the data URL

        // Create a download link and trigger the download
        var a = document.createElement("a");
        a.href = data_url;
        a.download = "animated.gif";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
  });
}

