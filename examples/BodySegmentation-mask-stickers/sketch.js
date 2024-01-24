let bodyPix;
let video;
let segmentation;
let frameRate = 10; // Default frames per second
let captureDuration = 2; // Default duration in seconds
let quality = 1; // Default quality
let frameDelay = 500; // Default frame delay

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

  // Get the latest values from input fields
  frameRate = parseFloat(document.getElementById("frameRate").value);
  // quality = parseInt(document.getElementById("quality").value);
  captureDuration = parseFloat(document.getElementById("duration").value);
  frameDelay = parseInt(document.getElementById("frameDelay").value);

  // Update the status indicator with the initial duration
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
  // Update the status indicator element
  const statusElement = document.getElementById("status");
  statusElement.innerText = duration;

  // Calculate the remaining duration
  let remainingDuration = duration;
  const statusInterval = setInterval(() => {
    remainingDuration--;
    if (remainingDuration >= 0) {
      statusElement.innerText = remainingDuration;
    } else {
      clearInterval(statusInterval);
    }
  }, 1000); // Update status every second
}

function createGIFfromFrames(frames) {
  var gif = new GIF({
    workers: 2,
    quality: 1,
    width: 1280, // Set width based on the frame dimensions
    height: 960, // Set height based on the frame dimensions
    transparent: [0, 0, 0, 0], // Set transparent color to rgba(0, 0, 0, 0) for full transparency
    repeat: 0, // Set repeat count
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
    // Create a canvas with the correct dimensions
    var canvas = document.createElement("canvas");
    canvas.width = 1280; // Set width based on the frame dimensions
    canvas.height = 960; // Set height based on the frame dimensions
    var context = canvas.getContext("2d");

    var img = new Image();
    img.src = frameDataURL;

    img.onload = function () {
      console.log("Loaded frame " + (index + 1) + "/" + frames.length); // Log frame loading progress

      // Clear the canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate positioning to center the frame
      var x = (canvas.width - img.width) / 2;
      var y = (canvas.height - img.height) / 2;

      // Draw the frame on the canvas
      context.drawImage(img, x, y);

      // Add the canvas as a frame to the gif
      gif.addFrame(canvas, { delay: frameDelay });

      loadedFrames++;

      if (loadedFrames === frames.length) {
        console.log("All frames loaded. Rendering the GIF..."); // Log when all frames are loaded
        // Render the gif
        gif.render();
      }
    };
  });
}
