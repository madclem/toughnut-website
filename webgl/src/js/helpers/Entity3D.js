// ViewCube.js

import alfrid, { GL, View3D } from 'alfrid';

class Entity3D extends View3D {
  constructor(vs, fs) {
    super(vs, fs);
    
    this.active = false;
  }
  
  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

	render() {
		if (!this.active) return;
	}
}

export { Entity3D };
