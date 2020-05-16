import { VerletLink } from './VerletLink';

export class VerletDot {
	constructor(x, y, z) {
		this.vel = vec3.create();
		this.pos = vec3.fromValues(x, y, z);
		this.lastPos = vec3.fromValues(x, y, z);
		this.gravity = vec3.fromValues(0, -0.5 / 60, 0);

		this.pinned = false;
		this.mass = 1;
		this.radius = 0.05;
		this.friction = 0.97;
		this.groundFriction = 0.7 / 60;
	}

	update() {
		if (this.pinned) return;
		
		vec3.sub(this.vel, this.pos, this.lastPos);
		vec3.scale(this.vel, this.vel, this.friction);
    
    // if the point touches the ground set groundFriction
    const sqrtLen = vec3.squaredLength(this.vel);
		if (this.pos[1] <= -0.5 - this.radius && sqrtLen > 0.000001) {
			const m = vec3.length(this.vel);
			this.vel[0] /= m;
			this.vel[1] /= m;

			vec3.scale(this.vel, this.vel, m * this.groundFriction);
		}

		vec3.copy(this.lastPos, this.pos);
		vec3.add(this.pos, this.pos, this.vel);
		vec3.add(this.pos, this.pos, this.gravity);
	}

	pin(val) {
		this.pinned = val;
	}
  
	constrain() {
		// TODO: CHECK IF BOUNDARIES
		// if (this.boundaries)
		// if (this.pos.x > CANVAS_WIDTH - this.radius) {
		//   this.pos.x = CANVAS_WIDTH - this.radius;
		// }
		// if (this.pos.x < this.radius) {
		//   this.pos.x = this.radius;
		// }
		if (this.pos[1] < -0.5 - this.radius) {
		  this.pos[1] = -0.5 - this.radius;
		}
		// if (this.pos.y < this.radius) {
		//   this.pos.y = this.radius;
		// }
	}

	// resetLinks() {
	// 	this.links.length = 0;
	// }
	// solveConstraints() {

	// 	// return;
	// 	/* Link Constraints */
	// 	// Links make sure PointMasss connected to this one is at a set distance away
	// 	for (let i = 0; i < this.links.length; i++) {
	// 		const currentLink = this.links[i];
	// 		currentLink.solve();
	// 	}

	// 	/* Boundary Constraints */
	// 	// These if statements keep the PointMasss within the screen
	// 	// if (y < 1)
	// 	//   y = 2 * (1) - y;
	// 	// if (y > height-1)
	// 	//   y = 2 * (height - 1) - y;
	// 	//
	// 	// if (x > width-1)
	// 	//   x = 2 * (width - 1) - x;
	// 	// if (x < 1)
	// 	//   x = 2 * (1) - x;

	// 	/* Other Constraints */
	// 	// make sure the PointMass stays in its place if it's pinned
	// 	if (this.pinned) {
	// 		this.x = this.pinX;
	// 		this.y = this.pinY;
	// 		this.z = this.pinZ;
	// 	}
	// }


	// // attachTo can be used to create links between this PointMass and other PointMasss
	// attachTo(P, restingDist, stiff) {
	// 	this.attachTo(P, restingDist, stiff, 30, true);
	// }
	// attachTo(P, restingDist, stiff,  drawLink) {
	// 	this.attachTo(P, restingDist, stiff, 30, drawLink);
	// }
	// attachTo(P, restingDist, stiff,  tearSensitivity) {
	// 	this.attachTo(P, restingDist, stiff, tearSensitivity, true);
	// }
	// attachTo(P, restingDist, stiff,  tearSensitivity,  drawLink) {
	// 	const lnk = new VerletLink(this, P, restingDist, stiff, tearSensitivity, drawLink);
	// 	this.links.push(lnk);
	// }
	// removeLink(lnk) {
	// 	// this.links.splice(lnk);
	// }

	// unpin() {
	// 	if(this.forever) return;
	// 	this.pinned = false;
	// }

	// pinTo(pX, pY, pZ = 0, forever) {

	// 	if(this.forever) return;
	// 	this.pinned = true;
	// 	this.pinX = pX || this.x;
	// 	this.pinY = pY || this.y;
	// 	this.pinZ = pZ;

	// 	if(forever) this.forever = true;
	// }

	// getPoint() {
	// 	return this;
	// }
}
