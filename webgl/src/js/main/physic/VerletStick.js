
export class VerletStick {
	constructor(p1, p2, length) {
		this.startPoint = p1;
		this.endPoint = p2;
		this.stiffness = 1;
    
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
		const dx = this.endPoint.pos[0] - this.startPoint.pos[0];
		const dy = this.endPoint.pos[1] - this.startPoint.pos[1];
		const dz = this.endPoint.pos[2] - this.startPoint.pos[2];
		// pythagoras theorem
		const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
		// calculate the resting distance betwen the dots
    const diff = (this.length - dist) / dist * this.stiffness;
    
    if (isNaN(diff)) return;
  
		// getting the offset of the points
		const offsetx = dx * diff;
		const offsety = dy * diff;
		const offsetz = dz * diff;
  
		// calculate mass
		let m1 = this.startPoint.mass + this.endPoint.mass;
		const m2 = this.startPoint.mass / m1;
		m1 = this.endPoint.mass / m1;
  
		// and finally apply the offset with calculated mass
		if (!this.startPoint.pinned) {
			this.startPoint.pos[0] -= offsetx * m1;
			this.startPoint.pos[1] -= offsety * m1;
			this.startPoint.pos[2] -= offsetz * m1;
		}
		if (!this.endPoint.pinned) {
			this.endPoint.pos[0] += offsetx * m2;
			this.endPoint.pos[1] += offsety * m2;
			this.endPoint.pos[2] += offsetz * m2;
    }
    
    if (isNaN(this.endPoint.pos[0])) {
      console.log('problem')
    }
  
	}
}
