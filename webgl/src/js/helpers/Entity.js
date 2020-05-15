// ViewCube.js

import alfrid, { GL, View } from 'alfrid';

class Entity extends View {
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

export { Entity };
