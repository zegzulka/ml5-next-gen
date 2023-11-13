/**
 * Takes in a HTML or p5 image or video and flip it horizontally.
 * The function return new instance of media and leaves the original media unmodified.
 * @param media - a HTML or p5 image or video to do the mirroring on.
 * @return a new mirror HTML or p5 image or video, matching the type of the media parameter.
 */
export default function mirror(media) {
  let isP5Media = media.elt;
  let rawMedia = isP5Media ? media.elt : media;

  let mirroredMedia;

  typeof HTMLVideoElement !== "undefined" && media instanceof HTMLVideoElement;
  if (rawMedia instanceof HTMLImageElement) {
    mirroredMedia = mirrorImage(rawMedia);
  } else if (rawMedia instanceof HTMLVideoElement) {
    mirroredMedia = mirrorVideo(rawMedia);
  } else if (rawMedia instanceof HTMLCanvasElement) {
    mirroredMedia = mirrorCanvas(rawMedia);
  } else {
    throw new Error(
      "The media parameter passed into the mirror() function is not a valid HTML or p5 image or video."
    );
  }
}
