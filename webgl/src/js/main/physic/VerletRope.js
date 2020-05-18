import { VerletEntity } from './VerletEntity';
import { VerletPoint } from './VerletPoint';
import { VerletStick } from './VerletStick';

export class VerletRope extends VerletEntity {
	constructor({ x = 0, y = 0, z = 0, nbPoints = 10, restingDistancesVerlet = 0.01, stiffness = 1, iterations = 5 }) {
		super(iterations);

		this.points = [];
		this.sticks = [];

		for (let i = 0; i < nbPoints; i++) {
      const pt = this.addPoint(0, y - restingDistancesVerlet * i, 0);
      if (i === 0) {
        pt.mass = 20;
      }
      else if (i === nbPoints - 1) {
        pt.mass = 20;
      }
      else {
        pt.mass = 1;
      }
		}

		for (let i = 0; i < nbPoints - 1; i++) {
      const stick = this.addStick(i, (i + 1) % nbPoints, restingDistancesVerlet, stiffness);
      stick.stiffness = 1.2 - 0.6 / (nbPoints - 1) * i;
      stick.length = 0.05 + 0.1 / (nbPoints - 1) * i;
		}
  }
  
  updateBounds(minX, maxX, minY, maxY, minZ, maxZ) {
    for (let i = 0; i < this.points.length; i++) {
      const pt = this.points[i];
      pt.updateBounds(minX, maxX, minY, maxY, minZ, maxZ);
      
    }
  }
}