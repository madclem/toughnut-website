// ViewDepth.js

import alfrid, { GL, View } from 'alfrid';

import Config from '../Config';
import fs from 'shaders/depth-viz.frag';

class ViewDepth extends View {
	
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, fs);
	}


	_init() {
		this.mesh = alfrid.Geom.bigTriangle();
	}


	render(texture) {
		this.shader.bind();
		this.shader.uniform('texture', 'uniform1i', 0);
		texture.bind(0);
		GL.draw(this.mesh);
	}

	destroy(){
		super.destroy();

		this.mesh.destroy();
	}


}

export default ViewDepth;