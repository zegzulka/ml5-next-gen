// Copyright (c) 2023 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

let facemesh;
let handpose;
let video;
let faces = [];
let hands = [];

function preload() {
  // Load the facemesh model
  handpose = ml5.handpose({ runtime: "tfjs" });
  facemesh = ml5.facemesh({ runtime: "tfjs" });
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose.detectStart(video, gotHands);
  facemesh.detectStart(video, gotFaces);
}

function draw() {
  background(255);
  image(video, 0, 0, width, height);
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }

  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }
}

// Callback function for when handpose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

// Callback function for when facemesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
  //console.log(faces);
}
