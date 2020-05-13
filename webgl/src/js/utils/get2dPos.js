import { GL } from 'alfrid';
import { vec3 } from 'gl-matrix';

const tempVec3 = vec3.create();
// return this.getXY(pos, this.scene.camera._matrix, this.scene.camera.projection, GL.width, GL.height);

const get2dPos = (pos) => {
  vec3.transformMat4(tempVec3, pos, GL.camera._matrix);
  vec3.transformMat4(tempVec3, tempVec3, GL.camera.projection);

  tempVec3[0] /= tempVec3[2];
  tempVec3[1] /= tempVec3[2];
  tempVec3[0] = (tempVec3[0] + 1) * GL.width / 2;
  tempVec3[1] = GL.height - (tempVec3[1] + 1) * GL.height / 2;

  return tempVec3;
}

export { get2dPos };