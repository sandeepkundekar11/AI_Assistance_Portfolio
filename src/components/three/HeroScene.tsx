import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { RobotHumanoid } from "./AiAvatar";

// Individual Floating Debris Element
function FloatingShard({ position, scale, rotationSpeed, type }: {
  position: [number, number, number];
  scale: number;
  rotationSpeed: [number, number, number];
  type: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame(() => {
    if (!meshRef.current) return;
    
    // Auto rotation
    meshRef.current.rotation.x += rotationSpeed[0] * (hovered ? 2 : 1);
    meshRef.current.rotation.y += rotationSpeed[1] * (hovered ? 2 : 1);
    meshRef.current.rotation.z += rotationSpeed[2] * (hovered ? 2 : 1);

    // Hover scale bounce
    const targetScale = hovered ? scale * 1.35 : scale;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {type === 0 ? (
        <octahedronGeometry args={[1, 1]} />
      ) : type === 1 ? (
        <torusGeometry args={[0.6, 0.15, 8, 24]} />
      ) : (
        <boxGeometry args={[0.8, 0.8, 0.8]} />
      )}
      <meshStandardMaterial
        color={hovered ? "#06b6d4" : "#8b5cf6"}
        wireframe={type !== 2}
        roughness={0.1}
        metalness={0.9}
        emissive={hovered ? "#06b6d4" : "#8b5cf6"}
        emissiveIntensity={hovered ? 1.2 : 0.4}
      />
    </mesh>
  );
}



// Core Glowing Mech Mesh Assembly in the center


export function HeroScene() {
  // Generate random shard characteristics
  const shards = useMemo(() => {
    const list = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
      // Avoid center position [0,0,0]
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 6 + 3.5;
      const x = Math.cos(angle) * radius;
      const y = (Math.random() - 0.5) * 8;
      const z = (Math.random() - 0.5) * 5 - 2;

      list.push({
        position: [x, y, z] as [number, number, number],
        scale: Math.random() * 0.4 + 0.18,
        rotationSpeed: [
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
        ] as [number, number, number],
        type: Math.floor(Math.random() * 3),
      });
    }
    return list;
  }, []);

  return (
    <div className="absolute inset-0 z-0 bg-transparent w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <fog attach="fog" args={["#050508", 10, 20]} />
        
        {/* Lights — tuned for white robot visibility */}
        <ambientLight intensity={0.7} color="#ffffff" />
        {/* Strong white key light from front */}
        <directionalLight position={[0, 3, 6]} intensity={3.5} color="#ffffff" />
        {/* Cyan rim fill left */}
        <pointLight position={[-8, 4, -4]} intensity={1.2} color="#06b6d4" />
        {/* Purple rim fill right */}
        <pointLight position={[8, 4, -4]} intensity={1.2} color="#8b5cf6" />
        {/* Soft top light */}
        <spotLight
          position={[0, 8, 4]}
          angle={0.35}
          penumbra={1}
          intensity={2.5}
          color="#e0f2fe"
          castShadow
        />

        {/* 3D Elements */}
        <Float speed={1.2} floatIntensity={0.6} floatingRange={[-0.1, 0.1]}>
          <group position={[0, -1.35, 0]} scale={[1.9, 1.9, 1.9]}>
            <RobotHumanoid isThinking={false} isTyping={false} />
          </group>
        </Float>
        
        {shards.map((shard, idx) => (
          <FloatingShard key={idx} {...shard} />
        ))}
        
        {/* Allow slight mouse look around */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 2.2}
          maxAzimuthAngle={Math.PI / 16}
          minAzimuthAngle={-Math.PI / 16}
        />
      </Canvas>
    </div>
  );
}
