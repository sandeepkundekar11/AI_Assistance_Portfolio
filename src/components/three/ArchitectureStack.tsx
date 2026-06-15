import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { portfolioData } from "../../data/portfolio";
import { RobotHumanoid } from "./AiAvatar";

interface LayerPlateProps {
  index: number;
  name: string;
  tech: string;
  selected: boolean;
  onSelect: () => void;
}

function LayerPlate({ index, name, tech, selected, onSelect }: LayerPlateProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  // Define accent colors matching the existing design system
  const accentColor = index === 3 ? "#10b981" : index === 0 || index === 2 ? "#06b6d4" : "#8b5cf6";

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Unique float motion per plate
    meshRef.current.position.y = (1.8 - index * 0.9) + Math.sin(time * 1.5 + index * 1.2) * 0.06;
  });

  return (
    <group
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* 3D Glass Layer Slab */}
      <mesh>
        <boxGeometry args={[3.2, 0.12, 2.0]} />
        <meshStandardMaterial
          color={selected ? accentColor : hovered ? "#1f1f38" : "#0d0d1b"}
          roughness={0.15}
          metalness={0.9}
          transparent
          opacity={selected ? 0.8 : hovered ? 0.7 : 0.55}
          emissive={selected || hovered ? accentColor : "#0d0d1b"}
          emissiveIntensity={selected ? 1.4 : hovered ? 0.6 : 0.05}
        />
      </mesh>

      {/* Wireframe border highlight */}
      <mesh scale={[1.02, 1.02, 1.02]}>
        <boxGeometry args={[3.2, 0.12, 2.0]} />
        <meshBasicMaterial
          color={selected ? accentColor : hovered ? accentColor : "#3a3a5e"}
          wireframe
          transparent
          opacity={selected ? 0.95 : hovered ? 0.75 : 0.25}
        />
      </mesh>

      {/* Dynamic Glow Orbs on Corner Nodes */}
      {(selected || hovered) && (
        <group>
          {/* Front Left Corner Node */}
          <mesh position={[-1.6, 0, 1.0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
          {/* Front Right Corner Node */}
          <mesh position={[1.6, 0, 1.0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
          {/* Back Left Corner Node */}
          <mesh position={[-1.6, 0, -1.0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
          {/* Back Right Corner Node */}
          <mesh position={[1.6, 0, -1.0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshBasicMaterial color={accentColor} />
          </mesh>
        </group>
      )}

      {/* Screen space layer labels */}
      <Html
        distanceFactor={6.8}
        position={[2.0, 0, 0]}
        center
      >
        <div
          className={`flex flex-col pl-4 border-l-2 py-1 select-none pointer-events-none transition-all duration-300 whitespace-nowrap ${
            selected
              ? "border-cyber-cyan opacity-100 scale-105"
              : hovered
              ? "border-cyber-purple opacity-90 scale-102"
              : "border-space-border/30 opacity-45"
          }`}
        >
          <span
            className={`font-orbitron text-[9px] font-bold tracking-wider ${
              selected ? "text-white" : hovered ? "text-gray-300" : "text-gray-500"
            }`}
          >
            L0{index + 1} // {name}
          </span>
          <span className="font-space text-[8px] text-gray-500 mt-0.5">{tech}</span>
        </div>
      </Html>
    </group>
  );
}

// Vertical wires running through the layers
function StackConnectingWires() {
  const points = useMemo(() => {
    return [
      // 4 corners vertical lines
      [[-1.5, -2.4, 0.9], [-1.5, 2.4, 0.9]],
      [[1.5, -2.4, 0.9], [1.5, 2.4, 0.9]],
      [[-1.5, -2.4, -0.9], [-1.5, 2.4, -0.9]],
      [[1.5, -2.4, -0.9], [1.5, 2.4, -0.9]],
    ] as [number, number, number][][];
  }, []);

  return (
    <group>
      {points.map((ptPair: [number, number, number][], idx: number) => {
        const geom = new THREE.BufferGeometry().setFromPoints(
          ptPair.map((p: [number, number, number]) => new THREE.Vector3(...p))
        );
        return (
          <line key={idx}>
            <primitive object={geom} attach="geometry" />
            <lineBasicMaterial
              color="#3a3a5e"
              transparent
              opacity={0.35}
            />
          </line>
        );
      })}
    </group>
  );
}

// Pulsing nodes running along the connecting wire pathways
function DataPulseParticle({ delay = 0, speed = 1.0 }) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    // Travel vertically between Y = -2.4 and Y = 2.4
    const t = ((time * 0.2 * speed + delay) % 1.0);
    const yVal = -2.4 + t * 4.8;
    ref.current.position.y = yVal;
  });

  return (
    <group>
      {/* Front Left Wire Pulse */}
      <mesh ref={ref} position={[-1.5, 0, 0.9]}>
        <sphereGeometry args={[0.035, 6, 6]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

interface ArchitectureStackProps {
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export function ArchitectureStack({ selectedIndex, onSelect }: ArchitectureStackProps) {
  return (
    <div className="w-full h-full min-h-[350px] cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [-3.8, 1.8, 5.0], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[6, 8, 5]} intensity={1.5} color="#8b5cf6" />
        <pointLight position={[-6, -6, -5]} intensity={1.5} color="#06b6d4" />
        <directionalLight position={[0, 10, 0]} intensity={0.5} />

        {/* Base Stack Components */}
        <group position={[-1.0, 0, 0]}>
          {portfolioData.architecture.layers.map((layer, idx) => (
            <LayerPlate
              key={idx}
              index={idx}
              name={layer.name}
              tech={layer.tech}
              selected={selectedIndex === idx}
              onSelect={() => onSelect(idx)}
            />
          ))}

          {/* Guide connection wires */}
          <StackConnectingWires />

          {/* Data signals */}
          <DataPulseParticle speed={1.2} delay={0.0} />
          <DataPulseParticle speed={0.9} delay={0.3} />
          <DataPulseParticle speed={1.5} delay={0.6} />
        </group>

        {/* AI Robot Humanoid in background */}
        <group position={[1.4, -0.9, -0.6]} scale={[0.55, 0.55, 0.55]} rotation={[0, -0.3, 0]}>
          <RobotHumanoid isThinking={false} isTyping={false} />
        </group>

        {/* Orbitcontrols restricting angles so it displays nicely in the card view */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.6}
          minPolarAngle={Math.PI / 2.6}
          maxAzimuthAngle={Math.PI / 4}
          minAzimuthAngle={-Math.PI / 4}
          rotateSpeed={0.55}
        />
      </Canvas>
    </div>
  );
}
