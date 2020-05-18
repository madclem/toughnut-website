import { StateHome, StateHomeToProjects, StateProjects, StateProjectsToHome } from '../states';

const NOOP = () =>{};

export class StatesSystem {
	constructor(scene) {
    this.scene = scene;
		this.states = {};
		this.currentStateId = 'empty';
		this.transitionMap = {};

    this.add('empty', { end: NOOP, begin: NOOP, update: NOOP, render: NOOP });
    
    this.add('home', new StateHome());
    this.add('projects', new StateProjects());
    this.add('homeToProjects', new StateHomeToProjects());
    this.add('projectsToHome', new StateProjectsToHome());

		this.addTransition('home', 'homeToProjects');	
		this.addTransition('homeToProjects', 'projects');	
		this.addTransition('projects', 'projectsToHome');	
		this.addTransition('projectsToHome', 'home');	
	}

	get id() {
		return this.currentStateId;
	}

	addTransition(id1, id2, bothways) {
		this.transitionMap[id1][id2] = true;

		if (bothways) {
			this.transitionMap[id2][id1] = true;
		}

		return this;
	}

	add(id, state) {
		this.states[id] = state;
		state.scene = this.scene;

		if (!state.empty)state.empty = NOOP;
		if (!state.begin)state.begin = NOOP;
		if (!state.update)state.update = NOOP;
		if (!state.render)state.render = NOOP;
		if (!state.end)state.end = NOOP;

		this.transitionMap[id] = {};

		this.addTransition('empty', id, true);

		return this;
	}

	set(id, data = {}, force = false) {
		data.from = this.currentStateId;
		data.to = id;
		if (force || this.transitionMap[this.currentStateId][id]) {
      this.states[this.currentStateId].end(data);

			this.currentStateId = id;

      this.states[this.currentStateId].begin(data);
		}
	}

	update() {
		this.states[this.currentStateId].update();
	}
}
