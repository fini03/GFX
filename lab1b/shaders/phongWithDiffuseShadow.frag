precision mediump float;

uniform vec3 u_lightPosition;
uniform vec3 u_ambientProduct;
uniform vec3 u_diffuseProduct;
uniform sampler2D u_shadowMap;

varying vec3 v_viewPosition;
varying vec3 v_normal;
varying vec4 v_shadowCoord;

varying vec4 v_vertexColor;

float unpackDepth(const in vec4 rgbaDepth) {
    const vec4 bitShift = vec4(1.0, 1.0/256.0, 1.0/(256.0 * 256.0), 1.0/(256.0 * 256.0 * 256.0));
    float depth = dot(rgbaDepth, bitShift);
    return depth;
  }

void main() {

    vec3 L = normalize(u_lightPosition - v_viewPosition);
    vec3 E = normalize(-v_viewPosition);
    vec3 N = normalize(v_normal);
    vec3 R = reflect(-L, N);

    vec3 ambientColor = v_vertexColor.rgb * u_ambientProduct;

    float diffuseIntensity = max(dot(L, N), 0.0);
    vec3 diffuseColor = v_vertexColor.rgb * diffuseIntensity * u_diffuseProduct;

    vec3 finalColor;

    float bias = max(0.00015 * (1.0 - dot(L, N)), 0.0);
    vec3 shadowCoord = (v_shadowCoord.xyz / v_shadowCoord.w) * 0.5 + 0.5;
    float depth = unpackDepth(texture2D(u_shadowMap, shadowCoord.xy));
    if (shadowCoord.z > depth + bias) {
        finalColor = ambientColor;
    } else {
        finalColor = ambientColor + diffuseColor;
    }

    gl_FragColor = vec4(finalColor.rgb, 1.0);
}
