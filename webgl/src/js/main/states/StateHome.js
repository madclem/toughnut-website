import { GL, Scheduler } from 'alfrid';
import gsap from 'gsap';
import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';

export class StateHome extends StateDefault {

	begin({ snap, from }) {
		const nut = this.scene._vNut;
		const cage = this.scene._vNutCage;
		const magicCube = this.scene._vMagicCube;

		// magicCube.stop();
		cage.fadeTo(0, 0);
		// }
		
		nut.start();
		cage.start();
		
		this.scene.orbitalControl.rx.value = 0; // (1) leave that here, even though it may be overidden by OrbitalControl tween
		this.scene.orbitalControl.ry.value = 0; // (2) important to calculate the rectangle boundaries
		this.scene.orbitalControl.radius.value = 3.75;

		this.scene._vNutCage.fit(window.innerWidth, window.innerHeight, 1 / 6);
		
		this.scene.touchSystem.setTargets([this.scene._vNut]);
		this.scene.touchSystem.connect();
	}

	
	end({ to }) {
		this.scene.touchSystem.disconnect();
	}

	render() {
	}
}
