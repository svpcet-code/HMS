"use client";

import { ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";

export default function ChartCanvas({ children, cameraPos = [0, 5, 10] }: { children: ReactNode, cameraPos?: [number, number, number] }) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden cursor-grab active:cursor-grabbing bg-transparent">
      <Canvas 
        camera={{ position: cameraPos, fov: 45 }}
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          alpha: true,
          preserveDrawingBuffer: true
        }}
        dpr={[1, 2]} // Performance: limit pixel ratio on high-DPI screens
        performance={{ min: 0.5 }} // Performance: allow scaling down quality if heavy
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, 10, -5]} intensity={0.5} color="#60a5fa" />
        
        {/* Soft environment lighting to make the charts look premium */}
        <Environment preset="city" />

        {/* OrbitControls disabled zoom/pan to avoid accidentally ruining scroll experience, only rotate is allowed */}
        <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />
        
        {children}
      </Canvas>
    </div>
  );
}
