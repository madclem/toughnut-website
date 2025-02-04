import { clamp } from '.';

const setFromRotationMatrix = function (m, order, update) {


	// assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

	const te = m;
  const m11 = te[0]; 
  const m12 = te[4]; 
	const m13 = te[8];
  const m21 = te[1]; 
  const m22 = te[5]; 
	const m23 = te[9];
  const m31 = te[2]; 
  const m32 = te[6]; 
	const m33 = te[10];

	let _x = 0;
	let _y = 0;
	let _z = 0;


	if (order === 'XYZ') {
    // const sy = Math.sqrt(te[0] * te[0] +  te[1] * te[1]);
    // const singular = sy < 1e-6;

    // if (!singular) {
    //   _x = Math.atan2(te[6], te[10]);
    //   _y = Math.atan2(-te[2], sy);
    //   _z = Math.atan2(te[1], te[0]);
    // } else {
    //   _x = Math.atan2(-te[9], te[5]);
    //   _y = Math.atan2(-te[2], sy);
    //   _z = 0;
    // }
		_y = Math.asin(clamp(- 1, 1,  m13));

		if (Math.abs(m13) < 0.9999999) {

			_x = Math.atan2(- m23, m33);
			_z = Math.atan2(- m12, m11);

		} else {

			_x = Math.atan2(m32, m22);
			_z = 0;

		}

	} else if (order === 'YXZ') {

		_x = Math.asin(- clamp(- 1, 1,  m23));

		if (Math.abs(m23) < 0.9999999) {

			_y = Math.atan2(m13, m33);
			_z = Math.atan2(m21, m22);

		} else {

			_y = Math.atan2(- m31, m11);
			_z = 0;

		}

	} else if (order === 'ZXY') {

		_x = Math.asin(clamp(- 1, 1,  m32));

		if (Math.abs(m32) < 0.9999999) {

			_y = Math.atan2(- m31, m33);
			_z = Math.atan2(- m12, m22);

		} else {

			_y = 0;
			_z = Math.atan2(m21, m11);

		}

	} else if (order === 'ZYX') {

		_y = Math.asin(- clamp(- 1, 1,  m31));

		if (Math.abs(m31) < 0.9999999) {

			_x = Math.atan2(m32, m33);
			_z = Math.atan2(m21, m11);

		} else {

			_x = 0;
			_z = Math.atan2(- m12, m22);

		}

	} else if (order === 'YZX') {

		_z = Math.asin(clamp(- 1, 1,  m21));

		if (Math.abs(m21) < 0.9999999) {

			_x = Math.atan2(- m23, m22);
			_y = Math.atan2(- m31, m11);

		} else {

			_x = 0;
			_y = Math.atan2(m13, m33);

		}

	} else if (order === 'XZY') {

		_z = Math.asin(- clamp(- 1, 1,  m12));

		if (Math.abs(m12) < 0.9999999) {

			_x = Math.atan2(m32, m22);
			_y = Math.atan2(m13, m11);

		} else {

			_x = Math.atan2(- m23, m33);
			_y = 0;

		}

	} else {

		console.warn(`order not supported${order}`);

	}

	return [_x, _y, _z];

};

export { setFromRotationMatrix };