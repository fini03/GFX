import * as glm from './gl-matrix/index.js'

class Shape {
    // Fields
    vaoIndex = -1; // Index of vertex array object
    #scalingMatrix;
    #rotationTranslationMatrix;
    #boundingBoxTransform;

    constructor(vertices, indices, colors, boundingBoxTransform) {
        this.vertices = vertices;
        this.indices = indices;
        this.colors = colors;
        this.coordSystem = null;
        this.#scalingMatrix = glm.mat4.create();
        this.#rotationTranslationMatrix = glm.mat4.create();
        this.#boundingBoxTransform = boundingBoxTransform;
    }

    /* -------- Initialize & bind buffers -------- */

    initBuffersAndVAO(gl, shader) {
        this.#createAndBindVAO(gl);

        this.#createAndBindVertexBuffer(gl);
        this.#enableAndBindVertexAttribs(gl, shader);
        this.#createAndBindColorBuffer(gl);
        this.#enableAndBindColorAttribs(gl, shader);
        this.#createAndBindIndexBuffer(gl);
    }

     /* -------- Create & bind VAO -------- */

    #createAndBindVAO(gl) {
        this.vaoIndex = gl.createVertexArray();
        gl.bindVertexArray(this.vaoIndex);

    }

    /* -------- Create & bind vertex buffer -------- */

    #createAndBindVertexBuffer(gl) {
        const vertexBuffer = gl.createBuffer();
         // We use ARRAY_BUFFER for coordinates
         gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
         // Store the data in the buffer
         gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.vertices),
            gl.STATIC_DRAW
         );
    }

    /* -------- Create & bind color buffer -------- */

    #createAndBindColorBuffer(gl) {
        const colorBuffer = gl.createBuffer();
        // We use ARRAY_BUFFER for colors
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(this.colors),
            gl.STATIC_DRAW
        );
    }

    /* -------- Create & bind index buffer -------- */

    #createAndBindIndexBuffer(gl) {
        const indexBuffer = gl.createBuffer();
        // We use ELEMENT_ARRAY_BUFFER for indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        // Store the data in the buffer
        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(this.indices),
            gl.STATIC_DRAW
        );

    }

    /* -------- Enable & bind vertex attributes -------- */

    #enableAndBindVertexAttribs(gl, shader) {
        gl.enableVertexAttribArray(shader.locACoord);

        // Specify coordinate formate for vertex shader attribute
        gl.vertexAttribPointer(
            shader.locACoord,
            3, // size for one coordinate, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset
        );
    }

     /* -------- Enable & bind color attributes -------- */

    #enableAndBindColorAttribs(gl, shader) {
        gl.enableVertexAttribArray(shader.locAColor);

        gl.vertexAttribPointer(
            shader.locAColor,
            3, // size for one color, vec3
            gl.FLOAT, // specify the data type of our coords
            false,
            0, // stride * sizeof float
            0 // offset * sizeof float
        );
    }

     /* -------- Update the scene after changes -------- */

    update(gl, shader, isCoordSystem) {
        const modelMatrix = glm.mat4.create();

        // Matrix transformations are read from right to left:
        // positionTranslationMatrix * rotationTranslationMatrix * scalingMatrix
        if (!isCoordSystem) {
            console.log(this.#boundingBoxTransform);
            glm.mat4.multiply(modelMatrix, this.#boundingBoxTransform, modelMatrix); // Bounding box centering/scaling
        }

        glm.mat4.multiply(modelMatrix, this.#scalingMatrix, modelMatrix); // Scales the object
        glm.mat4.multiply(modelMatrix, this.#rotationTranslationMatrix, modelMatrix); // Rotates and translates the object

        gl.uniformMatrix4fv(
            shader.locUTransform,
            false,
            modelMatrix
        );
    }

    /* -------- Scale method for shapes -------- */

    scale(scalingVector) {
        glm.mat4.scale(this.#scalingMatrix, this.#scalingMatrix, scalingVector);
    }

    /* -------- Rotate method for shapes -------- */

    rotate(axis, angle) {
        switch (axis) {
            case 'x':
                glm.mat4.rotateX(this.#rotationTranslationMatrix, this.#rotationTranslationMatrix, angle);
                break;
            case 'y':
                glm.mat4.rotateY(this.#rotationTranslationMatrix, this.#rotationTranslationMatrix, angle);
                break; 
            case 'z':
                glm.mat4.rotateZ(this.#rotationTranslationMatrix, this.#rotationTranslationMatrix, angle);
                break; 
        }
    }

    /* -------- Translate method for shapes -------- */

    translate(translationVector) {
        glm.mat4.translate(this.#rotationTranslationMatrix, this.#rotationTranslationMatrix, translationVector);
    }

    /* -------- Copy and apply the changes on the new shape -------- */

    copyTransforms(newShape) {
        newShape.#scalingMatrix = this.#scalingMatrix;
        newShape.#rotationTranslationMatrix = this.#rotationTranslationMatrix;
        newShape.coordSystem = this.coordSystem;
    }

    /* -------- Draw shape -------- */

    draw(gl, shader) {
        this.update(gl, shader, false);

        gl.bindVertexArray(this.vaoIndex);

        gl.drawElements(
            gl.TRIANGLES, // <- indexBuffer contains TRIANGLES
            this.indices.length,
            gl.UNSIGNED_SHORT, // <- Uint16Array
            0 // Offset, 0 means we don't skip anything
        );

        if (this.coordSystem !== null) {
            this.update(gl, shader, true);
            this.coordSystem.drawCoordSystem(gl);
        }
    }

    /* -------- Draw coordinate system -------- */

    drawCoordSystem(gl) {
        gl.bindVertexArray(this.vaoIndex);

        gl.drawElements(
            gl.LINES, // <- indexBuffer contains LINES
            this.indices.length,
            gl.UNSIGNED_SHORT, // <- Uint16Array
            0 // Offset, 0 means we don't skip anything
        );
    }
}

export { Shape }
