import alfrid, { GL } from "alfrid";

import fs from "../shaders/cube.frag";
import vs from "../shaders/cube.vert";

export default class ViewCube extends alfrid.View3D {
  constructor() {
    super(vs, fs);

    this.tick = 0;
    const size = 1;
    this.mesh = alfrid.Geom.cube(size, size, size);
  }

  render() {
    this.tick++;
    this.z = Math.cos(this.tick / 40);
    this.y = Math.sin(this.tick / 50);
    this.x = Math.sin(this.tick / 30);
    this.rotationX += 0.01;
    this.rotationY -= 0.01;
    this.shader.bind();
    GL.rotate(this._matrix);
    GL.draw(this.mesh);
  }
}
