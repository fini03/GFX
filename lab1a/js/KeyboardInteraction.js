import * as glm from './gl-matrix/index.js';
import { Shape } from './Shape.js';

const KEYBOARD_SENSITIVITY = 0.05; // Constant to represent the sensitivity of the keyboard input
const DECREASE_FACTOR = 0.9;
const INCREASE_FACTOR = 1.1;
const ROTATION_ANGLE = Math.PI / 180 * 5; // Rotate 5 degrees per key press
const TRANSLATION_FACTOR = 0.1;

const modes = {
    MODE_CAMERA: 0, // Changes apply only on the camera
    MODE_GLOBAL: 1, // Changes apply on every shape
    MODE_LOCAL: 2 // Changes only apply on the selected shape
};

class KeyboardInteraction {
    // Fields
    #selectedObject = null;
    #mode = modes.MODE_CAMERA;
    #index = -1;
    #objects = [];

    /* -------- Register keybord events for movement -------- */

    registerEvents(camera, objects, globalTransformationMatrix, coordSystem) {
        this.#objects = objects;
        document.addEventListener('keydown', (event) => this.#handleKeyDown(event, camera, objects, globalTransformationMatrix, coordSystem));
    }

    /* -------- Replace selected object with loaded .obj-file -------- */

    replaceObject(newObject) {
        if (this.#selectedObject === null) {
            alert("You have to select an object first!");
            return;
        }

        this.#selectedObject.copyTransforms(newObject);
        this.#objects[this.#index] = newObject;
        this.#selectedObject = newObject;
    }
    
    /* -------- Display OCS on selected object -------- */

    #selectObject(newObjectSelection, coordSystem) {
        if(this.#selectedObject !== null) {
            this.#selectedObject.coordSystem = null;
        }
        if(newObjectSelection !== null) {
            newObjectSelection.coordSystem = coordSystem;
        }
        this.#selectedObject = newObjectSelection;
    }

    /* -------- Handle keyboard input -------- */

    #handleKeyDown(event, camera, objects, globalTransformationMatrix, coordSystem) {
        // Activate CAMERA_MODE
        if (event.code === 'Space') {
            this.#selectObject(null, coordSystem);
            this.#mode = modes.MODE_CAMERA;
            return;
        }

        // Selection
        if(isFinite(event.key)) {
            const index = parseInt(event.key);

            if (index === 0) {
                this.#selectObject(null, coordSystem);
                this.#mode = modes.MODE_GLOBAL;
            } else {
                this.#index = index - 1;
                this.#selectObject(objects[this.#index], coordSystem);
                this.#mode = modes.MODE_LOCAL;
            }

            return;
        }

