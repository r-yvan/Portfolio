"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/** Drifting blueviolet particle shell with slow rotation + mouse parallax. */
function ParticleField({ count = 2600 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.03;
    ref.current.rotation.x += delta * 0.006;
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      state.pointer.x * 0.3,
      0.04,
    );
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.014}
        sizeAttenuation
        color="#6B6B6B"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

const GLOBE_R = 1.5;

/** Fibonacci-sphere dotted globe with a flat Saturn ring band of particles. */
function DottedGlobe() {
  const group = useRef<THREE.Group>(null!);

  const dots = useMemo(() => {
    const count = 1500;
    const arr = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = phi * i;
      arr[i * 3] = Math.cos(t) * r * GLOBE_R;
      arr[i * 3 + 1] = y * GLOBE_R;
      arr[i * 3 + 2] = Math.sin(t) * r * GLOBE_R;
    }
    return arr;
  }, []);

  // Particle ring (Saturn) — points scattered in a flat annulus.
  const ring = useMemo(() => {
    const count = 2200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const rad = 2.15 + Math.random() * 0.95;
      arr[i * 3] = Math.cos(a) * rad;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      arr[i * 3 + 2] = Math.sin(a) * rad;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.12;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      state.pointer.y * 0.25,
      0.05,
    );
  });

  return (
    <group ref={group} rotation={[0.32, 0, 0.18]}>
      {/* solid dark core so only front dots read */}
      <mesh>
        <sphereGeometry args={[GLOBE_R * 0.985, 48, 48]} />
        <meshBasicMaterial color="#080808" />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={dots}
            count={dots.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#7c7c86"
          sizeAttenuation
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
      {/* Saturn ring band */}
      <points rotation={[Math.PI / 2, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={ring}
            count={ring.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.018}
          color="#A78BFA"
          sizeAttenuation
          transparent
          opacity={0.7}
          depthWrite={false}
        />
      </points>
      {/* thin solid ring edge for definition */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.15, 0.004, 16, 200]} />
        <meshBasicMaterial color="#C4B5FD" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

/** Subtle camera parallax that follows the pointer. */
function Rig() {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.7,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.45,
      0.04,
    );
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 5.2], fov: 45 }}
    >
      <fog attach="fog" args={["#050505", 7, 18]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[6, 7, 5]} intensity={70} color="#ffffff" />
      <spotLight
        position={[-4, 2, 6]}
        angle={0.6}
        penumbra={1}
        intensity={35}
        color="#d4d4d4"
      />
      <pointLight position={[-6, -4, -4]} intensity={12} color="#8b7fb0" />

      <Float
        speed={1.1}
        rotationIntensity={0.3}
        floatIntensity={0.8}
        position={[1.6, 0.1, 0]}
      >
        <DottedGlobe />
      </Float>
      <ParticleField />
      <Rig />
    </Canvas>
  );
}
