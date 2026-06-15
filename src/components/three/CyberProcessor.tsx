import React, { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

// A glowing, floating bit particle that travels along a wire route
function DataPacket({ pathPoints, color, speed = 1, delay = 0 }: {
  pathPoints: [number, number, number][];
  color: string;
  speed?: number;
  delay?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const curve = useMemo(() => {
    const vectors = pathPoints.map(p => new THREE.Vector3(...p));
    return new THREE.CatmullRomCurve3(vectors);
  }, [pathPoints]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    // Offset by delay and wrap with modulo to loop
    const t = ((time * 0.15 * speed + delay) % 1.0);
    const position = curve.getPointAt(t);
    meshRef.current.position.copy(position);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Inner chip unit
function ChipCore({ hovered }: { hovered: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const circuitGroupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const rotSpeed = hovered ? 0.6 : 0.2;
    
    if (coreRef.current) {
      coreRef.current.rotation.y = time * rotSpeed;
    }
    if (circuitGroupRef.current) {
      circuitGroupRef.current.rotation.y = -time * rotSpeed * 0.5;
    }
  });

  // Material settings for the chip
  const coreMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#0a0a16",
      roughness: 0.15,
      metalness: 0.9,
      emissive: "#8b5cf6",
      emissiveIntensity: hovered ? 1.0 : 0.3,
    });
  }, [hovered]);

  return (
    <group>
      {/* Central Chip Body */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.15, 1.5]} />
        <primitive object={coreMaterial} attach="material" />
        
        {/* Core Cap (glowing node in the middle) */}
        <mesh position={[0, 0.09, 0]}>
          <boxGeometry args={[0.6, 0.05, 0.6]} />
          <meshStandardMaterial
            color={hovered ? "#06b6d4" : "#8b5cf6"}
            emissive={hovered ? "#06b6d4" : "#8b5cf6"}
            emissiveIntensity={hovered ? 2.5 : 1.0}
          />
        </mesh>
      </mesh>

      {/* Circuit board base */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[2.5, 0.05, 2.5]} />
        <meshStandardMaterial
          color="#06060c"
          roughness={0.4}
          metalness={0.8}
        />
        {/* Wireframe border glow */}
        <mesh scale={[1.02, 1.02, 1.02]}>
          <boxGeometry args={[2.5, 0.05, 2.5]} />
          <meshBasicMaterial
            color={hovered ? "#06b6d4" : "#8b5cf6"}
            wireframe
            transparent
            opacity={hovered ? 0.8 : 0.3}
          />
        </mesh>
      </mesh>

      {/* Orbiting structure rings */}
      <group ref={circuitGroupRef} position={[0, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 8, 64]} />
          <meshBasicMaterial
            color={hovered ? "#06b6d4" : "#8b5cf6"}
            transparent
            opacity={hovered ? 0.7 : 0.3}
          />
        </mesh>
        
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.15, 0]}>
          <torusGeometry args={[1.2, 0.015, 8, 48]} />
          <meshBasicMaterial
            color={hovered ? "#06b6d4" : "#8b5cf6"}
            transparent
            opacity={hovered ? 0.6 : 0.25}
          />
        </mesh>
      </group>
    </group>
  );
}

// Glowing background circuit lines
function CircuitLines() {
  const linePoints = useMemo(() => {
    // Generate some static path points for details
    return [
      // Top-Left to Center
      [[-2, 0, -2], [-1.2, 0, -1.2], [-0.8, 0, -0.8]],
      // Top-Right to Center
      [[2, 0, -2], [1.2, 0, -1.2], [0.8, 0, -0.8]],
      // Bottom-Left to Center
      [[-2, 0, 2], [-1.2, 0, 1.2], [-0.8, 0, 0.8]],
      // Bottom-Right to Center
      [[2, 0, 2], [1.2, 0, 1.2], [0.8, 0, 0.8]],
      // Vertical cross
      [[0, 0, -2], [0, 0, -0.8]],
      [[0, 0, 2], [0, 0, 0.8]],
      [[-2, 0, 0], [-0.8, 0, 0]],
      [[2, 0, 0], [0.8, 0, 0]],
    ] as [number, number, number][][];
  }, []);

  return (
    <group position={[0, -0.14, 0]}>
      {linePoints.map((points: [number, number, number][], idx: number) => {
        const lineGeom = new THREE.BufferGeometry().setFromPoints(
          points.map((p: [number, number, number]) => new THREE.Vector3(...p))
        );
        return (
          <line key={idx}>
            <primitive object={lineGeom} attach="geometry" />
            <lineBasicMaterial
              color="#3b2b63"
              linewidth={1}
              transparent
              opacity={0.4}
            />
          </line>
        );
      })}
    </group>
  );
}

export function CyberProcessor() {
  const [hovered, setHovered] = useState(false);

  // Define packet path trajectories
  const packetPaths = useMemo(() => {
    return [
      [[-2, -0.14, -2], [-1.2, -0.14, -1.2], [-0.8, -0.14, -0.8], [0, -0.05, 0]],
      [[2, -0.14, -2], [1.2, -0.14, -1.2], [0.8, -0.14, -0.8], [0, -0.05, 0]],
      [[-2, -0.14, 2], [-1.2, -0.14, 1.2], [-0.8, -0.14, 0.8], [0, -0.05, 0]],
      [[2, -0.14, 2], [1.2, -0.14, 1.2], [0.8, -0.14, 0.8], [0, -0.05, 0]],
    ] as [number, number, number][][];
  }, []);

  return (
    <div 
      className="w-full h-full min-h-[200px]"
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 2.8, 4.0], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color={hovered ? "#06b6d4" : "#8b5cf6"} />
        <pointLight position={[-5, -2, -5]} intensity={0.8} color="#06b6d4" />
        
        {/* Core elements */}
        <ChipCore hovered={hovered} />
        
        {/* Circuit board traces */}
        <CircuitLines />
        
        {/* Animated packet nodes */}
        {packetPaths.map((path, idx) => (
          <React.Fragment key={idx}>
            <DataPacket pathPoints={path} color={hovered ? "#06b6d4" : "#8b5cf6"} speed={1.2} delay={idx * 0.25} />
            <DataPacket pathPoints={path} color={hovered ? "#a855f7" : "#06b6d4"} speed={0.8} delay={idx * 0.25 + 0.5} />
          </React.Fragment>
        ))}

        {/* Orbit controls restricting viewing angles so user doesn't flip it upside down */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 4}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
