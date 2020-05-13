// resizeCanavs.js

import alfrid, { GL } from 'alfrid';

const resize = (w, h, containerWidth, containerHeight ) => {

	containerWidth |= window.innerWidth;
	containerHeight |= window.innerHeight;
	
	w           = w || containerWidth;
	h           = h || containerHeight;
	
	GL.setSize(w, h);
	let tw      = Math.min(w, containerWidth);
	let th      = Math.min(h, containerHeight);
	
	const sx    = containerWidth / w;
	const sy    = containerHeight / h;
	const scale = Math.min(sx, sy);
	tw          = w * scale;
	th          = h * scale;

	GL.canvas.style.width  = `${tw}px`;
	GL.canvas.style.height = `${th}px`;
}


export { resize };