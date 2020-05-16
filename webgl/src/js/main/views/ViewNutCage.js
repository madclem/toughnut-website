import alfrid, { GL } from 'alfrid';

import Assets from '../../Assets';
import CANNON from 'cannon';
import { Entity3D } from 'helpers';
import { fitXY } from 'utils';
import fs from 'shaders/pbr.frag';
import gsap from 'gsap';
import { materials } from '../physic/materials';
import vs from 'shaders/pbr.vert';

const definesToString = function (defines) {
	let outStr = '';
	for (const def in defines) {
    	if(defines[def]) {
    		outStr += `#define ${def} ${defines[def]}\n`;	
    	}
        
	}
	return outStr;
};

export class ViewNutCage extends Entity3D {
	constructor(scene) {
		const defines = {
			USE_TEX_LOD: !!GL.getExtension('EXT_shader_texture_lod') ? 1 : 0,
			USE_IBL: 1,
			HAS_BASECOLORMAP: 0,
			HAS_NORMALMAP: 0,
			HAS_EMISSIVEMAP: 0,
			HAS_OCCLUSIONMAP: 0,
		};
		const defineStr = definesToString(defines);
		// console.log(defineStr);
		const _vs = `${defineStr}\n${vs}`;
		const _fs = `${defineStr}\n${fs}`;

		// console.log(_fs);
		super(_vs, _fs);

		this.scene = scene;
		this.targetRot = 0;
    
		this.tick = 0;

		/** ALPHA RELATED PROPS */
		this.animatingAlpha = false;
		this.targetAlpha = 0;
		this.alpha = 0;
    
		/** SIZE RELATED PROPS */
		this.size = 1; // size of the cube inside
		this.widthCube = 2 * this.size; // how deep are the walls
		const widthFace = 8 * this.size; // the faces sizes, have to be big because we will scale the cube etc.
    
		this.mesh = alfrid.Geom.cube(this.size, this.size, this.size);
    
		this.shader.bind();

		this.shader.uniform('uBaseColor', 'uniform3fv', [1, 1, 1]);
		this.shader.uniform('uRoughness', 'uniform1f', .2);
		this.shader.uniform('uMetallic', 'uniform1f', .5);
		this.shader.uniform('uSpecular', 'uniform1f', .5);

		this.shader.uniform('uExposure', 'uniform1f', .4);
		this.shader.uniform('uGamma', 'uniform1f', 1.);
		this.shader.uniform('uAlpha', 'uniform1f', this.alpha);

		const body = new CANNON.Body({ mass: 0, type: CANNON.Body.KINEMATIC, material: materials.items.cage });
		body.entity = this;
		this.body = body;

		const shapeLeft = new CANNON.Box(new CANNON.Vec3(this.widthCube, widthFace, widthFace));
		body.addShape(shapeLeft, new CANNON.Vec3(-this.size / 2 - this.widthCube, 0, 0));

		const shapeRight = new CANNON.Box(new CANNON.Vec3(this.widthCube, widthFace, widthFace));
		body.addShape(shapeRight, new CANNON.Vec3(this.size / 2 + this.widthCube, 0, 0));

		const shapeBottom = new CANNON.Box(new CANNON.Vec3(widthFace, this.widthCube, widthFace));
		body.addShape(shapeBottom, new CANNON.Vec3(0, -this.size / 2 - this.widthCube, 0));

		const shapeTop = new CANNON.Box(new CANNON.Vec3(widthFace, this.widthCube, widthFace));
		body.addShape(shapeTop, new CANNON.Vec3(0, this.size / 2 + this.widthCube, 0));
		
		const shapeBack = new CANNON.Box(new CANNON.Vec3(widthFace, widthFace, this.widthCube));
		body.addShape(shapeBack, new CANNON.Vec3(0, 0, -this.size / 2 - this.widthCube));

		const shapeFront = new CANNON.Box(new CANNON.Vec3(widthFace, widthFace, this.widthCube));
		body.addShape(shapeFront, new CANNON.Vec3(0, 0, this.size / 2 + this.widthCube));

		this.bodies = [body];
	}
  
