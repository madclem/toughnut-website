#define SHADER_NAME pbr_vert

precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute vec3 aNormal;

uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;
uniform mat4 uMatrix;
uniform mat3 uNormalMatrix;
uniform mat3 uModelViewMatrixInverse;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vPosition;


float exponentialIn(float t) {
  return t == 0.0 ? t : pow(2.0, 10.0 * (t - 1.0));
}

void main(void) {
	vec4 position = uModelMatrix * vec4(aVertexPosition, 1.0);
	vPosition     = position.xyz / position.w;


	vec3 smoothNormal = normalize(aVertexPosition.xyz);
	float percentageSmooth = 0.;
	vNormal       = normalize(vec3(uModelMatrix * vec4(mix(aNormal, smoothNormal, percentageSmooth), 0.0)));
	vTextureCoord = aTextureCoord;

	gl_Position   = uProjectionMatrix * uViewMatrix * position;
}
