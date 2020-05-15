precision highp float;
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
attribute float aSide;
attribute vec3 aNormal;
attribute vec3 aExtra;

uniform mat4 uMatrix;
uniform mat4 uModelMatrix;
uniform mat4 uViewMatrix;
uniform mat4 uProjectionMatrix;

varying vec2 vTextureCoord;
varying vec3 vNormal;
varying vec3 vExtra;
varying vec3 vPosition;
varying float vSide;

void main(void) {
    // gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * uMatrix * vec4(aVertexPosition, 1.0);
    gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPosition, 1.0);
    
    vSide = aSide;
    vNormal = aNormal;
    vTextureCoord = aTextureCoord;
    vPosition = aVertexPosition;
    vExtra = aExtra;
}