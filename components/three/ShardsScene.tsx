"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  mulberry32,
  pointerNdc,
  useIsCompact,
  usePointer,
  useReducedMotionPref,
  type ScenePalette,
} from "./shared";

type Shard = {
  x: number;
  y: number;
  z: number;
  scale: number;
  stretch: number;
  rot: THREE.Euler;
  spin: THREE.Vector3;
  rise: number;
  red: boolean;
  tone: number;
};

/**
 * Floating field of faceted, flat-shaded octahedron shards in grey shades —
 * a handful glint red. They drift upward, tumble, and lean with the cursor.
 */
function Shards({ palette, reduced, count }: { palette: ScenePalette; reduced: boolean; count: number }) {
  usePointer();
  const mesh = useRef<THREE.InstancedMesh>(null);
  const group = useRef<THREE.Group>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const ndc = useMemo(() => ({ x: 0, y: 0 }), []);

  const shards = useMemo<Shard[]>(() => {
    const rnd = mulberry32(1337);
    return Array.from({ length: count }, () => ({
      x: (rnd() - 0.5) * 18,
      y: (rnd() - 0.5) * 9,
      z: -rnd() * 8 + 1,
      scale: 0.1 + rnd() ** 2.2 * 0.55,
      stretch: 1.2 + rnd() * 1.6,
      rot: new THREE.Euler(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI),
      spin: new THREE.Vector3((rnd() - 0.5) * 0.5, (rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.3),
      rise: 0.06 + rnd() * 0.16,
      red: rnd() < 0.07,
      tone: rnd(),
    }));
  }, [count]);

  const colors = useMemo(() => new Float32Array(count * 3), [count]);

  // Colours depend on the theme only.
  useLayoutEffect(() => {
    const low = new THREE.Color(palette.low);
    const high = new THREE.Color(palette.high);
    const red = new THREE.Color(palette.accent);
    const c = new THREE.Color();
    shards.forEach((s, i) => {
      if (s.red) c.copy(red);
      else c.copy(low).lerp(high, 0.25 + s.tone * 0.75);
      c.toArray(colors, i * 3);
    });
    if (mesh.current?.instanceColor) mesh.current.instanceColor.needsUpdate = true;
  }, [palette, shards, colors]);

  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [palette, invalidate]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = reduced ? 0 : Math.min(delta, 0.05);
    shards.forEach((s, i) => {
      s.y += s.rise * dt;
      if (s.y > 4.8) s.y = -4.8;
      s.rot.x += s.spin.x * dt;
      s.rot.y += s.spin.y * dt;
      s.rot.z += s.spin.z * dt;
      dummy.position.set(s.x, s.y, s.z);
      dummy.rotation.copy(s.rot);
      dummy.scale.set(s.scale, s.scale * s.stretch, s.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;

    if (group.current) {
      pointerNdc(state.gl.domElement.getBoundingClientRect(), ndc);
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, ndc.x * 0.18, 2.5, delta);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -ndc.y * 0.1, 2.5, delta);
    }
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial flatShading roughness={0.38} metalness={0.22} />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      </instancedMesh>
    </group>
  );
}

export default function ShardsScene({ palette, active }: { palette: ScenePalette; active: boolean }) {
  const reduced = useReducedMotionPref();
  const compact = useIsCompact();
  return (
    <Canvas
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      dpr={compact ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 7], fov: 45 }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <fog attach="fog" args={[palette.bg, 5, 15]} />
      <ambientLight intensity={palette.ambient * 0.9} />
      <directionalLight position={[4, 6, 5]} intensity={palette.key * 1.1} />
      <directionalLight position={[-5, -3, 2]} intensity={palette.key * 0.35} />
      <pointLight position={[0, -1.5, 3]} intensity={palette.dark ? 6 : 3} distance={9} color={palette.accent} />
      <Shards palette={palette} reduced={reduced} count={compact ? 55 : 120} />
    </Canvas>
  );
}
