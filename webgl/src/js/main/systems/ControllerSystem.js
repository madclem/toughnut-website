import { onKeyUp, onKeyDown } from '../signals';
import { System } from 'helpers'; // for now does nothing...

export class ControllerSystem extends System {
	constructor(scene) {
    super();

    this.onKeyDown = this._onKeyDown.bind(this);

    this.start();
  }
  
  start() {
    super.start();
		window.addEventListener('keydown', this.onKeyDown, true);
	}

	stop() {
    super.stop();
		window.removeEventListener('keydown', this.onKeyDown, true);
	}

	_onKeyDown(e) {
    if (e.keyCode === 38) { // arrow up
      onKeyUp.dispatch();
		} else if (e.keyCode === 40) { // arrow down
			onKeyDown.dispatch();
		}
	}
}