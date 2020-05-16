import alfrid, { BatchBall, GL, Ray, Scene } from 'alfrid';
import { createContainer, getMouse, intersectionPlane, resize } from 'utils';

import Assets from '../Assets';
import Config from './Config';
import { ControllerSystem } from './systems/ControllerSystem';
// SceneApp.js
import { OrbitalControlTween } from 'helpers';
import { PhysicSystem } from './systems/PhysicSystem';
import Signal from 'mini-signals';
import { StatesSystem } from './systems/StatesSystem';
import { TouchSystem } from './systems/TouchSystem';
import { VerletPhysicsSystem } from './systems/VerletPhysicsSystem';
import ViewFxaa from './views/ViewFxaa';
import { ViewMagicCube } from './views/ViewMagicCube';
import { ViewNut } from './views/ViewNut';
import { ViewNutCage } from './views/ViewNutCage';
import { ViewTextureSwap } from './views/ViewTextureSwap';
import { onElementAddedToWorld } from './signals';

class SceneApp extends Scene {
	constructor(options = {}) {
		GL.enableAlphaBlending();

		
		
		const container = createContainer(options); // will also set the options.container
		options.noControl = true;
		super(options);
		
		this.containerHTML = container;
		
		this.resize();
	}
	
	_init(options) {
		super._init(options);
		this.tick = 0;
		OrbitalControlTween.init(this.orbitalControl);

		this.verletPhysics = new VerletPhysicsSystem();
		this.physicSystem = new PhysicSystem();
		this.statesSystem = new StatesSystem(this);
		this.touchSystem = new TouchSystem(this, options.container);
		this.controllerSystem = new ControllerSystem(this, options.container);

		this.views = [];

		window.addEventListener('mousedown', this.onDown.bind(this));
		window.addEventListener('touchstart', this.onDown.bind(this));
		window.addEventListener('mousemove', this.onMove.bind(this));
		window.addEventListener('touchmove', this.onMove.bind(this));
		window.addEventListener('mouseup', this.onUp.bind(this));
		window.addEventListener('touchend', this.onUp.bind(this));

		this.ray = new Ray([0, 0, 0], [0, 0, -1]);
		this.mouse = vec2.create();
    this.pointOnPlane = vec3.create();
	}

	onDown(e) {
	}
	
	generateRay (e) {
    const o = getMouse(e, this.mouse);
		const mx = (o.x / GL.width) * 2.0 - 1.0;
    const my = - (o.y / GL.height) * 2.0 + 1.0;
		this.camera.generateRay([mx, my, 0], this.ray);
	}
	
  onMove(e) {
			this.generateRay(e);
			const origin = this.ray.origin;
			const target = this.ray.at(this.orbitalControl.radius.value);
			intersectionPlane(origin, target, this.pointOnPlane, [0, 0, 0], [1, 1, 0], [0, -1, 0]);
			      
      // this.jointBody.position.set(intersection[0], intersection[1], intersection[2]);
      // this.mouseConstraint.update();
  }

  onUp () {
  }

	_initTextures() {
		this.rad = Assets.get('studio_radiance');
		this.irr = Assets.get('irr');
		this.skymap = Assets.get('gradient-white');
	}

	_initViews() {

		// helpers
		this._bCopy = new alfrid.BatchCopy();
		this._bAxis = new alfrid.BatchAxis();
		this._bDots = new alfrid.BatchDotsPlane();
		this._bBall = new alfrid.BatchBall();

		this._bSky = new alfrid.BatchSky();



		// views
		
		this._vTextureSwap = new ViewTextureSwap();
		this._vMagicCube 		= new ViewMagicCube(this);
		this._vNutCage 		= new ViewNutCage(this);
		this._vNut 		= new ViewNut();
		this.addToWorld(this._vNutCage);
		this.addToWorld(this._vNut);
		this._vFxaa 		= new ViewFxaa();
		
		// framebuffers
		const oSettings = { minFilter:GL.LINEAR, magFilter: GL.LINEAR };
		this.fboRender = new alfrid.FrameBuffer(GL.width, GL.height, oSettings);
		this.orbitalControl.radius.setTo(3.75);

		this.createVerletPoints();

		// this.orbitalControl.radius.limit(1.9, 3.75);

		this.statesSystem.set('home');
	}

