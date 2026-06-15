import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface RobotHumanoidProps {
  isThinking: boolean;
  isTyping: boolean;
  isWaving?: boolean;
}

export function RobotHumanoid({ isThinking, isTyping, isWaving = false }: RobotHumanoidProps) {
  const headRef = useRef<THREE.Group>(null);
  const leftShoulderRef = useRef<THREE.Group>(null);
  const rightShoulderRef = useRef<THREE.Group>(null);
  const robotRootRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);

  // Dynamic canvas texture for the faceplate (bezel, screen, eyes, mouth)
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

  // Safe round rectangle fallback for canvas
  const drawRoundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }
  };

  const drawFace = (time: number, glowColor: string) => {
    const ctx = faceCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, 1024, 1024);

    ctx.save();
    ctx.translate(512, 512);
    ctx.scale(0.55, 1.0);

    // 1. Draw Bezel
    const bezelW = 1750;
    const bezelH = 760;
    const bezelX = -bezelW / 2;
    const bezelY = -bezelH / 2;
    const bezelR = 250;
    const bezelGrad = ctx.createLinearGradient(bezelX, bezelY, bezelX + bezelW, bezelY + bezelH);
    bezelGrad.addColorStop(0, "#ffffff");
    bezelGrad.addColorStop(0.4, "#f1f5f9");
    bezelGrad.addColorStop(0.8, "#cbd5e1");
    bezelGrad.addColorStop(1, "#94a3b8");
    ctx.fillStyle = bezelGrad;
    ctx.beginPath();
    drawRoundRect(ctx, bezelX, bezelY, bezelW, bezelH, bezelR);
    ctx.fill();
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 14;
    ctx.beginPath();
    drawRoundRect(ctx, bezelX, bezelY, bezelW, bezelH, bezelR);
    ctx.stroke();

    // 2. Draw Visor Screen
    const screenW = 1600;
    const screenH = 610;
    const screenX = -screenW / 2;
    const screenY = -screenH / 2;
    const screenR = 190;
    const screenGrad = ctx.createLinearGradient(0, screenY, 0, screenY + screenH);
    screenGrad.addColorStop(0, "#090d16");
    screenGrad.addColorStop(0.5, "#0d1527");
    screenGrad.addColorStop(1, "#121b30");
    ctx.fillStyle = screenGrad;
    ctx.beginPath();
    drawRoundRect(ctx, screenX, screenY, screenW, screenH, screenR);
    ctx.fill();
    ctx.strokeStyle = "#1a253c";
    ctx.lineWidth = 8;
    ctx.beginPath();
    drawRoundRect(ctx, screenX, screenY, screenW, screenH, screenR);
    ctx.stroke();

    // 3. Draw Eyes and Mouth
    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 40;

    const cycleTime = time % 4.0;
    const isBlinking = cycleTime > 3.85;

    if (isThinking) {
      // Thinking expression: narrow squinting eyes (thin horizontal bars) that pulse
      const squintH = 22 + Math.sin(time * 2.0) * 6;
      ctx.shadowBlur = 55;
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = squintH;
      ctx.lineCap = "round";
      // Left eye squint
      ctx.beginPath();
      ctx.moveTo(-410, -40);
      ctx.lineTo(-230, -40);
      ctx.stroke();
      // Right eye squint
      ctx.beginPath();
      ctx.moveTo(230, -40);
      ctx.lineTo(410, -40);
      ctx.stroke();
      // Thinking mouth: small flat tight line (not smiling)
      ctx.lineWidth = 28;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-90, 120);
      ctx.lineTo(90, 120);
      ctx.stroke();
      // Thinking indicator: three small pulsing dots below mouth
      const dotAlpha = 0.4 + 0.6 * Math.abs(Math.sin(time * 3.0));
      ctx.globalAlpha = dotAlpha;
      ctx.shadowBlur = 20;
      [-80, 0, 80].forEach((dx, i) => {
        const pulsed = 0.4 + 0.6 * Math.abs(Math.sin(time * 3.0 + i * 1.2));
        ctx.globalAlpha = pulsed;
        ctx.beginPath();
        ctx.arc(dx, 185, 18, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
    } else if (isBlinking) {
      ctx.strokeStyle = glowColor;
      ctx.lineWidth = 26;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(-410, -40);
      ctx.lineTo(-230, -40);
      ctx.moveTo(230, -40);
      ctx.lineTo(410, -40);
      ctx.stroke();
    } else {
      // Normal happy arch eyes
      ctx.beginPath();
      ctx.ellipse(-320, -40, 110, 90, 0, Math.PI, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(320, -40, 110, 90, 0, Math.PI, 2 * Math.PI);
      ctx.fill();
    }

    if (!isThinking) {
      // Normal smile mouth
      const mouthScaleY = isTyping ? (0.4 + Math.abs(Math.sin(time * 15.0)) * 0.8) : 1.0;
      ctx.save();
      ctx.translate(0, 100);
      ctx.scale(1.0, mouthScaleY);
      ctx.beginPath();
      ctx.ellipse(0, 0, 120, 50, 0, 0, Math.PI);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };


  // Helper to create horizontally bent plane geometry
  const createBentPlaneGeometry = (w: number, h: number, cylinderR: number) => {
    const geom = new THREE.PlaneGeometry(w, h, 32, 1);
    const posAttr = geom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      // Wrap around Y-axis cylinder
      const angle = vx / cylinderR;
      const newX = cylinderR * Math.sin(angle);
      const newZ = vz + (cylinderR * Math.cos(angle) - cylinderR);

      posAttr.setX(i, newX);
      posAttr.setZ(i, newZ);
    }
    geom.computeVertexNormals();
    return geom;
  };

  // 3D curved plane geometry for face visor
  const faceGeometry = useMemo(() => {
    return createBentPlaneGeometry(0.72, 0.48, 0.382);
  }, []);

  // Smooth chubbier arms
  const leftArmCurve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(-0.06, -0.18, 0.2),
      new THREE.Vector3(-0.03, -0.38, 0.01)
    );
  }, []);

  const rightArmCurve = useMemo(() => {
    return new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(0.06, -0.18, 0.2),
      new THREE.Vector3(0.03, -0.38, 0.01)
    );
  }, []);

  // Dynamic glow colors based on state
  const glowColor = isThinking ? "#10b981" : isTyping ? "#00f0ff" : "#00d8ff";

  // Throttle face canvas redraws to ~30fps (every other frame) to cut GC pressure
  const faceFrameSkip = useRef(0);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const pointerX = state.pointer.x * 0.45;
    const pointerY = state.pointer.y * 0.35;

    // Redraw face canvas at ~30fps instead of 60fps
    faceFrameSkip.current = (faceFrameSkip.current + 1) % 2;
    if (faceFrameSkip.current === 0) {
      drawFace(time, glowColor);
      faceTexture.needsUpdate = true;
    }

    // 1. Idle breathing float
    if (robotRootRef.current) {
      robotRootRef.current.position.y = -0.12 + Math.sin(time * 1.3) * 0.04;
    }

    // 2. Cursor tracking + head sway
    if (headRef.current) {
      let targetRotY = pointerX;
      let targetRotX = -pointerY + 0.05;
      let targetRotZ = 0;

      if (isWaving) {
        targetRotY += Math.sin(time * 3.0) * 0.08;
        targetRotZ = Math.sin(time * 2.5) * 0.05;
      } else if (isThinking) {
        targetRotZ = 0.05 + Math.sin(time * 2.0) * 0.02;
        targetRotX += 0.02 + Math.cos(time * 1.5) * 0.03;
      } else if (isTyping) {
        targetRotY += Math.sin(time * 5.0) * 0.03;
        targetRotX += Math.cos(time * 6.5) * 0.02;
      }

      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, targetRotY, 0.08);
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, targetRotX, 0.08);
      headRef.current.rotation.z = THREE.MathUtils.lerp(headRef.current.rotation.z, targetRotZ, 0.08);
    }

    // 3. Arm animations
    if (leftShoulderRef.current && rightShoulderRef.current) {
      if (isWaving) {
        // Raise right arm up and wave hand back and forth rapidly
        const waveAngle = Math.sin(time * 10.0) * 0.35;
        rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, 1.35 + waveAngle, 0.1);
        rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -0.4, 0.1);
        rightShoulderRef.current.rotation.y = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.y, -0.3, 0.1);

        // Left arm idle sway
        const armSway = Math.sin(time * 1.3) * 0.03;
        leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, -0.05 + armSway, 0.05);
        leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, armSway * 0.5, 0.05);
        leftShoulderRef.current.rotation.y = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.y, 0, 0.05);
      } else if (isThinking) {
        // Thinking pose: right arm raised to chin, left arm crosses torso
        const thinkSway = Math.sin(time * 0.8) * 0.015;
        rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -0.55 + thinkSway, 0.06);
        rightShoulderRef.current.rotation.y = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.y, -0.35, 0.06);
        rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, 0.65, 0.06);
        leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, -0.15, 0.06);
        leftShoulderRef.current.rotation.y = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.y, 0.35, 0.06);
        leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, -0.45 + thinkSway, 0.06);
      } else if (isTyping) {
        leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, -0.25 + Math.sin(time * 6.0) * 0.15, 0.1);
        leftShoulderRef.current.rotation.y = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.y, 0.15 + Math.cos(time * 5.0) * 0.1, 0.1);
        leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, -0.15 + Math.sin(time * 4.0) * 0.08, 0.1);
        rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, -0.25 + Math.cos(time * 5.8) * 0.15, 0.1);
        rightShoulderRef.current.rotation.y = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.y, -0.15 - Math.sin(time * 4.8) * 0.1, 0.1);
        rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, 0.15 - Math.cos(time * 4.2) * 0.08, 0.1);
      } else {
        const armSway = Math.sin(time * 1.3) * 0.03;
        leftShoulderRef.current.rotation.z = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.z, -0.05 + armSway, 0.05);
        leftShoulderRef.current.rotation.x = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.x, armSway * 0.5, 0.05);
        leftShoulderRef.current.rotation.y = THREE.MathUtils.lerp(leftShoulderRef.current.rotation.y, 0, 0.05);
        rightShoulderRef.current.rotation.z = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.z, 0.05 - armSway, 0.05);
        rightShoulderRef.current.rotation.x = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.x, armSway * 0.5, 0.05);
        rightShoulderRef.current.rotation.y = THREE.MathUtils.lerp(rightShoulderRef.current.rotation.y, 0, 0.05);
      }
    }

    // 4. Dynamic Shadow animation (scale & opacity)
    if (shadowRef.current) {
      const heightOffset = Math.sin(time * 1.3);
      const shadowScale = 1.0 + heightOffset * 0.08;
      const shadowOpacity = 0.15 - heightOffset * 0.04;
      shadowRef.current.scale.set(shadowScale, shadowScale, 1);
      if (shadowRef.current.material) {
        (shadowRef.current.material as THREE.MeshBasicMaterial).opacity = shadowOpacity;
      }
    }
  });

  const matClayBody = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f1f5f9",
    roughness: 0.4,
    metalness: 0.06,
  }), []);

  const matGraphiteJoint = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#475569",
    roughness: 0.35,
    metalness: 0.6,
  }), []);

  // Dynamic canvas texture for the body (seam line, neck socket)
  const bodyCanvas = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    return canvas;
  }, []);

  const bodyTexture = useMemo(() => {
    const ctx = bodyCanvas.getContext("2d");
    if (ctx) {
      // Fill background with white for clay body color mapping
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, 1024, 1024);

      // 1. Draw top neck socket (circular cap)
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, 0, 1024, 110);

      // Rim shadow/border
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(1024, 110);
      ctx.stroke();

      // 2. Draw Seam Line (medium grey groove with a step-down notch in the front center)
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 14;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const seamY = 620;
      const notchDepth = 40;
      const notchHalfW = 60; // width of notch is 120 pixels

      ctx.beginPath();
      ctx.moveTo(0, seamY);
      ctx.lineTo(512 - notchHalfW, seamY);
      ctx.lineTo(512 - notchHalfW, seamY + notchDepth);
      ctx.lineTo(512 + notchHalfW, seamY + notchDepth);
      ctx.lineTo(512 + notchHalfW, seamY);
      ctx.lineTo(1024, seamY);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(bodyCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [bodyCanvas]);

  const matTorsoBody = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#f1f5f9",
    map: bodyTexture,
    roughness: 0.4,
    metalness: 0.06,
  }), [bodyTexture]);

  // Custom tapered torso geometry (inverted rounded triangle / teardrop shape)
  const bodyGeometry = useMemo(() => {
    const geom = new THREE.SphereGeometry(0.34, 32, 32);
    const posAttr = geom.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      // Normalize y from -0.34 to 0.34 to range [0, 1] and clamp to avoid negative values from float precision at poles
      const normY = Math.max(0, Math.min(1, (y + 0.34) / 0.68));
      // Taper factor: 0.3 at the bottom, 1.25 at the top, convex curve
      const factor = 0.3 + 0.95 * Math.pow(normY, 0.75);
      posAttr.setX(i, posAttr.getX(i) * factor);
      posAttr.setZ(i, posAttr.getZ(i) * factor);
    }
    geom.computeVertexNormals();
    return geom;
  }, []);

  return (
    <group position={[0, 0.05, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* Dynamic Drop Shadow (ground shadow) */}
      <mesh
        ref={shadowRef}
        position={[0, -1.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.26, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} depthWrite={false} />
      </mesh>

      {/* Floating Robot Body */}
      <group ref={robotRootRef}>
        {/* --- NECK --- */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.07, 0.08, 0.10, 16]} />
          <primitive object={matGraphiteJoint} attach="material" />
        </mesh>

        {/* --- HEAD GROUP --- */}
        <group ref={headRef} position={[0, 0.43, 0]}>
          {/* Head armor sphere shell */}
          <mesh scale={[1.15, 0.95, 1.0]}>
            <sphereGeometry args={[0.38, 32, 32]} />
            <primitive object={matClayBody} attach="material" />
          </mesh>

          {/* Integrated 3D Curved Visor Faceplate (Bezel, Screen, Eyes, Mouth in one wrapped texture) */}
          <mesh position={[0, 0, 0.382]} scale={[1.15, 0.95, 1.0]}>
            <primitive object={faceGeometry} attach="geometry" />
            <meshBasicMaterial
              map={faceTexture}
              transparent={true}
              depthWrite={true}
            />
          </mesh>

          {/* --- LEFT EAR CUP --- */}
          <group position={[-0.38, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.115, 0.115, 0.08, 16]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
            <mesh position={[0, -0.06, 0]} rotation={[Math.PI, 0, 0]}>
              <sphereGeometry args={[0.115, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
          </group>

          {/* --- RIGHT EAR CUP --- */}
          <group position={[0.38, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.06, 16]} />
              <primitive object={matGraphiteJoint} attach="material" />
            </mesh>
            <mesh position={[0, -0.02, 0]}>
              <cylinderGeometry args={[0.115, 0.115, 0.08, 16]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
            <mesh position={[0, -0.06, 0]} rotation={[Math.PI, 0, 0]}>
              <sphereGeometry args={[0.115, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
          </group>
        </group>

        {/* --- TORSO / BODY --- */}
        <group position={[0, -0.20, 0]}>
          {/* Capsule-like Main Body */}
          <mesh scale={[1.0, 1.15, 0.95]} rotation={[0, Math.PI, 0]}>
            <primitive object={bodyGeometry} attach="geometry" />
            <primitive object={matTorsoBody} attach="material" />
          </mesh>
        </group>

        {/* --- LEFT ARM --- */}
        <group ref={leftShoulderRef} position={[-0.27, -0.15, 0]}>
          <mesh position={[0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <group>
            <mesh>
              <tubeGeometry args={[leftArmCurve, 16, 0.085, 12, false]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.085, 12, 12]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
            <mesh position={[-0.03, -0.38, 0.01]}>
              <sphereGeometry args={[0.085, 12, 12]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
          </group>
        </group>

        {/* --- RIGHT ARM --- */}
        <group ref={rightShoulderRef} position={[0.27, -0.15, 0]}>
          <mesh position={[-0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.04, 12]} />
            <primitive object={matGraphiteJoint} attach="material" />
          </mesh>
          <group>
            <mesh>
              <tubeGeometry args={[rightArmCurve, 16, 0.085, 12, false]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.085, 12, 12]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
            <mesh position={[0.03, -0.38, 0.01]}>
              <sphereGeometry args={[0.085, 12, 12]} />
              <primitive object={matClayBody} attach="material" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

interface AiAvatarProps {
  isThinking: boolean;
  isTyping: boolean;
  isWaving?: boolean;
}

export function AiAvatar({ isThinking, isTyping, isWaving = false }: AiAvatarProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <Canvas
        camera={{ position: [0, -0.05, 3.4], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={0.75} />

        <pointLight position={[0, 2, 1.5]} intensity={2.0} color={isThinking ? "#10b981" : isTyping ? "#00f0ff" : "#00d8ff"} />

        <directionalLight position={[0, 2, 4]} intensity={2.0} color="#ffffff" />

        <directionalLight position={[-4, 2, -3]} intensity={3.5} color="#00d8ff" />
        <directionalLight position={[4, 2, -3]} intensity={3.5} color="#8b5cf6" />

        <RobotHumanoid isThinking={isThinking} isTyping={isTyping} isWaving={isWaving} />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.7}
          minPolarAngle={Math.PI / 2.3}
          maxAzimuthAngle={Math.PI / 6}
          minAzimuthAngle={-Math.PI / 6}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}
