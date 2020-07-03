// SceneApp.js

import alfrid, { GL, Scene } from "alfrid";

import Assets from "./Assets";
import Config from "./Config";
import ViewCube from "./ViewCube";
import ViewPlane from "./ViewPlane";
import { resize } from "./utils";

class SceneApp extends Scene {
  constructor() {
    super();
    GL.enableAlphaBlending();
    this.orbitalControl.rx.value = this.orbitalControl.ry.value = 0.3;
    this.orbitalControl.radius.value = 5;

    this.tick = 0;

    // this.camera.setPerspective(45 * Math.PI / 180, GL.aspectRatio, 0.1, 50);

    // this.camera.setPerspective(45 * Math.PI / 180, GL.aspectRatio, 0.1, 40);

    this.resize();
  }

  _initTextures() {
    console.log("init textures");
    const oSettings = { minFilter: GL.LINEAR, magFilter: GL.LINEAR };
    this.fboDepth = new alfrid.FrameBuffer(GL.width, GL.height, oSettings);
  }

  _initViews() {
    console.log("init views");

    this._bCopy = new alfrid.BatchCopy();
    this._bAxis = new alfrid.BatchAxis();
    this._bDots = new alfrid.BatchDotsPlane();
    this._bBall = new alfrid.BatchBall();

    this.vCube = new ViewCube();
    this.vPlane = new ViewPlane();

    // this._vModel = new ViewObjModel();
  }

  render() {
    GL.clear(0, 0, 0, 0);

    // this.tick++;
    this._bAxis.draw();
    this._bDots.draw();

    this.fboDepth.bind();
    GL.clear(0, 0, 0, 1);
    this.vCube.render();

    this.fboDepth.unbind();

    this.vCube.render();

    GL.gl.cullFace(GL.gl.FRONT);
    this.vPlane.render(this.fboDepth.texture, this.fboDepth.depthTexture);
    GL.gl.cullFace(GL.gl.BACK);
    this.vPlane.render(this.fboDepth.texture, this.fboDepth.depthTexture);

    // this._vModel.render(Assets.get('studio_radiance'), Assets.get('irr'), Assets.get('aomap'));

    // GL.disable(GL.DEPTH_TEST);
    // const s = 300;
    // GL.viewport(0, 0, s, s);
    // this._bCopy.draw(this.fboDepth.depthTexture);
    // GL.enable(GL.DEPTH_TEST);
  }

  resize(w, h) {
    resize(w, h);
    this.camera.setAspectRatio(GL.aspectRatio);
  }
}

export default SceneApp;
