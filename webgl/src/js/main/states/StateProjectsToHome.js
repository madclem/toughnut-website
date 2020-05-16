import { GL, Scheduler } from 'alfrid';
import { fitXY, getCameraDistanceFitX } from 'utils';
import gsap, { Back } from 'gsap';

import { OrbitalControlTween } from 'helpers';
import { StateDefault } from './StateDefault';
import { mat4 } from 'gl-matrix';

const tempMat4 = mat4.create();

export class StateProjectsToHome extends StateDefault {
	begin(data = {}) {
		/** MOVE THE CAGE, ROTATE ETC. */
		const cage = this.scene._vNutCage;
		const nut = this.scene._vNut;
		const magicCube = this.scene._vMagicCube;
		const textureSwap = this.scene._vTextureSwap;
		
		cage.start();
		nut.start();

		
		mat4.identity(tempMat4);
		magicCube.saveMatrix(tempMat4);
		const originalRotX = magicCube.rotationX; // remeber that rotation
		
		const initValue = cage.rotationX;
		const extra = -(originalRotX % (Math.PI));
		const o = { rotX: initValue - extra, scaleX: cage.scaleX, scaleY: cage.scaleY, scaleZ: cage.scaleZ };
		cage.setRot(o.rotX);
		cage.updateRotation();


		magicCube.toggleMatrixMatching(true, cage._matrix);
		// setTimeout(()=>{

			// magicCube.rotationX = (-cage.rotationX + originalRotX);
		// 	magicCube._needUpdate = true;
		// 	magicCube._update();
		// }, 10)
		
		// return;
		const duration = 1.4;
		const ease = 'sine.inout';
		

		
		const w = window.innerWidth; // get the w out of the h ratio if windowW > windowH
		const h = window.innerHeight;


		
		// magicCube.rotationX = originalRotX + extra;
		magicCube.needUpdate = true;
		magicCube._update();

		// cage.fadeTo(0, 0.2, 'sine.in');
		// return;
		// const originalRotX = magicCube.rotationX;
		const nRot = 0.5;
		console.log('initValue, o.rotX - Math.PI * 2 * nRot + extra', initValue, o.rotX - Math.PI * 2 * nRot + extra)
		gsap.to(o, duration, {
			rotX: o.rotX - Math.PI * 2 * nRot + extra, // + originalRotX % Math.PI,
			ease,
			// ease: Back.easeOut.config(1.25),
			onUpdate: () => {
				cage.setRot(o.rotX);
				magicCube.rotationX = originalRotX + extra;
				// console.log(initValue - o.rotX);
				
				magicCube.extraAngle =  o.rotX;
				// magicCube.extraAngle = initValue - o.rotX - extra;
			},
			onComplete: () => {
				magicCube.saveMatrix();
				magicCube.toggleMatrixMatching(false, null);
			}

		});

		OrbitalControlTween.tween({
			radius: 3.75,
			ease,
			duration,
			centerX: 0,
			rx: 0,
			ry: 0,
		});

		const closestZ = cage.scaleZ / 2 + cage.z;
		const { scaleX, scaleY } = fitXY(w, h, closestZ, this.scene.camera, 3.75); // can pass radius directly instead of the orbital entirely
		const scaleZ = scaleY / 6;		

		gsap.to(o, duration, {
			scaleX,
			scaleY,
			scaleZ,
			ease,
			onUpdate: () => cage.changeOffsets(o.scaleX / 2, o.scaleY / 2, o.scaleZ / 2)			
		});

		gsap.to(magicCube, duration, {
			percentTransition: -1,
			ease,
			onComplete: () => {
				textureSwap.stop(); // stop the texture swaping
				magicCube.stop();
				magicCube.toggleMatrixMatching(false, null);
        this.scene.statesSystem.set('home');
			}
		});

		cage.fadeTo(0, duration, 'sine.in');
	}

	
	end({ to }) {
	}

	render() {
	}
}
