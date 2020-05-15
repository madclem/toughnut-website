import alfrid, { GL } from 'alfrid';

import { Entity } from 'helpers';
import Assets from '../../Assets';
import frag from 'shaders/texture-swap.frag';

export class ViewTextureSwap extends Entity {
	constructor() {
		super(alfrid.ShaderLibs.bigTriangleVert, frag);

		this.textures = [
			'project-1',
			'project-2',
			'project-3',
			'project-4',
			'project-5',
			'project-6',
			'project-7',
			'project-8',
			'project-9',
		];


		this.mesh = alfrid.Geom.bigTriangle();
		this.shader.bind();
		this.shader.uniform('texture', 'uniform1i', 0);
		this.shader.uniform('texture2', 'uniform1i', 1);

		this.fboTextureSwap = new alfrid.FrameBuffer(1024, 1024, { minFilter: GL.LINEAR, magFilter: GL.LINEAR });

		this.reset();
	}

	reset() {
		this.currentIndex = 0;
		this.indexOther = 1;
		this.inverse = false;
		this._dirty = true;

		this.textureFront = Assets.get(this.textures[this.currentIndex]);
		this.textureOther = Assets.get(this.textures[this.indexOther]);
		this.textureOther.currentIndex = this.currentIndex + 1;

		this.render(true);
	}

	start() {
		super.start();
		this.reset();
	}

	showBottom() {
		this._dirty = true;
		this.indexOther = (this.currentIndex + 1) % this.textures.length;
		this.textureOther = Assets.get(this.textures[this.indexOther]);
	}
  
	showTop() {
		this._dirty = true;
		this.indexOther = this.currentIndex - 1 < 0 ? this.textures.length - 1 : this.currentIndex - 1;
		this.textureOther = Assets.get(this.textures[this.indexOther]);
	}

	swap(index) {
		this._dirty = true;
		this.inverse = index % 2 > 0;
		this.currentIndex = this.indexOther;
		this.textureFront = Assets.get(this.textures[this.currentIndex]);
	}

	get texture() {	return this.fboTextureSwap._textures[0]; }

	render(force) {
		if (!this.active && !force) return;
		
		if (!this._dirty) return;

		this.fboTextureSwap.bind();
		GL.clear(0, 0, 0, 1);
		this.shader.bind();
		this.textureOther.bind(this.inverse ? 1 : 0);
		this.textureFront.bind(this.inverse ? 0 : 1);
		GL.draw(this.mesh);
		this.fboTextureSwap.unbind();
	}
}
