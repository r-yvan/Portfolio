"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

const GLOBE_R = 2;

/** Convert latitude/longitude to a point on a sphere of the given radius. */
function latLngToVec3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

const KIGALI = { lat: -1.9441, lng: 30.0619 };
const CITIES = [
  { lat: 51.5074, lng: -0.1278 }, // London
  { lat: 40.7128, lng: -74.006 }, // New York
  { lat: 35.6762, lng: 139.6503 }, // Tokyo
  { lat: 1.3521, lng: 103.8198 }, // Singapore
];

/** Evenly distributed surface dots (fibonacci sphere) — the tech-globe look. */
function Dots({ count = 1700 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      arr[i * 3] = Math.cos(theta) * r * GLOBE_R;
      arr[i * 3 + 1] = y * GLOBE_R;
      arr[i * 3 + 2] = Math.sin(theta) * r * GLOBE_R;
    }
    return arr;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        color="#5e5e66"
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

/** Pulsing glow marker anchored on the globe surface. */
function Marker({ position }: { position: THREE.Vector3 }) {
  const ring = useRef<THREE.Mesh>(null!);
  const quaternion = useMemo(
    () =>
      new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        position.clone().normalize(),
      ),
    [position],
  );

  useFrame((state) => {
    if (!ring.current) return;
    const t = (state.clock.elapsedTime % 2) / 2;
    ring.current.scale.setScalar(0.04 + t * 0.2);
    (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.7 * (1 - t);
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#C4B5FD" />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.06, 0.085, 32]} />
        <meshBasicMaterial
          color="#A78BFA"
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/** Glowing arc between two surface points, with a traveling light pulse. */
function Arc({
  start,
  end,
  offset,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  offset: number;
}) {
  const dot = useRef<THREE.Mesh>(null!);
  const { points, curve } = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.normalize().multiplyScalar(GLOBE_R + dist * 0.55);
    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    return { points: c.getPoints(60), curve: c };
  }, [start, end]);

  useFrame((state) => {
    if (!dot.current) return;
    const t = (state.clock.elapsedTime * 0.22 + offset) % 1;
    dot.current.position.copy(curve.getPoint(t));
  });

  return (
    <group>
      <Line
        points={points}
        color="#8B5CF6"
        lineWidth={1}
        transparent
        opacity={0.45}
      />
      <mesh ref={dot}>
        <sphereGeometry args={[0.03, 12, 12]} />
        <meshBasicMaterial color="#C4B5FD" />
      </mesh>
    </group>
  );
}

function GlobeGroup() {
  const group = useRef<THREE.Group>(null!);
  const kigali = useMemo(
    () => latLngToVec3(KIGALI.lat, KIGALI.lng, GLOBE_R),
    [],
  );
  const arcs = useMemo(
    () =>
      CITIES.map((c, i) => ({
        start: kigali,
        end: latLngToVec3(c.lat, c.lng, GLOBE_R),
        offset: i / CITIES.length,
      })),
    [kigali],
  );

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.08;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -0.2 + state.pointer.y * 0.18,
      0.05,
    );
  });

  return (
    <group ref={group} rotation={[-0.2, 0, 0.12]}>
      {/* Opaque dark core occludes back-facing dots for a solid read */}
      <mesh>
        <sphereGeometry args={[GLOBE_R * 0.99, 64, 64]} />
        <meshBasicMaterial color="#0A0A0A" />
      </mesh>
      <Dots />
      {/* Atmosphere */}
      <mesh scale={1.16}>
        <sphereGeometry args={[GLOBE_R, 64, 64]} />
        <meshBasicMaterial
          color="#6b6b76"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {arcs.map((a, i) => (
        <Arc key={i} start={a.start} end={a.end} offset={a.offset} />
      ))}
      <Marker position={kigali} />
    </group>
  );
}

export default function Globe() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
    >
      <GlobeGroup />
    </Canvas>
  );
}
