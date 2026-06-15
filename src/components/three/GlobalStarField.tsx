import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMousePosition } from "../../hooks/useMousePosition";

function StarFieldPoints() {
  const pointsRef = useRef<THREE.Points>(null);
  const mouse = useMousePosition(); // reads from shared ref, zero re-renders

  // Reduced star count for better performance
  const count = 1200;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  // Reusable material (avoids allocation each frame)
  const material = useMemo(() => new THREE.PointsMaterial({
    size: 0.07,
    color: "#06b6d4",
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.getElapsedTime();

    pointsRef.current.rotation.y = t * 0.015;
    pointsRef.current.rotation.x = t * 0.005;

    // Drift following normalized mouse (reads from ref, no re-renders)
    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x, mouse.x * 2.0, 0.03
    );
    pointsRef.current.position.y = THREE.MathUtils.lerp(
      pointsRef.current.position.y, mouse.y * 2.0, 0.03
    );
  });

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
    </points>
  );
}

export function GlobalStarField() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none w-full h-full bg-[#050508]">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{
          antialias: false, // not needed for a star bg; saves GPU
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        dpr={[1, 1.5]} // cap pixel ratio to avoid over-rendering on HiDPI
      >
        <ambientLight intensity={1.0} />
        <StarFieldPoints />
      </Canvas>
    </div>
  );
}
