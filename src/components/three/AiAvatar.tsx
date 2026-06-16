import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface RobotHumanoidProps {
  isThinking: boolean;
  isTyping: boolean;
  isListening?: boolean;
  isWaving?: boolean;
}

// ----------------------------------------------------
// ROBOT FINGER COMPONENT
// ----------------------------------------------------
interface FingerProps {
  offset: [number, number, number];
  length: number;
  thickness: number;
  rotationZ?: number;
  rotationX?: number;
  materialBody: THREE.Material;
  materialJoint: THREE.Material;
}

function RobotFinger({
  offset,
  length,
  thickness,
  rotationZ = 0,
  rotationX = 0,
  materialBody,
  materialJoint,
}: FingerProps) {
  return (
    <group position={offset} rotation={[rotationX, 0, rotationZ]}>
      {/* Knuckle base */}
      <mesh>
        <sphereGeometry args={[thickness * 1.35, 12, 12]} />
        <primitive object={materialJoint} attach="material" />
      </mesh>
      {/* Proximal segment */}
      <mesh position={[0, -length * 0.35, 0]}>
        <cylinderGeometry args={[thickness, thickness * 0.9, length * 0.7, 10]} />
        <primitive object={materialBody} attach="material" />
      </mesh>
      {/* Mid joint */}
      <group position={[0, -length * 0.7, 0]}>
        <mesh>
          <sphereGeometry args={[thickness * 1.15, 10, 10]} />
          <primitive object={materialJoint} attach="material" />
        </mesh>
        {/* Distal segment */}
        <mesh position={[0, -length * 0.25, 0]}>
          <cylinderGeometry args={[thickness * 0.9, thickness * 0.7, length * 0.5, 10]} />
          <primitive object={materialBody} attach="material" />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------
// ROBOT HAND COMPONENT
// ----------------------------------------------------
interface RobotHandProps {
  side: "left" | "right";
  isWaving?: boolean;
  materialBody: THREE.Material;
  materialJoint: THREE.Material;
}

function RobotHand({ side, isWaving = false, materialBody, materialJoint }: RobotHandProps) {
  const isLeft = side === "left";
  const flip = isLeft ? 1 : -1;

  // Wave pose rotation offset if waving
  const handRotX = isWaving && !isLeft ? -0.2 : 0;
  const handRotZ = isWaving && !isLeft ? 0.3 : 0;

  return (
    <group rotation={[handRotX, 0, handRotZ]}>
      {/* Palm Plate */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.11, 0.08, 0.048]} />
        <primitive object={materialBody} attach="material" />
      </mesh>
      {/* Backhand carbon cover */}
      <mesh position={[0, -0.05, 0.026]}>
        <boxGeometry args={[0.08, 0.06, 0.01]} />
        <meshStandardMaterial color="#1e293b" roughness={0.35} metalness={0.8} />
      </mesh>
      {/* Fingers */}
      <RobotFinger
        offset={[-0.04 * flip, -0.09, 0.01]}
        length={0.062}
        thickness={0.011}
        materialBody={materialBody}
        materialJoint={materialJoint}
      />
      <RobotFinger
        offset={[-0.013 * flip, -0.09, 0.013]}
        length={0.072}
        thickness={0.012}
        materialBody={materialBody}
        materialJoint={materialJoint}
      />
      <RobotFinger
        offset={[0.013 * flip, -0.09, 0.013]}
        length={0.068}
        thickness={0.011}
        materialBody={materialBody}
        materialJoint={materialJoint}
      />
      <RobotFinger
        offset={[0.04 * flip, -0.09, 0.009]}
        length={0.058}
        thickness={0.01}
        materialBody={materialBody}
        materialJoint={materialJoint}
      />
      {/* Thumb */}
      <RobotFinger
        offset={[-0.055 * flip, -0.035, -0.005]}
        length={0.048}
        thickness={0.012}
        rotationZ={0.65 * flip}
        rotationX={0.2}
        materialBody={materialBody}
        materialJoint={materialJoint}
      />
    </group>
  );
}

// ----------------------------------------------------
// REACTOR CORE COMPONENT
// ----------------------------------------------------
interface ReactorCoreProps {
  isThinking: boolean;
  isListening: boolean;
  isTyping: boolean;
  cogRef: React.RefObject<THREE.Group | null>;
  materialJoint: THREE.Material;
  materialGold: THREE.Material;
}

function ReactorCore({
  isThinking,
  isListening,
  isTyping,
  cogRef,
  materialJoint,
  materialGold,
}: ReactorCoreProps) {
  const glowColor = isThinking
    ? "#10b981"
    : isListening
      ? "#f59e0b"
      : isTyping
        ? "#00f0ff"
        : "#6366f1";

  return (
    <group position={[0, -0.08, 0.32]} rotation={[0.08, 0, 0]}>
      {/* Outer Chamber Rim */}
      <mesh>
        <torusGeometry args={[0.165, 0.024, 16, 48]} />
        <primitive object={materialGold} attach="material" />
      </mesh>
      {/* Core Backing Plate */}
      <mesh position={[0, 0, -0.03]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 32]} />
        <primitive object={materialJoint} attach="material" />
      </mesh>
      {/* Rotating Mechanical Cog */}
      <group ref={cogRef} position={[0, 0, -0.01]}>
        <mesh>
          <cylinderGeometry args={[0.075, 0.075, 0.015, 12]} />
          <primitive object={materialJoint} attach="material" />
        </mesh>
        {Array.from({ length: 8 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <boxGeometry args={[0.025, 0.11, 0.014]} />
            <primitive object={materialJoint} attach="material" />
          </mesh>
        ))}
      </group>
      {/* Copper winding coils around the core */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i * Math.PI) / 5;
        const radius = 0.115;
        return (
          <group
            key={i}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, -0.01]}
            rotation={[0, 0, angle]}
          >
            <mesh>
              <cylinderGeometry args={[0.014, 0.014, 0.038, 8]} />
              <meshPhysicalMaterial color="#b45309" metalness={0.96} roughness={0.15} />
            </mesh>
          </group>
        );
      })}
      {/* Glowing Inner Core Sphere */}
      <mesh position={[0, 0, 0.01]}>
        <sphereGeometry args={[0.046, 20, 20]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>

    </group>
  );
}

