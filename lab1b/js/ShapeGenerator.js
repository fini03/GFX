import * as glm from './gl-matrix/index.js'
import  { Shape } from './Shape.js';

class ShapeGenerator {

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
            objFile.normals,
            objFile.indices,
            colors,
            objFile.boundingBoxTransform
        );
    }

    /* -------- Generate ground plane -------- */

    generateGroundPlane() {
        const vertices = [
            -5, 0, -5,
            -5, 0, 5,
            5, 0, -5,
            5, 0, 5
        ];

        const indices = [
            0, 1, 2,
            1, 3, 2
        ];

        const normals = [
            0, 1, 0,   // normal 0
            0, 1, 0,   // normal 1
            0, 1, 0,   // normal 2
            0, 1, 0    // normal 3
        ];

        const colorsArray = [
            [204.0, 204.0, 204.0],
            [204.0, 204.0, 204.0],
            [204.0, 204.0, 204.0],
            [204.0, 204.0, 204.0]
        ];

        const colors = [];

        for (const eachColor of colorsArray) {
            // For each color in colorsArray add it four times to the colors to represent
            // the color of each of the four vertices of the face
            colors.push(...[
                ...eachColor,
                ...eachColor
            ])
        }

        return new Shape(
            vertices,
            normals,
            indices,
            colors,
            glm.mat4.create()
        );
    }
}

export { ShapeGenerator };
