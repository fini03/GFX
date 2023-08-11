import * as glm from './gl-matrix/index.js';

class Camera {
    #eye = glm.vec3.fromValues(0.0, 0.0, 10.0);

    constructor() {
        this.viewMatrix = this.#initViewMatrix(this.#eye);
    }

    /* -------- Initialize camera's view matrix based on the eye position -------- */

    #initViewMatrix(eye) {
        const viewMatrix = glm.mat4.create();
        const target = glm.vec3.create();
        glm.vec3.add(target, eye, glm.vec3.fromValues(0, 0, -1));
        glm.mat4.lookAt(viewMatrix, eye, target, [0, 1, 0]);
       
        return viewMatrix;
    }

    /* -------- Translate camera based on the x and y axis values -------- */

    translateCamera(xAxis, yAxis) {
        glm.vec3.add(this.#eye, this.#eye, glm.vec3.fromValues(xAxis, yAxis, 0));
        this.viewMatrix = this.#initViewMatrix(this.#eye);
    }

    /* -------- Translate without modifying the camera's original position -------- */
    
    translateCameraForMouse(xAxis, yAxis) {
        const eye = glm.vec3.create();
        glm.vec3.add(eye, this.#eye, glm.vec3.fromValues(xAxis, yAxis, 0));
        this.viewMatrix = this.#initViewMatrix(eye);
    }
}

export { Camera }
