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

    reset() {
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

    parse(fileContent) {
        this.reset();
        const lines = fileContent.split('\n');
        let srcPositions = [];
        let srcNormals = [];
        let dstPositions = [];
        let dstNormals = [];
        let dstIndices = [];
        let map = {};
        let nextIndex = 0;

        for (const line of lines) {
            const parts = line.trim().split(' ');
            if(parts.length > 0) {
                switch (parts[0]) {
                    case 'v':
                        const x = parseFloat(parts[1]);
                        const y = parseFloat(parts[2]);
                        const z = parseFloat(parts[3]);
                        srcPositions.push([x, y, z]);

                        // Update minimum and maximum values
                        if (x < this.#minX || this.#minX === null) this.#minX = x;
                        if (y < this.#minY || this.#minY === null) this.#minY = y;
                        if (z < this.#minZ || this.#minZ === null) this.#minZ = z;
                        if (x > this.#maxX || this.#maxX === null) this.#maxX = x;
                        if (y > this.#maxY || this.#maxY === null) this.#maxY = y;
                        if (z > this.#maxZ || this.#maxZ === null) this.#maxZ = z;
                        break;
                    case 'vn':
                        srcNormals.push([parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])]);
                        break;
                    case 'f':
                        for (let i = 0; i < 3; i++) {
                            const subParts = parts[i + 1].split('/');
                            if (subParts in map) {
                                dstIndices.push(map[subParts]);
                            } else {
                                const position = srcPositions[parseInt(subParts[0]) - 1];
                                dstPositions.push(position[0]);
                                dstPositions.push(position[1]);
                                dstPositions.push(position[2]);
                                if (subParts[2]) {
                                    const normal = srcNormals[parseInt(subParts[2]) - 1];
                                    dstNormals.push(normal[0]);
                                    dstNormals.push(normal[1]);
                                    dstNormals.push(normal[2]);
                                }
                                dstIndices.push(nextIndex);
                                map[subParts] = nextIndex++;
                            }
                        }
                        break;
                }
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
            vertices: new Float32Array(dstPositions),
            normals: new Float32Array(dstNormals),
            indices: new Uint16Array(dstIndices),
            boundingBoxTransform: boundingBoxTransform
        };

    }

    loadOBJFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const { vertices, normals, indices, boundingBoxTransform } = this.parse(reader.result);
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
