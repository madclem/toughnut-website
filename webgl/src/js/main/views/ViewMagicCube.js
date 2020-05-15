// ViewCube.js

import alfrid, { GL } from 'alfrid';

import { Entity3D } from 'helpers';
import { ViewTextureSwap } from './ViewTextureSwap';
import fs from 'shaders/magic.frag';
import { mat4 } from 'gl-matrix';
import vs from 'shaders/magic.vert';

export class ViewMagicCube extends Entity3D {
	constructor(scene) {
		super(vs, fs);
		this.scene = scene;

		this.extraAngle = 0;
		this.tempMat4 = mat4.create();
    
		this.isMatching = false;
		this.matrixToMatch = null;
		this.tick = 0;
		this.mtx = mat4.create();
		this.angle = 0;
		this.lastAngle = 0;
		this.lastFace = 9999999;
		this.angleTarget = 0;
    
		const cube = alfrid.Geom.cube(1.004, 1.004, 1.004);
    
		const positions = cube.vertices.slice();
		const indices = cube.indices.slice();

		const coords = [];
		coords.push([1, 0], [0, 0], [0, 1 / 2], [1, 1 / 2]); // BACK
		coords.push([0, 0], [1, 0], [1, 1], [0, 1]); // RIGHT
		coords.push([0, 1 / 2], [1, 1 / 2], [1, 0], [0, 0]); // FRONT
		coords.push([0, 0], [1, 0], [1, 1], [0, 1]); // LEFT
		coords.push([0, 1], [1, 1], [1, 1 / 2], [0, 1 / 2]); // TOP
		coords.push([0, 1], [1, 1], [1, 1 / 2], [0, 1 / 2]); // BOTTOM

		const sides = [];
		sides.push([0], [0], [0], [0]); // BACK
		sides.push([1], [1], [1], [1]); // RIGHT
		sides.push([0], [0], [0], [0]); // FRONT
		sides.push([1], [1], [1], [1]); // LEFT
		sides.push([0], [0], [0], [0]); // TOP
		sides.push([0], [0], [0], [0]); // BOTTOM

		const extra = [];
		for (let x = 0; x < 4 * 6; x++) {
			extra.push([
				-4 + Math.random() * 4 * 2, 
				-4 + Math.random() * 4 * 2, 
				-4 + Math.random() * 4 * 2
			]);
		}

		this.mesh = new alfrid.Mesh();
		this.mesh.bufferVertex(positions);
		this.mesh.bufferData(sides, 'aSide', 1);
		this.mesh.bufferData(extra, 'aExtra', 3);
		this.mesh.bufferTexCoord(coords);
		this.mesh.bufferIndex(indices);
    
		// this._bCopy = new alfrid.BatchCopy();

		this.percentTransition = -1;
		this.scaleNoise = 1.19;
		gui.add(this, 'scaleNoise', 0, 4).step(0.01);    
	}

	rotate(val) {
		this.angleTarget += val * Math.PI / 2;
		// this.angleTarget %= Math.PI * 2
	}
	
	setAngle(val) {
		this.extraAngle = 0;
		this.angleTarget = this.angle = this.rotationX = val;
	}
  
	toggleMatrixMatching(val, matrix) {
		this.isMatching = val;
		this.matrixToMatch = matrix || null;
	}

	reset() {
		this.setAngle(0);
		this.lastFace = 9999;
	}

	start() {
		super.start();
		this.reset();
	}

	getRX(matrix, order="XYZ") {
		const rot = this.getRotationEuler(matrix, order);

		return rot[0];
	}

	saveMatrix(mat) {
		this.setMatrix(mat || this.tempMat4);
		this.setAngle(this.lastAngle);
		this._update();
	}

	render(texture, vTextureSwap) {
		if (!this.active) return;

		this.tick++;
		this.shader.bind();
		if (this.isMatching && this.matrixToMatch) {
			this._needUpdate = true;
			this._update();
			mat4.multiply(this.tempMat4, this.matrixToMatch, this._matrix);			
			GL.rotate(this.tempMat4);
		} else {
			const speed = (this.angleTarget - this.angle) * 0.05;
			this.angle += speed;
			this.rotationX = this.angle;

			GL.rotate(this._matrix);
		}
		

		// UPDATE TEXTURE SHADER
		this.shader.uniform('texture', 'uniform1i', 0);
		texture.bind(0);
		this.shader.uniform('uOffset', 'float', this.lastFace < 0 ? Math.abs(this.lastFace % 2) : 0);
		this.shader.uniform('uTime', 'float', this.tick);
		this.shader.uniform('uPercentTransition', 'float', this.percentTransition);
		this.shader.uniform('uScaleNoise', 'float', this.scaleNoise);
		GL.draw(this.mesh);

		const angle = this.rotationX + this.extraAngle;// + angleMatMatch / (Math.PI * 2);
		const currentFace = Math.round(angle / (Math.PI / 2));

		if (currentFace !== this.lastFace) {
			vTextureSwap.swap(currentFace);
		}
		if (angle > currentFace * Math.PI / 2) {
			vTextureSwap.showTop();
		} else {
			vTextureSwap.showBottom();
		}
		this.lastFace = currentFace;

		this.lastAngle = angle;
	}
}
