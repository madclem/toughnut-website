import CANNON from 'cannon';
import { materials } from '../physic/materials';
import { onElementAddedToWorld } from '../signals';

export class PhysicSystem {
	constructor() {    
		// create the world
		this.world = new CANNON.World();
		this.world.broadphase.useBoundingBoxes = true;
		// this.world.defaultContactMaterial.friction = 0.0;
		// this.world.defaultContactMaterial.restitution = 0.25;
		this.world.gravity.set(0, -2, 0);
    
    for (const cm in materials.contacts) {
      this.world.addContactMaterial(materials.contacts[cm]);
    }

		onElementAddedToWorld.add(this.entityAddedToGame.bind(this));
	}
  
	update() {
		for (let i = this.world.bodies.length - 1; i >= 0; i--) {
			const body = this.world.bodies[i];
      
			if (body.entity) {				
				const { x, y, z, w } = body.quaternion;
				body.entity.setRotationFromQuaternion([x, y, z, w]);
				body.entity.x = body.position.x;
				body.entity.y = body.position.y;
				body.entity.z = body.position.z;
			}
		}

		const fixedTimeStep = 1 / 60;
		this.world.step(fixedTimeStep, 1, 2); // fixed timestep, delta, maxsubstep
	}

	entityAddedToGame(entity) {
		if (entity.bodies && entity.bodies.length > 0) {
			for (let i = 0; i < entity.bodies.length; i++) {
				const body = entity.bodies[i];
				this.world.addBody(body);
        
			}
		}
	}

	entityRemovedFromGame(entity) {
		if (entity.body) {
			this.world.removeBody(entity.body);
		}
	}
}