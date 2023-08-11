import * as glm from './gl-matrix/index.js';

class OBJParser {
    // Fields
    #minX;
    #minY;
    #minZ;
    #maxX;
    #maxY;
    #maxZ;
    
    constructor() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.#minX = null;
        this.#minY = null;
        this.#minZ = null;
        this.#maxX = null;
        this.#maxY = null;
        this.#maxZ = null;
    }

    #parse(fileData) {
        const lines = fileData.split('\n');
        for (const line of lines) {
            const parts = line.trim().split(' ');
            switch (parts[0]) {
                case 'v':
                    const x = parseFloat(parts[1]);
                    const y = parseFloat(parts[2]);
                    const z = parseFloat(parts[3]);
                    this.vertices.push(x, y, z);

                    // Update minimum and maximum values
                    if (x < this.#minX || this.#minX === null) this.#minX = x;
                    if (y < this.#minY || this.#minY === null) this.#minY = y;
                    if (z < this.#minZ || this.#minZ === null) this.#minZ = z;
                    if (x > this.#maxX || this.#maxX === null) this.#maxX = x;
                    if (y > this.#maxY || this.#maxY === null) this.#maxY = y;
                    if (z > this.#maxZ || this.#maxZ === null) this.#maxZ = z;
                    break;
                case 'vn':
                    this.normals.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                    break;
                case 'f':
                    for (let i = 1; i < parts.length; i++) {
                        const subParts = parts[i].split('/');
                        this.indices.push(parseInt(subParts[0]) - 1);
                    }
                    break;
            }
        }

        // Scaling the obj object so it's fits withing the boudingBox
        const boundingBoxOffset = glm.vec3.fromValues(-(this.#maxX + this.#minX) / 2, -(this.#maxY + this.#minY) / 2, -(this.#maxZ + this.#minZ) / 2);
        const maxLength = Math.min((this.#maxX - this.#minX), (this.#maxY - this.#minY), (this.#maxZ - this.#minZ));
        const boundingBoxScale = glm.vec3.fromValues(1 / maxLength, 1 / maxLength, 1 / maxLength);

        const boundingBoxTransform = glm.mat4.create();
        glm.mat4.fromScaling(boundingBoxTransform, boundingBoxScale);
        glm.mat4.translate(boundingBoxTransform, boundingBoxTransform, boundingBoxOffset);


        return {
            vertices: this.vertices,
            normals: this.normals,
            indices: this.indices,
            boundingBoxTransform: boundingBoxTransform
        };
    }

    loadOBJFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const { vertices, normals, indices, boundingBoxTransform } = this.#parse(reader.result);
                resolve({ vertices, normals, indices, boundingBoxTransform });
            };
            reader.onerror = () => {
                reject(`Failed to load ${file.name}: ${reader.error}`);
            };
            reader.readAsText(file);
        });
    }
}

export { OBJParser }
