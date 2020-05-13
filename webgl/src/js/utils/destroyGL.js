const destroyGL = (gl) => {
	const numTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
	for (let unit = 0; unit < numTextureUnits; unit++) {
		gl.activeTexture(gl.TEXTURE0 + unit);
		gl.bindTexture(gl.TEXTURE_2D, null);
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
	}

	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	gl.bindRenderbuffer(gl.RENDERBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
};

export { destroyGL };