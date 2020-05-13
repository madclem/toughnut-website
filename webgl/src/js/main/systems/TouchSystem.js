import { GL, Ray } from 'alfrid';
import { getMouse, intersectionPlane, intersectionRayMesh } from 'utils';
import { vec2, vec3 } from 'gl-matrix';

import CANNON from 'cannon';

export class TouchSystem {
	constructor(scene, targetListener) {
		this.targetListener = targetListener;	
		this.scene = scene; 
		this.isMouseDown = false;
		this.ray = new Ray([0, 0, 0], [0, 0, -1]);
    this.target = null;
		this.mouse = vec2.create();
    this.pointOnPlane = vec3.create();
    
    this.camera = this.scene.camera;
    this.targets = [];
		// Joint body
		const shape = new CANNON.Sphere(0.1);
		this.jointBody = new CANNON.Body({ mass: 0 });
		this.jointBody.addShape(shape);
		this.jointBody.collisionFilterGroup = 0;
		this.jointBody.collisionFilterMask = 0;
		this.scene.physicSystem.world.add(this.jointBody);

		this._onDown = this.onDown.bind(this);
		this._onMove = this.onMove.bind(this);
		this._onUp = this.onUp.bind(this);
	}	
  
  setTargets(targets) {
    this.targets = targets;
  }

	connect() {
		this.targetListener.addEventListener('mousedown', this._onDown);
		this.targetListener.addEventListener('touchstart', this._onDown);
		this.targetListener.addEventListener('mousemove', this._onMove);
		this.targetListener.addEventListener('touchmove', this._onMove);
		this.targetListener.addEventListener('mouseup', this._onUp);
		this.targetListener.addEventListener('touchend', this._onUp);
	}

	disconnect() {
		this.targetListener.removeEventListener('mousedown', this._onDown);
		this.targetListener.removeEventListener('touchstart', this._onDown);
		this.targetListener.removeEventListener('mousemove', this._onMove);
		this.targetListener.removeEventListener('touchmove', this._onMove);
		this.targetListener.removeEventListener('mouseup', this._onUp);
		this.targetListener.removeEventListener('touchend', this._onUp);
	}

	generateRay(e) {
		const o = getMouse(e, this.mouse);
		const mx = (o.x / GL.width) * 2.0 - 1.0;
    const my = - (o.y / GL.height) * 2.0 + 1.0;
		this.camera.generateRay([mx, my, 0], this.ray);
	}

	onDown(e) {
    this.generateRay(e);
    
    for (let i = 0; i < this.targets.length; i++) {
      const target = this.targets[i];

      const hit = intersectionRayMesh(this.ray, target.mesh.vertices, target._matrix);

      if(hit) {
        this.addMouseConstraint(hit[0], hit[1], hit[2], target.bodies[0], target);

        return;
      }
    }
	}

	onMove(e) {
		if (this.mouseConstraint && this.target) {
			this.generateRay(e);

			const origin = this.ray.origin;
			const target = this.ray.at(this.scene.orbitalControl.radius.value);

			const z = this.target.z;
			const intersection = intersectionPlane(origin, target, this.pointOnPlane, [0, 0, z], [1, 1, z], [0, -1, z]);
      
			this.jointBody.position.set(intersection[0], intersection[1], intersection[2]);
			this.mouseConstraint.update();
		}
	}

	onUp() {
		this.scene.physicSystem.world.removeConstraint(this.mouseConstraint);
		this.mouseConstraint = false;
		this.target = null;
	}

	addMouseConstraint(x, y, z, body, target) {
    this.target = target;
		const constrainedBody = body;

		// view-source:https://schteppe.github.io/cannon.js/examples/threejs_mousepick.html
		const v1 = new CANNON.Vec3(x, y, z).vsub(constrainedBody.position);
		const antiRot = constrainedBody.quaternion.inverse();
		const pivot = antiRot.vmult(v1);
		this.jointBody.position.set(x, y, z);
		this.mouseConstraint = new CANNON.PointToPointConstraint(constrainedBody, pivot, this.jointBody, new CANNON.Vec3(0, 0, 0));
		this.scene.physicSystem.world.addConstraint(this.mouseConstraint);
	}

	start() {
	}

	stop() {

	}
}