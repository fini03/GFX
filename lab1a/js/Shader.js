import { createShader, createProgram } from './shaderUtils.js';

class Shader {
    // Fields
    name = '';
    program = -1;
    locACoord = -1;
    locAColor = -1;
    locUTransform = -1;
    locPTransform = -1;
    locVTransform = -1;

    constructor(name) {
        this.name = name;
    }

    // Load and compile the shader program from the vertex and fragment shader source code
    async loadAndCompile(gl) {

        /* -------- Prepare shaders -------- */

        const vertShaderSrc = await fetch(`shaders/${this.name}.vert`)
            .then(response => response.text());
        const vertShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertShaderSrc
        );

        const fragShaderSrc = await fetch(`shaders/${this.name}.frag`)
            .then(response => response.text());
        const fragShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragShaderSrc
        );

        /* -------- Create program -------- */

        this.program = createProgram(
            gl,
            vertShader,
            fragShader
        );

        /* -------- Get the attribute for the shader program -------- */

        this.locACoord= gl.getAttribLocation(
            this.program,
            "a_coords"
        );

        this.locAColor = gl.getAttribLocation(
            this.program,
            "a_color"
        );
        
        /* -------- Get uniform locations for the shader program -------- */

        this.locPTransform = gl.getUniformLocation(
            this.program,
            "u_projection"
        );

        this.locUTransform = gl.getUniformLocation(
            this.program,
            "u_transform"
        );

        this.locVTransform = gl.getUniformLocation(
            this.program,
            "u_view"
        );
    }

    /* -------- Bind shader program for rendering -------- */

    bind(gl) {
        gl.useProgram(this.program);
    }

    /* -------- Set projection & view matrices as uniforms for shader program -------- */

    uniformMatrices(gl, projectionMatrix, viewMatrix) {
        gl.uniformMatrix4fv(
            this.locPTransform,
            false,
            projectionMatrix
        );

        gl.uniformMatrix4fv(
            this.locVTransform,
            false,
            viewMatrix
        );
    }

}

export { Shader }
