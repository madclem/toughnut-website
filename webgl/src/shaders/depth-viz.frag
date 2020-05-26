// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D texture;


float near = 1; 
float far  = 10.0; 
  
float LinearizeDepth(float depth) 
{
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));	
}

void main(void) {
    float depth = 1. - LinearizeDepth(texture2D(texture, vTextureCoord).r) / far;

    gl_FragColor =vec4(vec3(depth), 1.);
}