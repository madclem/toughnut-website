import { BatchBall, GL, Scheduler } from 'alfrid';

import CANNON from 'cannon';
import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';
import { VerletRope } from '../physic/VerletRope';
import gsap from 'gsap';
import { intersectionPlane } from 'utils';

const ptOnPlane = vec3.create();
export class StateHome extends StateDefault {
	constructor() {
		super();
		this.rope = null;
		this.target = null;

		this.targetPos = vec3.create();

		this.views = [];
		const shape = new CANNON.Sphere(0.1);
		this.jointBody = new CANNON.Body({ mass: 0 });
		this.jointBody.addShape(shape);
		this.jointBody.collisionFilterGroup = 0;
		this.jointBody.collisionFilterMask = 0;
		
	}
	
	addRope() {
		this.rope = new VerletRope({ x: 0, y: 0.5, z: 0, nbPoints: 5, restingDistancesVerlet: 0.1, stiffness: 0.85 });

		for (let i = 0; i < this.rope.points.length; i++) {
			const pt = this.rope.points[i];

			this.views.push({ mesh: new BatchBall(), pt })
			
		}
	}

	begin({ snap, from }) {
		if (!this.rope) {
			this.addRope();
		}

		const nut = this.scene._vNut;
		const cage = this.scene._vNutCage;
		const magicCube = this.scene._vMagicCube;
		
		
		cage.fadeTo(0, 0);
		nut.start();
		cage.start();
		
		this.scene.orbitalControl.rx.value = 0; // (1) leave that here, even though it may be overidden by OrbitalControl tween
		this.scene.orbitalControl.ry.value = 0; // (2) important to calculate the rectangle boundaries
		this.scene.orbitalControl.radius.value = 3.75;

		this.scene._vNutCage.fit(window.innerWidth, window.innerHeight, 1 / 6);
		this.scene.touchSystem.setTargets([this.scene._vNut]);
		this.scene.touchSystem.connect();

		this.scene.physicSystem.world.add(this.jointBody);

		this.scene.touchSystem.listeners.onDown = this.onDown.bind(this);
		this.scene.touchSystem.listeners.onMove = this.onMove.bind(this);
		this.scene.touchSystem.listeners.onUp = this.onUp.bind(this);
		
		this.rope.updateBounds(-cage.scaleX / 2, cage.scaleX / 2, -cage.scaleY / 2, 100, -cage.scaleZ / 2, cage.scaleZ / 2);
	}

	onDown(position, body, target) {
		this.tick = 0;
		this.addMouseConstraint(position[0], position[1], position[2], body, target);
	}

	onMove(e) {
		if (this.mouseConstraint && this.target) {
			this.tick++;
			const ray = this.scene.touchSystem.ray;
			const origin = ray.origin;
			const target = ray.at(this.scene.orbitalControl.radius.value);			
			
			const z = this.target ? this.target.z : 0;
			intersectionPlane(origin, target, ptOnPlane, [0, 0, z], [1, 1, z], [0, -1, z]);
		}
	}

	onUp() {
		this.scene.physicSystem.world.removeConstraint(this.mouseConstraint);
		this.mouseConstraint = false;
		this.target = null;
	}

	addMouseConstraint(x, y, z, body, target) {
		if (isNaN(x) || isNaN(y) || isNaN(z) || this.mouseConstraint) return;

    this.target = target;
		const constrainedBody = body;

		// view-source:https://schteppe.github.io/cannon.js/examples/threejs_mousepick.html
		const v1 = new CANNON.Vec3(x, y, z).vsub(constrainedBody.position);
		const antiRot = constrainedBody.quaternion.inverse();
		const pivot = antiRot.vmult(v1);
		// this.jointBody.position.set(x, y, z);
		
		this.mouseConstraint = new CANNON.PointToPointConstraint(constrainedBody, new CANNON.Vec3(0, -0.1 / 2, 0), this.jointBody, new CANNON.Vec3(0, 0, 0));
		this.scene.physicSystem.world.addConstraint(this.mouseConstraint);

		ptOnPlane[0] = x;
		ptOnPlane[1] = y;
		ptOnPlane[2] = z;
		
		this.targetPos[0] = x;
		this.targetPos[1] = y;
		this.targetPos[2] = z;

		let ind = 0;
		for (let i = this.rope.points.length - 1; i > -1; i--) {
			const pt = this.rope.points[i]
			pt.pos[0] = x;
			pt.pos[1] = y;
			pt.pos[2] = z + ind * .1;
			
			ind++;
		}

		
		this.jointBody.position.set(x, y, z);
		this.mouseConstraint.update();
		this.rope.update();
	}

	
	end({ to }) {
		this.scene.touchSystem.disconnect();
		this.scene.physicSystem.world.remove(this.jointBody);
		this.scene.physicSystem.world.removeConstraint(this.mouseConstraint);
		this.scene.touchSystem.removeListeners();
		this.mouseConstraint = false;
		this.target = null;
	}

	update() {
		if (this.mouseConstraint && this.target) {

			if (isNaN(this.targetPos[1])) {
				console.log('is nan')
			}
			
			
			const lastPoint = this.rope.points[this.rope.points.length - 1];
			this.jointBody.position.set(lastPoint.pos[0], lastPoint.pos[1], lastPoint.pos[2]);
			this.mouseConstraint.update();

			const firstPoint = this.rope.points[0];
			
			this.targetPos[0] = ptOnPlane[0];
			this.targetPos[1] = ptOnPlane[1];
			this.targetPos[2] = ptOnPlane[2];
			firstPoint.pos = this.targetPos;
	
			this.rope.update(Scheduler.deltaTime);
			for (let i = 0; i < this.views.length; i++) {
				const mesh = this.views[i].mesh;
				const pt = this.views[i].pt;
	
				mesh.draw(pt.pos, [0.025, 0.025, 0.025], [1, 0, 0]);
				
			}
		}

	}
}
