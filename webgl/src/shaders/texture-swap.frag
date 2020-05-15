precision highp float;
uniform sampler2D texture;
uniform sampler2D texture2;

varying vec2 vTextureCoord;
varying vec3 vPosition;

void main(void) {
  float uvX = 1. - vTextureCoord.x;
  float uvY = mod(vTextureCoord.y , .5) * 2.;

  vec4 tex1 = texture2D(texture, vec2(uvX, uvY));
  vec4 tex2 = texture2D(texture2, vec2(uvX, uvY));

  vec4 color = mix(tex1, tex2, step(vTextureCoord.y, .5));
    
  gl_FragColor = color;
}