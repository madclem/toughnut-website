// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform vec3 uColor;

void main(void) {
    // gl_FragColor = vec4(uColor, 1.);
    gl_FragColor = vec4(vec3(1., 0., 0.), 1.);
}