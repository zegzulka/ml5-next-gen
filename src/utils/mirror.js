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
 * Takes in a HTML or p5 video and flip it horizontally.
 * The function return new instance of media and leaves the original media unmodified.
 * @param video - a HTML or p5 video to do the mirroring on.
 * @return a new mirror HTML or p5 image or video, matching the type of the media parameter.
 */
export default function mirror(video) {
  let isP5Element = video.elt !== undefined;
  let mirroredVideo;

  if (rawMedia instanceof HTMLVideoElement) {
    mirroredMedia = mirrorVideo(rawMedia);
  } else if (isP5Element && rawMedia.elt instanceof HTMLVideoElement) {
  } else {
    throw new Error(
      "The media parameter passed into the mirror() function is not a valid HTML or p5 video."
    );
  }
  return mirroredVideo;
}
