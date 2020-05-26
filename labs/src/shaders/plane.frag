// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec4 vDepthPos;
uniform sampler2D texture;
uniform sampler2D textureDepth;

float near = 0.1; 
float far  = 100.0; 

const vec2 dimensions = vec2(1065., 540.);
  
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

float decodeFloatRG(vec2 rg) {
    return rg.y*(1.0/255.0) + rg.x;
}
float decodeFloatRGBA( vec4 rgba ) {
    return dot( rgba, vec4(1.0, 1.0/255.0, 1.0/65025.0, 1.0/160581375.0) );
}

void main(void) {
    vec3 texPos = (vPosition.xyz / vPosition.w) * 0.5 + 0.5;
    // float textDepth = mapDepthToproj(texture2D(texture, vTextureCoord.xy).x);
    // float depth = mapDepthToproj(gl_FragCoord.z / gl_FragCoord.w);
    vec4 textureCol = texture2D(texture, texPos.xy);
    vec4 textureDepthCol = texture2D(textureDepth, texPos.xy);
    // float textDepth = texture2D(texture, vTextureCoord.xy).r;
    // float fragDepth = gl_FragCoord.z;
    // float fragDepth = vDepthPos.z / vPosition.w;
    // float depthDiff = textDepth - fragDepth;

    float threshold = 0.005;

    if(gl_FragCoord.z > textureDepthCol.r )
    {
        discard;
    }

    float screenDepth = decodeFloatRG(texture2D(textureDepth, texPos.xy).zw);
    float fragDepth = vDepthPos.z / far;
    float diff = screenDepth - fragDepth;
    float intersect = 0.;
    // float fragDepth = 1. - (gl_FragCoord.z / gl_FragCoord.w) / far;

    // if (diff > 0.) {
        intersect = 1. - smoothstep(0., (1. / far) * 0.5, diff);
    // }

    vec3 c = vec3(1., 0., 0.);
    // if (fragDepth > textDepth) discard;
    // if (fragDepth > textDepth) {
    // if (fragDepth < textDepth) {
    //     c = vec3(1., 1., 0.);
    // }
    // gl_FragColor = texture2D(texture, vTextureCoord);
    // gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.);
    gl_FragColor = vec4(vec3(c), 1.) + intersect;
    // gl_FragColor = textureCol - intersect;
    // gl_FragColor = vec4(vec3(textDepth), .2);
}