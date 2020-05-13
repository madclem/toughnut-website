import { GL } from 'alfrid';

const getScales = (camera, orbitalControl, fillWidth = 1, fillHeight = 1, objectY = 0) => {
  const fov = camera._fov;
  const distCameraToCube = orbitalControl.radius.targetValue - objectY;

  const height = 2 * Math.tan(fov / 2) * distCameraToCube;
  const width = height * GL.aspectRatio;

  const totalHeight = fillHeight;
  const finalScaleH = totalHeight / (1 / height);

  const totalWidth = fillWidth;
	const finalScaleW = totalWidth / (1 / width);

	return  { scaleX: finalScaleW, scaleY: finalScaleH };

  // return orbitalControl.radius.targetValue / (finalScaleH / elementHeight);
};

const fitXY = (w, h, closestZ, camera, orbitalControl) => {
  const { scaleX, scaleY } = getScales(camera, orbitalControl, w / window.innerWidth, h / window.innerHeight, closestZ);

  return { scaleX, scaleY }
}

const getCameraDistanceFitY = (h, elementHeight, closestZ, camera, orbitalControl) => {
  const { scaleY } = getScales(camera, orbitalControl, 1, h / window.innerHeight, closestZ);

  return orbitalControl.radius.targetValue / (scaleY / elementHeight);
}

const getCameraDistanceFitX = (w, elementWidth, closestZ, camera, orbitalControl) => {
  const { scaleX } = getScales(camera, orbitalControl, w / window.innerWidth, 1, closestZ);

  return orbitalControl.radius.targetValue / (scaleX / elementWidth);
}

export { getScales, fitXY, getCameraDistanceFitY, getCameraDistanceFitX };

