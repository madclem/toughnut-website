import alfrid, { GL } from "alfrid";
import fs from "../shaders/plane.frag";
import vs from "../shaders/plane.vert";

export default class ViewPlane extends alfrid.View3D {
  constructor() {
    super(vs, fs);

    const size = 2;
    // this.mesh = alfrid.Geom.cube(size, size, size);
    this.mesh = alfrid.Geom.sphere(1.5, 30);
  }

  render(texture, textureDepth) {
    this.shader.bind();
    this.shader.uniform("texture", "uniform1i", 0);
    texture.bind(0);
    this.shader.uniform("textureDepth", "uniform1i", 1);
    textureDepth.bind(1);

    GL.rotate(this._matrix);
    GL.draw(this.mesh);
  }
}
