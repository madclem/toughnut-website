import { GL, Scheduler } from 'alfrid';
import { fitXY, getCameraDistanceFitX } from 'utils';
import gsap, { Back } from 'gsap';
import { onKeyDown, onKeyUp } from '../signals';

import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';
import { mat4 } from 'gl-matrix';

const tempMatrix = mat4.create();
export class StateProjects extends StateDefault {
	begin(data = {}) {
		/** MOVE THE CAGE, ROTATE ETC. */
		const cage = this.scene._vNutCage;
		// cage.setRot(0); // important
		const textureSwap = this.scene._vTextureSwap;
		if (!textureSwap.active) textureSwap.start(); // start the texture swaping

		this.keyDownB = onKeyDown.add(this.onKeyDown);
		this.keyUpB = onKeyUp.add(this.onKeyUp);
	}

	onKeyDown = () => {
		this.scene._vMagicCube.rotate(1);
	}

	onKeyUp = () => {
		this.scene._vMagicCube.rotate(-1);
	}

	end({ to }) {
		this.keyDownB.detach();
		this.keyUpB.detach();
	}
}
