// copy.frag

#define SHADER_NAME SIMPLE_TEXTURE

precision highp float;
varying vec2 vTextureCoord;
varying vec4 vPosition;
varying vec4 vDepthPos;
uniform sampler2D texture;
uniform sampler2D textureDepth;

float near=.1;
float far=100.;

const vec2 dimensions=vec2(1065.,540.);

float mapDepthToproj(float depth)
{
    float ndc=depth*2.-1.;// back to NDC
    return-(2.*near*far)/(ndc*(far-near)-far-near);
}

float LinearizeDepth(float depth)
{
    float z=depth*2.-1.;// back to NDC
    return(2.*near*far)/(far+near-z*(far-near));
}

float decodeFloatRG(vec2 rg){
    return rg.y*(1./255.)+rg.x;
}
float decodeFloatRGBA(vec4 rgba){
    return dot(rgba,vec4(1.,1./255.,1./65025.,1./160581375.));
}

void main(void){
    vec3 texPos=(vPosition.xyz/vPosition.w)*.5+.5;
    // float textDepth = mapDepthToproj(texture2D(texture, vTextureCoord.xy).x);
    // float depth = mapDepthToproj(gl_FragCoord.z / gl_FragCoord.w);
    // vec4 textureCol=texture2D(texture,texPos.xy);
    // vec4 textureDepthCol=texture2D(textureDepth,texPos.xy);
    // float textDepth = texture2D(texture, vTextureCoord.xy).r;
    // float fragDepth = gl_FragCoord.z;
    // float fragDepth = vDepthPos.z / vPosition.w;
    // float depthDiff = textDepth - fragDepth;
    
    // float threshold=.3;
    
    // if(gl_FragCoord.z>textureDepthCol.r)
    // {
        //     discard;
    // }
    
    // float screenDepth=decodeFloatRG(texture2D(textureDepth,texPos.xy).zw);
    float screenDepth=mapDepthToproj(texture2D(textureDepth,texPos.xy).x);
    float depth=mapDepthToproj(gl_FragCoord.z);
    float diff=screenDepth-depth;
    float intersect=0.;
    // float fragDepth = 1. - (gl_FragCoord.z / gl_FragCoord.w) / far;
    
    if(diff>0.){
        intersect=1.-smoothstep(0.,1./vPosition.w*.5,diff);
        // intersect=1.-diff/threshold;
        // c=vec3(1.,1.,0.);
    }
    
    // if (fragDepth > textDepth) discard;
    // if (fragDepth > textDepth) {
        // if (fragDepth < textDepth) {
            //     c = vec3(1., 1., 0.);
        // }
        // gl_FragColor = texture2D(texture, vTextureCoord);
        // gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.);
        
        vec4 niceColor=vec4(mix(vec3(1.,0.,0.),vec3(1.),pow(intersect,4.)),1.);
        gl_FragColor=niceColor;
        gl_FragColor*=.1+intersect;
        
        // gl_FragColor=vec4(vec3(c) ,.4)+intersect;
        // gl_FragColor = textureCol - intersect;
        // gl_FragColor = vec4(vec3(textDepth), .2);
    }