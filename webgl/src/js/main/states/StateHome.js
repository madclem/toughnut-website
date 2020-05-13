import { GL, Scheduler } from 'alfrid';

import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';

export class StateHome extends StateDefault {

	begin(data = {}) {
		this.scene.orbitalControl.rx.value = 0;
		this.scene.orbitalControl.ry.value = 0;
		this.scene.orbitalControl.radius.value = 3.75;

		this.scene._vNutCage.fit(window.innerWidth, window.innerHeight, 1 / 6);
		this.scene._vNutCage.fadeTo(0, data.snap);

		this.scene.touchSystem.setTargets([this.scene._vNut]);
		this.scene.touchSystem.connect();
	}

	
	end({ to }) {
		this.scene.touchSystem.disconnect();
	}

	render() {
	}
}