// ----------------------------------------------------
// MAIN ROBOTHUMANOID COMPONENT
// ----------------------------------------------------
export function RobotHumanoid({
  isThinking,
  isTyping,
  isListening = false,
  isWaving = false,
}: RobotHumanoidProps) {
  const headRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const robotRootRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const visorMaterialRef = useRef<THREE.MeshStandardMaterial>(null);

  // Mechanical spinal rings (vertebrae)
  const spine1Ref = useRef<THREE.Mesh>(null);
  const spine2Ref = useRef<THREE.Mesh>(null);
  const spine3Ref = useRef<THREE.Mesh>(null);

  // Hydraulic neck pistons
  const leftPistonBaseRef = useRef<THREE.Group>(null);
  const leftPistonShaftRef = useRef<THREE.Mesh>(null);
  const rightPistonBaseRef = useRef<THREE.Group>(null);
  const rightPistonShaftRef = useRef<THREE.Mesh>(null);

  // Torso / Reactor Core Refs
  const cogRef = useRef<THREE.Group>(null);

  // Dynamic canvas texture for the faceplate
  const faceCanvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    return canvas;
  }, []);

  const faceTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(faceCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [faceCanvas]);

  const drawFace = (time: number) => {
    const ctx = faceCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1024, 1024);

    const grad = ctx.createRadialGradient(512, 512, 50, 512, 512, 600);
    grad.addColorStop(0, "#081528");
    grad.addColorStop(1, "#03070d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    ctx.save();
    ctx.translate(512, 512);
    ctx.scale(0.8, 1);

    const ledColor = isThinking ? "#00ff88" : isListening ? "#ffaa00" : isTyping ? "#00f3ff" : "#38bdf8";
    ctx.fillStyle = ledColor;
    ctx.strokeStyle = ledColor;
    ctx.shadowColor = ledColor;
    ctx.shadowBlur = 40;

    if (isListening) {
      const R = 95;
      ctx.beginPath();
      ctx.arc(-175, -65, R + Math.sin(time * 8.0) * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(175, -65, R + Math.sin(time * 8.0) * 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(0, 95, 48 + Math.cos(time * 8.0) * 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#081528";
      ctx.beginPath();
      ctx.arc(0, 95, (48 + Math.cos(time * 8.0) * 6) * 0.72, 0, Math.PI * 2);
      ctx.fill();
    } else if (isThinking) {
      const eyeScaleY = 0.15 + Math.abs(Math.sin(time * 4.5)) * 0.7;

      ctx.save();
      ctx.translate(-175, -65);
      ctx.scale(1.0, eyeScaleY);
      ctx.beginPath();
      ctx.arc(0, 0, 105, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(175, -65);
      ctx.scale(1.0, eyeScaleY);
      ctx.beginPath();
      ctx.arc(0, 0, 105, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.strokeStyle = ledColor;
      ctx.beginPath();
      const startX = -120;
      const endX = 120;
      ctx.moveTo(startX, 95);
      for (let x = startX; x <= endX; x += 15) {
        const y = 95 + Math.sin(time * 15.0 + (x - startX) * 0.08) * 20;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    } else {
      const R = 115;
      ctx.beginPath();
      ctx.arc(-175, -65, R, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.arc(175, -65, R, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();

      ctx.save();
      ctx.translate(0, 75);
      if (isTyping) {
        const mouthOpen = 0.2 + Math.abs(Math.sin(time * 16.0)) * 0.95;
        ctx.scale(1.0, mouthOpen);
      }
      ctx.beginPath();
      ctx.arc(0, 0, 75, 0, Math.PI, false);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  const createRoundedBoxGeometry = (
    width: number,
    height: number,
    depth: number,
    radius: number,
    segments: number
  ) => {
    const geom = new THREE.BoxGeometry(width, height, depth, segments, segments, segments);
    const posAttr = geom.attributes.position;
    const temp = new THREE.Vector3();
    for (let i = 0; i < posAttr.count; i++) {
      temp.fromBufferAttribute(posAttr, i);
      const sx = Math.sign(temp.x);
      const sy = Math.sign(temp.y);
      const sz = Math.sign(temp.z);

      const innerX = temp.x - sx * radius;
      const innerY = temp.y - sy * radius;
      const innerZ = temp.z - sz * radius;

      const dx = Math.abs(temp.x) > width / 2 - radius;
      const dy = Math.abs(temp.y) > height / 2 - radius;
      const dz = Math.abs(temp.z) > depth / 2 - radius;

      if (dx && dy && dz) {
        const vec = new THREE.Vector3(innerX, innerY, innerZ).normalize().multiplyScalar(radius);
        posAttr.setXYZ(
          i,
          sx * (width / 2 - radius) + vec.x,
          sy * (height / 2 - radius) + vec.y,
          sz * (depth / 2 - radius) + vec.z
        );
      } else if (dx && dy) {
        const vec = new THREE.Vector2(innerX, innerY).normalize().multiplyScalar(radius);
        posAttr.setXYZ(i, sx * (width / 2 - radius) + vec.x, sy * (height / 2 - radius) + vec.y, temp.z);
      } else if (dx && dz) {
        const vec = new THREE.Vector2(innerX, innerZ).normalize().multiplyScalar(radius);
        posAttr.setXYZ(i, sx * (width / 2 - radius) + vec.x, temp.y, sz * (depth / 2 - radius) + vec.y);
      } else if (dy && dz) {
        const vec = new THREE.Vector2(innerY, innerZ).normalize().multiplyScalar(radius);
        posAttr.setXYZ(i, temp.x, sy * (height / 2 - radius) + vec.x, sz * (depth / 2 - radius) + vec.y);
      }
    }
    geom.computeVertexNormals();
    return geom;
  };

  const headGeometry = useMemo(() => {
    return createRoundedBoxGeometry(0.96, 0.82, 0.78, 0.22, 16);
  }, []);

  const visorGeometry = useMemo(() => {
    return createRoundedBoxGeometry(0.76, 0.6, 0.00, 0.1, 16);
  }, []);

  const faceFrameSkip = useRef(0);

  // ----------------------------------------------------
  // USEFRAME ANIMATION LOOP
  // ----------------------------------------------------
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointerX = state.pointer.x * 0.35;
    const pointerY = state.pointer.y * 0.25;

    faceFrameSkip.current = (faceFrameSkip.current + 1) % 2;
    if (faceFrameSkip.current === 0) {
      drawFace(time);
      faceTexture.needsUpdate = true;
    }

    if (visorMaterialRef.current) {
      visorMaterialRef.current.emissiveIntensity = isThinking
        ? 1.5 + Math.sin(time * 8.0) * 0.45
        : 1.5;
    }

    // Spin Reactor Core Cog
    if (cogRef.current) {
      cogRef.current.rotation.z = time * 2.2;
    }

    // Breathing float
    if (robotRootRef.current) {
      robotRootRef.current.position.y = -0.15 + Math.sin(time * 1.3) * 0.035;
    }

    // Head tracking calculations
    let targetRotY = pointerX;
    let targetRotX = -pointerY + 0.05;
    let targetRotZ = 0;

    if (isWaving) {
      targetRotY += Math.sin(time * 3.0) * 0.08;
      targetRotZ = Math.sin(time * 2.5) * 0.05;
    } else if (isThinking) {
      targetRotZ = 0.05 + Math.sin(time * 2.0) * 0.02;
      targetRotX += 0.02 + Math.cos(time * 1.5) * 0.03;
    }

    if (headRef.current) {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotZ, 0.08);

      // Vertebrae organic bending
      const curRotY = headRef.current.rotation.y;
      const curRotX = headRef.current.rotation.x;
      const curRotZ = headRef.current.rotation.z;

      if (spine1Ref.current) {
        spine1Ref.current.rotation.y = curRotY * 0.25;
        spine1Ref.current.rotation.x = curRotX * 0.25;
        spine1Ref.current.rotation.z = curRotZ * 0.25;
        spine1Ref.current.position.set(0.0, 0.22, 0);
      }
      if (spine2Ref.current) {
        spine2Ref.current.rotation.y = curRotY * 0.55;
        spine2Ref.current.rotation.x = curRotX * 0.55;
        spine2Ref.current.rotation.z = curRotZ * 0.55;
        spine2Ref.current.position.set(curRotY * 0.04, 0.29, -curRotX * 0.015);
      }
      if (spine3Ref.current) {
        spine3Ref.current.rotation.y = curRotY * 0.8;
        spine3Ref.current.rotation.x = curRotX * 0.8;
        spine3Ref.current.rotation.z = curRotZ * 0.8;
        spine3Ref.current.position.set(curRotY * 0.08, 0.36, -curRotX * 0.03);
      }

      // Hydraulic Neck Pistons dynamic aiming
      const headPos = new THREE.Vector3(0, 0.48, 0);
      const headEuler = new THREE.Euler(curRotX, curRotY, curRotZ, "YXZ");

      if (leftPistonBaseRef.current && leftPistonShaftRef.current) {
        const leftTargetLocal = new THREE.Vector3(-0.16, -0.09, -0.06);
        leftTargetLocal.applyEuler(headEuler);
        const targetWorld = headPos.clone().add(leftTargetLocal);
        const baseWorld = new THREE.Vector3(-0.13, 0.17, -0.08);

        const dir = new THREE.Vector3().subVectors(targetWorld, baseWorld);
        const len = dir.length();

        leftPistonBaseRef.current.position.copy(baseWorld);
        leftPistonBaseRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        leftPistonShaftRef.current.position.y = len * 0.45;
      }

      if (rightPistonBaseRef.current && rightPistonShaftRef.current) {
        const rightTargetLocal = new THREE.Vector3(0.16, -0.09, -0.06);
        rightTargetLocal.applyEuler(headEuler);
        const targetWorld = headPos.clone().add(rightTargetLocal);
        const baseWorld = new THREE.Vector3(0.13, 0.17, -0.08);

        const dir = new THREE.Vector3().subVectors(targetWorld, baseWorld);
        const len = dir.length();

        rightPistonBaseRef.current.position.copy(baseWorld);
        rightPistonBaseRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        rightPistonShaftRef.current.position.y = len * 0.45;
      }
    }

    // Arm micro-animations (Breathing + Wave state)
    if (leftShoulderRef.current && rightShoulderRef.current) {
      const breathingAngle = Math.sin(time * 1.3) * 0.02;

      let targetLeftRotX = -0.05 + breathingAngle;
      let targetLeftRotZ = Math.PI / 16;
      let targetRightRotX = 0.05 + breathingAngle;
      let targetRightRotZ = -Math.PI / 16;

      if (isWaving) {
        // Raise right shoulder for waving
        targetRightRotX = -Math.PI / 2.2 + Math.sin(time * 8.0) * 0.1;
        targetRightRotZ = -Math.PI / 3 + Math.cos(time * 8.5) * 0.15;
      }

      leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, targetLeftRotX, 0.08);
      leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, targetLeftRotZ, 0.08);

      rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, targetRightRotX, 0.08);
      rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, targetRightRotZ, 0.08);
    }

    // Dynamic ground shadow
    if (shadowRef.current) {
      const heightOffset = Math.sin(time * 1.3);
      const shadowScale = 1.0 + heightOffset * 0.08;
      const shadowOpacity = 0.14 - heightOffset * 0.03;
      shadowRef.current.scale.set(shadowScale, shadowScale, 1);
      if (shadowRef.current.material) {
        (shadowRef.current.material as THREE.MeshBasicMaterial).opacity = shadowOpacity;
      }
    }
  });

  // ----------------------------------------------------
  // HIGH-QUALITY PHYSICAL SHADERS & MATERIALS
  // ----------------------------------------------------
  const matWhiteBody = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#f8fafc",
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
    []
  );

  const matGraphiteJoint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#27272a",
        roughness: 0.22,
        metalness: 0.9,
        clearcoat: 0.3,
      }),
    []
  );

  const matGoldAccent = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#d97706",
        roughness: 0.16,
        metalness: 0.96,
        clearcoat: 0.8,
      }),
    []
  );

  const bodyTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.5, "#f1f5f9");
      grad.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 5;
      ctx.lineCap = "round";

      // Grooves & seam line detailing on body panel
      ctx.beginPath();
      ctx.moveTo(0, 270);
      ctx.lineTo(220, 270);
      ctx.lineTo(220, 285);
      ctx.lineTo(292, 285);
      ctx.lineTo(292, 270);
      ctx.lineTo(512, 270);
      ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.offset.x = -0.25;
    return tex;
  }, []);

  const matTorsoBody = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        roughness: 0.12,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        map: bodyTexture,
        side: THREE.DoubleSide,
      }),
    [bodyTexture]
  );

  const torsoGeometry = useMemo(() => {
    const curve = new THREE.CubicBezierCurve(
      new THREE.Vector2(0.01, 0.38),
      new THREE.Vector2(0.58, 0.3),
      new THREE.Vector2(0.44, -0.44),
      new THREE.Vector2(0.01, -0.54)
    );
    const points = curve.getPoints(32);
    return new THREE.LatheGeometry(points, 64);
  }, []);

  const leftArmGeometry = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.12, -0.16, 0.06),
      new THREE.Vector3(-0.21, -0.32, 0.1)
    ]);
    return new THREE.TubeGeometry(path, 24, 0.078, 16, false);
  }, []);

  const rightArmGeometry = useMemo(() => {
    const path = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.12, -0.16, 0.06),
      new THREE.Vector3(0.21, -0.32, 0.1)
    ]);
    return new THREE.TubeGeometry(path, 24, 0.078, 16, false);
  }, []);

  const earGlowColor = isThinking ? "#00ff88" : isListening ? "#ffaa00" : isTyping ? "#00f3ff" : "#38bdf8";

  return (
    <group position={[0, 0.02, 0]} scale={[1.42, 1.42, 1.42]}>
      {/* Drop Ground Shadow */}
      <mesh ref={shadowRef} position={[0, -1.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.38, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.14} depthWrite={false} />
      </mesh>

      {/* Main Robot Structure */}
      <group ref={robotRootRef}>

        {/* --- MECHANICAL COLLAR BASE --- */}
        <group position={[0, 0.11, 0]}>
          <mesh>
            <cylinderGeometry args={[0.16, 0.19, 0.05, 24]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <mesh position={[0, 0.026, 0]}>
            <torusGeometry args={[0.17, 0.012, 12, 32]} />
            <primitive object={matGoldAccent} attach="material" />
          </mesh>
        </group>

        {/* --- DETAILED SEGMENTED VERTEBRAE SPINE --- */}
        <group>
          <mesh ref={spine1Ref}>
            <cylinderGeometry args={[0.07, 0.075, 0.04, 16]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <mesh ref={spine2Ref}>
            <cylinderGeometry args={[0.065, 0.07, 0.04, 16]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <mesh ref={spine3Ref}>
            <cylinderGeometry args={[0.06, 0.065, 0.04, 16]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
        </group>

        {/* --- DYNAMIC HYDRAULIC NECK PISTONS --- */}
        <group ref={leftPistonBaseRef}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <mesh ref={leftPistonShaftRef} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.14, 8]} />
            <meshPhysicalMaterial color="#94a3b8" metalness={0.96} roughness={0.1} />
          </mesh>
        </group>

        <group ref={rightPistonBaseRef}>
          <mesh>
            <cylinderGeometry args={[0.02, 0.02, 0.14, 8]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <mesh ref={rightPistonShaftRef} position={[0, 0, 0]}>
            <cylinderGeometry args={[0.011, 0.011, 0.14, 8]} />
            <meshPhysicalMaterial color="#94a3b8" metalness={0.96} roughness={0.1} />
          </mesh>
        </group>

        {/* --- HEAD COMPONENT (Double Visor Structure) --- */}
        <group ref={headRef} position={[0, 0.48, 0]}>

          {/* Main White Glossy Head Shell */}
          <mesh>
            <primitive object={headGeometry} attach="geometry" />
            <primitive object={matWhiteBody} attach="material" />
          </mesh>

          {/* VISOR LAYER 1: Deep Inset Digital Faceplate Screen */}
          <mesh position={[0, 0, 0.391]}>
            <primitive object={visorGeometry} attach="geometry" />
            <meshStandardMaterial
              ref={visorMaterialRef}
              color="#0f172a"
              roughness={0.12}
              metalness={0.9}
              map={faceTexture}
              emissive="#ffffff"
              emissiveMap={faceTexture}
              emissiveIntensity={1.5}
            />
          </mesh>

          {/* Forehead Camera Sensor Lens (Aesthetics detail) */}
          <group position={[0, 0.31, 0.33]} rotation={[0.4, 0, 0]}>
            <mesh>
              <cylinderGeometry args={[0.04, 0.04, 0.03, 16]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0, 0.016, 0]}>
              <cylinderGeometry args={[0.028, 0.028, 0.01, 16]} />
              <primitive object={matGoldAccent} attach="material" />
            </mesh>
            <mesh position={[0, 0.021, 0]}>
              <sphereGeometry args={[0.015, 12, 12]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>

          {/* --- TOP SENSOR ANTENNA ARRAY --- */}
          <group position={[0, 0.41, 0]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.08, 0.11, 0.05, 20]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0, 0.06, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.08, 8]} />
              <primitive object={matGoldAccent} attach="material" />
            </mesh>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshBasicMaterial color={earGlowColor} />
            </mesh>
          </group>

          {/* --- LEFT EAR CUP WITH LED GLOW RING --- */}
          <group position={[-0.49, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            {/* LED Status Ring */}
            <mesh position={[0, 0.041, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.055, 0.007, 8, 24]} />
              <meshBasicMaterial color={earGlowColor} />
            </mesh>
          </group>

          {/* --- RIGHT EAR CUP WITH LED GLOW RING --- */}
          <group position={[0.49, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.13, 0.13, 0.06, 24]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.04, 24]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            {/* LED Status Ring */}
            <mesh position={[0, 0.041, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.055, 0.007, 8, 24]} />
              <meshBasicMaterial color={earGlowColor} />
            </mesh>
          </group>
        </group>

        {/* --- TORSO & CHEST REACTOR CORE --- */}
        <group position={[0, -0.22, 0]}>
          {/* Torso Outer Lathe Geometry */}
          <mesh>
            <primitive object={torsoGeometry} attach="geometry" />
            <primitive object={matTorsoBody} attach="material" />
          </mesh>

          {/* Recessed Reactor Core Assembly */}
          <ReactorCore
            isThinking={isThinking}
            isListening={isListening}
            isTyping={isTyping}
            cogRef={cogRef}
            materialJoint={matGraphiteJoint}
            materialGold={matGoldAccent}
          />
        </group>

        {/* --- DETAILED MECHANICAL RIGHT LEG --- */}
        <group>
          {/* Hip socket */}
          <mesh position={[0.16, -0.54, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          {/* Thigh Casing with decorative gold ring */}
          <group position={[0.16, -0.72, 0.02]} rotation={[0.08, 0, 0]}>
            <mesh>
              <capsuleGeometry args={[0.095, 0.22, 8, 16]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
            {/* Hydraulic damper shock strut */}
            <mesh position={[0.07, 0, -0.02]} rotation={[-0.1, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
          {/* Knee hinge mechanism */}
          <group position={[0.16, -0.9, 0.04]}>
            <mesh>
              <sphereGeometry args={[0.09, 16, 16]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.03, 16]} />
              <primitive object={matGoldAccent} attach="material" />
            </mesh>
          </group>
          {/* Calf Casing */}
          <group position={[0.16, -1.1, 0.02]} rotation={[-0.08, 0, 0]}>
            <mesh>
              <capsuleGeometry args={[0.085, 0.22, 8, 16]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
          </group>
          {/* Joint Ankle & Foot */}
          <group position={[0.16, -1.27, 0.06]} rotation={[0.05, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.055, 12, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            {/* Foot Body */}
            <mesh position={[0, -0.04, 0.04]}>
              <boxGeometry args={[0.16, 0.05, 0.22]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
            {/* Twin Toes cylinders */}
            <mesh position={[-0.045, -0.04, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0.045, -0.04, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
          </group>
        </group>

        {/* --- DETAILED MECHANICAL LEFT LEG --- */}
        <group>
          {/* Hip socket */}
          <mesh position={[-0.16, -0.54, 0]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          {/* Thigh Casing */}
          <group position={[-0.16, -0.72, 0.02]} rotation={[0.08, 0, 0]}>
            <mesh>
              <capsuleGeometry args={[0.095, 0.22, 8, 16]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
            {/* Hydraulic damper strut */}
            <mesh position={[-0.07, 0, -0.02]} rotation={[-0.1, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, 0.24, 8]} />
              <meshPhysicalMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
          {/* Knee joint */}
          <group position={[-0.16, -0.9, 0.04]}>
            <mesh>
              <sphereGeometry args={[0.09, 16, 16]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[-0.04, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <cylinderGeometry args={[0.065, 0.065, 0.03, 16]} />
              <primitive object={matGoldAccent} attach="material" />
            </mesh>
          </group>
          {/* Calf Casing */}
          <group position={[-0.16, -1.1, 0.02]} rotation={[-0.08, 0, 0]}>
            <mesh>
              <capsuleGeometry args={[0.085, 0.22, 8, 16]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
          </group>
          {/* Ankle & Foot */}
          <group position={[-0.16, -1.27, 0.06]} rotation={[0.05, 0, 0]}>
            <mesh>
              <sphereGeometry args={[0.055, 12, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            {/* Foot body */}
            <mesh position={[0, -0.04, 0.04]}>
              <boxGeometry args={[0.16, 0.05, 0.22]} />
              <primitive object={matWhiteBody} attach="material" />
            </mesh>
            {/* Toes */}
            <mesh position={[-0.045, -0.04, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0.045, -0.04, 0.16]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.06, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
          </group>
        </group>

        {/* --- DETAILED MECHANICAL RIGHT ARM (WAVING ACTION TARGET) --- */}
        <group ref={rightShoulderRef} position={[0.38, -0.12, -0.06]} rotation={[0, 0, -Math.PI / 16]}>
          {/* Shoulder Cap */}
          <mesh>
            <sphereGeometry args={[0.085, 16, 16]} />
            <primitive object={matWhiteBody} attach="material" />
          </mesh>
          {/* Arm Core Joint */}
          <mesh position={[0, -0.02, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          {/* Bicep Tube */}
          <mesh>
            <primitive object={rightArmGeometry} attach="geometry" />
            <primitive object={matWhiteBody} attach="material" />
          </mesh>
          {/* Elbow Joint Shield */}
          <group position={[0.21, -0.32, 0.1]}>
            <mesh>
              <sphereGeometry args={[0.065, 12, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.025, 12]} />
              <primitive object={matGoldAccent} attach="material" />
            </mesh>
            {/* Articulated Hand */}
            <group position={[0.04, -0.12, 0.05]} rotation={[0.1, 0.05, 0.1]}>
              <RobotHand
                side="right"
                isWaving={isWaving}
                materialBody={matWhiteBody}
                materialJoint={matGraphiteJoint}
              />
            </group>
          </group>
        </group>

        {/* --- DETAILED MECHANICAL LEFT ARM --- */}
        <group ref={leftShoulderRef} position={[-0.38, -0.12, -0.06]} rotation={[0, 0, Math.PI / 16]}>
          {/* Shoulder Cap */}
          <mesh>
            <sphereGeometry args={[0.085, 16, 16]} />
            <primitive object={matWhiteBody} attach="material" />
          </mesh>
          {/* Arm Core Joint */}
          <mesh position={[0, -0.02, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          {/* Bicep Tube */}
          <mesh>
            <primitive object={leftArmGeometry} attach="geometry" />
            <primitive object={matWhiteBody} attach="material" />
          </mesh>
          {/* Elbow Joint Shield */}
          <group position={[-0.21, -0.32, 0.1]}>
            <mesh>
              <sphereGeometry args={[0.065, 12, 12]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
              <cylinderGeometry args={[0.048, 0.048, 0.025, 12]} />
              <primitive object={matGoldAccent} attach="material" />
            </mesh>
            {/* Articulated Hand */}
            <group position={[-0.04, -0.12, 0.05]} rotation={[0.1, -0.05, -0.1]}>
              <RobotHand
                side="left"
                isWaving={false}
                materialBody={matWhiteBody}
                materialJoint={matGraphiteJoint}
              />
            </group>
          </group>
        </group>

      </group>
    </group>
  );
}

// ----------------------------------------------------
// PARENT AIVATAR CANVAS COMPONENT
// ----------------------------------------------------
interface AiAvatarProps {
  isThinking: boolean;
  isTyping: boolean;
  isListening?: boolean;
  isWaving?: boolean;
}

export function AiAvatar({ isThinking, isTyping, isListening = false, isWaving = false }: AiAvatarProps) {
  return (
    <div className="w-full h-full min-h-[300px] pointer-events-none">
      <Canvas
        style={{ pointerEvents: "none" }}
        camera={{ position: [0, 0.05, 4.2], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        dpr={[1, 1.5]}
      >
        {/* Soft fill ambient light */}
        <ambientLight intensity={0.55} />

        {/* Front key light for sharp glossy specular highlights */}
        <directionalLight position={[2, 3, 2.5]} intensity={3.8} color="#ffffff" />

        {/* Fill light from the left */}
        <directionalLight position={[-2, 1, 2]} intensity={1.8} color="#ffffff" />

        {/* Strong back rim light to carve silhouette out of dark background */}
        <directionalLight position={[0, 2, -3]} intensity={4.8} color="#ffffff" />

        {/* Chest point light state indicator */}
        <pointLight
          position={[0, 0.2, 0.4]}
          intensity={1.8}
          distance={1.3}
          color={isThinking ? "#10b981" : isListening ? "#f59e0b" : isTyping ? "#00f0ff" : "#3b82f6"}
        />

        <RobotHumanoid isThinking={isThinking} isTyping={isTyping} isListening={isListening} isWaving={isWaving} />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          enableRotate={false}
          target={[0, 0.12, 0]}
        />
      </Canvas>
    </div>
  );
}
