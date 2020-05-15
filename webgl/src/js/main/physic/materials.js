import CANNON from 'cannon';

export const materials = {
	items: {
		// All materials
		cage: new CANNON.Material('cageMaterial'),
		nut: new CANNON.Material('nutMaterial'),
	},
	contacts: {
		cageNut: CANNON.ContactMaterial,
		nutNut: CANNON.ContactMaterial,
	},
};

// Contact between materials
materials.contacts.cageNut = new CANNON.ContactMaterial(
	materials.items.cage,
	materials.items.nut,
	{
		restitution: 0.2,
		friction: 0.01,
	}
);

materials.contacts.nutNut = new CANNON.ContactMaterial(
	materials.items.nut,
	materials.items.nut,
	{
		restitution: 1,
		friction: 0.0,
	}
);

