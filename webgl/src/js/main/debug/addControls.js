// addControls.js

import Config from '../Config';
import Settings from '../Settings';
import { saveJson } from 'utils';

const addControls = (scene) => {

	const oControl = {
		toggleOrbital: () => {
			if (scene.orbitalControl.connected) scene.orbitalControl.lock(!scene.orbitalControl._isLockZoom);
			else scene.orbitalControl.connect();
		},
		save:() => {
			saveJson(Config, 'Settings');
		}
	};

	setTimeout(()=> {

		const navO = {
			goHome: () => scene.statesSystem.set('projectsToHome'),
			goProjects: () => scene.statesSystem.set('homeToProjects'),
		};
		gui.add(navO, 'goHome').name('Go: Home');
		gui.add(navO, 'goProjects').name('Go: Projects');
		gui.add(Config.fxaa, 'active').onChange(Settings.refresh);

		gui.add(oControl, 'toggleOrbital').name('toggle orbital control');
		gui.add(oControl, 'save').name('Save Settings');
		gui.add(Settings, 'reset').name('Reset Default');
	}, 200);
};


export default addControls;