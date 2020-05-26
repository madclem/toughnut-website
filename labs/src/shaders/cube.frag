// // copy.frag

// #define SHADER_NAME SIMPLE_TEXTURE

// precision highp float;
// varying vec2 vTextureCoord;
// uniform sampler2D texture;

// void main(void) {
//     gl_FragColor = vec4(vec3(1., 0., 0.), 1.);
// }


// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vPosition;
uniform sampler2D texture;

float near = 0.1; 
float far  = 100.0; 
  
float mapDepthToproj(float depth) 
{
    float ndc = depth * 2.0 - 1.0; // back to NDC 
    return -(2.0 * near * far) / (ndc * (far - near) - far - near);	
}

  
float LinearizeDepth(float depth) 
{
    float z = depth * 2.0 - 1.0; // back to NDC 
    return (2.0 * near * far) / (far + near - z * (far - near));	
}

void main(void) {
    // float depth = 1. - (gl_FragCoord.z / gl_FragCoord.w) / far;

    // if (gl_FragCoord.z / gl_FragCoord.w > 1.) {
    //    discard;
    // }

    // if (depth > depthFromZBuffer) discard;
    // gl_FragColor = texture2D(texture, vTextureCoord);
    gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.);
    // gl_FragColor = vec4(vec3(depthFromZBuffer), .2);
}