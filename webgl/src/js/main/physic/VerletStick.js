
export class VerletStick {
	constructor(p1, p2, length = 0.01, stiffness = 1.5) {
		this.startPoint = p1;
		this.endPoint = p2;
		this.stiffness = stiffness;
    
		// if the length is not given then calculate the distance based on position
		if (!length) {
      console.log('here');
      
			this.length = vec3.distance(this.startPoint.pos, this.endPoint.pos);
		} else {
			this.length = length;
		}
  }
    
	update() {
		// calculate the distance between two dots
		const dx = this.startPoint.pos[0] - this.endPoint.pos[0];
		const dy = this.startPoint.pos[1] - this.endPoint.pos[1];
		const dz = this.startPoint.pos[2] - this.endPoint.pos[2];
		// pythagoras theorem
		const dist = Math.max(0.001, Math.sqrt(dx * dx + dy * dy + dz * dz));
    // calculate the resting distance betwen the dots
    const diff = (this.length - dist) / dist;
    
    if (isNaN(diff)) return;
  
		// getting the offset of the points
		const offsetx = dx * diff;
		const offsety = dy * diff;
		const offsetz = dz * diff;
  
		const im1 = 1 / this.startPoint.mass;
		const im2 = 1 / this.endPoint.mass;
		const scalarP1 = (im1 / (im1 + im2)) * this.stiffness;
		const scalarP2 = this.stiffness - scalarP1;

		// Push/pull based on mass
		// heavier objects will be pushed/pulled less than attached light objects
		this.startPoint.pos[0] += dx * scalarP1 * diff;
		this.startPoint.pos[1] += dy * scalarP1 * diff;
		this.startPoint.pos[2] += dz * scalarP1 * diff;

		this.endPoint.pos[0] -= dx * scalarP2 * diff;
		this.endPoint.pos[1] -= dy * scalarP2 * diff;
		this.endPoint.pos[2] -= dz * scalarP2 * diff;
  
	}
}
