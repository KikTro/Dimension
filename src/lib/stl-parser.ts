import { ModelGeometryAnalysis } from "./types";

/**
 * Parses an STL file buffer (Binary or ASCII) and calculates exact geometric properties:
 * - Bounding box (X, Y, Z in mm)
 * - Volume (in cm3) using the signed tetrahedron algorithm
 * - Surface area (in cm2)
 * - Triangle count
 */
export function parseSTL(buffer: ArrayBuffer): {
  geometry: ModelGeometryAnalysis;
  positions: Float32Array;
  normals: Float32Array;
} {
  const isAscii = isASCII(buffer);

  if (isAscii) {
    return parseAsciiSTL(buffer);
  } else {
    return parseBinarySTL(buffer);
  }
}

function isASCII(buffer: ArrayBuffer): boolean {
  const reader = new DataView(buffer);
  // Binary STLs have an 80 byte header followed by a 4-byte uint32 triangle count
  if (buffer.byteLength < 84) return true;

  // Check if header starts with "solid"
  let header = "";
  for (let i = 0; i < Math.min(80, buffer.byteLength); i++) {
    header += String.fromCharCode(reader.getUint8(i));
  }

  if (!header.toLowerCase().startsWith("solid")) {
    return false;
  }

  // Double check: if it's binary, the byteLength should match 84 + triangleCount * 50
  const triangleCount = reader.getUint32(80, true);
  const expectedBinarySize = 84 + triangleCount * 50;

  if (Math.abs(buffer.byteLength - expectedBinarySize) <= 2) {
    return false; // Binary file that happens to start with "solid"
  }

  return true;
}

function parseBinarySTL(buffer: ArrayBuffer) {
  const reader = new DataView(buffer);
  const triangleCount = reader.getUint32(80, true);

  const positions = new Float32Array(triangleCount * 9);
  const normals = new Float32Array(triangleCount * 9);

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  let totalSignedVolume = 0;
  let totalSurfaceArea = 0;

  let offset = 84;

  for (let i = 0; i < triangleCount; i++) {
    if (offset + 50 > buffer.byteLength) break;

    // Normal
    const nx = reader.getFloat32(offset, true);
    const ny = reader.getFloat32(offset + 4, true);
    const nz = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Vertex 1
    const v1x = reader.getFloat32(offset, true);
    const v1y = reader.getFloat32(offset + 4, true);
    const v1z = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Vertex 2
    const v2x = reader.getFloat32(offset, true);
    const v2y = reader.getFloat32(offset + 4, true);
    const v2z = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Vertex 3
    const v3x = reader.getFloat32(offset, true);
    const v3y = reader.getFloat32(offset + 4, true);
    const v3z = reader.getFloat32(offset + 8, true);
    offset += 12;

    // Attribute byte count
    offset += 2;

    const posIdx = i * 9;
    positions[posIdx] = v1x;
    positions[posIdx + 1] = v1y;
    positions[posIdx + 2] = v1z;

    positions[posIdx + 3] = v2x;
    positions[posIdx + 4] = v2y;
    positions[posIdx + 5] = v2z;

    positions[posIdx + 6] = v3x;
    positions[posIdx + 7] = v3y;
    positions[posIdx + 8] = v3z;

    // Normals per vertex
    for (let j = 0; j < 3; j++) {
      normals[posIdx + j * 3] = nx;
      normals[posIdx + j * 3 + 1] = ny;
      normals[posIdx + j * 3 + 2] = nz;
    }

    // Bounds update
    minX = Math.min(minX, v1x, v2x, v3x);
    maxX = Math.max(maxX, v1x, v2x, v3x);
    minY = Math.min(minY, v1y, v2y, v3y);
    maxY = Math.max(maxY, v1y, v2y, v3y);
    minZ = Math.min(minZ, v1z, v2z, v3z);
    maxZ = Math.max(maxZ, v1z, v2z, v3z);

    // Signed volume of tetrahedron formed with origin:
    // v = 1/6 * (-v3x*v2y*v1z + v2x*v3y*v1z + v3x*v1y*v2z - v1x*v3y*v2z - v2x*v1y*v3z + v1x*v2y*v3z)
    const v321 = -v3x * v2y * v1z;
    const v231 = v2x * v3y * v1z;
    const v312 = v3x * v1y * v2z;
    const v132 = -v1x * v3y * v2z;
    const v213 = -v2x * v1y * v3z;
    const v123 = v1x * v2y * v3z;
    totalSignedVolume += (1.0 / 6.0) * (v321 + v231 + v312 + v132 + v213 + v123);

    // Triangle surface area = 0.5 * |(v2 - v1) x (v3 - v1)|
    const ax = v2x - v1x;
    const ay = v2y - v1y;
    const az = v2z - v1z;

    const bx = v3x - v1x;
    const by = v3y - v1y;
    const bz = v3z - v1z;

    const cx = ay * bz - az * by;
    const cy = az * bx - ax * bz;
    const cz = ax * by - ay * bx;

    totalSurfaceArea += 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
  }

  const dimX = Math.max(0, maxX - minX);
  const dimY = Math.max(0, maxY - minY);
  const dimZ = Math.max(0, maxZ - minZ);

  // Convert volume from mm^3 to cm^3 (1 cm3 = 1000 mm3)
  const volumeCm3 = Math.abs(totalSignedVolume) / 1000.0;
  // Convert area from mm^2 to cm^2 (1 cm2 = 100 mm2)
  const surfaceAreaCm2 = totalSurfaceArea / 100.0;

  return {
    geometry: {
      dimensions: {
        x: Number(dimX.toFixed(2)),
        y: Number(dimY.toFixed(2)),
        z: Number(dimZ.toFixed(2)),
      },
      volumeCm3: Number(volumeCm3.toFixed(2)),
      surfaceAreaCm2: Number(surfaceAreaCm2.toFixed(2)),
      triangleCount,
      isWatertight: totalSignedVolume !== 0 && !isNaN(totalSignedVolume),
    },
    positions,
    normals,
  };
}

