// ViewCube.js

import alfrid, { GL, View3D } from 'alfrid';

import CANNON from 'cannon';
import fs from 'shaders/nut.frag';
import { getGeometryFaces } from 'utils';
import { materials } from '../physic/materials';
import vs from 'shaders/nut.vert';

export class ViewNut extends View3D {
  constructor() {
		super(vs, fs);

		const size = 0.2;
		this.mesh = alfrid.Geom.cube(size, size, size);

		if (this.mesh.faces.length === 0) this.mesh._faces = getGeometryFaces(this.mesh);
		this.faces = this.mesh.faces;
		
		const body = new CANNON.Body({
			mass: 200,
      type: CANNON.Body.DYNAMIC,
      material: materials.items.nut
			// angularDamping: 0,
			// collisionFilterGroup: GROUPS.gameObjects,
			// collisionFilterMask: GROUPS.player,
		});

		body.entity = this;

		const box = new CANNON.Box(new CANNON.Vec3(size / 2, size / 2, size / 2));
		body.addShape(box);

		this.bodies = [body];
	}

	render() {
		this.shader.bind();

		GL.rotate(this._matrix);
		
		GL.draw(this.mesh);
	}
}
