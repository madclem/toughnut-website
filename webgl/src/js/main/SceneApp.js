import alfrid, { GL, Scene } from 'alfrid';
import { createContainer, resize } from 'utils';

import Assets from '../Assets';
import Config from './Config';
import { ControllerSystem } from './systems/ControllerSystem';
// SceneApp.js
import { OrbitalControlTween } from 'helpers';
import { PhysicSystem } from './systems/PhysicSystem';
import Signal from 'mini-signals';
import { StatesSystem } from './systems/StatesSystem';
import { TouchSystem } from './systems/TouchSystem';
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
		OrbitalControlTween.init(this.orbitalControl);
		this.physicSystem = new PhysicSystem();
		this.statesSystem = new StatesSystem(this);
		this.touchSystem = new TouchSystem(this, options.container);
		this.controllerSystem = new ControllerSystem(this, options.container);
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

		// this.orbitalControl.radius.limit(1.9, 3.75);

		this.statesSystem.set('home');
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
		
		this._vNut.render();
		this._vNutCage.render(this.rad, this.irr);
		this._vMagicCube.render(this._vTextureSwap.texture, this._vTextureSwap);
		
		if (Config.fxaa.active) {			
			this.fboRender.unbind();
	
			this._vFxaa.render(this.fboRender.getTexture(0));
		}

		// this._vTextureSwap.setAngle(this._vMagicCube.angle);
		
		
		


		// GL.disable(GL.DEPTH_TEST);
		// const s = 300;      
		// GL.viewport(0, 0, s, s);
		// this._bCopy.draw(this._vTextureSwap.texture);
		// GL.enable(GL.DEPTH_TEST);
	}

	resize(w, h) {
		resize(null, null, this.containerHTML.clientWidth, this.containerHTML.clientHeight);
		this.camera.setAspectRatio(GL.aspectRatio);
	}
}


export default SceneApp;