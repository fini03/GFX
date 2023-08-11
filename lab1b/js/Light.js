import * as glm from './gl-matrix/index.js';

class Light {

   constructor(lightPosition) {
        this.lightPosition = lightPosition;
        this.viewMatrix = this.#initViewMatrix(lightPosition);
    }

    #initViewMatrix(position) {
        const viewMatrix = glm.mat4.create();
        const target = glm.vec3.create();
        glm.mat4.lookAt(viewMatrix, position, target, [0, 0, -1]);

        return viewMatrix;
    }

    translate(xAxis, yAxis, zAxis) {
        glm.vec3.add(this.lightPosition, this.lightPosition, glm.vec3.fromValues(xAxis, yAxis, zAxis));
        this.viewMatrix = this.#initViewMatrix(this.lightPosition);
    }

    rotate(axis, angle) {
        switch (axis) {
            case 'x':
                glm.vec3.rotateX(this.lightPosition, this.lightPosition, glm.vec3.fromValues(0.0, 0.0, 0.0), angle);
                break;
            case 'y':
                glm.vec3.rotateY(this.lightPosition, this.lightPosition, glm.vec3.fromValues(0.0, 0.0, 0.0), angle);
                break;
            case 'z':
                glm.vec3.rotateZ(this.lightPosition, this.lightPosition, glm.vec3.fromValues(0.0, 0.0, 0.0), angle);
                break;
        }
        this.viewMatrix = this.#initViewMatrix(this.lightPosition);
    }
}

export { Light };
