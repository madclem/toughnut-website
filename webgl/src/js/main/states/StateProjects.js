import { GL, Scheduler } from 'alfrid';
import { fitXY, getCameraDistanceFitX } from 'utils';
import gsap, { Back } from 'gsap';

import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';

export class StateProjects extends StateDefault {
	begin(data = {}) {
		this.scene._vNutCage.fadeTo(0.5, true);

		const cage = this.scene._vNutCage;
		
		
		const o = { rotX: 0,  scaleX: cage.scaleX, scaleY: cage.scaleY, scaleZ: cage.scaleZ };
		const nRot = 0.5;
		gsap.to(o, 1.6, {
			rotX: Math.PI * 2 * nRot,
			ease: Back.easeOut.config(1.25),
			onUpdate: () => cage.setRot(o.rotX)
		});
		
		
		const ratio = 9 / 16;
		let w = 0; //window.innerWidth * 1; // get the w out of the h ratio if windowW > windowH
		let h = 0; //w * ratio;

		if (window.innerWidth > window.innerHeight) {
			h = window.innerHeight;
			w = h * 16 / 9;
		} else {
			w = window.innerWidth;
			h = w * ratio;
		}
		
		// const h = window.innerHeight * 1;
		let closestZ = cage.scaleZ / 2 + cage.z;
		const { scaleX, scaleY } = fitXY(w, h, closestZ, this.scene.camera, this.scene.orbitalControl);
		const scaleZ = scaleY;
		

		gsap.to(o, 1, {
			scaleX,
			scaleY,
			scaleZ,
			ease: 'sine.out',
			onUpdate: () => cage.changeOffsets(o.scaleX / 2, o.scaleY / 2, o.scaleZ / 2)
		});		

		// setTimeout(()=>{
			closestZ = cage.getZForScale(scaleZ) + scaleZ / 2;
			const dist = getCameraDistanceFitX(window.innerWidth  / 2.2, scaleX, closestZ, this.scene.camera, this.scene.orbitalControl);
	
			// this.scene.orbitalControl.radius.setTo(dist);
		// }, 2000);
		
		OrbitalControlTween.tween({
			radius: dist,
			// offsetX: 2,
			ry: 0.2,
		});
	}

	
	end({ to }) {
	}

	render() {
	}
}
