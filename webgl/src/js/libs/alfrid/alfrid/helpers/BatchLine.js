// BatchLine.js

import Batch from '../Batch';
import GL from '../GLTool';
import GLShader from '../GLShader';
import Mesh from '../Mesh';
import fs from '../shaders/simpleColor.frag';
import vs from '../shaders/basic.vert';

class BatchAxis extends Batch {

	constructor() {
		const positions = [];
		const indices = [0, 1];
		const coords = [[0, 0], [1, 1]];
		positions.push([0,  0,  0]);
		positions.push([0,  0,  0]);

		const mesh = new Mesh(GL.LINES);
		mesh.bufferVertex(positions);
		mesh.bufferTexCoord(coords);
		mesh.bufferIndex(indices);

		const shader = new GLShader(vs, fs);

		super(mesh, shader);
	}


	draw(mPositionA, mPositionB, color = [1, 1, 1], opacity = 1.0) {
		this._mesh.bufferVertex([mPositionA, mPositionB]);

		this._shader.bind();
		this._shader.uniform('color', 'vec3', color);
		this._shader.uniform('opacity', 'float', opacity);
		super.draw();
	}


}


export default BatchAxis;