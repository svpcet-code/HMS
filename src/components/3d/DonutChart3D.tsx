"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface DonutData {
  label: string;
  value: number;
  color: string;
}

interface SliceProps {
  data: DonutData;
  startAngle: number;
  angle: number;
}

function Slice({ data, startAngle, angle }: SliceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Animation loop: pop out slightly when hovered
  useFrame((_, delta) => {
    if (meshRef.current) {
      // Calculate normal direction bisecting the slice to translate it outwards when hovered
      const midAngle = startAngle + angle / 2;
      const targetX = hovered ? Math.cos(midAngle) * 0.2 : 0;
      const targetZ = hovered ? -Math.sin(midAngle) * 0.2 : 0; // Negative because Three.js angles grow clockwise in XY but we map to XZ usually
      
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, 5 * delta);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetZ, 5 * delta); // Map to Y because torus is naturally in XY plane, we'll rotate the group to flatten it
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { setHovered(false); document.body.style.cursor = 'grab'; }}
        rotation={[0, 0, startAngle]}
      >
        {/* radius, tube, radialSegments, tubularSegments, arc */}
        {angle > 0.0001 && !isNaN(angle) && (
          <torusGeometry args={[1.5, 0.4, 16, 50, angle]} />
        )}
        <meshPhysicalMaterial 
          color={hovered ? "#60a5fa" : data.color} 
          emissive={hovered ? "#3b82f6" : "#000000"}
          emissiveIntensity={hovered ? 0.6 : 0}
          roughness={0.1}
          metalness={0.1}
          clearcoat={0.5}
        />
      </mesh>
      
      {/* Label and Value attached to midAngle (pop up text when hovered) */}
      {hovered && (
        <Text
          position={[
            Math.cos(startAngle + angle / 2) * 2.5, 
            Math.sin(startAngle + angle / 2) * 2.5, 
            0.5
          ]}
          fontSize={0.4}
          color="#ffffff"
          outlineWidth={0.02}
          outlineColor="#000000"
          anchorX="center"
          anchorY="middle"
          rotation={[0, 0, -(startAngle + angle / 2)]} // Keep text upright
        >
          {`${data.label}\n${data.value}`}
        </Text>
      )}
    </group>
  );
}

export default function DonutChart3D({ data }: { data: DonutData[] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const total = data.reduce((acc, d) => acc + d.value, 0);

  // Removed auto-rotation as requested
  // useFrame((_, delta) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.z -= delta * 0.2;
  //   }
  // });

  // Calculate angles beforehand to avoid mutation during render
  const slices = data.reduce((acc: { d: DonutData, startAngle: number, sliceAngle: number }[], d) => {
    const startAngle = acc.length > 0 ? acc[acc.length - 1].startAngle + acc[acc.length - 1].sliceAngle : 0;
    const sliceAngle = total > 0 ? (d.value / total) * Math.PI * 2 : 0;
    acc.push({ d, startAngle, sliceAngle });
    return acc;
  }, []);

  return (
    <group rotation={[-Math.PI / 2.5, 0, 0]}> {/* Tilt to lay it flat */}
      <group ref={groupRef}>
        {slices.map((slice) => (
          <Slice 
            key={slice.d.label} 
            data={slice.d} 
            startAngle={slice.startAngle} 
            angle={slice.sliceAngle} 
          />
        ))}
      </group>
      
      {/* Center pedestal / shadow receiver */}
      <mesh position={[0, 0, -0.6]}>
        <cylinderGeometry args={[2.5, 2.8, 0.1, 32]} />
        <meshStandardMaterial color="#1e293b" opacity={0.6} transparent />
      </mesh>
    </group>
  );
}
