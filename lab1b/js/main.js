import  { Shader } from './Shader.js';
import  { ShapeGenerator } from './ShapeGenerator.js';
import  { Camera } from './Camera.js';
import  { Light } from './Light.js';
import  { MouseInteraction } from './MouseInteraction.js';
import { KeyboardInteraction } from './KeyboardInteraction.js';
import { OBJParser } from './OBJParser.js';
import * as glm from './gl-matrix/index.js';

    let showShadows = false;

    const toggleShadows = (shadow) => {
        showShadows = shadow;
    }

const main = async () => {

    /* -------- Instantiation -------- */

    const sBase = new Shader("basic", "basic");
    const sBaseGD = new Shader("gouraudWithDiffuse", "gouraud");
    const sBaseGS = new Shader("gouraudWithSpecular", "gouraud");
    const sBaseGDS = new Shader("gouraudWithDiffuseShadow", "gouraudShadow");
    const sBaseGSS = new Shader("gouraudWithSpecularShadow", "gouraudShadow");
    const sBasePD = new Shader("phong", "phongWithDiffuse");
    const sBasePS = new Shader("phong", "phongWithSpecular");
    const sBasePDS = new Shader("phongShadow", "phongWithDiffuseShadow");
    const sBasePSS = new Shader("phongShadow", "phongWithSpecularShadow");

    const objParser = new OBJParser();
    const shapeGenerator = new ShapeGenerator();
    const camera = new Camera();
    const keyboardInteraction = new KeyboardInteraction();
    const mouseInteraction = new MouseInteraction();

    /* --------- Initialize shading values --------- */

    const light = new Light(glm.vec3.fromValues(0.0, 10, 0.0));
    const ambientProduct = glm.vec3.fromValues(0.4, 0.4, 0.4);
    const diffuseProduct = glm.vec3.fromValues(0.7, 0.7, 0.7);
    const specularProduct = glm.vec3.fromValues(1.0, 1.0, 1.0);
    const shininess = 42.0;

    /* --------- Initialize matrices and objects --------- */

    const projectionMatrixFromCamera = glm.mat4.create();
    const projectionMatrixFromLight = glm.mat4.create();
    const globalTransformationMatrix = glm.mat4.create();
    const updatedViewMatrix = glm.mat4.create();

    const objects = []; // Array to store generated objects
    const shaders = new Map(); // Array to store loaded shaders

    /* --------- Basic setup --------- */

    const canvas = document.querySelector("#glcanvas");
    const gl = canvas.getContext("webgl2");

    // Check if WebGL is available in the browser
    if (gl === null) {
        console.log("WebGL is not available in this browser");
        return;
    }

    console.log(canvas);

    /* --------- Load shader --------- */

    await sBase.loadAndCompile(gl);
    shaders.set('sBase', sBase);

    await sBaseGD.loadAndCompile(gl);
    shaders.set('sBaseGD', sBaseGD);

    await sBaseGS.loadAndCompile(gl);
    shaders.set('sBaseGS', sBaseGS);

    await sBasePD.loadAndCompile(gl);
    shaders.set('sBasePD', sBasePD);

    await sBasePS.loadAndCompile(gl);
    shaders.set('sBasePS', sBasePS);

    await sBaseGDS.loadAndCompile(gl);
    shaders.set('sBaseGDS', sBaseGDS);

    await sBaseGSS.loadAndCompile(gl);
    shaders.set('sBaseGSS', sBaseGSS);

    await sBasePDS.loadAndCompile(gl);
    shaders.set('sBasePDS', sBasePDS);

    await sBasePSS.loadAndCompile(gl);
    shaders.set('sBasePSS', sBasePSS);

    /* --------- Initialize the ground plane --------- */

    const plane = shapeGenerator.generateGroundPlane();
    plane.translate([0.0, -3.5, 0.0]);
    plane.initBuffersAndVAO(gl, sBaseGD);

    /* --------- Initialize the objects to be drawn --------- */

    const teddy = await fetch('/sampleModels/teddy.obj')
        .then(response => response.text());

    const teapot = await fetch('/sampleModels/teapot.obj')
        .then(response => response.text());

    const sphere = await fetch('/sampleModels/sphere.obj')
        .then(response => response.text());

    const teddyData = objParser.parse(teddy);
    const teapotData = objParser.parse(teapot);
    const sphereData = objParser.parse(sphere);

    objects.push(shapeGenerator.createShapeFromOBJFile(teddyData));
    objects[0].translate([-3.0, 2.5, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(teapotData));
    objects[1].translate([0.0, 2.5, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(sphereData));
    objects[2].translate([3.0, 2.5, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(sphereData));
    objects[3].translate([-3.0, 0.0, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(teddyData));
    objects[4].translate([0.0, 0.0, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(teapotData));
    objects[5].translate([3.0, 0.0, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(teapotData));
    objects[6].translate([-3.0, -2.5, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(sphereData));
    objects[7].translate([0.0, -2.5, 0.0]);

    objects.push(shapeGenerator.createShapeFromOBJFile(teddyData));
    objects[8].translate([3.0, -2.5, 0.0]);

    /* --------- Register keyboard and mouse events --------- */

    keyboardInteraction.registerEvents(camera, light, objects, shaders, globalTransformationMatrix);
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
            shape.initBuffersAndVAO(gl, sBaseGD);
            keyboardInteraction.replaceObject(shape);

        } catch (error) {
            console.error(error);
        }
    });

    /* --------- Build VAOs for all objects with base shader --------- */

    objects.forEach(eachObject => {
        eachObject.initBuffersAndVAO(gl, sBaseGD);
    });

    /* --------- Initializes projection matrix --------- */

    glm.mat4.perspective(
        projectionMatrixFromCamera, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        gl.canvas.clientWidth / gl.canvas.clientHeight, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    glm.mat4.perspective(
        projectionMatrixFromLight, // Output
        (45 * Math.PI) / 180, // Field of view in radians
        1024 / 1024, // Aspect ratio
        0.1, // Near
        100.0 // Far
    );

    /* --------- Updating view matrix --------- */

    const updateLightViewMatrix = () => {
        glm.mat4.multiply(updatedViewMatrix, light.viewMatrix, globalTransformationMatrix);
        glm.mat4.multiply(lightMatrix, projectionMatrixFromLight, updatedViewMatrix);
    }

    const updateCameraViewMatrix = () => {
        glm.mat4.multiply(updatedViewMatrix, camera.viewMatrix, globalTransformationMatrix);
    }

    /* -------- Create & bind FBO -------- */

    const shadowFBO = gl.createFramebuffer();

    /* -------- Create & bind texture -------- */

    const shadowTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, shadowTexture);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1024, 1024, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

     /* -------- Attach texture to shadow -------- */

    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, shadowTexture, 0);

    const renderBuffer = gl.createRenderbuffer()
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer)
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, 1024, 1024);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer)
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const lightMatrix = glm.mat4.create();
    glm.mat4.multiply(lightMatrix, projectionMatrixFromLight, light.viewMatrix);

    /* --------- Draw --------- */

    let shader;
    const draw = () => {
        if(showShadows) {
            // Clear the screen with color
            gl.clearColor(1.0, 1.0, 1.0, 1.0);

            gl.clearDepth(1.0); // Clear everything
            gl.enable(gl.CULL_FACE);
            gl.enable(gl.DEPTH_TEST); // Enable depth testing
            gl.depthFunc(gl.LEQUAL); // Near things obscure far things

            gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO);
            gl.viewport(0, 0, 1024, 1024);

            // Clear the color and depth buffers
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.cullFace(gl.FRONT);

            // Update the view matrix based on camera position and orientation
            updateLightViewMatrix();

            // Bind the shader program and set the projection and view matrices as uniforms
            shader = shaders.get('sBase');
            shader.bind(gl);
            shader.uniformMatrices(gl, projectionMatrixFromLight, updatedViewMatrix);

            // Draw all the objects in the scene
            objects.forEach(eachObject => {
                shader.lightingUniforms(gl, light.lightPosition, light.viewMatrix);
                shader.setUniforms(gl, ambientProduct, diffuseProduct, specularProduct, shininess);
                eachObject.draw(gl, shader, updatedViewMatrix);
            });

            plane.draw(gl, shader, updatedViewMatrix);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            gl.cullFace(gl.BACK);

            // Update the view matrix based on camera position and orientation
            updateCameraViewMatrix();

            // Bind the shader program and set the projection and view matrices as uniforms
            shader = keyboardInteraction.selectedShader();
            shader.bind(gl);
            shader.uniformMatrices(gl, projectionMatrixFromCamera, updatedViewMatrix);

            // Draw all the objects in the scene
            objects.forEach(eachObject => {
                shader.lightingUniforms(gl, light.lightPosition, camera.viewMatrix);
                shader.setUniforms(gl, ambientProduct, diffuseProduct, specularProduct, shininess);
                shader.shadowingUniforms(gl, lightMatrix, shadowTexture);
                eachObject.draw(gl, shader, updatedViewMatrix);
            });

            plane.draw(gl, shader, updatedViewMatrix);

            window.requestAnimationFrame(draw);
        } else {
            // Clear the screen with color
            gl.clearColor(38.0 / 255.0, 12.0 / 255.0, 16.0 / 255.0, 1.0);

            gl.clearDepth(1.0); // Clear everything
            gl.enable(gl.DEPTH_TEST); // Enable depth testing
            gl.depthFunc(gl.LEQUAL); // Near things obscure far things

            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            // Update the view matrix based on camera position and orientation
            updateCameraViewMatrix();

            // Bind the shader program and set the projection and view matrices as uniforms
            shader = keyboardInteraction.selectedShader();
            shader.bind(gl);
            shader.uniformMatrices(gl, projectionMatrixFromCamera, updatedViewMatrix);

            // Draw all the objects in the scene
            objects.forEach(eachObject => {
                shader.lightingUniforms(gl, light.lightPosition, camera.viewMatrix);
                shader.setUniforms(gl, ambientProduct, diffuseProduct, specularProduct, shininess);
                eachObject.draw(gl, shader, updatedViewMatrix);
            });

            plane.draw(gl, shader, updatedViewMatrix);

            window.requestAnimationFrame(draw);
        }
    };

    window.requestAnimationFrame(draw);
    window.addEventListener('load', main);
}

main();

export { toggleShadows };
