import { vec3 } from 'gl-matrix';

const intersectionPlane = (pt1, pt2, target, p1Plane, p2Plane, p3Plane) => {
	// plane equation
	const p1 = p1Plane || [0, 0, 0];
	const p2 = p2Plane || [1, 1, 0];
	const p3 = p3Plane || [0, -1, 0];
	const x0 = p1[0];
	const y0 = p1[1];
	const z0 = p1[2];
	/* find perpendicular vector */
	const v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
	const v2 = [p3[0] - p2[0], p3[1] - p2[1], p3[2] - p2[2]];
	const abc = [(v1[1] * v2[2] + v1[2] * v2[1]), - (v1[0] * v2[2] + v1[2] * v2[0]),  -(v1[0] * v2[1] + v1[1] * v2[0])];
	const t = (abc[0] * x0 + abc[1] * y0 + abc[2] * z0 - abc[0] * pt1[0] - abc[1] * pt1[1] - abc[2] * pt1[2]) / (abc[0] * (pt2[0] - pt1[0]) + abc[1] * (pt2[1] - pt1[1]) + abc[2] * (pt2[2] - pt1[2])); 
	// so when we replace the line above (1*))
	const newx = t * (pt2[0] - pt1[0]) + pt1[0];
	const newy = t * (pt2[1] - pt1[1]) + pt1[1];
	const newz = t * (pt2[2] - pt1[2]) + pt1[2];
	if (target) {
		target[0] = newx;
		target[1] = newy;
		target[2] = newz;
		return target;
	}
	return [newx, newy, newz];
};
export { intersectionPlane };