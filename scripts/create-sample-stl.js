const fs = require("fs");
const path = require("path");

const targetDir = path.join(__dirname, "..", "public", "uploads", "samples");
fs.mkdirSync(targetDir, { recursive: true });

// Create a valid binary STL file for a cube (12 triangles)
function createSampleBinarySTL(size = 30) {
  const triangleCount = 12;
  const buffer = Buffer.alloc(84 + triangleCount * 50);

  // 80 bytes header
  buffer.write("Dimension by KikTro Labs Sample 3D Test Model", 0, "utf8");

  // Triangle count (uint32 LE at offset 80)
  buffer.writeUInt32LE(triangleCount, 80);

  const half = size / 2;
  const vertices = [
    // Front face
    [-half, -half, half], [half, -half, half], [half, half, half],
    [-half, -half, half], [half, half, half], [-half, half, half],
    // Back face
    [-half, -half, -half], [-half, half, -half], [half, half, -half],
    [-half, -half, -half], [half, half, -half], [half, -half, -half],
    // Top face
    [-half, half, -half], [-half, half, half], [half, half, half],
    [-half, half, -half], [half, half, half], [half, half, -half],
    // Bottom face
    [-half, -half, -half], [half, -half, -half], [half, -half, half],
    [-half, -half, -half], [half, -half, half], [-half, -half, half],
    // Right face
    [half, -half, -half], [half, half, -half], [half, half, half],
    [half, -half, -half], [half, half, half], [half, -half, half],
    // Left face
    [-half, -half, -half], [-half, -half, half], [-half, half, half],
    [-half, -half, -half], [-half, half, half], [-half, half, -half],
  ];

  let offset = 84;
  for (let i = 0; i < triangleCount; i++) {
    // Normal (0, 0, 0)
    buffer.writeFloatLE(0, offset);
    buffer.writeFloatLE(0, offset + 4);
    buffer.writeFloatLE(1, offset + 8);
    offset += 12;

    for (let v = 0; v < 3; v++) {
      const vert = vertices[i * 3 + v];
      buffer.writeFloatLE(vert[0], offset);
      buffer.writeFloatLE(vert[1], offset + 4);
      buffer.writeFloatLE(vert[2], offset + 8);
      offset += 12;
    }

    // Attribute byte count (uint16 LE)
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }

  return buffer;
}

const sampleStl = createSampleBinarySTL(40);
fs.writeFileSync(path.join(targetDir, "precision_mount.stl"), sampleStl);
fs.writeFileSync(path.join(targetDir, "drone_camera_gimbal_v3.stl"), sampleStl);
fs.writeFileSync(path.join(targetDir, "ergonomic_trackball_shell_left.stl"), sampleStl);
fs.writeFileSync(path.join(targetDir, "custom_dampener_seal.stl"), sampleStl);

console.log("Sample STL files generated successfully in public/uploads/samples!");
