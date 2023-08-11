/* -------- Creating a shader to display -------- */

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

/* --------  Creating a shader program object to store the combined shader -------- */

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

export { createShader, createProgram };
