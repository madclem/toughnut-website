import Assets from '../Assets';
import AssetsLoader from 'assets-loader';
import Capture from './Capture';
import { GL } from 'alfrid';
// preload.js
import debugPolyfill from '../debug/debugPolyfill';

const getLoadingImage = () => new Promise((resolve, reject) => {
	const img = document.createElement('img');

	img.onload = () => {
		resolve(img);
	};

	img.src = 'assets/css-img/loading.png';
});


const initAlfrid = (options = {}) => new Promise((resolve, reject) => {
	// CREATE CANVAS
	// let canvas = document.querySelector('.Main-Canvas');

	// if (!canvas) {
		let canvas = document.createElement('canvas');
		canvas.className = 'Main-Canvas';
	// }
	const container = options.container || document.body.querySelector('.container');
	container.appendChild(canvas);

	// INIT 3D TOOL
	GL.init(canvas, { ignoreWebgl2: false, preserveDrawingBuffer: true });

	resolve();
});

const createLoadingAnim = () => new Promise((resolve, reject) => {
	resolve();
});

const loadAssets = (assets) => new Promise((resolve, reject) => {
	if (assets.length > 0) {
		document.body.classList.add('isLoading');

		new AssetsLoader({
			assets
		})
			.on('error', (error) => {
			})
			.on('progress', (p) => {
				const loader = document.body.querySelector('.Loading-Bar');
				if (loader) loader.style.width = `${(p * 100)}%`;
			})
			.on('complete', (o) => {
				resolve(o);
			})
			.start();
	} else {
		resolve([]);
	}
});

const loadAssetsBuild = (options = {}) => new Promise((resolve, reject) => {
	if (options.assets.length > 0) {
		document.body.classList.add('isLoading');

		const assets = [...options.assets];
		
		const assetsWithUrl = options.assets.map((asset)=> {
			asset.url = asset.url.indexOf('static') > -1 ? asset.url : (options.assetsPath || '')  + asset.url;

			return asset;
		});
    
		new AssetsLoader({
			assets: assetsWithUrl
		})
			.on('error', (error) => {
			})
			.on('progress', (p) => {
				if (options.onProgress) options.onProgress(p);
			})
			.on('complete', (o) => {
				if (options.onComplete) options.onComplete(o);
				resolve(o);
			})
			.start();
	} else {
		resolve([]);
	}
});

const initAssets = (listAssets, mAssets) => new Promise((resolve, reject) => {
	const loader = document.body.querySelector('.Loading-Bar');
	loader.style.width = '100%';

	// INIT ASSETS
	Assets.init(mAssets, listAssets);

	resolve();
});

const initAssetsBuild = (listAssets, mAssets) => new Promise((resolve, reject) => {
	// INIT ASSETS
	Assets.init(mAssets, listAssets);

	resolve();
});

const closeLoadingAnim = () => new Promise((resolve, reject) => {
	setTimeout(() => {
		document.body.classList.remove('isLoading');
	}, 250);

	setTimeout(() => {
		resolve();
	}, 500);
});

const preload = (options) => new Promise((resolve, reject) => {
	initAlfrid()
		.then(getLoadingImage)
		.then(createLoadingAnim)
		.then(loadAssets.bind(null, options.assets))
		.then(initAssets.bind(null, options.assets))
		.then(closeLoadingAnim)
		.then(() => {
			resolve();
		})
		.catch((e) => {
		});
});

export const preloadBuild = (options) => new Promise((resolve, reject) => {
	initAlfrid(options)
		.then(loadAssetsBuild.bind(null, options))
		.then(initAssetsBuild.bind(null, options.assets))
		.then(() => {
			resolve();
		})
		.catch((e) => {
		});
});

export default preload;
