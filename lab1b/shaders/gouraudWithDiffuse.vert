precision mediump float;

attribute vec4 a_coords;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_transform;
uniform mat4 u_projection;
uniform mat4 u_view;
uniform mat3 u_normal;
uniform mat4 u_lightViewProj;

uniform vec3 u_lightPosition;
uniform vec3 u_ambientProduct;
uniform vec3 u_diffuseProduct;

varying vec4 v_vertexColor;

void main() {
    // Transform vertex position and normal vector to view space
    vec4 viewPosition = u_view * u_transform * a_coords;

    vec3 L = normalize(u_lightPosition - viewPosition.xyz);
    vec3 N = normalize(u_normal * a_normal);

    vec3 ambientColor = a_color.rgb / 255.0 * u_ambientProduct;

    float diffuseIntensity = max(dot(L, N), 0.0);
    vec3 diffuseColor = a_color.rgb / 255.0 * diffuseIntensity * u_diffuseProduct;

    vec3 finalColor = ambientColor + diffuseColor;

    v_vertexColor = vec4(finalColor, 1.0);

    gl_Position = u_projection * viewPosition;
}