        if (this.#mode === modes.MODE_CAMERA) {

            /* -------- Applying the changes on camera -------- */

            switch(event.key) {
                 // Camera translations
                case 'ArrowUp':
                    // Moves camera up -> positve yAxis
                    camera.translateCamera(0, KEYBOARD_SENSITIVITY);
                    break;
                case 'ArrowDown':
                    // Moves camera down -> negative yAxis
                    camera.translateCamera(0, -KEYBOARD_SENSITIVITY);
                    break;
                case 'ArrowLeft':
                    // Moves camera right -> negative xAxis
                    camera.translateCamera(-KEYBOARD_SENSITIVITY, 0);
                    break;
                case 'ArrowRight':
                    // Moves camera left -> positve xAxis
                    camera.translateCamera(KEYBOARD_SENSITIVITY, 0);
                    break;
            }
        } else if (this.#mode === modes.MODE_LOCAL) {

            /* --------- Applying the changes on selected object  --------- */

            switch(event.key) {
                // Scaling
                case 'a':
                    // Decrease width with DECREASE_FACTOR
                    this.#selectedObject.scale(glm.vec3.fromValues(DECREASE_FACTOR, 1, 1));
                    break;
                case 'A':
                    // Increase width with INCREASE_FACTOR
                    this.#selectedObject.scale(glm.vec3.fromValues(INCREASE_FACTOR, 1, 1));
                    break;
                case 'b':
                    // Decrease height with DECREASE_FACTOR
                    this.#selectedObject.scale(glm.vec3.fromValues(1, DECREASE_FACTOR, 1));
                    break;
                case 'B':
                    // Increase height with INCREASE_FACTOR
                    this.#selectedObject.scale(glm.vec3.fromValues(1, INCREASE_FACTOR, 1));
                    break;
                case 'c':
                    // Decrease depth with DECREASE_FACTOR
                    this.#selectedObject.scale(glm.vec3.fromValues(1, 1, DECREASE_FACTOR));
                    break;
                case 'C':
                    // Increase depth with INCREASE_FACTOR
                    this.#selectedObject.scale(glm.vec3.fromValues(1, 1, INCREASE_FACTOR));
                    break;

                // Rotations
                case 'i':
                    // Rotate cw about the xAxis
                    this.#selectedObject.rotate('x', -ROTATION_ANGLE);
                    break;
                case 'k':
                    // Rotate ccw about the xAxis
                    this.#selectedObject.rotate('x', ROTATION_ANGLE);
                    break;
                case 'o':
                    // Rotate cw about the yAxis
                    this.#selectedObject.rotate('y', -ROTATION_ANGLE);
                    break;
                case 'u':
                    // Rotate ccw about the yAxis
                    this.#selectedObject.rotate('y', ROTATION_ANGLE);
                    break;
                case 'l':
                    // Rotate cw about the zAxis
                    this.#selectedObject.rotate('z', -ROTATION_ANGLE);
                    break;
                case 'j':
                    // Rotate ccw about the zAxis
                    this.#selectedObject.rotate('z', ROTATION_ANGLE);
                    break;

                 // Shape translations
                case 'ArrowUp':
                    // Moves shape up
                    this.#selectedObject.translate(glm.vec3.fromValues(0, TRANSLATION_FACTOR, 0));
                    break;
                case 'ArrowDown':
                    // Moves shape down
                    this.#selectedObject.translate(glm.vec3.fromValues(0, -TRANSLATION_FACTOR, 0));
                    break;
                case 'ArrowLeft':
                    // Moves shape left
                    this.#selectedObject.translate(glm.vec3.fromValues(-TRANSLATION_FACTOR, 0, 0));
                    break;
                case 'ArrowRight':
                    // Moves shape right
                    this.#selectedObject.translate(glm.vec3.fromValues(TRANSLATION_FACTOR, 0, 0));
                    break;
                case ',':
                    // Moves shape forwards
                    this.#selectedObject.translate(glm.vec3.fromValues(0, 0, TRANSLATION_FACTOR));
                    break;
                case '.':
                    // Moves shape backwards
                    this.#selectedObject.translate(glm.vec3.fromValues(0, 0, -TRANSLATION_FACTOR));
                    break;
            }
        } else if (this.#mode === modes.MODE_GLOBAL) {

            /* --------- Initialize matrices --------- */

            const scaleMatrix = glm.mat4.create();
            const rotationMatrix = glm.mat4.create();
            const translateMatrix = glm.mat4.create();

            /* --------- Applying the changes on all objects  --------- */

            switch (event.key) {
                // Scaling
                case 'a':
                    // Decrease width with DECREASE_FACTOR
                    glm.mat4.scale(scaleMatrix, scaleMatrix, glm.vec3.fromValues(DECREASE_FACTOR, 1, 1));
                    glm.mat4.multiply(globalTransformationMatrix, scaleMatrix, globalTransformationMatrix);
                    break;
                case 'A':
                    // Increase width with INCREASE_FACTOR
                    glm.mat4.scale(scaleMatrix, scaleMatrix, glm.vec3.fromValues(INCREASE_FACTOR, 1, 1));
                    glm.mat4.multiply(globalTransformationMatrix, scaleMatrix, globalTransformationMatrix);
                    break;
                case 'b':
                    // Decrease height with DECREASE_FACTOR
                    glm.mat4.scale(scaleMatrix, scaleMatrix, glm.vec3.fromValues(1, DECREASE_FACTOR, 1));
                    glm.mat4.multiply(globalTransformationMatrix, scaleMatrix, globalTransformationMatrix);
                    break;
                case 'B':
                    // Increase height with INCREASE_FACTOR
                    glm.mat4.scale(scaleMatrix, scaleMatrix, glm.vec3.fromValues(1, INCREASE_FACTOR, 1));
                    glm.mat4.multiply(globalTransformationMatrix, scaleMatrix, globalTransformationMatrix);
                    break;
                case 'c':
                    // Decrease depth with DECREASE_FACTOR
                    glm.mat4.scale(scaleMatrix, scaleMatrix, glm.vec3.fromValues(1, 1, DECREASE_FACTOR));
                    glm.mat4.multiply(globalTransformationMatrix, scaleMatrix, globalTransformationMatrix);
                    break;
                case 'C':
                    // Increase depth with INCREASE_FACTOR
                    glm.mat4.scale(scaleMatrix, scaleMatrix, glm.vec3.fromValues(1, 1, INCREASE_FACTOR));
                    glm.mat4.multiply(globalTransformationMatrix, scaleMatrix, globalTransformationMatrix);
                    break;

                // Rotations
                case 'i':
                    // Rotate cw about the xAxis
                    glm.mat4.rotateX(rotationMatrix, rotationMatrix, -ROTATION_ANGLE);
                    glm.mat4.multiply(globalTransformationMatrix, rotationMatrix, globalTransformationMatrix);
                    break;
                case 'k':
                    // Rotate ccw about the xAxis
                    glm.mat4.rotateX(rotationMatrix, rotationMatrix, ROTATION_ANGLE);
                    glm.mat4.multiply(globalTransformationMatrix, rotationMatrix, globalTransformationMatrix);
                    break;
                case 'o':
                    // Rotate cw about the yAxis
                    glm.mat4.rotateY(rotationMatrix, rotationMatrix, -ROTATION_ANGLE);
                    glm.mat4.multiply(globalTransformationMatrix, rotationMatrix, globalTransformationMatrix);
                    break;
                case 'u':
                    // Rotate ccw about the yAxis
                    glm.mat4.rotateY(rotationMatrix, rotationMatrix, ROTATION_ANGLE);
                    glm.mat4.multiply(globalTransformationMatrix, rotationMatrix, globalTransformationMatrix);
                    break;
                case 'l':
                    // Rotate cw about the zAxis
                    glm.mat4.rotateZ(rotationMatrix, rotationMatrix, -ROTATION_ANGLE);
                    glm.mat4.multiply(globalTransformationMatrix, rotationMatrix, globalTransformationMatrix);
                    break;
                case 'j':
                    // Rotate ccw about the zAxis
                    glm.mat4.rotateZ(rotationMatrix, rotationMatrix, ROTATION_ANGLE);
                    glm.mat4.multiply(globalTransformationMatrix, rotationMatrix, globalTransformationMatrix);
                    break;

                 // Shape translations
                case 'ArrowUp':
                    // Moves everything up
                    glm.mat4.translate(translateMatrix, translateMatrix, glm.vec3.fromValues(0, TRANSLATION_FACTOR, 0));
                    glm.mat4.multiply(globalTransformationMatrix, translateMatrix, globalTransformationMatrix);
                    break;
                case 'ArrowDown':
                    // Moves everything down
                    glm.mat4.translate(translateMatrix, translateMatrix, glm.vec3.fromValues(0, -TRANSLATION_FACTOR, 0));
                    glm.mat4.multiply(globalTransformationMatrix, translateMatrix, globalTransformationMatrix);
                    break;
                case 'ArrowLeft':
                    // Moves everything left
                    glm.mat4.translate(translateMatrix, translateMatrix, glm.vec3.fromValues(-TRANSLATION_FACTOR, 0, 0));
                    glm.mat4.multiply(globalTransformationMatrix, translateMatrix, globalTransformationMatrix);
                    break;
                case 'ArrowRight':
                    // Moves everything right
                    glm.mat4.translate(translateMatrix, translateMatrix, glm.vec3.fromValues(TRANSLATION_FACTOR, 0, 0));
                    glm.mat4.multiply(globalTransformationMatrix, translateMatrix, globalTransformationMatrix);
                    break;
                case ',':
                    // Moves everything forwards
                    glm.mat4.translate(translateMatrix, translateMatrix, glm.vec3.fromValues(0, 0, TRANSLATION_FACTOR));
                    glm.mat4.multiply(globalTransformationMatrix, translateMatrix, globalTransformationMatrix);
                    break;
                case '.':
                    // Moves everything backwards
                    glm.mat4.translate(translateMatrix, translateMatrix, glm.vec3.fromValues(0, 0, -TRANSLATION_FACTOR));
                    glm.mat4.multiply(globalTransformationMatrix, translateMatrix, globalTransformationMatrix);
                    break;
           }
        }
    }

    getMode() {
        return this.#mode;
    }
}

export { KeyboardInteraction }
