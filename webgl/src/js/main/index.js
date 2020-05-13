import '../../css/main.css';

import SceneApp from './SceneApp';
import Signal from 'mini-signals';
import assetsList from './asset-list';
import { preloadBuild } from 'utils/preload';

export default class WebGL {
	constructor() {
		this.scene = null;
	}

	init(options) {
		options.assets = assetsList;
		preloadBuild(options).then(() => {
			this.scene = new SceneApp(options, this);
		}, (err) => {
			console.log('err', err);
		});
	}
}