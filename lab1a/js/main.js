import  { Shader } from './Shader.js';
import  { ShapeGenerator } from './ShapeGenerator.js';
import  { Camera } from './Camera.js';
import  { MouseInteraction } from './MouseInteraction.js';
import { KeyboardInteraction } from './KeyboardInteraction.js';
import { OBJParser } from './OBJParser.js';
import * as glm from './gl-matrix/index.js';

const main = async () => {

    /* -------- Instantiation -------- */

    const sBase = new Shader("basic");
    const shapeGenerator = new ShapeGenerator();
    const camera = new Camera();
    const keyboardInteraction = new KeyboardInteraction();
    const mouseInteraction = new MouseInteraction();

    /* --------- Initialize matrices and objects --------- */

    const projectionMatrix = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();

    const objects = []; // Array to store generated objects

    /* --------- Basic setup --------- */

    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Check if WebGL is available in the browser
    if (gl === null) {
        console.log("WebGL is not available in this browser");
        return;
    }

    console.log(canvas);

    /* --------- Load shader --------- */

    await sBase.loadAndCompile(gl);

    /* --------- Initialize the coordinate system of the objects --------- */

    const coordSystem = shapeGenerator.generateCoordSystem();
    coordSystem.translate([0.0, 0.0, 0.0]);
    coordSystem.initBuffersAndVAO(gl, sBase);

    /* --------- Initialize the objects to be drawn --------- */

    objects.push(shapeGenerator.generateTetrahedron());
    objects[0].translate([-3.0, 2.5, 0.0]);

    objects.push(shapeGenerator.generateTetrahedron());
    objects[1].translate([0.0, 2.5, 0.0]);

    objects.push(shapeGenerator.generateTetrahedron());
    objects[2].translate([3.0, 2.5, 0.0]);

    objects.push(shapeGenerator.generateCube());
    objects[3].translate([-3.0, 0.0, 0.0]);

    objects.push(shapeGenerator.generateCube());
    objects[4].translate([0.0, 0.0, 0.0]);

    objects.push(shapeGenerator.generateCube());
    objects[5].translate([3.0, 0.0, 0.0]);

    objects.push(shapeGenerator.generateCube());
    objects[6].translate([-3.0, -2.5, 0.0]);

    objects.push(shapeGenerator.generateTetrahedron());
    objects[7].translate([0.0, -2.5, 0.0]);

    objects.push(shapeGenerator.generateCube());
    objects[8].translate([3.0, -2.5, 0.0]);

    /* --------- Register keyboard and mouse events --------- */

    keyboardInteraction.registerEvents(camera, objects, globalTransformationMatrix, coordSystem);
    mouseInteraction.registerEvents(canvas, camera);

    /* --------- Load .obj-files from filesystem --------- */

    // Add an event listener to the "file-input-btn" button that triggers when it's clicked
    document.getElementById('file-input-btn').addEventListener('click', async () => {
        const objParser = new OBJParser();
        const fileInput = document.createElement('input');

        fileInput.type = 'file'; // Set the type of the file input element to "file"
        fileInput.accept = '.obj'; // Only allow files with the ".obj" extension to be selected

        try {
            // Wait for the user to select a file using the file input element
            const [file] = await new Promise((resolve, reject) => {
                fileInput.addEventListener('change', (event) => {
                    const { files } = event.target; // Get the selected file
                    // If at least one file was selected, resolve the promise with the selected file(s)
                    if (files.length > 0) {
                        resolve(files);
                    } else {
                        reject(new Error('No file selected.'));
                    }
                });
                fileInput.click();
            });

            // Load the selected OBJ file using the OBJParser object
            const data = await objParser.loadOBJFile(file);

            const shape = shapeGenerator.createShapeFromOBJFile(data, glm.vec3.fromValues(0.0, 0.0, 0.0));
            shape.initBuffersAndVAO(gl, sBase);
            keyboardInteraction.replaceObject(shape);

        } catch (error) {
            console.error(error);
        }
    });

    /* --------- Build VAOs for all objects with base shader --------- */

    objects.forEach(eachObject => {
        eachObject.initBuffersAndVAO(gl, sBase);
    });

    /* --------- Initializes projection matrix --------- */

    glm.mat4.perspective(
        projectionMatrix, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        gl.canvas.clientWidth / gl.canvas.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    /* --------- Updating view matrix --------- */

    const updateViewMatrix = () => {
        glm.mat4.multiply(updatedViewMatrix, camera.viewMatrix, globalTransformationMatrix);
    }

     /* --------- Scaling WCS --------- */

    coordSystem.scale(glm.vec3.fromValues(4.0, 4.0, 4.0));

    /* --------- Draw --------- */

    const draw = () => {
        // Clear the screen with color
        gl.clearColor(38.0 / 255.0, 12.0 / 255.0, 16.0 / 255.0, 1.0);

        gl.clearDepth(1.0); // Clear everything
        gl.enable(gl.DEPTH_TEST); // Enable depth testing
        gl.depthFunc(gl.LEQUAL); // Near things obscure far things

        // Clear the color and depth buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // Update the view matrix based on camera position and orientation
        updateViewMatrix();

        // Bind the shader program and set the projection and view matrices as uniforms
        sBase.bind(gl);
        sBase.uniformMatrices(gl, projectionMatrix, updatedViewMatrix);

        // Draw all the objects in the scene
        objects.forEach(eachObject => {
            eachObject.draw(gl, sBase);
        });

        if (keyboardInteraction.getMode() === 1) {
            coordSystem.update(gl, sBase, false);
            coordSystem.drawCoordSystem(gl);
        }

        window.requestAnimationFrame(draw);
    };

    window.requestAnimationFrame(draw);
    window.addEventListener('load', main);
}

main();