	changeOffsets(scaleX = 1, scaleY = 1, scaleZ = 1) {
    
		for (let i = 0; i < this.body.shapeOffsets.length; i++) {
			const shapeOffset = this.body.shapeOffsets[i];
      
			if (shapeOffset.x !== 0) shapeOffset.x = scaleX * (shapeOffset.x < 0 ? -1 : 1) + this.widthCube * (shapeOffset.x < 0 ? -1 : 1);
			if (shapeOffset.y !== 0) shapeOffset.y = scaleY * (shapeOffset.y < 0 ? -1 : 1) + this.widthCube * (shapeOffset.y < 0 ? -1 : 1);
			if (shapeOffset.z !== 0) shapeOffset.z = scaleZ * (shapeOffset.z < 0 ? -1 : 1) + this.widthCube * (shapeOffset.z < 0 ? -1 : 1);
		}
    
		for (let i = 0; i < this.body.shapes.length; i++) {
			const shape = this.body.shapes[i];
			shape.updateConvexPolyhedronRepresentation();
			shape.updateBoundingSphereRadius();
		}
    
		this.scaleX = scaleX * 2;
		this.scaleY = scaleY * 2;
		this.scaleZ = scaleZ * 2;

		// reposition the z so it fits tightly
		
		this.body.position.z = this.getZForScale(this.scaleZ);
    
		// this.body.updateBoundingRadius();
		this.body.computeAABB();
		this.body.updateBoundingRadius();
		this.body.updateInertiaWorld();
		this.body.updateMassProperties();
		this.body.aabbNeedsUpdate = true;
	}

	getZForScale(scaleZ) {
		const newRadius = scaleZ / 2;
		const oldRadius = this.size / 2;

		return -(newRadius - oldRadius);
	}
  
	/**
   * fadeTo
   */
	fadeTo(val, duration = 0.5, ease = 'sine.out') {
		if (!duration) {
			this.alpha = val;
			this._dirty = true;
		}
		gsap.to(this, duration, {
			alpha: val,
			ease,
			onUpdate: () => this._dirty = true
		});
	}

	/**
   * fit
   * Will fit the cube to the screen (and update the physic walls)
   */
	fit(w, h, ratioHeight = 1) {
		console.log(w, h, this.scaleZ / 2 + this.z);
		const { scaleX, scaleY } = fitXY(w, h, this.scaleZ / 2 + this.z, this.scene.camera, this.scene.orbitalControl);
		this.changeOffsets(scaleX / 2, scaleY / 2, scaleY * ratioHeight);
	}
  
	setRot(rotX, rotY, rotZ) {
		this.body.quaternion.setFromEuler(rotX, rotY || 0, rotZ || 0);
		// this.rotationX = rotX;
	}

	updateRotation() {
		const { x, y, z, w } = this.body.quaternion;
		this.setRotationFromQuaternion([x, y, z, w]);
	}

	render(textureRad, textureIrr) {
		if (!this.active) return; // this.active comes from View3D
		
		this.shader.bind();
		this.tick++;

		const body = this.body;

		// const target = { x: 0, y: 0, z: 0};
		// body.quaternion.toEuler(target);
		
		// const rotSpeed = (this.targetRot % (Math.PI * 2)) - target.x;
		// console.log(rotSpeed);
		
		
		// body.angularVelocity.x = rotSpeed;
		// body.angularVelocity.z = 1 * Math.sin(this.tick / 20);
		// body.angularVelocity.y = 2 * Math.cos(this.tick / 30);
		// body.angularVelocity.x = 1;
    
		// body.velocity.x = Math.cos(this.tick / 40) * .5;
		// body.velocity.y = Math.sin(this.tick / 10) * 1;
		// body.velocity.z = Math.cos(this.tick / 10) * 1;

		this.shader.uniform('uCameraPos', 'vec3', GL.camera.position);
		
		this.shader.uniform('uMatrix', 'mat4', this._matrix);
		
		this.shader.uniform('uBRDFMap', 'uniform1i', 1);
		Assets.get('brdfLUT').bind(1);
		
		this.shader.uniform('uRadianceMap', 'uniform1i', 3);
		this.shader.uniform('uIrradianceMap', 'uniform1i', 2);
		
		textureRad.bind(3);
		textureIrr.bind(2);

		if (this._dirty) {
			this.shader.uniform('uAlpha', 'uniform1f', this.alpha);
		}

		GL.rotate(this._matrix);

		GL.draw(this.mesh);
	}
}