	createVerletPoints() {
		const restingDistancesVerlet = 0.1;
		const stiffnesses = .1;
		const nbPoints = 10;
		const pinnedY = 0.5;
		const lengthRope = 0.45;

		// for (let i = 0; i < nbPoints; i++) {
		// 	// const pointmass = new VerletPointMass(0, pinnedY - (lengthRope / nbPoints * i), 0);
			
		// 	// if (i != 0)
		// 	// 	pointmass.attachTo(this.verletPoints[this.verletPoints.length-1], restingDistancesVerlet, stiffnesses * 2);
		// 	// else 
		// 	// 	pointmass.pinTo(pointmass.x, pointmass.y, pointmass.z, true);
			
		// 	const pointmass = new VerletPointMass(Math.random() * 1 - 1 / 2, 0.5, Math.random() * 1 - 1 / 2);
		// 	this.verletPoints.push(pointmass);

		// 	const bBall = new BatchBall();
		// 	this.views.push({ mesh: bBall, point: pointmass });
		// }

		for (let i = 0; i < nbPoints; i++) {
			const point = this.verletPhysics.addDot(0, pinnedY - i * 0.05, 0);
			this.views.push({ mesh: new BatchBall(), point });
    }

    for (let i = 0; i < nbPoints - 1; i++) {
      this.verletPhysics.addStick(i, (i + 1) % nbPoints, 0.05);
		}
		
		// for (let i = 0; i < nbPoints; i++) {
		// 	const point = this.verletPhysics.addDot(0, pinnedY - (lengthRope / nbPoints * i), 0);
		// 	this.views.push({ mesh: new BatchBall(), point });
			
		// 	if (i === 0) {
		// 		// point.pin(true);
		// 	} else {
		// 		if (i === 9) {
		// 			// point.mass = 20;
		// 		}
		// 		this.verletPhysics.addStick(i - 1, i);
		// 	}
			
		// }
	}

	addToWorld(element) {
    onElementAddedToWorld.dispatch(element);
  }

	
	render() {
		GL.clear(0, 0, 0, 0);

		
		this.physicSystem.update();
		
		// 3d scene utils 
		// this._bAxis.draw();
		// this._bDots.draw();
		this._vTextureSwap.render(); // keep it outside as it has it's own fbo
		
		if (Config.fxaa.active) {
			this.fboRender.bind();
			GL.clear(0, 0, 0, 1);
		}
		
		this._bSky.draw(this.skymap);
		
		// this._vNut.render();
		// this._vNutCage.render(this.rad, this.irr);
		// this._vMagicCube.render(this._vTextureSwap.texture, this._vTextureSwap);
		this.tick++;

		this.verletPhysics.update(alfrid.Scheduler.deltaTime);

		for (let i = 0; i < this.views.length; i++) {
			const mesh = this.views[i].mesh;
			const point = this.views[i].point;

			if (i === 0) {
				point.pos[0] = this.pointOnPlane[0];
				point.pos[1] = this.pointOnPlane[1];
				point.pos[2] = this.pointOnPlane[2];
			}
			mesh.draw(point.pos, [0.01, 0.01, 0.01], i === 0 ? [1, 0, 0] : [0, 0, 1]);
		}

		this._bBall.draw(this.pointOnPlane, [0.05, 0.05, 0.05], [0, 0, 1])

		if (Config.fxaa.active) {			
			this.fboRender.unbind();
	
			this._vFxaa.render(this.fboRender.getTexture(0));
		}

		// this.verletPhysics.update(this.verletPoints);
		// this._vTextureSwap.setAngle(this._vMagicCube.angle);
		
		
		


		GL.disable(GL.DEPTH_TEST);
		const s = 300;      
		GL.viewport(0, 0, s, s);
		this._bCopy.draw(this._vTextureSwap.texture);
		GL.enable(GL.DEPTH_TEST);
	}

	resize(w, h) {
		resize(null, null, this.containerHTML.clientWidth, this.containerHTML.clientHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;