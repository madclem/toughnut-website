// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;

void main(void) {
    gl_FragColor = vec4(vec3(0., 154./255., 221./255.), 1.0);
}