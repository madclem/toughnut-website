import { GL, Scheduler } from 'alfrid';
import { fitXY, getCameraDistanceFitX } from 'utils';
import gsap, { Back } from 'gsap';

import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';
import { mat4 } from 'gl-matrix';

const tempMat4 = mat4.create();
export class StateHomeToProjects extends StateDefault {
	begin(data = {}) {
		/** MOVE THE CAGE, ROTATE ETC. */
		const cage = this.scene._vNutCage;
		const nut = this.scene._vNut;
		const magicCube = this.scene._vMagicCube;
		const textureSwap = this.scene._vTextureSwap;
		// cage.setRot(0); // important
		textureSwap.start(); // start the texture swaping
		magicCube.start(); // start the magic cube
		mat4.identity(tempMat4);
		magicCube.setMatrix(tempMat4);
		magicCube.toggleMatrixMatching(true, cage._matrix); // make the cube matrix dependant to the cage
		
		cage.fadeTo(0.6, 0.2);

		const o = { rotX: cage.rotationX,  scaleX: cage.scaleX, scaleY: cage.scaleY, scaleZ: cage.scaleZ };
		const nRot = 0.5;
		gsap.to(o, 1.6, {
			rotX: o.rotX + Math.PI * 2 * nRot,
			ease: Back.easeOut.config(1.25),
			onUpdate: () => {
				cage.setRot(o.rotX);
				// magicCube.rotationX = -Math.PI / 2;
			},
			onComplete: () => {
				magicCube.saveMatrix();
				magicCube.toggleMatrixMatching(false, null);
			}
		});
		
		const ratio = 9 / 16;
		let w = window.innerWidth; // get the w out of the h ratio if windowW > windowH
		let h = w * ratio;

		if (window.innerWidth > window.innerHeight) {
			h = window.innerHeight;
			w = h * 16 / 9;
		}
		

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

		closestZ = cage.getZForScale(scaleZ) + scaleZ / 2;
		const dist = getCameraDistanceFitX(window.innerWidth  / 2.6, scaleX, closestZ, this.scene.camera, this.scene.orbitalControl);
		
		OrbitalControlTween.tween({
			radius: dist,
			centerX: 1.5,
			ry: Math.PI / 7,
		});


		magicCube.percentTransition = -1;
		gsap.to(magicCube, 1.6, {
			percentTransition: 1,
			onComplete: () => {
				nut.stop();
        cage.stop();
        this.scene.statesSystem.set('projects');
			}
		});
	}

	
	end({ to }) {
	}

	render() {
	}
}
