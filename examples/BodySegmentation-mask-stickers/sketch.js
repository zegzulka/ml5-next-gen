let bodyPix;
let video;
let segmentation;
let isVideoPlaying = true;
let gif;
let captureDuration = 2; // Duration in seconds
let frameRate = 1; // Frames per second
let quality = 10; // GIF quality

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

loadGIFWorker();

function draw() {
  clear(); // Use clear() instead of background()
  if (segmentation) {
    video.mask(segmentation);
    image(video, 0, 0);
  }
}

function gotResults(result) {
  segmentation = result.mask;
}

function toggleVideo() {
  // Toggle the video playback
  if (isVideoPlaying) {
    video.pause();
    isVideoPlaying = false;
  } else {
    video.loop();
    isVideoPlaying = true;
  }
}

function updateGIFSettings() {
  frameRate = parseInt(document.getElementById("frameRate").value);
  quality = parseInt(document.getElementById("quality").value);
  captureDuration = parseInt(document.getElementById("duration").value);
  const loopCount = parseInt(document.getElementById("loopCount").value);
  const frameDelay = parseInt(document.getElementById("frameDelay").value);

  gif.options.quality = quality;
  gif.options.repeat = loopCount;

  return frameDelay;
}

function startGIFCapture() {
  let frameCount = captureDuration * frameRate;
  for (let i = 0; i < frameCount; i++) {
    setTimeout(() => {
      clear();
      gif.addFrame(video.canvas, { delay: 1000 / frameRate, copy: true });
      if (i === frameCount - 1) {
        gif.render();
      }
    }, (i * 1000) / frameRate);
  }
}

function loadGIFWorker() {
  fetch("https://cdnjs.cloudflare.com/ajax/libs/gif.js/0.2.0/gif.worker.js")
    .then((response) => response.blob())
    .then((workerBlob) => {
      const workerBlobUrl = URL.createObjectURL(workerBlob);

      gif = new GIF({
        workers: 2,
        quality: quality,
        workerScript: workerBlobUrl,
      });

      gif.on("finished", function (blob) {
        window.open(URL.createObjectURL(blob));
      });
    })
    .catch(console.error);
}
