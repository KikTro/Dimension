"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function HeroSlicerAnimation() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStage, setActiveStage] = useState<"wireframe" | "layers" | "solid">("solid");
  const [autoCycle, setAutoCycle] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const wireMeshRef = useRef<THREE.LineSegments | null>(null);
  const pointCloudRef = useRef<THREE.Points | null>(null);
  const solidMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#16181B");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(70, 50, 85);
    camera.lookAt(0, 4, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Warm architectural studio lighting
    const ambLight = new THREE.AmbientLight(0xf5f3ee, 1.2);
    scene.add(ambLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(60, 90, 70);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xb85834, 0.8);
    fillLight.position.set(-60, -20, -50);
    scene.add(fillLight);

    // Subtle ivory grid floor
    const grid = new THREE.GridHelper(100, 20, 0x3a3f47, 0x24282f);
    grid.position.y = -16;
    scene.add(grid);

    // Group
    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // Rich architectural geometry (Icosahedral multifaceted faceted monolith)
    const geom = new THREE.IcosahedronGeometry(18, 2);
    geom.computeVertexNormals();

    // 1. Wireframe CAD Mode
    const wireGeom = new THREE.WireframeGeometry(geom);
    const wireMat = new THREE.LineBasicMaterial({
      color: 0xd2cec4,
      transparent: true,
      opacity: 0.8,
    });
    const wireMesh = new THREE.LineSegments(wireGeom, wireMat);
    wireMeshRef.current = wireMesh;

    // 2. Slicer Layers Point Cloud
    const ptsMat = new THREE.PointsMaterial({
      color: 0xb85834,
      size: 1.8,
      transparent: true,
      opacity: 0.9,
    });
    const pointCloud = new THREE.Points(geom, ptsMat);
    pointCloudRef.current = pointCloud;

    // 3. Solid Matte Tactile Object
    const solidMat = new THREE.MeshStandardMaterial({
      color: 0xe2dfd7,
      roughness: 0.45,
      metalness: 0.05,
      flatShading: false,
    });
    const solidMesh = new THREE.Mesh(geom, solidMat);
    solidMeshRef.current = solidMesh;

    group.add(solidMesh);

    let time = 0;
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.008;

      if (groupRef.current) {
        groupRef.current.rotation.y = time * 0.5;
        groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!groupRef.current) return;
    while (groupRef.current.children.length > 0) {
      groupRef.current.remove(groupRef.current.children[0]);
    }

    if (activeStage === "wireframe" && wireMeshRef.current) {
      groupRef.current.add(wireMeshRef.current);
    } else if (activeStage === "layers" && pointCloudRef.current) {
      groupRef.current.add(pointCloudRef.current);
    } else if (activeStage === "solid" && solidMeshRef.current) {
      groupRef.current.add(solidMeshRef.current);
    }
  }, [activeStage]);

  useEffect(() => {
    if (!autoCycle) return;
    const stages: ("wireframe" | "layers" | "solid")[] = ["wireframe", "layers", "solid"];
    const interval = setInterval(() => {
      setActiveStage((prev) => {
        const nextIndex = (stages.indexOf(prev) + 1) % stages.length;
        return stages[nextIndex];
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [autoCycle]);

  return (
    <div className="relative w-full h-[440px] sm:h-[480px] bg-[#16181B] border border-paper-400/40 shadow-editorial overflow-hidden flex flex-col justify-between p-5">
      {/* Telemetry Header */}
      <div className="relative z-10 flex items-center justify-between pointer-events-none font-mono text-[11px]">
        <div className="flex items-center gap-2 text-paper-300">
          <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
          <span>FIG 01. STUDY IN TOPOLOGY & MATERIAL REALIZATION</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-paper-400">
          <span>BOUNDS: 68 × 68 × 38 MM</span>
          <span>•</span>
          <span>TOL: ±0.1 MM</span>
        </div>
      </div>

      {/* 3D Canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Bottom Stage Progress Selector */}
      <div className="relative z-10 flex items-center justify-between bg-[#121417]/90 backdrop-blur-md p-1.5 border border-paper-400/20 font-mono text-xs text-paper-300">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              setAutoCycle(false);
              setActiveStage("wireframe");
            }}
            className={`px-3 py-1.5 transition-colors ${
              activeStage === "wireframe"
                ? "bg-paper-100 text-ink font-semibold"
                : "text-paper-400 hover:text-paper-100"
            }`}
          >
            01. CAD MESH
          </button>

          <span className="text-paper-500">/</span>

          <button
            type="button"
            onClick={() => {
              setAutoCycle(false);
              setActiveStage("layers");
            }}
            className={`px-3 py-1.5 transition-colors ${
              activeStage === "layers"
                ? "bg-terracotta text-white font-semibold"
                : "text-paper-400 hover:text-paper-100"
            }`}
          >
            02. SLICE TOOLPATH
          </button>

          <span className="text-paper-500">/</span>

          <button
            type="button"
            onClick={() => {
              setAutoCycle(false);
              setActiveStage("solid");
            }}
            className={`px-3 py-1.5 transition-colors ${
              activeStage === "solid"
                ? "bg-paper-100 text-ink font-semibold"
                : "text-paper-400 hover:text-paper-100"
            }`}
          >
            03. PHYSICAL ARTIFACT
          </button>
        </div>

        <button
          type="button"
          onClick={() => setAutoCycle(!autoCycle)}
          className="text-[10px] uppercase text-paper-400 hover:text-paper-200 px-2 py-1"
        >
          {autoCycle ? "Cycle [ON]" : "Manual"}
        </button>
      </div>
    </div>
  );
}
