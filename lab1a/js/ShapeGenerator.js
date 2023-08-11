import * as glm from './gl-matrix/index.js'
import  { Shape } from './Shape.js';

class ShapeGenerator {

    /* -------- Generate cube shape -------- */

    generateCube() {
        const vertices = [
            // Front face
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,

            // Back face
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            // Top face
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,

            // Right face
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,

            // Left face
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5
        ];

        const indices = [
            // Front face
            0, 1, 2,
            0, 2, 3,

            // Back face
            4, 5, 6,
            4, 6, 7,

            // Top face
            8, 9, 10,
            8, 10, 11,

            // Bottom face
            12, 13, 14,
            12, 14, 15,

            // Right face
            16, 17, 18,
            16, 18, 19,

            // Left face
            20, 21, 22,
            20, 22, 23
        ];

        const colorsArray = [
            [149.0, 191.0, 201.0],
            [247.0, 217.0, 198.0],
            [251.0, 233.0, 213.0],
            [240.0, 209.0, 226.0],
            [239.0, 170.0, 209.0],
            [161.0, 143.0, 196.0]
        ];

        const colors = [];

        for (const eachColor of colorsArray) {
            // For each color in colorsArray add it four times to the colors to represent
            // the color of each of the four vertices of the face
            colors.push(...[
                ...eachColor,
                ...eachColor,
                ...eachColor,
                ...eachColor
            ]);
        }
        return new Shape(
            vertices,
            indices,
            colors,
            glm.mat4.create()
        );
    }

    /* -------- Generate tetrahedron shape -------- */

    generateTetrahedron() {
        const vertices = [
            // Front face
            0.0, 0.8, -0.5,
            -0.8, -0.5, -0.5,
            0.8, -0.5, -0.5,

            // Right face
            0.0, 0.8, -0.5,
            0.8, -0.5, -0.5,
            0.0,  0.0, 0.8,

            // Back face
            0.0, 0.8, -0.5,
            0.0, 0.0, 0.8,
            -0.8, -0.5, -0.5,

            // Left face
            0.8, -0.5, -0.5,
            -0.8, -0.5, -0.5,
            0.0, 0.0, 0.8
        ];

        const indices = [
            0, 1, 2, // Front face
            3, 4, 5, // Right face
            6, 7, 8, // Back face
            9, 10, 11 // Left face
        ];

        const colorsArray = [
            [251.0, 233.0, 213.0],
            [240.0, 209.0, 226.0],
            [239.0, 170.0, 209.0],
            [161.0, 143.0, 196.0]
        ];

        const colors = [];

        for (const eachColor of colorsArray) {
            // For each color in colorsArray add it four times to the colors to represent
            // the color of each of the four vertices of the face
            colors.push(...[
                ...eachColor,
                ...eachColor,
                ...eachColor
            ]);
        }
        return new Shape(
            vertices,
            indices,
            colors,
            glm.mat4.create()
        );
    }

    /* -------- Create a shape from loaded .obj-file -------- */

    createShapeFromOBJFile(objFile) {
        const colorsArray = [
            [136.0, 213.0, 213.0],
            [136.0, 213.0, 213.0],
            [136.0, 213.0, 213.0]
        ]

        const colors = [];

        for (let i = 0; i < objFile.vertices.length / 3; i++) {
            const color = colorsArray[i % 3]; // cycle through the colorsArray
            colors.push(
                ...color
            );
        }

        return new Shape(
            objFile.vertices,
            objFile.indices,
            colors,
            objFile.boundingBoxTransform
        );
    }

    /* -------- Generate coordinate system -------- */

    generateCoordSystem() {
        const vertices = [
            // xAxis
            1, 0, 0,
            -1, 0, 0,

            // yAxis
            0, 1, 0,
            0, -1, 0,

            // zAxis
            0, 0, 1,
            0, 0, -1,
        ];

        const indices = [
            // xAxis
            0, 1,

            // yAxis
            2, 3,

            // zAxis
            4, 5
        ];

        const colorsArray = [
            [255.0, 0.0, 0.0], // xAxis = RED
            [0.0, 255.0, 0.0], // yAxis = GREEN
            [0.0, 0.0, 255.0] // zAxis = BLUE
        ];

        const colors = [];

        for (const eachColor of colorsArray) {
            // For each color in colorsArray add it four times to the colors to represent
            // the color of each of the four vertices of the face
            colors.push(...[
                ...eachColor,
                ...eachColor
            ]);
        }

        return new Shape(
            vertices,
            indices,
            colors,
            glm.mat4.create()
        );
    }
}

export { ShapeGenerator };
