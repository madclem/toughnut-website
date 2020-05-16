import { VerletDot } from '../physic/VerletDot';
import { VerletStick } from '../physic/VerletStick';

export class VerletPhysicsSystem {
	constructor() {
		this.dots = [];
		this.sticks = [];
		this.constraintAccuracy = 10;
		this.fixedDeltaTime = 4;
		this.leftOverDeltaTime = 0;
	}

	addDot(x, y, z, pinned) {
		const dot = new VerletDot(x, y, z, pinned);
		this.dots.push(dot);

		return dot;
	}

	addStick(indexP1, indexP2, length) {
		this.sticks.push(new VerletStick(this.dots[indexP1], this.dots[indexP2], length));
	}

	updatePoints() {
		for (let i = 0; i < this.dots.length; i++) {
			this.dots[i].update();
		}
	}

	updateSticks() {
		for (let i = 0; i < this.sticks.length; i++) {
			this.sticks[i].update();
		}
	}
	
	updateContrains() {
		for (let i = 0; i < this.dots.length; i++) {
			this.dots[i].constrain();
		}
	}

	update(deltaTime) {
		// let timeStepAmt = (deltaTime + this.leftOverDeltaTime) / this.fixedDeltaTime;
		// timeStepAmt = Math.min(timeStepAmt, 5);
		
		// this.leftOverDeltaTime = deltaTime - (timeStepAmt * this.fixedDeltaTime);
		
		// for (let iteration = 1; iteration <= timeStepAmt; iteration++) {
			this.updatePoints();
			for (let j = 0; j < this.constraintAccuracy; j++) {
				this.updateSticks();
				this.updateContrains();
			}
		// }

	}
}


//
// void addCircle (Circle c) {
//   circles.add(c);
// }
// void removeCircle (Circle c) {
//   circles.remove(c);
// }






// export class VerletPhysicsSystem {
// 	constructor() {
// 		this.circles = [];
// 		this.previousTime = 0;
// 		this.currentTime = 0;
// 		this.gravity = 0.1;

// 		this.fixedDeltaTime = 4;
// 		this.fixedDeltaTimeSeconds = this.fixedDeltaTime / 1000.0;
// 		this.leftOverDeltaTime = 0;
// 		this.constraintAccuracy = 10;
// 	}

// 	update(pointmasses) {
// 		this.currentTime = Date.now();
// 		const deltaTimeMS = this.currentTime - this.previousTime;

// 		this.previousTime = this.currentTime; // reset previous time

// 		// break up the elapsed time into manageable chunks
// 		let timeStepAmt = (deltaTimeMS + this.leftOverDeltaTime) / this.fixedDeltaTime;

// 		// limit the timeStepAmt to prevent potential freezing
// 		timeStepAmt = Math.min(timeStepAmt, 5);

// 		// store however much time is leftover for the next frame
// 		this.leftOverDeltaTime = deltaTimeMS - (timeStepAmt * this.fixedDeltaTime);

// 		// How much to push PointMasses when the user is interacting

// 		// update physics
// 		for (let iteration = 1; iteration <= timeStepAmt; iteration++) {
// 			// solve the constraints multiple times
// 			// the more it's solved, the more accurate.
// 			for (let x = 0; x < this.constraintAccuracy; x++) {
// 				// update each PointMass's position
// 				for (let i = 0; i < pointmasses.length; i++) {
// 					const pointmass = pointmasses[i];
// 					// pointmass.updateInteractions();
// 					pointmass.updatePhysics(this.fixedDeltaTimeSeconds);
// 					pointmass.y -= 0.01;
// 				}
				
// 				for (let i = 0; i < pointmasses.length; i++) {
// 					const pointmass = pointmasses[i];
// 					pointmass.solveConstraints();
// 				}
// 			}

// 		}
// 	}
// }


// //
// // void addCircle (Circle c) {
// //   circles.add(c);
// // }
// // void removeCircle (Circle c) {
// //   circles.remove(c);
// // }
