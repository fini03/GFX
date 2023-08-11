import { createShader, createProgram } from './shaderUtils.js';
import * as glm from './gl-matrix/index.js'

class Shader {
    // Fields
    vertName = '';
    fragName = '';
    program = -1;
    locACoord = -1;
    locANormal = -1;
    locAColor = -1;
    locUTransform = -1;
    locPTransform = -1;
    locVTransform = -1;
    locNTransform = -1;
    locLPosition = -1;
    locAProduct = -1;
    locDProduct = -1;
    locSProduct = -1;
    locShininess = -1;
    locLVPTransform = -1;


    constructor(vertName, fragName) {
        this.vertName = vertName;
        this.fragName = fragName;
    }

    // Load and compile the shader program from the vertex and fragment shader source code
    async loadAndCompile(gl) {

        /* -------- Prepare shaders -------- */

        const vertShaderSrc = await fetch(`shaders/${this.vertName}.vert`)
            .then(response => response.text());
        const vertShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertShaderSrc
        );

        const fragShaderSrc = await fetch(`shaders/${this.fragName}.frag`)
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

        this.locACoord = gl.getAttribLocation(
            this.program,
            "a_coords"
        );

        this.locANormal = gl.getAttribLocation(
            this.program,
            "a_normal"
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

        this.locNTransform = gl.getUniformLocation(
            this.program,
            "u_normal"
        );

        this.locLPosition = gl.getUniformLocation(
            this.program,
            "u_lightPosition"
        );

        this.locAProduct = gl.getUniformLocation(
            this.program,
            "u_ambientProduct"
        );

        this.locDProduct = gl.getUniformLocation(
            this.program,
            "u_diffuseProduct"
        );

        this.locSProduct = gl.getUniformLocation(
            this.program,
            "u_specularProduct"
        );

        this.locShininess = gl.getUniformLocation(
            this.program,
            "u_shininess"
        );

        this.locLVPTransform = gl.getUniformLocation(
            this.program,
            "u_lightViewProj"
        );

         this.shadowMapLocation = gl.getUniformLocation(
             this.program,
             "u_shadowMap"
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

    /* -------- Set lighting for shader program -------- */

    lightingUniforms(gl, lightPosition, viewMatrix) {

        const resultVec4 = glm.vec4.fromValues(lightPosition[0], lightPosition[1], lightPosition[2], 1.0);
        glm.vec4.transformMat4(resultVec4, resultVec4, viewMatrix);

        lightPosition = glm.vec3.fromValues(resultVec4[0], resultVec4[1], resultVec4[2]);

        gl.uniform3fv(
            this.locLPosition,
            lightPosition
        );
    }

    /* -------- Set shadowing for shader program -------- */

    shadowingUniforms(gl, lightMatrix, shadowMap) {
        gl.uniformMatrix4fv(
            this.locLVPTransform,
            false,
            lightMatrix
        );

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, shadowMap);

        gl.uniform1i(
            this.shadowMapLocation,
            0
        );
    }

    /* -------- Set uniforms for shader program -------- */

    setUniforms(gl, ambientProduct, diffuseProduct, specularProduct, shininess) {
        gl.uniform3fv(
            this.locAProduct,
            ambientProduct
        );

        gl.uniform3fv(
            this.locDProduct,
            diffuseProduct
        );

        gl.uniform3fv(
            this.locSProduct,
            specularProduct
        );

        gl.uniform1f(
            this.locShininess,
            shininess
        );

    }
}

export { Shader }
