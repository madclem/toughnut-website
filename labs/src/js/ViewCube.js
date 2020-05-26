import alfrid, { GL } from 'alfrid';

import fs from '../shaders/cube.frag';
import vs from '../shaders/cube.vert';

export default class ViewCube extends alfrid.View3D {
  constructor () {

    super(vs, fs);

    const size = 1;
		this.mesh = alfrid.Geom.cube(size, size, size );
  }

  render () {
    this.shader.bind();
    GL.draw(this.mesh);
  }
}