attribute vec3 a_coords;
attribute vec3 a_color;

varying vec4 v_vertexColor;

void main() {
    v_vertexColor = vec4(a_color / 255.0, 1.0);
    gl_Position = vec4(a_coords, 1.0);
}
