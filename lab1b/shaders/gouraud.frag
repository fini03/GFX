precision mediump float;

varying vec4 v_vertexColor;

void main() {
     gl_FragColor = vec4(v_vertexColor.rgb, 1.0);
}
