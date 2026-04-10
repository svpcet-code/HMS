"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface Bar3DProps {
  position: [number, number, number];
  data: BarData;
  maxValue: number;
}

function Bar({ position, data, maxValue }: Bar3DProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Normalize height based on max value, arbitrary multiplier (e.g. 4) for visual appealing height
  const targetHeight = (data.value / maxValue) * 4;
  
  // Animation for height bouncing
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Lerp scale to target height for smooth entry animation
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, Math.max(0.1, targetHeight), 4 * delta);
      // Lerp position to stay grounded (since box origins are center)
      meshRef.current.position.y = meshRef.current.scale.y / 2;
    }
  });

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* 3D Bar */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        scale={[0.8, 0.1, 0.8]}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'grab'; }}
      >
        <boxGeometry args={[1, 1, 1]} />
        {/* Dynamic color changing on hover */}
        <meshStandardMaterial 
          color={hovered ? "#60a5fa" : data.color} 
          emissive={hovered ? "#3b82f6" : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0}
          roughness={0.2} 
        />
      </mesh>
      
      {/* Label under the bar */}
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.3}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
      >
        {data.label}
      </Text>

      {/* Floating Value when hovered */}
      {hovered && (
        <Text
          position={[0, targetHeight + 0.5, 0]}
          fontSize={0.5}
          color="#ffffff"
          outlineWidth={0.02}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
        >
          {data.value.toString()}
        </Text>
      )}
    </group>
  );
}

export default function BarChart3D({ data }: { data: BarData[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const maxValue = Math.max(...data.map(d => d.value));

  // Removed auto-rotation completely as requested by the user.
  // useFrame((_, delta) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += delta * 0.1;
  //   }
  // });

  // Calculate generic offsets to center the group of bars
  const spacing = 1.5;
  const offsetX = -((data.length - 1) * spacing) / 2;

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Base platform */}
      <mesh position={[0, -0.2, 0]} receiveShadow>
        <boxGeometry args={[data.length * spacing + 1, 0.2, 3]} />
        <meshStandardMaterial color="#1e293b" opacity={0.6} transparent />
      </mesh>
      
      {data.map((d, index) => (
        <Bar 
          key={d.label} 
          data={d} 
          maxValue={maxValue || 1} 
          position={[offsetX + index * spacing, 0, 0]} 
        />
      ))}
    </group>
  );
}
