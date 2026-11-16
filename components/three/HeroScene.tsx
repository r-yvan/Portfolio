"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  pointerNdc,
  useIsCompact,
  usePointer,
  useReducedMotionPref,
  type ScenePalette,
} from "./shared";

const SPACING = 0.27;
const CUBE = 0.2;
const BASE_Y = -1.55;
/** Slight yaw so the camera never looks straight down a gap between columns. */
const FIELD_YAW = 0.14;

/**
 * Grey cube terrain: thousands of instanced boxes whose heights ripple like a
 * slow sound wave. The cursor projects onto the ground plane and lifts a soft
 * "lens" of cubes beneath it. Heights also drive a low→high grey ramp.
 */
function WaveField({ palette, reduced, compact }: { palette: ScenePalette; reduced: boolean; compact: boolean }) {
  usePointer();
  // Odd column count → a column (not a gap) sits on the camera's centre line.
  const cols = compact ? 41 : 75;
  const rows = compact ? 30 : 46;
  const count = cols * rows;
  const mesh = useRef<THREE.InstancedMesh>(null);

  const { offsets, colors } = useMemo(() => {
    const offsets = new Float32Array(count * 2);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = r * cols + c;
        offsets[i * 2] = (c - (cols - 1) / 2) * SPACING;
        offsets[i * 2 + 1] = 2.8 - (rows - 1 - r) * SPACING;
      }
    }
    return { offsets, colors: new Float32Array(count * 3) };
  }, [cols, rows, count]);

  const low = useMemo(() => new THREE.Color(palette.low), [palette.low]);
  const high = useMemo(() => new THREE.Color(palette.high), [palette.high]);

  const tools = useMemo(
    () => ({
      plane: new THREE.Plane(new THREE.Vector3(0, 1, 0), -BASE_Y),
      raycaster: new THREE.Raycaster(),
      ndc: { x: 0, y: 0 },
      ndcVec: new THREE.Vector2(),
      hit: new THREE.Vector3(),
      local: new THREE.Vector3(),
      focus: new THREE.Vector3(0, 0, -40),
      target: new THREE.Vector3(0, 0, -40),
      strength: { value: 0 },
    }),
    [],
  );

  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => invalidate(), [palette, invalidate]);

  useLayoutEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const arr = m.instanceMatrix.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const o = i * 16;
      arr.fill(0, o, o + 16);
      arr[o] = 1;
      arr[o + 5] = 0.4;
      arr[o + 10] = 1;
      arr[o + 12] = offsets[i * 2];
      arr[o + 13] = BASE_Y + 0.2;
      arr[o + 14] = offsets[i * 2 + 1];
      arr[o + 15] = 1;
    }
    m.instanceMatrix.needsUpdate = true;
  }, [count, offsets]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = reduced ? 2.4 : state.clock.elapsedTime;
    const { plane, raycaster, ndc, ndcVec, hit, local, focus, target, strength } = tools;

    const inside = pointerNdc(state.gl.domElement.getBoundingClientRect(), ndc);
    if (inside && !reduced) {
      raycaster.setFromCamera(ndcVec.set(ndc.x, ndc.y), state.camera);
      // Work in the field's own (yawed) space so the lens sits under the cursor.
      if (raycaster.ray.intersectPlane(plane, hit)) target.copy(m.worldToLocal(local.copy(hit)));
    }
    strength.value = THREE.MathUtils.damp(strength.value, inside && !reduced ? 1 : 0, 2.4, delta);
    focus.lerp(target, 1 - Math.exp(-delta * 5));
    const fx = focus.x;
    const fz = focus.z;
    const k = strength.value;

    const arr = m.instanceMatrix.array as Float32Array;
    const lr = low.r, lg = low.g, lb = low.b;
    const dr = high.r - lr, dg = high.g - lg, db = high.b - lb;

    for (let i = 0; i < count; i++) {
      const x = offsets[i * 2];
      const z = offsets[i * 2 + 1];
      const radial = Math.sqrt(x * x + z * z);
      const wave =
        Math.sin(x * 0.42 + t * 0.65) * Math.cos(z * 0.36 - t * 0.5) * 0.46 +
        Math.sin(radial * 0.78 - t * 1.05) * 0.24;
      const dx = x - fx;
      const dz = z - fz;
      const lens = Math.exp(-(dx * dx + dz * dz) * 0.5) * 1.45 * k;
      const h = 0.16 + (wave + 0.7) * 0.72 + lens;

      const o = i * 16;
      arr[o + 5] = h;
      arr[o + 13] = BASE_Y + h * 0.5;

      const tone = Math.min(1, Math.max(0, (h - 0.25) / 1.9));
      const c = i * 3;
      colors[c] = lr + dr * tone;
      colors[c + 1] = lg + dg * tone;
      colors[c + 2] = lb + db * tone;
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return (
    <group rotation={[0, FIELD_YAW, 0]}>
      <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
        <boxGeometry args={[CUBE, 1, CUBE]} />
        <meshStandardMaterial roughness={0.62} metalness={0.08} />
        <instancedBufferAttribute attach="instanceColor" args={[colors, 3]} />
      </instancedMesh>
      {/* Ground beneath the cubes so gaps never show through to the page */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, BASE_Y + 0.002, 2.8 - ((rows - 1) * SPACING) / 2]}>
        <planeGeometry args={[cols * SPACING, rows * SPACING]} />
        <meshStandardMaterial color={palette.low} roughness={1} />
      </mesh>
    </group>
  );
}

