import { mat4 } from 'gl-matrix';

const matrix = mat4.create();

const compose = (
	quaternion,
	position = { x: 0, y: 0, z: 0 },
	scale = { x: 1, y: 1, z: 1 }
) => {
	const te = matrix;

	let x = quaternion.x,
		y = quaternion.y,
		z = quaternion.z,
		w = quaternion.w;
	let x2 = x + x,
		y2 = y + y,
		z2 = z + z;
	let xx = x * x2,
		xy = x * y2,
		xz = x * z2;
	let yy = y * y2,
		yz = y * z2,
		zz = z * z2;
	let wx = w * x2,
		wy = w * y2,
		wz = w * z2;

	let sx = scale.x,
		sy = scale.y,
		sz = scale.z;

	te[0] = (1 - (yy + zz)) * sx;
	te[1] = (xy + wz) * sx;
	te[2] = (xz - wy) * sx;
	te[3] = 0;

	te[4] = (xy - wz) * sy;
	te[5] = (1 - (xx + zz)) * sy;
	te[6] = (yz + wx) * sy;
	te[7] = 0;

	te[8] = (xz + wy) * sz;
	te[9] = (yz - wx) * sz;
	te[10] = (1 - (xx + yy)) * sz;
	te[11] = 0;

	te[12] = position.x;
	te[13] = position.y;
	te[14] = position.z;
	te[15] = 1;

	return matrix;
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const setFromRotationMatrix = vectorTarget => {
	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

	const te = matrix;
	let m11 = te[0],
		m12 = te[4],
		m13 = te[8];
	let m21 = te[1],
		m22 = te[5],
		m23 = te[9];
	let m31 = te[2],
		m32 = te[6],
		m33 = te[10];

	vectorTarget[1] = Math.asin(clamp(m13, -1, 1));

	if (Math.abs(m13) < 0.9999999) {
		vectorTarget[0] = Math.atan2(-m23, m33);
		vectorTarget[2] = Math.atan2(-m12, m11);
	} else {
		vectorTarget[0] = Math.atan2(m32, m22);
		vectorTarget[2] = 0;
	}
};

export const toEuler = (quaternion, vectorTarget) => {
	compose(quaternion);
	setFromRotationMatrix(vectorTarget);

	return vectorTarget;
};
