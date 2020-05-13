import { mat4, vec3, vec4 } from 'gl-matrix';

import { Ray } from 'alfrid';
import { getDistOptim3D } from 'utils';

const v = vec4.create();

function rotate(vec, matrix) {
	vec4.copy(v, [vec[0], vec[1], vec[2], 1.0]);
	vec4.transformMat4(v, v, matrix);

	return vec4.clone(v);
}

const intersectionRayMesh = (ray, vertices, matrix, getClosest = false) => {
	let hit; let v0; let v1; let 
		v2;
    
	let closestHit;
	let previousDist = 100000000;
	let dist;
  
	for(let i = 0; i < vertices.length; i+=3) {
		const vertice = vertices[i];
		const vertice1 = vertices[i + 1];
		const vertice2 = vertices[i + 2];
      
		if (matrix) {
			v0 = rotate(vertice, matrix);
			v1 = rotate(vertice1, matrix);
			v2 = rotate(vertice2, matrix);
		} else {
			v0 = vertice;
			v1 = vertice1;
			v2 = vertice2;
		}

		hit = ray.intersectTriangle(v0, v1, v2, false);

    console.log('here');
		
		if(hit) {
			if (getClosest) {
        dist = getDistOptim3D(ray.origin[0], ray.origin[1], ray.origin[2], hit[0], hit[1], hit[2]);
        
				if (dist < previousDist) {
					previousDist = dist;
					closestHit = [...hit];
				}
			} else {
				return hit;
			}
		};
	}
    
	return closestHit;
};

export { intersectionRayMesh };