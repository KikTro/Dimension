"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { parseSTL } from "@/lib/stl-parser";
import { ModelGeometryAnalysis } from "@/lib/types";
import {
  Box,
  Layers,
  RotateCcw,
  Play,
  Pause,
  Grid,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
} from "lucide-react";

interface ThreeViewerProps {
  fileBuffer?: ArrayBuffer | null;
  fileUrl?: string | null;
  materialColor?: string;
  onAnalysisReady?: (analysis: ModelGeometryAnalysis) => void;
  className?: string;
  height?: string;
}

export default function ThreeViewer({
  fileBuffer,
  fileUrl,
  materialColor = "#1D2024",
  onAnalysisReady,
  className = "",
  height = "h-[460px]",
}: ThreeViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"solid" | "wireframe" | "layers">("solid");
  const [viewerTheme, setViewerTheme] = useState<"light" | "dark">("light"); // Default is light mode
  const [isRotating, setIsRotating] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [geometryInfo, setGeometryInfo] = useState<ModelGeometryAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const meshGroupRef = useRef<THREE.Group | null>(null);
  const solidMeshRef = useRef<THREE.Mesh | null>(null);
  const wireframeMeshRef = useRef<THREE.LineSegments | null>(null);
  const layerPointsRef = useRef<THREE.Points | null>(null);
  const gridHelperRef = useRef<THREE.GridHelper | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);
  const dirLight1Ref = useRef<THREE.DirectionalLight | null>(null);
  const dirLight2Ref = useRef<THREE.DirectionalLight | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const heightPx = containerRef.current.clientHeight || 460;

    const scene = new THREE.Scene();
    const isLight = viewerTheme === "light";
    scene.background = new THREE.Color(isLight ? "#EBEAE5" : "#16181B");
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / heightPx, 0.1, 2000);
    camera.position.set(120, 95, 150);
    camera.lookAt(0, 15, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(renderer.domElement);

    // Architectural lights
    const ambLight = new THREE.AmbientLight(isLight ? 0xffffff : 0xf2f0eb, isLight ? 1.5 : 1.4);
    scene.add(ambLight);
    ambLightRef.current = ambLight;

    const dirLight1 = new THREE.DirectionalLight(0xffffff, isLight ? 1.8 : 2.0);
    dirLight1.position.set(80, 140, 90);
    dirLight1.castShadow = true;
    scene.add(dirLight1);
    dirLight1Ref.current = dirLight1;

    const dirLight2 = new THREE.DirectionalLight(isLight ? 0x8c887e : 0xb85834, isLight ? 0.5 : 0.7);
    dirLight2.position.set(-80, -30, -80);
    scene.add(dirLight2);
    dirLight2Ref.current = dirLight2;

    // Bed Grid - 325 mm build envelope
    const grid = new THREE.GridHelper(
      325,
      26,
      isLight ? 0x9e998d : 0x474b54,
      isLight ? 0xd0ccc0 : 0x22262c
    );
    grid.position.y = 0;
    scene.add(grid);
    gridHelperRef.current = grid;

    const meshGroup = new THREE.Group();
    scene.add(meshGroup);
    meshGroupRef.current = meshGroup;

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      if (isRotating && meshGroupRef.current && !isDraggingRef.current) {
        meshGroupRef.current.rotation.y += 0.006;
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
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
    };
  }, []);

  // Update theme colors dynamically (Light / Dark)
  useEffect(() => {
    if (!sceneRef.current) return;
    const isLight = viewerTheme === "light";

    sceneRef.current.background = new THREE.Color(isLight ? "#EBEAE5" : "#16181B");

    if (gridHelperRef.current && sceneRef.current) {
      sceneRef.current.remove(gridHelperRef.current);
      const newGrid = new THREE.GridHelper(
        325,
        26,
        isLight ? 0x9e998d : 0x474b54,
        isLight ? 0xd0ccc0 : 0x22262c
      );
      newGrid.position.y = 0;
      newGrid.visible = showGrid;
      sceneRef.current.add(newGrid);
      gridHelperRef.current = newGrid;
    }

    if (ambLightRef.current) {
      ambLightRef.current.color.set(isLight ? 0xffffff : 0xf2f0eb);
      ambLightRef.current.intensity = isLight ? 1.5 : 1.4;
    }

    if (dirLight2Ref.current) {
      dirLight2Ref.current.color.set(isLight ? 0x8c887e : 0xb85834);
    }

    if (wireframeMeshRef.current) {
      (wireframeMeshRef.current.material as THREE.LineBasicMaterial).color.set(
        isLight ? 0x1f2329 : 0xe0ddd5
      );
    }
  }, [viewerTheme, showGrid]);

  // Load / Parse Model
  useEffect(() => {
    if (!meshGroupRef.current || !sceneRef.current) return;

    const loadModel = async () => {
      setIsLoading(true);
      try {
        let bufferToParse: ArrayBuffer | null = null;
        if (fileBuffer) {
          bufferToParse = fileBuffer;
        } else if (fileUrl) {
          const res = await fetch(fileUrl);
          bufferToParse = await res.arrayBuffer();
        }

        while (meshGroupRef.current!.children.length > 0) {
          const obj = meshGroupRef.current!.children[0];
          meshGroupRef.current!.remove(obj);
        }

        let geometry: THREE.BufferGeometry;
        let analysis: ModelGeometryAnalysis;

        if (bufferToParse) {
          const parsed = parseSTL(bufferToParse);
          analysis = parsed.geometry;

          geometry = new THREE.BufferGeometry();
          geometry.setAttribute("position", new THREE.BufferAttribute(parsed.positions, 3));
          geometry.setAttribute("normal", new THREE.BufferAttribute(parsed.normals, 3));
        } else {
          // Default architectural CAD block
          geometry = new THREE.CylinderGeometry(28, 38, 42, 6, 6);
          geometry.computeVertexNormals();
          analysis = {
            dimensions: { x: 76.0, y: 42.0, z: 76.0 },
            volumeCm3: 48.2,
            surfaceAreaCm2: 72.0,
            triangleCount: 360,
            isWatertight: true,
          };
        }

        geometry.computeBoundingBox();
        const bbox = geometry.boundingBox!;
        const center = new THREE.Vector3();
        bbox.getCenter(center);
        geometry.center();

        const size = new THREE.Vector3();
        bbox.getSize(size);
        const yOffset = size.y / 2;

        setGeometryInfo(analysis);
        if (onAnalysisReady) onAnalysisReady(analysis);

        const isLight = viewerTheme === "light";

        // 1. Solid Mesh
        const solidMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(materialColor),
          roughness: 0.5,
          metalness: 0.05,
          flatShading: false,
        });
        const solidMesh = new THREE.Mesh(geometry, solidMaterial);
        solidMesh.position.y = yOffset;
        solidMesh.castShadow = true;
        solidMesh.receiveShadow = true;
        solidMeshRef.current = solidMesh;

        // 2. Wireframe Mesh
        const wireframeGeometry = new THREE.WireframeGeometry(geometry);
        const wireframeMaterial = new THREE.LineBasicMaterial({
          color: isLight ? 0x1f2329 : 0xe0ddd5,
          transparent: true,
          opacity: 0.85,
        });
        const wireframeMesh = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);
        wireframeMesh.position.y = yOffset;
        wireframeMeshRef.current = wireframeMesh;

        // 3. Slicer Layers
        const pointsMat = new THREE.PointsMaterial({
          color: 0xb85834,
          size: 1.6,
          transparent: true,
          opacity: 0.95,
        });
        const layerPoints = new THREE.Points(geometry, pointsMat);
        layerPoints.position.y = yOffset;
        layerPointsRef.current = layerPoints;

        if (viewMode === "solid") {
          meshGroupRef.current!.add(solidMesh);
        } else if (viewMode === "wireframe") {
          meshGroupRef.current!.add(wireframeMesh);
        } else if (viewMode === "layers") {
          meshGroupRef.current!.add(layerPoints);
        }

        if (cameraRef.current) {
          const maxDim = Math.max(size.x, size.y, size.z, 45);
          const fov = cameraRef.current.fov * (Math.PI / 180);
          let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 2.2;
          cameraRef.current.position.set(cameraZ * 0.7, cameraZ * 0.55, cameraZ * 0.75);
          cameraRef.current.lookAt(0, yOffset, 0);
        }
      } catch (err) {
        console.error("Error setting up 3D geometry:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadModel();
  }, [fileBuffer, fileUrl]);

  useEffect(() => {
    if (solidMeshRef.current) {
      (solidMeshRef.current.material as THREE.MeshStandardMaterial).color.set(materialColor);
    }
  }, [materialColor]);

  useEffect(() => {
    if (!meshGroupRef.current) return;
    while (meshGroupRef.current.children.length > 0) {
      meshGroupRef.current.remove(meshGroupRef.current.children[0]);
    }

    if (viewMode === "solid" && solidMeshRef.current) {
      meshGroupRef.current.add(solidMeshRef.current);
    } else if (viewMode === "wireframe" && wireframeMeshRef.current) {
      meshGroupRef.current.add(wireframeMeshRef.current);
    } else if (viewMode === "layers" && layerPointsRef.current) {
      meshGroupRef.current.add(layerPointsRef.current);
    }
  }, [viewMode]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !meshGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    meshGroupRef.current.rotation.y += deltaX * 0.01;
    meshGroupRef.current.rotation.x += deltaY * 0.01;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!cameraRef.current) return;
    const zoomFactor = e.deltaY * 0.1;
    cameraRef.current.position.multiplyScalar(1 + zoomFactor * 0.005);
  };

  const resetView = () => {
    if (meshGroupRef.current) meshGroupRef.current.rotation.set(0, 0, 0);
    if (cameraRef.current) {
      cameraRef.current.position.set(120, 95, 150);
      cameraRef.current.lookAt(0, 15, 0);
    }
  };

  const zoom = (inOut: "in" | "out") => {
    if (!cameraRef.current) return;
    cameraRef.current.position.multiplyScalar(inOut === "in" ? 0.85 : 1.15);
  };

  const isLight = viewerTheme === "light";

  return (
    <div
      className={`relative w-full overflow-hidden hairline select-none transition-colors duration-200 ${
        isLight ? "bg-[#EBEAE5] border-paper-400" : "bg-[#16181B] border-paper-400/40"
      } ${className}`}
    >
      {/* 3D Canvas */}
      <div
        ref={containerRef}
        className={`w-full ${height} cursor-grab active:cursor-grabbing`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-3 z-20 ${
            isLight ? "bg-[#EBEAE5]/90 text-ink" : "bg-[#16181B]/90 text-paper-300"
          }`}
        >
          <div className="w-6 h-6 border border-terracotta border-t-transparent animate-spin" />
          <span className="font-mono text-xs uppercase tracking-widest">
            Parsing 3D Geometry...
          </span>
        </div>
      )}

      {/* Top HUD Dimensions */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 font-mono text-xs">
        <div
          className={`px-3 py-1 backdrop-blur-md hairline ${
            isLight ? "bg-[#FBFBF9]/90 text-ink" : "bg-[#121417]/85 text-paper-300 border-paper-400/20"
          }`}
        >
          <span>3D MODEL VIEWPORT</span>
        </div>

        {geometryInfo && (
          <div
            className={`px-3 py-1 backdrop-blur-md hairline flex items-center gap-3 ${
              isLight ? "bg-[#FBFBF9]/90 text-ink" : "bg-[#121417]/85 text-paper-200 border-paper-400/20"
            }`}
          >
            <span>
              {geometryInfo.dimensions.x} × {geometryInfo.dimensions.y} × {geometryInfo.dimensions.z} mm
            </span>
            <span className={isLight ? "text-paper-500" : "text-paper-500"}>•</span>
            <span className="text-terracotta font-semibold">{geometryInfo.volumeCm3} cm³</span>
          </div>
        )}
      </div>

      {/* Bottom Toolbar */}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none font-mono text-xs">
        {/* Mode Selector */}
        <div
          className={`flex items-center p-1 backdrop-blur-md hairline pointer-events-auto ${
            isLight ? "bg-[#FBFBF9]/95 text-ink" : "bg-[#121417]/90 text-paper-300 border-paper-400/20"
          }`}
        >
          <button
            type="button"
            onClick={() => setViewMode("solid")}
            className={`px-3 py-1 transition-colors ${
              viewMode === "solid"
                ? isLight
                  ? "bg-ink text-paper-100 font-semibold"
                  : "bg-paper-100 text-ink font-semibold"
                : isLight
                ? "text-ink-muted hover:text-ink"
                : "text-paper-400 hover:text-white"
            }`}
          >
            SOLID
          </button>
          <button
            type="button"
            onClick={() => setViewMode("wireframe")}
            className={`px-3 py-1 transition-colors ${
              viewMode === "wireframe"
                ? isLight
                  ? "bg-ink text-paper-100 font-semibold"
                  : "bg-paper-100 text-ink font-semibold"
                : isLight
                ? "text-ink-muted hover:text-ink"
                : "text-paper-400 hover:text-white"
            }`}
          >
            WIREFRAME
          </button>
          <button
            type="button"
            onClick={() => setViewMode("layers")}
            className={`px-3 py-1 transition-colors ${
              viewMode === "layers"
                ? "bg-terracotta text-white font-semibold"
                : isLight
                ? "text-ink-muted hover:text-ink"
                : "text-paper-400 hover:text-white"
            }`}
          >
            SLICER
          </button>
        </div>

        {/* Viewport & Theme Actions */}
        <div
          className={`flex items-center gap-1 backdrop-blur-md p-1 hairline pointer-events-auto ${
            isLight ? "bg-[#FBFBF9]/95 text-ink" : "bg-[#121417]/90 text-paper-300 border-paper-400/20"
          }`}
        >
          {/* Light / Dark Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setViewerTheme(isLight ? "dark" : "light")}
            title={isLight ? "Switch to Dark Viewer" : "Switch to Light Viewer"}
            className={`flex items-center gap-1 px-2 py-1 transition-colors text-[11px] font-semibold ${
              isLight
                ? "bg-paper-300 text-ink hover:bg-paper-400"
                : "bg-paper-100/10 text-amber-300 hover:bg-paper-100/20"
            }`}
          >
            {isLight ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            <span>{isLight ? "LIGHT" : "DARK"}</span>
          </button>

          <span className="w-px h-4 bg-paper-400 mx-0.5" />

          <button
            type="button"
            onClick={() => setIsRotating(!isRotating)}
            title="Auto-Rotation"
            className={`p-1.5 transition-colors ${
              isRotating ? "text-terracotta" : isLight ? "text-ink-muted hover:text-ink" : "text-paper-400 hover:text-white"
            }`}
          >
            {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Bed Grid (325×320mm)"
            className={`p-1.5 transition-colors ${
              showGrid
                ? isLight
                  ? "text-ink font-bold"
                  : "text-paper-200 font-bold"
                : isLight
                ? "text-ink-subtle"
                : "text-paper-500 hover:text-white"
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => zoom("in")}
            title="Zoom In"
            className={`p-1.5 ${isLight ? "text-ink-muted hover:text-ink" : "text-paper-400 hover:text-white"}`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => zoom("out")}
            title="Zoom Out"
            className={`p-1.5 ${isLight ? "text-ink-muted hover:text-ink" : "text-paper-400 hover:text-white"}`}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={resetView}
            title="Reset Camera View"
            className={`p-1.5 ${isLight ? "text-ink-muted hover:text-ink" : "text-paper-400 hover:text-white"}`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
