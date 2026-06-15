import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { portfolioData } from "../../data/portfolio";
import { RobotHumanoid } from "./AiAvatar";

interface SkillNodeProps {
  name: string;
  position: [number, number, number];
  color: string;
}

function SkillNode({ name, position, color }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.08;
  });

  return (
    <group position={position}>
      {/* 3D mesh dot */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? "#06b6d4" : color}
          roughness={0.1}
          metalness={0.9}
          emissive={hovered ? "#06b6d4" : color}
          emissiveIntensity={hovered ? 1.5 : 0.4}
        />
      </mesh>

      {/* Floating line connector back to center */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0, -position[0], -position[1], -position[2]]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={hovered ? "#06b6d4" : "rgba(139, 92, 246, 0.2)"} linewidth={1} />
      </line>

      {/* Screen space tag */}
      <Html distanceFactor={7} position={[0, 0.35, 0]} center>
        <div
          className={`px-3 py-1 font-space text-[10px] font-bold rounded border uppercase whitespace-nowrap transition-all duration-300 pointer-events-none select-none ${
            hovered
              ? "bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)] scale-110"
              : "bg-space-black/80 text-gray-400 border-space-border/50"
          }`}
        >
          {name}
        </div>
      </Html>
    </group>
  );
}

function GalaxyCluster() {
  const groupRef = useRef<THREE.Group>(null);

  // Auto slow spin
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Flat array of skills
  const skills = useMemo(() => {
    const list = portfolioData.skills.flatMap((cat, catIdx) => {
      // Pick a color for each category
      let color = "#8b5cf6"; // purple
      if (catIdx === 0) color = "#06b6d4"; // cyan
      if (catIdx === 2) color = "#10b981"; // emerald
      if (catIdx === 4) color = "#ec4899"; // pink

      return cat.skills.map((sk) => ({
        name: sk.name,
        color,
      }));
    });

    return list.map((sk, idx) => {
      // Spread nodes evenly on a sphere coordinates using Fibonacci sphere algorithm
      const count = list.length;
      const phi = Math.acos(1 - 2 * (idx + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * idx;

      const r = 3.6;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      return {
        ...sk,
        position: [x, y, z] as [number, number, number],
      };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Central Core Processor Node -> AI Robot Humanoid */}
      <group scale={[0.55, 0.55, 0.55]} position={[0, -0.4, 0]}>
        <RobotHumanoid isThinking={false} isTyping={false} />
      </group>

      {/* Orbiting skill nodes */}
      {skills.map((sk, idx) => (
        <SkillNode key={idx} {...sk} />
      ))}
    </group>
  );
}

export function SkillsGalaxy() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 7.8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#8b5cf6" />
        <pointLight position={[-5, -5, -5]} intensity={1.5} color="#06b6d4" />
        
        <GalaxyCluster />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.65}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
