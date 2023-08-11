precision mediump float;

varying vec3 v_vertexAmbient;
varying vec3 v_vertexDiffuseSpecular;
varying vec4 v_shadowCoord;

uniform sampler2D u_shadowMap;

float unpackDepth(const in vec4 rgbaDepth) {
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0 * 256.0), 1.0/(256.0 * 256.0 * 256.0));
    float depth = dot(rgbaDepth, bitShift);
    return depth;
  }

void main() {
    vec3 finalColor;
    vec3 shadowCoord = (v_shadowCoord.xyz / v_shadowCoord.w) * 0.5 + 0.5;
    float depth = unpackDepth(texture2D(u_shadowMap, shadowCoord.xy));
    if (shadowCoord.z > depth + 0.00015) {
        finalColor = v_vertexAmbient;
    } else {
        finalColor = v_vertexAmbient + v_vertexDiffuseSpecular;
    }

    gl_FragColor = vec4(finalColor.rgb, 1.0);
}
