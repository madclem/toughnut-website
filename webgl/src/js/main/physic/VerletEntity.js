import { VerletPoint } from './VerletPoint';
import { VerletStick } from './VerletStick';

export class VerletEntity {
	constructor(iterations = 10) {
		this.points = [];
		this.sticks = [];
		this.constraintAccuracy = iterations;
		this.fixedDeltaTime = 4;
		this.leftOverDeltaTime = 0;
	}

	addPoint(x, y, z) {
		let dot;
		if (x instanceof VerletPoint) {
			dot = x;
		} else {
			dot = new VerletPoint(x, y, z);
		}
		
		this.points.push(dot);

		return dot;
	}

	addStick(indexP1, indexP2, length, stiffness) {
    let stick;
		if (indexP1 instanceof VerletStick) {
			stick = indexP1;
		} else {
			stick = new VerletStick(this.points[indexP1], this.points[indexP2], length, stiffness);
    }

    this.sticks.push(stick);

    return stick;
    
	}

	updatePoints() {
		for (let i = 0; i < this.points.length; i++) {
			this.points[i].update();
		}
	}

	updateSticks() {
		for (let i = 0; i < this.sticks.length; i++) {
			this.sticks[i].update();
		}
	}
	
	updateContrains() {
		for (let i = 0; i < this.points.length; i++) {
			this.points[i].constrain();
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
