/**
 * Creating a shader to display
 *
 * @param {WebGLRenderingContext} gl - WebGL rendering context
 * @param {number} type - Type of shader to create
 * @param {string} source - Source code for the shader
 * @returns {WebGLShader} - Created shader
 */
const createShader = (gl, type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // If the shader compiles return the shader
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }

    console.log(gl.getShaderInfoLog(shader));

    // Delete the shader if it doesn't compile
    gl.deleteShader(shader);
}
/**
 * Creating a shader program object to store the combined shader
 *
 * @param {WebGLRenderingContext} gl - WebGL rendering context
 * @param {WebGLShader} vertexShader - Vertex shader
 * @param {WebGLShader} fragmentShader - Fragment shader
 * @returns {WebGLProgam} - Created shader program
 */
const createProgram = (gl, vertexShader, fragmentShader) => {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }

    console.log(gl.getShaderInfoLog(program));

    // Delete the program if it doesn't compile
    gl.deleteProgram(program);
}

// Initializes and runs WebGL program
const main = async () => {
    const canvas = document.querySelector("#glcanvas");
    console.log(canvas);

    const gl = canvas.getContext("webgl");

    // Resizes a given WebGL canvas to match the size of it's display area
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
    // Check if WebGL is availabe in the browser
    if(gl === null) {
        console.log("WebGL is not available in this browser");
        return;
    }
    
    // Fetching the source code for the vertex shader
    const vertShaderSrc = await fetch('shaders/basic.vert')
        .then(response => response.text());
    // Creating and compiling the vertex shader
    const vertShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertShaderSrc
    );
    
    // Fetching the source code for the fragment shader
    const fragShaderSrc = await fetch('shaders/basic.frag')
        .then(response => response.text());
    // Creating and compiling the vertex shader
    const fragShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragShaderSrc
     );

    // Creating the shader program
    const shaderProgram = createProgram(gl, vertShader, fragShader);

    const coordAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "a_coords"
    );
    
    const colorAttributeLocation = gl.getAttribLocation(
        shaderProgram,
        "a_color"
    );

    const vertices = [
        // First three are the coords and the others are the RGB values (divison in the shader)
        0.0, 0.5, 0.0, 179.0, 153.0, 212.0,
        0.5, -0.5, 0.0, 245.0, 225.0, 253.0,
       -0.5, -0.5, 0.0, 206.0, 157.0, 217.0
    ];

    const indices = [
        0, 2, 1
    ];

    const vertexBuffer = gl.createBuffer();
    // We use ARRAY_BUFFER for coordinates
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // Store the data in the buffer
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertices),
        gl.STATIC_DRAW
    );

    const indexBuffer = gl.createBuffer();
    // We use ELEMENT_ARRAY_BUFFER for indices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    // Store the data in the buffer
    gl.bufferData(
        gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), // gl.UNSIGNED_SHORT
        gl.STATIC_DRAW
    );

    // Clear the screen with black color
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our shader program
    gl.useProgram(shaderProgram);
    gl.enableVertexAttribArray(coordAttributeLocation);
    gl.enableVertexAttribArray(colorAttributeLocation);

    // Bind all buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // Specify coordinate formate for vertex shader attribute
    gl.vertexAttribPointer(
        coordAttributeLocation,
        3, // size for one coordinate, vec3
        gl.FLOAT, // specify the data type of our coords
        false,
        6 * 4, // stride * sizeof float
        0 // offset * sizeof float
    );

    gl.vertexAttribPointer(
        colorAttributeLocation,
        3, // size for one coordinate, vec3
        gl.FLOAT, // specify the data type of our coords
        false,
        6 * 4, // stride * sizeof float
        3 * 4 // offset * sizeof float
    );

    // Draw
    gl.drawElements(
        gl.TRIANGLES, // <- this means indexBuffer contains triangles
        indices.length,
        gl.UNSIGNED_SHORT, // <- because we used Uint16Array before 
        0 // offset, 0 means we're not skipping anything
    );
}

main();