/** Distant wireframe polyhedra rising over the "horizon" for depth. */
function Monolith({ palette, reduced, compact }: { palette: ScenePalette; reduced: boolean; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (reduced || !group.current) return;
    group.current.rotation.y += delta * 0.05;
    group.current.rotation.x += delta * 0.018;
  });
  const opacity = (palette.dark ? 0.17 : 0.24) * (compact ? 0.6 : 1);
  return (
    // Sits back at the far edge of the field, centred around the headline's
    // top line so it reads as rising over the horizon behind the copy.
    <group ref={group} position={[0, compact ? -0.2 : -0.75, -10]} scale={compact ? 0.8 : 1.3}>
      <mesh>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial color={palette.line} wireframe transparent opacity={opacity} fog={false} depthWrite={false} />
      </mesh>
      <mesh scale={0.6}>
        <octahedronGeometry args={[2.5, 0]} />
        <meshBasicMaterial color={palette.line} wireframe transparent opacity={opacity * 0.65} fog={false} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Slow drift + pointer parallax on the camera. */
function Rig({ reduced }: { reduced: boolean }) {
  const tools = useMemo(() => ({ ndc: { x: 0, y: 0 }, look: new THREE.Vector3(0, -0.4, -1.5) }), []);
  useFrame((state, delta) => {
    pointerNdc(state.gl.domElement.getBoundingClientRect(), tools.ndc);
    const t = state.clock.elapsedTime;
    const tx = reduced ? 0 : tools.ndc.x * 0.5 + Math.sin(t * 0.11) * 0.3;
    const ty = 1.2 + (reduced ? 0 : tools.ndc.y * 0.2 + Math.sin(t * 0.17) * 0.06);
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, tx, 2, delta);
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, ty, 2, delta);
    state.camera.lookAt(tools.look);
  });
  return null;
}

export default function HeroScene({ palette, active }: { palette: ScenePalette; active: boolean }) {
  const reduced = useReducedMotionPref();
  const compact = useIsCompact();

  return (
    <Canvas
      frameloop={active ? (reduced ? "demand" : "always") : "never"}
      dpr={compact ? [1, 1.25] : [1, 1.75]}
      gl={{ antialias: !compact, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.2, 7.4], fov: 40, near: 0.1, far: 60 }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <fog attach="fog" args={[palette.bg, 6.5, 16]} />
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[3, 7, 4]} intensity={palette.key} />
      <directionalLight position={[-6, 2, -4]} intensity={palette.key * 0.25} />
      <WaveField palette={palette} reduced={reduced} compact={compact} />
      <Monolith palette={palette} reduced={reduced} compact={compact} />
      <Rig reduced={reduced} />
    </Canvas>
  );
}
