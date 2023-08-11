precision mediump float;

uniform vec3 u_lightPosition;
uniform vec3 u_ambientProduct;
uniform vec3 u_diffuseProduct;

varying vec3 v_viewPosition;
varying vec3 v_normal;

varying vec4 v_vertexColor;

void main() {
    vec3 L = normalize(u_lightPosition - v_viewPosition);
    vec3 E = normalize(-v_viewPosition);
    vec3 N = normalize(v_normal);
    vec3 R = reflect(-L, N);

    vec3 ambientColor = v_vertexColor.rgb * u_ambientProduct;

    float diffuseIntensity = max(dot(L, N), 0.0);
    vec3 diffuseColor = v_vertexColor.rgb * diffuseIntensity * u_diffuseProduct;

    vec3 finalColor = ambientColor + diffuseColor;

    gl_FragColor = vec4(finalColor, 1.0);
}
