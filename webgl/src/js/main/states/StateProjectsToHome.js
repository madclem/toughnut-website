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
		
		const originalRotX = magicCube.rotationX; // remeber that rotation
		cage.start();
		nut.start();
		
		mat4.identity(tempMat4);
		magicCube.saveMatrix(tempMat4);
		magicCube.toggleMatrixMatching(true, cage._matrix);
		setTimeout(()=>{

			magicCube.rotationX += (-cage.rotationX + originalRotX);
		}, 10)
		magicCube._needUpdate = true;
		magicCube._update();
		
		return;
		OrbitalControlTween.tween({
			radius: 3.75,
			centerX: 0,
			rx: 0,
			ry: 0,
		});

		this.scene.orbitalControl.radius.value = 3.75;
		
		const w = window.innerWidth; // get the w out of the h ratio if windowW > windowH
		const h = window.innerHeight;


		const o = { rotX: cage.rotationX, scaleX: cage.scaleX, scaleY: cage.scaleY, scaleZ: cage.scaleZ };
		// const originalRotX = magicCube.rotationX;
		const add = magicCube.rotationX % Math.PI;
		// cage.setRot(originalRotX);

		// return;

		const nRot = 0.5;
		gsap.to(o, 1.6, {
			rotX: o.rotX - Math.PI * 2 * nRot,
			ease: Back.easeOut.config(1.25),
			onUpdate: () => {
				cage.setRot(o.rotX);
				// magicCube.rotationX = Math.PI / 2;
			},
			onComplete: () => {
				// magicCube.saveMatrix();
				magicCube.toggleMatrixMatching(false, null);
			}

		});

		const closestZ = cage.scaleZ / 2 + cage.z;
		const { scaleX, scaleY } = fitXY(w, h, closestZ, this.scene.camera, this.scene.orbitalControl);
		const scaleZ = scaleY / 6;		

		gsap.to(o, 1.6, {
			scaleX,
			scaleY,
			scaleZ,
			ease: 'sine.out',
			onUpdate: () => cage.changeOffsets(o.scaleX / 2, o.scaleY / 2, o.scaleZ / 2)			
		});

		gsap.to(magicCube, 1.6, {
			percentTransition: -1,
			onComplete: () => {
				textureSwap.stop(); // stop the texture swaping
				magicCube.stop();
				magicCube.toggleMatrixMatching(false, null);
        this.scene.statesSystem.set('home');
			}
		});

		cage.fadeTo(0, 1.6);
	}

	
	end({ to }) {
	}

	render() {
	}
}
