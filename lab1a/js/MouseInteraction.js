import * as glm from './gl-matrix/index.js';

const MOUSE_SENSITIVITY = 5; // Constant to represent the sensitivity of the mouse input

class MouseInteraction {
    #initialMousePosition = null;

    /* -------- Register mouse events for camera movement -------- */

    registerEvents(canvas, camera) {
        canvas.addEventListener('mousedown', (event) => this.#handleMouseDown(event));
        canvas.addEventListener('mouseup', (event) => this.#handleMouseUp(event, canvas, camera));
        canvas.addEventListener('mousemove', (event) => this.#handleMouseMove(event, canvas, camera));
        canvas.addEventListener('mouseout', (event) => this.#handleMouseUp(event, canvas, camera));
    }

    /* -------- Handle mouse input -------- */

    #handleMouseDown(event) {
        // Store the initial mouse position
        this.#initialMousePosition = glm.vec2.fromValues(event.x, event.y);
    }

    #handleMouseUp(event, canvas, camera) {
        // Save the mouse transformation
        if (this.#initialMousePosition != null) {
            const currentMousePosition = glm.vec2.fromValues(event.x, event.y);
            const mouseDelta = this.#calculateMouseDelta(canvas, currentMousePosition);
            camera.translateCamera(mouseDelta[0], -mouseDelta[1]);
        }

        // Reset the initial mouse position
        this.#initialMousePosition = null;
    }

    #handleMouseMove(event, canvas, camera) {
        // Only process if we have initialMousePosition (a mouse button is pressed)
        if (this.#initialMousePosition === null) {
            return;
        }

        const currentMousePosition = glm.vec2.fromValues(event.x, event.y);
        const mouseDelta = this.#calculateMouseDelta(canvas, currentMousePosition);

        // Translate the camera based on the mouse delta
        camera.translateCameraForMouse(mouseDelta[0], -mouseDelta[1]);
        
    }

    #calculateMouseDelta(canvas, currentMousePosition) {
        const mouseDelta = glm.vec2.create();

        // Calculate the difference between the current and initial mouse positions
        glm.vec2.sub(mouseDelta, this.#initialMousePosition, currentMousePosition);

        // Normalize the mouse delta based on the canvas size and sensitivity
        glm.vec2.divide(mouseDelta, mouseDelta, glm.vec2.fromValues(canvas.width, canvas.height));
        glm.vec2.scale(mouseDelta, mouseDelta, MOUSE_SENSITIVITY);

        return mouseDelta;
    }
}

export { MouseInteraction }