function parseAsciiSTL(buffer: ArrayBuffer) {
  const text = new TextDecoder().decode(buffer);
  const lines = text.split("\n");

  const posList: number[] = [];
  const normList: number[] = [];

  let currentNormal = [0, 0, 1];
  let currentFaceVertices: number[][] = [];

  let minX = Infinity,
    minY = Infinity,
    minZ = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity,
    maxZ = -Infinity;

  let totalSignedVolume = 0;
  let totalSurfaceArea = 0;

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith("facet normal")) {
      const parts = line.split(/\s+/).slice(2).map(Number);
      currentNormal = parts.length === 3 ? parts : [0, 0, 1];
      currentFaceVertices = [];
    } else if (line.startsWith("vertex")) {
      const parts = line.split(/\s+/).slice(1).map(Number);
      if (parts.length === 3) {
        currentFaceVertices.push(parts);
      }
    } else if (line.startsWith("endfacet")) {
      if (currentFaceVertices.length === 3) {
        const [v1, v2, v3] = currentFaceVertices;

        for (const v of [v1, v2, v3]) {
          posList.push(v[0], v[1], v[2]);
          normList.push(currentNormal[0], currentNormal[1], currentNormal[2]);

          minX = Math.min(minX, v[0]);
          maxX = Math.max(maxX, v[0]);
          minY = Math.min(minY, v[1]);
          maxY = Math.max(maxY, v[1]);
          minZ = Math.min(minZ, v[2]);
          maxZ = Math.max(maxZ, v[2]);
        }

        // Signed volume calculation
        const v321 = -v3[0] * v2[1] * v1[2];
        const v231 = v2[0] * v3[1] * v1[2];
        const v312 = v3[0] * v1[1] * v2[2];
        const v132 = -v1[0] * v3[1] * v2[2];
        const v213 = -v2[0] * v1[1] * v3[2];
        const v123 = v1[0] * v2[1] * v3[2];
        totalSignedVolume += (1.0 / 6.0) * (v321 + v231 + v312 + v132 + v213 + v123);

        // Surface area
        const ax = v2[0] - v1[0];
        const ay = v2[1] - v1[1];
        const az = v2[2] - v1[2];
        const bx = v3[0] - v1[0];
        const by = v3[1] - v1[1];
        const bz = v3[2] - v1[2];

        const cx = ay * bz - az * by;
        const cy = az * bx - ax * bz;
        const cz = ax * by - ay * bx;
        totalSurfaceArea += 0.5 * Math.sqrt(cx * cx + cy * cy + cz * cz);
      }
    }
  }

  const triangleCount = Math.floor(posList.length / 9);
  const dimX = Math.max(0, maxX - minX);
  const dimY = Math.max(0, maxY - minY);
  const dimZ = Math.max(0, maxZ - minZ);

  const volumeCm3 = Math.abs(totalSignedVolume) / 1000.0;
  const surfaceAreaCm2 = totalSurfaceArea / 100.0;

  return {
    geometry: {
      dimensions: {
        x: Number(dimX.toFixed(2)),
        y: Number(dimY.toFixed(2)),
        z: Number(dimZ.toFixed(2)),
      },
      volumeCm3: Number(volumeCm3.toFixed(2)),
      surfaceAreaCm2: Number(surfaceAreaCm2.toFixed(2)),
      triangleCount,
      isWatertight: totalSignedVolume !== 0 && !isNaN(totalSignedVolume),
    },
    positions: new Float32Array(posList),
    normals: new Float32Array(normList),
  };
}
