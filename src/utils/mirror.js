/**
 * Takes in a HTML video and return a new HTML video that is mirrored horizontally.
 * @param video - a HTML video to do the mirroring on.
 * @return a new mirror HTML video.
 */
function mirrorVideo(video) {
  let canvas = document.createElement("canvas");
  canvas.width = video.width;
  canvas.height = video.height;
  let ctx = canvas.getContext("2d");
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  const drawFrame = () => {
    if (!video || !canvas) return;
    ctx.drawImage(video, 0, 0, video.width, video.height);
    requestAnimationFrame(drawFrame);
  };
  requestAnimationFrame(drawFrame);

  let mirroredVideo = document.createElement("video");
  mirroredVideo.width = video.width;
  mirroredVideo.height = video.height;
  mirroredVideo.srcObject = canvas.captureStream();
  mirroredVideo.muted = true; // for chrome autoplay policy
  return mirroredVideo;
}

/**
 * Takes in a HTML video and return a new p5 video that is mirrored horizontally.
 */
function htmlVideoToP5Video(video) {
  const p5Video = addElement(video, p5.instance, true);
  p5Video.loadedmetadata = false;
  // set width and height onload metadata
  video.addEventListener("loadedmetadata", function () {
    video.play();
    p5Video.width = video.width;
    p5Video.height = video.height;
    p5Video.loadedmetadata = true;
  });
  return p5Video;
}
/**
 * Helper function to create a p5 element
 */
function addElement(elt, pInst, media) {
  const node = pInst._userNode ? pInst._userNode : document.body;
  node.appendChild(elt);
  const c = media
    ? new p5.MediaElement(elt, pInst)
    : new p5.Element(elt, pInst);
  pInst._elements.push(c);
  return c;
}

/**
 * Takes in a HTML or p5 video and flip it horizontally.
 * The function return new instance of media and leaves the original media unmodified.
 * @param video - a HTML or p5 video to do the mirroring on.
 * @return a new mirror HTML or p5 image or video, matching the type of the media parameter.
 */
export default function mirror(video) {
  let isP5Element = video.elt !== undefined;

  if (video instanceof HTMLVideoElement) {
    let mirroredVideo = mirrorVideo(rawMedia);
    return mirroredVideo;
  } else if (isP5Element && video.elt instanceof HTMLVideoElement) {
    let rawMirroredVideo = mirrorVideo(video.elt);
    let mirroredVideo = htmlVideoToP5Video(rawMirroredVideo);
    return mirroredVideo;
  } else {
    throw new Error(
      "The media parameter passed into the mirror() function is not a valid HTML or p5 video."
    );
  }
}
